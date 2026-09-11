import React, { useState, useEffect } from 'react'
import { 
  X, 
  Luggage, 
  Zap, 
  CheckSquare, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  BatteryCharging,
  Layers,
  ChevronRight,
  Share2
} from 'lucide-react'
import { AIRLINES_DATA, COUNTRIES_PLUGS_DATA, PACKING_CHECKLIST_DATA } from '../data/travelToolsData'
import gadgetsData from '../data/gadgets.json'
import { copyTextToClipboard } from '../utils/clipboard'
import WhatsAppIcon from './WhatsAppIcon'

export default function TravelToolsModal({ 
  isOpen, 
  onClose, 
  initialTab = 'airlines', 
  onSelectProduct, 
  onFilterCategory,
  trackEvent 
}) {
  const [activeTab, setActiveTab] = useState(initialTab)
  
  // Tab 1: Aerolíneas
  const [selectedAirlineId, setSelectedAirlineId] = useState(AIRLINES_DATA[0].id)
  const [luggageFilter, setLuggageFilter] = useState('all') // 'all' | 'free' | 'cabin'
  
  // Tab 2: Enchufes (solo desplegable ordenado alfabéticamente para evitar errores)
  const sortedCountries = [...COUNTRIES_PLUGS_DATA].sort((a, b) => a.country.localeCompare(b.country));
  const [selectedCountryName, setSelectedCountryName] = useState(sortedCountries[0].country)

  // Tab 3: Checklist (guardado persistente independiente por cada modo de viaje)
  const [checklistPreset, setChecklistPreset] = useState('weekend')
  const [checkedItems, setCheckedItems] = useState({})
  const [checklistCopied, setChecklistCopied] = useState(false)

  // Cargar checklist guardado para el preset actual
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`es_checklist_${checklistPreset}`);
      setCheckedItems(saved ? JSON.parse(saved) : {});
    } catch {
      setCheckedItems({});
    }
  }, [checklistPreset])

  // Guardar en localStorage cada vez que cambia
  const toggleCheckItem = (itemText) => {
    setCheckedItems(prev => {
      const next = { ...prev, [itemText]: !prev[itemText] };
      try {
        localStorage.setItem(`es_checklist_${checklistPreset}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    trackEvent('toggle_checklist_item', { item: itemText, preset: checklistPreset });
  };

  const resetChecklist = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem(`es_checklist_${checklistPreset}`);
    } catch {
      // ignore
    }
    trackEvent('reset_checklist', { preset: checklistPreset });
  };

  const handleShareChecklistWhatsApp = () => {
    trackEvent('share_checklist_whatsapp', { preset: checklistPreset });
    const currentChecklist = PACKING_CHECKLIST_DATA[checklistPreset] || PACKING_CHECKLIST_DATA.weekend;
    const allChecklistItems = currentChecklist.sections.flatMap(s => s.items);
    const checkedList = allChecklistItems.filter(item => checkedItems[item]);
    const pendingList = allChecklistItems.filter(item => !checkedItems[item]);
    const progressPercent = Math.round((checkedList.length / (allChecklistItems.length || 1)) * 100);
    
    let text = `✈️ *Mi Checklist de Viaje (${currentChecklist.title})* en EquipajeSmart\n`;
    text += `Progreso: ${checkedList.length}/${allChecklistItems.length} completado (${progressPercent}%)\n\n`;
    
    if (checkedList.length > 0) {
      text += `✅ *Listo en la maleta (${checkedList.length}):*\n`;
      checkedList.forEach(item => { text += `• ${item}\n`; });
      text += `\n`;
    }
    
    if (pendingList.length > 0) {
      text += `⏳ *Pendiente de meter (${pendingList.length}):*\n`;
      pendingList.forEach(item => { text += `• ${item}\n`; });
      text += `\n`;
    }
    
    text += `Organiza tu viaje en: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyChecklist = async () => {
    trackEvent('share_checklist_copy', { preset: checklistPreset });
    const currentChecklist = PACKING_CHECKLIST_DATA[checklistPreset] || PACKING_CHECKLIST_DATA.weekend;
    const allChecklistItems = currentChecklist.sections.flatMap(s => s.items);
    const checkedList = allChecklistItems.filter(item => checkedItems[item]);
    const pendingList = allChecklistItems.filter(item => !checkedItems[item]);
    const progressPercent = Math.round((checkedList.length / (allChecklistItems.length || 1)) * 100);
    
    let text = `📋 Mi Checklist de Viaje (${currentChecklist.title}) - EquipajeSmart\n`;
    text += `Progreso: ${checkedList.length}/${allChecklistItems.length} (${progressPercent}%)\n\n`;
    
    if (checkedList.length > 0) {
      text += `[X] LISTO (${checkedList.length}):\n` + checkedList.map(i => ` • ${i}`).join('\n') + '\n\n';
    }
    if (pendingList.length > 0) {
      text += `[ ] PENDIENTE (${pendingList.length}):\n` + pendingList.map(i => ` • ${i}`).join('\n') + '\n\n';
    }
    text += `Organizado con: ${window.location.origin}`;
    
    const success = await copyTextToClipboard(text);
    if (success) {
      setChecklistCopied(true);
      setTimeout(() => setChecklistCopied(false), 2500);
    }
  };

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  if (!isOpen) return null;

  const currentAirline = AIRLINES_DATA.find(a => a.id === selectedAirlineId) || AIRLINES_DATA[0];
  const selectedCountry = sortedCountries.find(c => c.country === selectedCountryName) || sortedCountries[0];

  const currentChecklist = PACKING_CHECKLIST_DATA[checklistPreset] || PACKING_CHECKLIST_DATA.weekend;
  const allChecklistItems = currentChecklist.sections.flatMap(s => s.items);
  const totalItemsCount = allChecklistItems.length;
  const checkedCount = allChecklistItems.filter(item => checkedItems[item]).length;
  const progressPercent = Math.round((checkedCount / (totalItemsCount || 1)) * 100);

  // Productos de equipaje específicos
  const personalBagProduct = gadgetsData.find(g => g.id === 41) || gadgetsData.find(g => g.id === 1);
  const cabinTrolleyProduct = gadgetsData.find(g => g.id === 42) || gadgetsData.find(g => g.id === 9);

  // Productos recomendados de energía / enchufes
  const adapterProduct = gadgetsData.find(g => g.id === 3);
  const powerbankProduct = gadgetsData.find(g => g.id === 38);
  const cableOrganizerProduct = gadgetsData.find(g => g.id === 4);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="tools-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </button>

        {/* Modal Tabs Header */}
        <div className="tools-modal-header">
          <div className="tools-title-group">
            <span className="badge-pill" style={{ marginBottom: '0.5rem' }}>
              <Sparkles size={13} />
              <span>Herramientas Interactivas</span>
            </span>
            <h2>Centro de Preparación de Viaje</h2>
          </div>

          <div className="tools-tabs-nav">
            <button 
              className={`tool-tab-btn ${activeTab === 'airlines' ? 'active' : ''}`}
              onClick={() => { setActiveTab('airlines'); trackEvent('switch_tool_tab', { tab: 'airlines' }); }}
            >
              <Luggage size={16} />
              <span>Medidas Aerolíneas</span>
            </button>
            <button 
              className={`tool-tab-btn ${activeTab === 'plugs' ? 'active' : ''}`}
              onClick={() => { setActiveTab('plugs'); trackEvent('switch_tool_tab', { tab: 'plugs' }); }}
            >
              <Zap size={16} />
              <span>Enchufes por País</span>
            </button>
            <button 
              className={`tool-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
              onClick={() => { setActiveTab('checklist'); trackEvent('switch_tool_tab', { tab: 'checklist' }); }}
            >
              <CheckSquare size={16} />
              <span>Checklist de Maleta</span>
            </button>
          </div>
        </div>

        {/* TAB 1: VALIDADOR DE AEROLÍNEAS */}
        {activeTab === 'airlines' && (
          <div className="tool-tab-body">
            <div className="airline-selector-row">
              <label htmlFor="airline-select">Selecciona tu compañía aérea:</label>
              <select 
                id="airline-select"
                className="tool-select"
                value={selectedAirlineId}
                onChange={e => {
                  setSelectedAirlineId(e.target.value);
                  trackEvent('select_airline', { airline: e.target.value });
                }}
              >
                {AIRLINES_DATA.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.country})</option>
                ))}
              </select>
            </div>

            <div className="airline-disclaimer-note">
              <span>ℹ️ <strong>Medidas orientativas:</strong> Verifica siempre las condiciones de tu billete antes de volar.</span>
            </div>

            {/* Selector Rápido de Tipo de Equipaje en Móvil */}
            <div className="luggage-filter-bar">
              <button 
                type="button"
                className={`luggage-filter-btn ${luggageFilter === 'all' ? 'active' : ''}`}
                onClick={() => setLuggageFilter('all')}
              >
                <span>✈️ Ambas Piezas</span>
              </button>
              <button 
                type="button"
                className={`luggage-filter-btn ${luggageFilter === 'free' ? 'active' : ''}`}
                onClick={() => setLuggageFilter('free')}
              >
                <span>🎒 Bulto Gratuito</span>
              </button>
              <button 
                type="button"
                className={`luggage-filter-btn ${luggageFilter === 'cabin' ? 'active' : ''}`}
                onClick={() => setLuggageFilter('cabin')}
              >
                <span>🧳 Maleta Cabina</span>
              </button>
            </div>

            <div className="airline-spec-cards">
              {/* Tarjeta 1: Bulto Gratuito */}
              {(luggageFilter === 'all' || luggageFilter === 'free') && (
                <div className="spec-card free-spec">
                  <div className="spec-card-head">
                    <div className="spec-head-left">
                      <span className="spec-type-tag free">🎒 Bulto Bajo el Asiento</span>
                      <span className="spec-status-pill free">GRATIS INCLUIDO</span>
                    </div>
                    <div className="spec-dim-badge">
                      <span className="dim-val">{currentAirline.freeBag.w} × {currentAirline.freeBag.h} × {currentAirline.freeBag.d}</span>
                      <span className="dim-unit">cm</span>
                    </div>
                  </div>

                  <div className="spec-chips-strip">
                    <span className="spec-chip">⚖️ {currentAirline.freeBag.weight}</span>
                    <span className="spec-chip">📍 {currentAirline.freeBag.desc}</span>
                  </div>

                  {/* Producto Recomendado Directo */}
                  {personalBagProduct && (
                    <div className="spec-rec-strip" onClick={() => onSelectProduct(personalBagProduct.id)}>
                      <img src={personalBagProduct.images[0]} alt={personalBagProduct.name} />
                      <div className="rec-strip-info">
                        <span className="rec-strip-eyebrow">
                          {currentAirline.freeBag.d < 20 
                            ? `Mochila Flexible (Fondo ${currentAirline.freeBag.d} cm)` 
                            : 'Mochila Homologada Recomendada'}
                        </span>
                        <h4 className="rec-strip-title">{personalBagProduct.name}</h4>
                      </div>
                      <div className="rec-strip-cta">
                        <span className="rec-strip-price">{personalBagProduct.price}€</span>
                        <span className="rec-strip-btn">Ver <ChevronRight size={13} /></span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tarjeta 2: Trolley de Cabina */}
              {(luggageFilter === 'all' || luggageFilter === 'cabin') && (
                <div className="spec-card cabin-spec">
                  <div className="spec-card-head">
                    <div className="spec-head-left">
                      <span className="spec-type-tag cabin">🧳 Maleta de Cabina</span>
                      <span className="spec-status-pill cabin">10 KG / PRIORIDAD</span>
                    </div>
                    <div className="spec-dim-badge">
                      <span className="dim-val">{currentAirline.cabinBag.w} × {currentAirline.cabinBag.h} × {currentAirline.cabinBag.d}</span>
                      <span className="dim-unit">cm</span>
                    </div>
                  </div>

                  <div className="spec-chips-strip">
                    <span className="spec-chip">⚖️ {currentAirline.cabinBag.weight}</span>
                    <span className="spec-chip">📍 {currentAirline.cabinBag.desc}</span>
                  </div>

                  {/* Producto Recomendado Dinámico según medidas reales de la aerolínea */}
                  {(currentAirline.cabinBag.w >= 55 && currentAirline.cabinBag.h >= 40 && currentAirline.cabinBag.d >= 20) ? (
                    cabinTrolleyProduct && (
                      <div className="spec-rec-strip" onClick={() => onSelectProduct(cabinTrolleyProduct.id)}>
                        <img src={cabinTrolleyProduct.images[0]} alt={cabinTrolleyProduct.name} />
                        <div className="rec-strip-info">
                          <span className="rec-strip-eyebrow">Trolley Rígido Homologado (55×40×20 cm)</span>
                          <h4 className="rec-strip-title">{cabinTrolleyProduct.name}</h4>
                        </div>
                        <div className="rec-strip-cta">
                          <span className="rec-strip-price">{cabinTrolleyProduct.price}€</span>
                          <span className="rec-strip-btn">Ver <ChevronRight size={13} /></span>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="spec-rec-strip warning-rec-strip" onClick={() => { onClose(); onFilterCategory('Equipaje'); }}>
                      <div className="rec-strip-info">
                        <span className="rec-strip-eyebrow" style={{ color: '#d97706' }}>
                          ⚠️ Ancho restringido a {currentAirline.cabinBag.h} cm (máx {currentAirline.cabinBag.w}×{currentAirline.cabinBag.h}×{currentAirline.cabinBag.d} cm)
                        </span>
                        <h4 className="rec-strip-title" style={{ fontSize: '0.78rem' }}>
                          Bolsas o mochilas flexibles recomendadas para evitar recargos
                        </h4>
                      </div>
                      <div className="rec-strip-cta">
                        <span className="rec-strip-btn">Catálogo <ChevronRight size={13} /></span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="airline-warning-box">
              <div className="warning-head">
                <AlertTriangle size={16} />
                <span>Penalización en puerta: {currentAirline.penaltyFee}</span>
              </div>
              <p className="warning-tip">💡 <strong>Consejo:</strong> {currentAirline.tip}</p>
            </div>

            <div className="tool-actions-bar">
              <button 
                className="cta-primary-btn"
                onClick={() => {
                  onClose();
                  onFilterCategory('Equipaje');
                }}
              >
                Ver Todo el Equipaje de Cabina
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ENCHUFES POR PAÍS (DESPLEGABLE EXCLUSIVO) */}
        {activeTab === 'plugs' && (
          <div className="tool-tab-body">
            <div className="airline-selector-row">
              <label htmlFor="country-select">Selecciona el país al que viajas:</label>
              <select 
                id="country-select"
                className="tool-select"
                style={{ minWidth: '260px' }}
                value={selectedCountryName}
                onChange={e => {
                  setSelectedCountryName(e.target.value);
                  trackEvent('select_country_plug', { country: e.target.value });
                }}
              >
                {sortedCountries.map(c => (
                  <option key={c.country} value={c.country}>
                    {c.country} {c.needsAdapterFromES ? '⚠️ (Necesita Adaptador)' : '✅ (Compatible)'}
                  </option>
                ))}
              </select>
            </div>

            {selectedCountry && (
              <div className="plug-result-card">
                <div className="plug-result-header">
                  <div>
                    <h3>{selectedCountry.country}</h3>
                    <p className="voltage-tag">Voltaje: <strong>{selectedCountry.voltage}</strong> | Frecuencia: <strong>{selectedCountry.freq}</strong></p>
                  </div>
                  <div className={`adapter-badge ${selectedCountry.needsAdapterFromES ? 'needed' : 'ok'}`}>
                    {selectedCountry.needsAdapterFromES ? '⚠️ Necesitas Adaptador' : '✅ Enchufe Compatible con España'}
                  </div>
                </div>

                <div className="plug-types-row">
                  <span>Tipos de Clavija:</span>
                  <div className="types-list">
                    {selectedCountry.plugs.map(p => (
                      <span key={p} className="plug-type-tag">Tipo {p}</span>
                    ))}
                  </div>
                </div>

                <p className="plug-notes">💡 {selectedCountry.notes}</p>

                {/* Kit Completo de Energía Recomendado */}
                <div className="power-kit-section">
                  <h4>⚡ Kit de Energía y Conectividad Recomendado</h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Accesorios esenciales para tener batería en cualquier país sin cargar adaptadores pesados:
                  </p>

                  <div className="power-kit-grid">
                    {adapterProduct && (
                      <div className="power-kit-card" onClick={() => onSelectProduct(adapterProduct.id)}>
                        <img src={adapterProduct.images[0]} alt={adapterProduct.name} />
                        <div className="power-kit-info">
                          <span className="kit-tag">Adaptador Universal</span>
                          <h5>{adapterProduct.name}</h5>
                          <span className="kit-price">{adapterProduct.price}€</span>
                        </div>
                        <ChevronRight size={16} />
                      </div>
                    )}

                    {powerbankProduct && (
                      <div className="power-kit-card" onClick={() => onSelectProduct(powerbankProduct.id)}>
                        <img src={powerbankProduct.images[0]} alt={powerbankProduct.name} />
                        <div className="power-kit-info">
                          <span className="kit-tag">Batería MagSafe</span>
                          <h5>{powerbankProduct.name}</h5>
                          <span className="kit-price">{powerbankProduct.price}€</span>
                        </div>
                        <ChevronRight size={16} />
                      </div>
                    )}

                    {cableOrganizerProduct && (
                      <div className="power-kit-card" onClick={() => onSelectProduct(cableOrganizerProduct.id)}>
                        <img src={cableOrganizerProduct.images[0]} alt={cableOrganizerProduct.name} />
                        <div className="power-kit-info">
                          <span className="kit-tag">Organizador Cables</span>
                          <h5>{cableOrganizerProduct.name}</h5>
                          <span className="kit-price">{cableOrganizerProduct.price}€</span>
                        </div>
                        <ChevronRight size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CHECKLIST INTERACTIVO (GUARDADO PERSISTENTE) */}
        {activeTab === 'checklist' && (
          <div className="tool-tab-body">
            <div className="checklist-controls-header">
              <div className="preset-tabs">
                {Object.values(PACKING_CHECKLIST_DATA).map(p => (
                  <button 
                    key={p.id}
                    className={`preset-btn ${checklistPreset === p.id ? 'active' : ''}`}
                    onClick={() => {
                      setChecklistPreset(p.id);
                      trackEvent('switch_checklist_preset', { preset: p.id });
                    }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>

              <button className="reset-checklist-btn" onClick={resetChecklist} title="Reiniciar lista">
                <RotateCcw size={14} />
                <span>Reiniciar</span>
              </button>
            </div>

            <div className="checklist-progress-bar-wrap">
              <div className="progress-info">
                <span>Progreso: {checkedCount} de {totalItemsCount} preparados</span>
                <span><strong>{progressPercent}%</strong></span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '6px' }}>
                💾 Tus marcas se guardan automáticamente en este dispositivo para que puedas retomar la lista cuando quieras.
              </p>

              {/* Acciones para Enviar y Compartir Checklist */}
              <div className="checklist-share-bar">
                <button 
                  className="checklist-whatsapp-btn" 
                  onClick={handleShareChecklistWhatsApp}
                  title="Enviar este checklist por WhatsApp"
                >
                  <WhatsAppIcon size={16} color="white" />
                  <span>Enviar por WhatsApp</span>
                </button>
                <button 
                  className={`checklist-copy-btn ${checklistCopied ? 'copied' : ''}`} 
                  onClick={handleCopyChecklist}
                  title="Copiar resumen del checklist al portapapeles"
                >
                  {checklistCopied ? <Check size={15} /> : <Share2 size={15} />}
                  <span>{checklistCopied ? '¡Checklist copiado!' : 'Copiar lista'}</span>
                </button>
              </div>
            </div>

            <div className="checklist-sections-scroll">
              {currentChecklist.sections.map((section, sIdx) => (
                <div key={sIdx} className="checklist-section-box">
                  <h4>{section.name}</h4>
                  <div className="checklist-items-grid">
                    {section.items.map((item, iIdx) => {
                      const isChecked = !!checkedItems[item];
                      return (
                        <div 
                          key={iIdx} 
                          className={`check-item-label ${isChecked ? 'completed' : ''}`}
                          onClick={() => toggleCheckItem(item)}
                          role="checkbox"
                          aria-checked={isChecked}
                        >
                          <span className="checkbox-custom">
                            {isChecked && <Check size={12} />}
                          </span>
                          <span className="item-text">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
