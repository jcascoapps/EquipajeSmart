import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../src/data/gadgets.json');

// Helper to delay execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parsePrice(rawPrice) {
  if (!rawPrice) return null;
  // Look for patterns like "15,74 €", "15.74 €", "1.234,56 €"
  const clean = rawPrice.replace(/\s+/g, ' ').trim();
  const match = clean.match(/(\d{1,3}(?:\.\d{3})*|\d+)[,\.](\d{2})/);
  if (match) {
    const whole = match[1].replace(/\./g, '');
    const fraction = match[2];
    return `${whole}.${fraction}`;
  }
  const integerMatch = clean.match(/(\d+)/);
  if (integerMatch) {
    return `${integerMatch[1]}.00`;
  }
  return null;
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  // Replace Amazon sizing tags like ._AC_US40_.jpg or ._SX38_SY50_CR,0,0,38,50_.jpg with high-res ._AC_SL1500_.jpg
  if (url.includes('media-amazon.com/images/I/')) {
    return url.replace(/\._[A-Za-z0-9_,]+_\.([a-zA-Z]+)$/, '._AC_SL1500_.$1');
  }
  return url;
}

async function scrapeAmazonProduct(page, url) {
  // Go to product page
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

  // Check for captcha/robot check
  const pageTitle = await page.title();
  if (pageTitle.toLowerCase().includes('robot check') || pageTitle.toLowerCase().includes('captcha')) {
    console.warn('  ⚠️ Amazon solicitó verificación de captcha. Saltando este producto para evitar bloqueo.');
    return null;
  }

  // 1. Extraer Título
  const title = await page.evaluate(() => {
    const el = document.querySelector('#productTitle');
    return el ? el.innerText.trim() : null;
  });

  // 2. Extraer Precio
  const price = await page.evaluate(() => {
    // Selectores habituales de precio en Amazon España
    const selectors = [
      '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
      '.priceToPay .a-offscreen',
      '#price_inside_buybox',
      '.apexPriceToPay .a-offscreen',
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '#corePrice_feature_div .a-offscreen',
      '.a-price .a-offscreen'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText && el.innerText.trim()) {
        return el.innerText.trim();
      }
    }

    // Alternativa: componente whole + fraction
    const wholeEl = document.querySelector('.priceToPay .a-price-whole') || document.querySelector('.a-price .a-price-whole');
    const fracEl = document.querySelector('.priceToPay .a-price-fraction') || document.querySelector('.a-price .a-price-fraction');
    if (wholeEl) {
      const whole = wholeEl.innerText.replace(/[^0-9]/g, '');
      const frac = fracEl ? fracEl.innerText.replace(/[^0-9]/g, '') : '00';
      return `${whole}.${frac}`;
    }

    return null;
  });

  // 3. Extraer Descripción / Viñetas
  const description = await page.evaluate(() => {
    // Viñetas principales del producto
    const bulletEls = Array.from(document.querySelectorAll('#feature-bullets ul li span.a-list-item'));
    const bullets = bulletEls
      .map(el => el.innerText.trim())
      .filter(t => t.length > 0 && !t.startsWith('Make sure this fits') && !t.startsWith('Asegúrate de'));

    if (bullets.length > 0) {
      return bullets.join('\n');
    }

    // Alternativa: Descripción de producto estándar
    const descEl = document.querySelector('#productDescription p') || document.querySelector('#productDescription');
    if (descEl && descEl.innerText.trim()) {
      return descEl.innerText.trim();
    }

    return null;
  });

  // 4. Extraer Imágenes de la galería
  const images = await page.evaluate(() => {
    const list = [];

    // Intento A: data-a-dynamic-image en la imagen principal
    const mainImg = document.querySelector('#landingImage') || document.querySelector('#imgBlkFront');
    if (mainImg) {
      const dyn = mainImg.getAttribute('data-a-dynamic-image');
      if (dyn) {
        try {
          const parsed = JSON.parse(dyn);
          list.push(...Object.keys(parsed));
        } catch (e) {
          // ignore JSON parse error
        }
      }
      if (mainImg.src) list.push(mainImg.src);
    }

    // Intento B: miniaturas del selector alternativo (#altImages)
    const thumbImgs = Array.from(document.querySelectorAll('#altImages ul li:not(.video-thumbnail) img'));
    for (const img of thumbImgs) {
      const src = img.getAttribute('data-old-hires') || img.src;
      if (src && !src.includes('sprite') && !src.includes('pixel') && !src.includes('play-icon')) {
        list.push(src);
      }
    }

    return list;
  });

  // Normalizar imágenes y eliminar duplicados
  const normalizedImages = Array.from(
    new Set(
      images
        .map(normalizeImageUrl)
        .filter(url => url && url.startsWith('http') && !url.includes('G/01/x-locale/common/transparent-pixel'))
    )
  );

  return {
    title,
    price: parsePrice(price),
    description,
    images: normalizedImages.length > 0 ? normalizedImages : null
  };
}

