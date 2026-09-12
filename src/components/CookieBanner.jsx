import React, { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'

export default function CookieBanner({ onOpenCookiesInfo }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const accepted = localStorage.getItem('es_cookie_consent')
      if (!accepted) {
        // Mostrar con un pequeño retardo para no saturar al cargar
        const timer = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(timer)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem('es_cookie_consent', 'true')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside className="cookie-banner" role="region" aria-label="Aviso de Cookies y Almacenamiento">
      <div className="cookie-banner-inner">
        <div className="cookie-banner-text">
          <div className="cookie-icon-pill">
            <Cookie size={16} color="var(--accent)" />
          </div>
          <p>
            Utilizamos almacenamiento local técnico para recordar tu maleta y modo de color. Al navegar o comprar en Amazon aceptas sus políticas de cookies.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button 
            className="cookie-banner-info-btn"
            onClick={() => onOpenCookiesInfo('cookies')}
          >
            Más info
          </button>
          <button 
            className="cookie-banner-accept-btn"
            onClick={handleAccept}
          >
            Entendido
          </button>
        </div>
      </div>
    </aside>
  )
}
