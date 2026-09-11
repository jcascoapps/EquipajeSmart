/**
 * Copia texto al portapapeles de manera universal y garantizada,
 * compatible con HTTPS, localhost y HTTP en IPs locales (donde navigator.clipboard no existe).
 */
export async function copyTextToClipboard(text) {
  if (!text) return false;

  // 1. Intentar con navigator.clipboard en entornos seguros (HTTPS o localhost)
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard falló, usando fallback execCommand:', err);
    }
  }

  // 2. Fallback universal usando un elemento textarea temporal con document.execCommand('copy')
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Evitar zoom o desplazamiento en móviles
    textArea.style.fontSize = '12pt';
    textArea.style.border = '0';
    textArea.style.padding = '0';
    textArea.style.margin = '0';
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) return true;
  } catch (fallbackErr) {
    console.warn('Fallback execCommand falló:', fallbackErr);
  }

  // 3. Último recurso: prompt nativo para copiar manualmente
  try {
    window.prompt('Copia el enlace seleccionado (Ctrl+C o Mantén pulsado):', text);
    return true;
  } catch {
    return false;
  }
}