async function main() {
  console.log('🚀 Iniciando actualización de productos de EquipajeSmart...\n');

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ No se encontró el archivo de datos en: ${DATA_FILE}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(DATA_FILE, 'utf8');
  const products = JSON.parse(rawData);

  // Parse command line arguments (e.g. node scripts/refresh.js --id=5 or --limit=3)
  const args = process.argv.slice(2);
  const targetIdArg = args.find(a => a.startsWith('--id='));
  const targetId = targetIdArg ? parseInt(targetIdArg.split('=')[1], 10) : null;
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

  let itemsToProcess = products;
  if (targetId) {
    itemsToProcess = products.filter(p => p.id === targetId);
    console.log(`🎯 Filtrando para actualizar solo el producto con ID: ${targetId}`);
  } else if (limit) {
    itemsToProcess = products.slice(0, limit);
    console.log(`🎯 Limitando a los primeros ${limit} productos.`);
  }

  console.log(`📦 Total productos a procesar: ${itemsToProcess.length}\n`);

  // Crear copia de seguridad antes de modificar
  const backupFile = path.join(__dirname, `../src/data/gadgets.backup.${Date.now()}.json`);
  fs.writeFileSync(backupFile, rawData, 'utf8');
  console.log(`💾 Copia de respaldo guardada en: ${path.basename(backupFile)}\n`);

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'es-ES'
  });

  const page = await context.newPage();

  // Bloquear recursos innecesarios (fuentes, media pesada) para máxima velocidad
  await page.route('**/*', (route) => {
    const req = route.request();
    const resourceType = req.resourceType();
    if (['font', 'media'].includes(resourceType)) {
      route.abort();
    } else {
      route.continue();
    }
  });

  let updatedCount = 0;

  try {
    for (let i = 0; i < itemsToProcess.length; i++) {
      const product = itemsToProcess[i];
      const indexStr = `[${i + 1}/${itemsToProcess.length}]`;
      console.log(`${indexStr} Procesando ID ${product.id}: "${product.name.slice(0, 45)}..."`);

      if (!product.amazonUrl) {
        console.log(`  ⚠️ Sin amazonUrl. Saltando.`);
        continue;
      }

      try {
        const scraped = await scrapeAmazonProduct(page, product.amazonUrl);

        if (scraped) {
          let changes = [];

          if (scraped.price && scraped.price !== product.price) {
            changes.push(`Precio: ${product.price}€ -> ${scraped.price}€`);
            product.price = scraped.price;
          }

          if (scraped.description && scraped.description.length > 20 && (!product.description || product.description.includes('Cargando descripción'))) {
            changes.push(`Descripción actualizada (${scraped.description.length} caracteres)`);
            product.description = scraped.description;
          }

          if (scraped.images && scraped.images.length > 0) {
            // Si antes no tenía imágenes o tenía pocas, actualizar
            if (!product.images || product.images.length < scraped.images.length) {
              changes.push(`Imágenes actualizadas (${scraped.images.length} fotos)`);
              product.images = scraped.images;
            }
          }

          if (changes.length > 0) {
            console.log(`  ✅ Actualizado: ${changes.join(' | ')}`);
            updatedCount++;
          } else {
            console.log(`  ✨ Sin cambios necesarios (Precio actual: ${product.price}€)`);
          }

          // Guardar periódicamente tras cada producto para no perder progreso
          fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8');
        } else {
          console.log(`  ⚠️ No se pudieron obtener datos nuevos.`);
        }
      } catch (err) {
        console.error(`  ❌ Error al procesar ID ${product.id}:`, err.message);
      }

      // Pausa prudente entre peticiones para evitar captchas
      if (i < itemsToProcess.length - 1) {
        const waitTime = Math.floor(Math.random() * 1500) + 1500; // 1.5s - 3s
        await sleep(waitTime);
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`\n🎉 Proceso completado.`);
  console.log(`📊 Productos modificados: ${updatedCount}/${itemsToProcess.length}`);
  console.log(`📁 Catálogo guardado en: ${DATA_FILE}\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
