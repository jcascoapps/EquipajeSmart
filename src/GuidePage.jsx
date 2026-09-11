import React, { useState } from 'react'
import { 
  ArrowLeft, 
  Share2, 
  Check, 
  Luggage, 
  Scale, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle, 
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Plane
} from 'lucide-react'

export default function GuidePage({ onBackToStore, onSelectProduct, trackEvent }) {
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const handleShareGuide = async () => {
    trackEvent('share_guide_click');
    const shareData = {
      title: 'Guía Definitiva de Equipaje de Mano 2026 | EquipajeSmart',
      text: 'Guía completa para viajar sin facturar: medidas de aerolíneas, trucos de espacio y gadgets clave.',
      url: window.location.origin + '/guia'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        trackEvent('share_guide_completed', { method: 'native' });
        return;
      } catch (err) {
        // Cancelado o error fallback
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      trackEvent('share_guide_completed', { method: 'clipboard' });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // ignore
    }
  }

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
    trackEvent('toggle_faq', { index: idx });
  }

  return (
    <main className="guide-page-container">
      {/* Breadcrumbs & Header */}
      <section className="guide-hero">
        <div className="container">
          <button className="guide-back-btn" onClick={onBackToStore}>
            <ArrowLeft size={16} />
            <span>Volver a la colección</span>
          </button>

          <div className="badge-pill">
            <Sparkles size={14} color="var(--accent)" />
            <span>Manual del Viajero Inteligente 2026</span>
          </div>

          <h1 className="guide-title">
            La Guía Definitiva del Equipaje de Mano: Cómo Viajar sin Facturar
          </h1>
          <p className="guide-lead">
            Aprende a esquivar las tarifas abusivas de las aerolíneas, organizar tu ropa para 7-14 días en una mochila de 40L y descubrir los gadgets clave que ahorran espacio y dinero.
          </p>

          <div className="guide-meta-bar">
            <div className="guide-author-info">
              <span>✍️ Redacción EquipajeSmart</span>
              <span>•</span>
              <span>Lectura: 6 min</span>
              <span>•</span>
              <span>Actualizado Septiembre 2026</span>
            </div>

            <button 
              className={`guide-share-btn ${copied ? 'copied' : ''}`}
              onClick={handleShareGuide}
              title="Compartir esta guía"
            >
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              <span>{copied ? '¡Enlace copiado!' : 'Compartir Guía'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="container guide-content-body">

        {/* 1. Medidas de Aerolíneas */}
        <section className="guide-section">
          <div className="section-heading">
            <div className="heading-icon-wrap"><Luggage size={22} /></div>
            <h2>1. Medidas y Límites de Equipaje de Cabina (2026)</h2>
          </div>
          <p>
            Uno de los errores más caros al viajar en avión es confundir el <strong>artículo personal gratuito</strong> (bolso o mochila pequeña que cabe debajo del asiento delantero) con la <strong>maleta de cabina de 10 kg</strong> (trolley de cabina que va en el compartimento superior).
          </p>

          <div className="table-responsive">
            <table className="airline-table">
              <thead>
                <tr>
                  <th>Aerolínea</th>
                  <th>Artículo Personal (Gratuito)</th>
                  <th>Maleta de Mano (Cabina)</th>
                  <th>Tasa en puerta si excede</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Ryanair</strong></td>
                  <td>40 x 20 x 25 cm (sin peso límite)</td>
                  <td>55 x 40 x 20 cm (hasta 10 kg con Priority)</td>
                  <td className="danger-text">Hasta 45€ - 70€</td>
                </tr>
                <tr>
                  <td><strong>Vueling</strong></td>
                  <td>40 x 20 x 30 cm</td>
                  <td>55 x 40 x 20 cm (Tarifas TimeFlex o Premium)</td>
                  <td className="danger-text">Hasta 50€ - 60€</td>
                </tr>
                <tr>
                  <td><strong>Iberia</strong></td>
                  <td>40 x 30 x 15 cm</td>
                  <td>56 x 40 x 25 cm (hasta 10 kg incluida en la mayoría)</td>
                  <td>Facturación en bodega</td>
                </tr>
                <tr>
                  <td><strong>EasyJet</strong></td>
                  <td>45 x 36 x 20 cm (hasta 15 kg)</td>
                  <td>56 x 45 x 25 cm (con asiento extra legroom)</td>
                  <td className="danger-text">Hasta 58€</td>
                </tr>
                <tr>
                  <td><strong>Air Europa</strong></td>
                  <td>40 x 30 x 15 cm</td>
                  <td>55 x 35 x 25 cm (hasta 10 kg)</td>
                  <td>Tarifa de exceso</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--secondary)', marginTop: '8px', marginBottom: '20px', fontStyle: 'italic', lineHeight: 1.4 }}>
            * <em>Aviso legal y orientativo:</em> Las políticas, medidas y tarifas pueden variar según el tipo de billete adquirido, la aeronave o modificaciones de cada aerolínea. Te sugerimos verificar siempre los requisitos vigentes en el sitio oficial de la compañía aérea antes de acudir al aeropuerto.
          </p>

          <div className="guide-tip-card">
            <div className="tip-title">💡 El Consejo de Oro:</div>
            <p>
              Una mochila flexible (como las de 30L-40L con correas de compresión) casi nunca se mide en el cajetín de metal del aeropuerto porque se adapta visualmente, mientras que una maleta rígida llama inmediatamente la atención del personal de puerta.
            </p>
          </div>
        </section>

        {/* 2. Técnica del 5-4-3-2-1 */}
        <section className="guide-section">
          <div className="section-heading">
            <div className="heading-icon-wrap"><Zap size={22} /></div>
            <h2>2. La Regla del 5-4-3-2-1 para Viajes de 1 Semana</h2>
          </div>
          <p>
            Si viajas de 5 a 10 días, no necesitas más que esta fórmula minimalista probada por viajeros nómadas:
          </p>

          <div className="rule-grid">
            <div className="rule-card">
              <span className="rule-number">5</span>
              <h4>Juegos de Ropa Interior</h4>
              <p>Y calcetines transpirables o de secado rápido.</p>
            </div>
            <div className="rule-card">
              <span className="rule-number">4</span>
              <h4>Partes de Arriba</h4>
              <p>Camisetas o camisas versátiles combinables entre sí.</p>
            </div>
            <div className="rule-card">
              <span className="rule-number">3</span>
              <h4>Partes de Abajo</h4>
              <p>Pantalones o bermudas cómodas aptas para día y noche.</p>
            </div>
            <div className="rule-card">
              <span className="rule-number">2</span>
              <h4>Pares de Calzado</h4>
              <p>El más voluminoso puesto para volar y uno ligero guardado.</p>
            </div>
            <div className="rule-card">
              <span className="rule-number">1</span>
              <h4>Chaqueta / Capa Exterior</h4>
              <p>Un cortavientos o chaqueta térmica ligera en la mano.</p>
            </div>
          </div>

          <p style={{marginTop: '1.5rem'}}>
            <strong>¿El secreto para que quepa todo?</strong> Utilizar <em>cubos de embalaje por compresión</em>. A diferencia de las bolsas tradicionales, tienen una segunda cremallera perimetral que expulsa el aire atrapado y compacta los tejidos hasta en un 40%.
          </p>
        </section>

        {/* 3. Gadgets Clave Recomendados */}
        <section className="guide-section">
          <div className="section-heading">
            <div className="heading-icon-wrap"><Scale size={22} /></div>
            <h2>3. Los 4 Gadgets Imprescindibles para la Maleta</h2>
          </div>
          <p>
            Estos cuatro accesorios ocupan menos de un estuche de gafas pero solucionan el 90% de los problemas habituales en aeropuertos y hoteles:
          </p>

          <div className="gadgets-feature-grid">
            <div className="gadget-feature-card">
              <div className="gadget-feature-badge">Multas 0€</div>
              <h3>1. Báscula Digital de Bolsillo</h3>
              <p>Pesa menos de 90 gramos y te permite saber si estás en 9.8 kg o en 10.4 kg antes de que la aerolínea te cobre 50€ en puerta.</p>
              <button 
                className="gadget-link-btn" 
                onClick={() => onSelectProduct && onSelectProduct(2)}
              >
                Ver Báscula Digital en el Catálogo <ArrowRight size={14} />
              </button>
            </div>

            <div className="gadget-feature-card">
              <div className="gadget-feature-badge">Cero Enredos</div>
              <h3>2. Adaptador Universal GaN</h3>
              <p>Compatible con enchufes de Reino Unido, EE.UU., Asia y Europa, con salidas USB-C de alta velocidad para móvil y portátil.</p>
              <button 
                className="gadget-link-btn" 
                onClick={() => onSelectProduct && onSelectProduct(3)}
              >
                Ver Adaptador Universal <ArrowRight size={14} />
              </button>
            </div>

            <div className="gadget-feature-card">
              <div className="gadget-feature-badge">Descanso Real</div>
              <h3>3. Almohada Cervical Ergonómica</h3>
              <p>Dormir sentado en un vuelo sin dolor de cuello es posible si la almohada fija la barbilla y no se desinfla a mitad del trayecto.</p>
              <button 
                className="gadget-link-btn" 
                onClick={() => onSelectProduct && onSelectProduct(5)}
              >
                Ver Almohada Ergonómica <ArrowRight size={14} />
              </button>
            </div>

            <div className="gadget-feature-card">
              <div className="gadget-feature-badge">Tranquilidad Total</div>
              <h3>4. Localizador GPS / AirTag</h3>
              <p>Ten siempre la ubicación exacta de tu maleta o mochila desde tu móvil, incluso si la aerolínea la extravía en conexiones cortas.</p>
              <button 
                className="gadget-link-btn" 
                onClick={() => onSelectProduct && onSelectProduct(12)}
              >
                Ver Localizador de Equipaje <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* 4. Preguntas Frecuentes (FAQ) */}
        <section className="guide-section">
          <div className="section-heading">
            <div className="heading-icon-wrap"><HelpCircle size={22} /></div>
            <h2>4. Preguntas Frecuentes sobre Equipaje (FAQ)</h2>
          </div>

          <div className="faq-accordion">
            {[
              {
                q: "¿Se pueden llevar baterías portátiles (powerbanks) en la maleta facturada?",
                a: "NO. La normativa internacional IATA prohíbe taxativamente llevar baterías de iones de litio en la bodega del avión por riesgo de incendio. Las powerbanks deben viajar SIEMPRE contigo en el equipaje de mano en cabina (hasta un máximo habitual de 100 Wh / 27.000 mAh)."
              },
              {
                q: "¿Sigue vigente la regla de líquidos de 100 ml en 2026?",
                a: "Sí, en la gran mayoría de aeropuertos internacionales y europeos sigue aplicando el límite de envases de máximo 100 ml dentro de una bolsa transparente de 1 litro. Aunque aeropuertos con nuevos escáneres 3D (EDTS) como Madrid-Barajas o Londres-Gatwick van flexibilizando la norma, si haces escala en otro aeropuerto podrían confiscar tus botellas."
              },
              {
                q: "¿Qué sucede si mi mochila o trolley excede las medidas por un par de centímetros?",
                a: "Si el personal de tierra te pide introducirla en el medidor metálico y no entra con suavidad (sin forzar), la aerolínea exigirá pagar la tarifa de puerta de embarque, que suele costar entre 35€ y 70€ según la compañía. Por eso recomendamos organizadores de compresión y medir antes de salir de casa."
              },
              {
                q: "¿Puedo llevar una plancha o hervidor portátil en el equipaje de mano?",
                a: "Sí, los pequeños electrodomésticos portátiles de viaje (como planchas de vapor verticales plegables o hervidores de silicona) están permitidos en cabina sin líquidos en su depósito."
              }
            ].map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(i)}>
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="faq-icon" />
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Banner CTA a la tienda */}
        <section className="guide-cta-banner">
          <div className="cta-content">
            <Plane size={32} color="var(--accent)" />
            <h2>¿Listo para preparar tu próximo viaje inteligente?</h2>
            <p>Descubre nuestra selección de más de 40 accesorios testeados con los mejores precios directos en Amazon España.</p>
            <button className="cta-primary-btn" onClick={onBackToStore}>
              Ver Toda la Colección de Productos
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

      </div>
    </main>
  )
}
