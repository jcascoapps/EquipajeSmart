import React, { useState } from 'react'
import { X, ShieldCheck, FileText, Cookie, ExternalLink, Lock, CheckCircle2 } from 'lucide-react'

export default function LegalModal({ isOpen, onClose, initialTab = 'legal' }) {
  const [activeTab, setActiveTab] = useState(initialTab)

  if (!isOpen) return null

  return (
    <div className="modal-overlay legal-modal-overlay" onClick={onClose}>
      <div className="legal-modal-content" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal legal">
          <X size={20} />
        </button>

        <div className="legal-modal-header">
          <div className="legal-title-wrap">
            <ShieldCheck size={24} color="var(--accent)" />
            <h2>Información Legal y Cumplimiento</h2>
          </div>
          <div className="legal-tabs-nav">
            <button 
              className={`legal-tab-btn ${activeTab === 'legal' ? 'active' : ''}`}
              onClick={() => setActiveTab('legal')}
            >
              <FileText size={15} />
              <span>Aviso Legal & Afiliados</span>
            </button>
            <button 
              className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <Lock size={15} />
              <span>Privacidad</span>
            </button>
            <button 
              className={`legal-tab-btn ${activeTab === 'cookies' ? 'active' : ''}`}
              onClick={() => setActiveTab('cookies')}
            >
              <Cookie size={15} />
              <span>Cookies</span>
            </button>
          </div>
        </div>

        <div className="legal-modal-body">
          {/* PESTAÑA 1: AVISO LEGAL Y AFILIACIÓN AMAZON */}
          {activeTab === 'legal' && (
            <div className="legal-section">
              <h3>1. Información General y Titularidad</h3>
              <p>
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que <strong>EquipajeSmart</strong> es un proyecto digital divulgativo independiente dedicado a la recomendación, comparativa y análisis de equipamiento, gadgets y accesorios de viaje optimizados para equipaje de mano y cabina.
              </p>

              <div className="legal-highlight-box">
                <h4>🛡️ Declaración Obligatoria del Programa de Afiliados de Amazon</h4>
                <p>
                  <strong>EquipajeSmart participa en el Programa de Afiliados de Amazon EU</strong>, un programa de publicidad para afiliados diseñado para ofrecer a sitios web un modo de obtener comisiones por publicidad, publicitando e incluyendo enlaces a Amazon.es.
                </p>
                <p style={{ marginTop: '0.5rem', fontStyle: 'italic', fontWeight: 600 }}>
                  "En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables."
                </p>
              </div>

              <h3>2. Precios y Disponibilidad</h3>
              <p>
                Los precios y la disponibilidad de los productos mostrados en este sitio web son orientativos y corresponden a la información obtenida en la última sincronización con Amazon.es. El precio y disponibilidad reales serán exclusivamente los que figuren en la web de <strong>Amazon.es</strong> en el momento exacto de la compra.
              </p>
              <p>
                EquipajeSmart no vende directamente ningún producto físico ni gestiona pagos, cobros, envíos, aduanas, devoluciones o garantías. Toda la relación comercial de compraventa se suscribe de manera exclusiva y directa entre el usuario y Amazon.es (o sus vendedores externos autorizados).
              </p>

              <h3>3. Marcas Comerciales y Propiedad Intelectual</h3>
              <p>
                Amazon y el logotipo de Amazon son marcas comerciales registradas de Amazon.com, Inc. o de sus sociedades filiales. Los nombres de aerolíneas (Ryanair, Vueling, Iberia, etc.) y marcas de productos se mencionan con carácter meramente descriptivo e informativo para el viajero.
              </p>
            </div>
          )}

          {/* PESTAÑA 2: POLÍTICA DE PRIVACIDAD */}
          {activeTab === 'privacy' && (
            <div className="legal-section">
              <h3>1. Responsable del Tratamiento y Protección de Datos</h3>
              <p>
                EquipajeSmart se rige estrictamente por el Reglamento General de Protección de Datos (RGPD UE 2016/679) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
              </p>

              <div className="legal-highlight-box green">
                <h4>🔒 Compromiso de Privacidad Cero Datos Sensibles</h4>
                <p>
                  <strong>EquipajeSmart NO recopila, NO solicita ni almacena datos bancarios, números de tarjetas de crédito, direcciones postales ni información financiera.</strong>
                </p>
                <p style={{ marginTop: '0.4rem' }}>
                  Cualquier transacción se realiza de forma cifrada mediante el protocolo de seguridad SSL directamente en los servidores de <strong>Amazon España</strong>.
                </p>
              </div>

              <h3>2. Datos Almacenados en tu Navegador (Uso Local)</h3>
              <p>
                Para proporcionarte una experiencia interactiva óptima sin obligarte a registrarte ni crear cuentas, utilizamos almacenamiento local en tu navegador (LocalStorage / SessionStorage):
              </p>
              <ul className="legal-bullets">
                <li><strong>Modo Oscuro / Claro:</strong> Almacena tu preferencia estética seleccionada.</li>
                <li><strong>Mi Maleta (Favoritos):</strong> Guarda en tu propio dispositivo la lista de gadgets que has marcado con el corazón para que no los pierdas al recargar.</li>
                <li><strong>Checklist de Viaje:</strong> Guarda los elementos que has completado en tu lista de equipaje.</li>
              </ul>
              <p>
                Estos datos se conservan únicamente de manera local en tu navegador y nunca son enviados ni vendidos a servidores de terceros con fines de lucro.
              </p>

              <h3>3. Enlaces Salientes hacia Amazon</h3>
              <p>
                Al hacer clic en los enlaces de compra de Amazon, serás redirigido al sitio oficial de Amazon.es, el cual cuenta con su propia <a href="https://www.amazon.es/gp/help/customer/display.html?nodeId=201909010" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Política de Privacidad de Amazon.es <ExternalLink size={12} style={{ display: 'inline' }} /></a>.
              </p>
            </div>
          )}

          {/* PESTAÑA 3: POLÍTICA DE COOKIES */}
          {activeTab === 'cookies' && (
            <div className="legal-section">
              <h3>1. ¿Qué son las Cookies y el Almacenamiento Local?</h3>
              <p>
                Una cookie o elemento de almacenamiento local es un pequeño fichero que se almacena en el navegador del usuario al acceder a determinadas páginas web con el fin de recordar preferencias de navegación.
              </p>

              <h3>2. Tecnologías Empleadas en EquipajeSmart</h3>
              <div className="table-responsive" style={{ marginTop: '0.8rem', marginBottom: '1.2rem' }}>
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Clave / Nombre</th>
                      <th>Tipo</th>
                      <th>Finalidad</th>
                      <th>Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>es_theme</code></td>
                      <td>Técnica (Local)</td>
                      <td>Recordar si tienes activado el Modo Oscuro o Claro</td>
                      <td>Persistente</td>
                    </tr>
                    <tr>
                      <td><code>es_favorites</code></td>
                      <td>Técnica (Local)</td>
                      <td>Guardar los gadgets añadidos a "Mi Maleta"</td>
                      <td>Persistente</td>
                    </tr>
                    <tr>
                      <td><code>es_checklist_*</code></td>
                      <td>Técnica (Local)</td>
                      <td>Guardar el estado de tu lista de equipaje</td>
                      <td>Persistente</td>
                    </tr>
                    <tr>
                      <td><code>es_cookie_consent</code></td>
                      <td>Técnica (Local)</td>
                      <td>Recordar la aceptación del aviso informativo</td>
                      <td>Persistente</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="legal-highlight-box">
                <h4>🍪 Cookies de Terceros al Comprar en Amazon</h4>
                <p>
                  EquipajeSmart no instala cookies de seguimiento publicitario invasivo en tu dispositivo. Cuando decides pulsar un botón hacia Amazon.es, Amazon instala una cookie propia de sesión (generalmente con 24 horas de duración) para registrar la procedencia y atribuir la comisión de compra correspondiente según el programa oficial de Afiliados de Amazon.
                </p>
              </div>

              <h3>3. Cómo Desactivar o Gestionar las Cookies en tu Navegador</h3>
              <p>
                Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador web:
              </p>
              <ul className="legal-bullets">
                <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies.</li>
                <li><strong>Apple Safari:</strong> Ajustes &gt; Safari &gt; Privacidad y seguridad.</li>
                <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad &amp; Seguridad.</li>
                <li><strong>Microsoft Edge:</strong> Configuración &gt; Permisos del sitio &gt; Cookies y datos del sitio.</li>
              </ul>
            </div>
          )}
        </div>

        <div className="legal-modal-footer">
          <button className="cta-primary-btn" onClick={onClose} style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}>
            <CheckCircle2 size={16} />
            <span>Entendido y Aceptar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
