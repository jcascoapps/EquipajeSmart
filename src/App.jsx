import React, { useState, useMemo, useEffect, useRef } from 'react'
import { 
  Search, 
  Filter, 
  X, 
  ExternalLink, 
  Plane, 
  ArrowRight, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Check,
  Sparkles,
  ShieldCheck,
  Compass,
  BookOpen,
  Heart,
  Wrench,
  Moon,
  Sun,
  Luggage,
  Zap,
  CheckSquare,
  Menu
} from 'lucide-react'
import gadgetsData from './data/gadgets.json'
import GuidePage from './GuidePage'
import TravelToolsModal from './components/TravelToolsModal'
import WishlistDrawer from './components/WishlistDrawer'
import LegalModal from './components/LegalModal'
import CookieBanner from './components/CookieBanner'
import WhatsAppIcon from './components/WhatsAppIcon'
import { copyTextToClipboard } from './utils/clipboard'
import './App.css'

// Sistema de analítica y métricas ocultas (compatible con GA4 / GTM / Plausible)
const trackEvent = (eventName, data = {}) => {
  try {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, timestamp: Date.now(), ...data });
    }
    const metricsHistory = JSON.parse(sessionStorage.getItem('es_metrics') || '[]');
    metricsHistory.push({ event: eventName, data, time: new Date().toISOString() });
    sessionStorage.setItem('es_metrics', JSON.stringify(metricsHistory.slice(-50)));
  } catch (e) {
    // Fail-safe silencioso
  }
}

function App() {
  // Rutas: 'home' | 'guia'
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('guia') || hash === '#guia') return 'guia';
    return 'home';
  })

  // Modo Oscuro
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('es_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  })

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
      localStorage.setItem('es_theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
    trackEvent('theme_change', { theme: darkMode ? 'dark' : 'light' });
  }, [darkMode])

  // Favoritos (Mi Maleta)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('es_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('es_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites])

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter(item => item !== id) : [...prev, id];
      trackEvent(isFav ? 'remove_favorite' : 'add_favorite', { id });
      return next;
    });
  }

  const clearAllFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem('es_favorites');
    } catch {
      // ignore
    }
    trackEvent('clear_all_favorites', {});
  }

  // Modales y Drawers
  const [toolsModalOpen, setToolsModalOpen] = useState(false)
  const [toolsInitialTab, setToolsInitialTab] = useState('airlines')
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [legalInitialTab, setLegalInitialTab] = useState('legal')

  const openTools = (tab = 'airlines') => {
    setToolsInitialTab(tab);
    setToolsModalOpen(true);
    trackEvent('open_travel_tools', { tab });
  }

  const openLegal = (tab = 'legal') => {
    setLegalInitialTab(tab);
    setLegalModalOpen(true);
    trackEvent('open_legal_modal', { tab });
  }

  // Filtros y Productos
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(12)
  const [isSticky, setIsSticky] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const observerTarget = useRef(null)

  // Categorías con filtros de presupuesto y top ventas
  const categories = [
    'Todos', 
    'Top Ventas',
    'Menos de 15€', 
    '15€ - 30€', 
    ...new Set(gadgetsData.map(g => g.category))
  ]

  // Navegación fluida entre páginas sin recargas
  const navigateTo = (route) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const targetUrl = route === 'guia' ? '/guia' : '/';
    if (window.history.pushState) {
      window.history.pushState(null, '', targetUrl);
    }
    trackEvent('navigation_view', { route });
  }

  // Soporte de historial de navegación (Botones Atrás / Adelante del navegador)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('guia') || hash === '#guia') {
        setCurrentRoute('guia');
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cierre de modal y limpieza de URL
  const closeModal = () => {
    setSelectedProduct(null);
    setShowFullDescription(false);
    if (window.history.replaceState) {
      const currentPath = currentRoute === 'guia' ? '/guia' : '/';
      window.history.replaceState(null, '', currentPath);
    }
    trackEvent('close_product_modal');
  }

  // Apertura de producto con actualización de URL para compartibilidad viral
  const openProductModal = (gadget) => {
    setSelectedProduct(gadget);
    if (window.history.replaceState) {
      const basePath = currentRoute === 'guia' ? '/guia' : '/';
      window.history.replaceState(null, '', `${basePath}?gadget=${gadget.id}`);
    }
    trackEvent('open_product_modal', { id: gadget.id, name: gadget.name, category: gadget.category, price: gadget.price });
  }

  // Soporte de enlace profundo (?gadget=ID o ?wishlist=1,2,3)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gadgetId = params.get('gadget');
    const wishlistIds = params.get('wishlist');

    if (gadgetId) {
      const found = gadgetsData.find(g => g.id === parseInt(gadgetId, 10));
      if (found) {
        setSelectedProduct(found);
        trackEvent('viral_link_opened', { id: found.id, name: found.name });
      }
    }

    if (wishlistIds) {
      const ids = wishlistIds.split(',').map(n => parseInt(n, 10)).filter(Boolean);
      if (ids.length > 0) {
        setFavorites(prev => Array.from(new Set([...prev, ...ids])));
        setWishlistOpen(true);
        trackEvent('shared_wishlist_opened', { count: ids.length });
      }
    }

    trackEvent('page_view', { total_products: gadgetsData.length, initial_route: currentRoute });
  }, [])

  const topSellerIds = [1, 2, 3, 5, 12, 14, 29, 37, 38];

  const filteredGadgets = useMemo(() => {
    return gadgetsData.filter(gadget => {
      const name = gadget.name || ''
      const desc = gadget.description || ''
      const priceNum = parseFloat(gadget.price) || 0;

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          desc.toLowerCase().includes(searchTerm.toLowerCase())

      let matchesCategory = true;
      if (selectedCategory === 'Todos') {
        matchesCategory = true;
      } else if (selectedCategory === 'Menos de 15€') {
        matchesCategory = priceNum < 15;
      } else if (selectedCategory === '15€ - 30€') {
        matchesCategory = priceNum >= 15 && priceNum <= 30;
      } else if (selectedCategory === 'Top Ventas') {
        matchesCategory = topSellerIds.includes(gadget.id);
      } else {
        matchesCategory = gadget.category === selectedCategory;
      }

      return matchesSearch && matchesCategory;
    })
  }, [searchTerm, selectedCategory])

  const paginatedGadgets = useMemo(() => {
    return filteredGadgets.slice(0, visibleCount)
  }, [filteredGadgets, visibleCount])

  // Infinity Scroll Observer (solo activo en la vista home)
  useEffect(() => {
    if (currentRoute !== 'home') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredGadgets.length) {
          setVisibleCount(prev => prev + 4)
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current)
    }
  }, [visibleCount, filteredGadgets.length, currentRoute])

  // Sticky Filters Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 250)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Carrusel y Desplazamiento Lateral de Filtros
  const filtersRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (!filtersRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = filtersRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }

  useEffect(() => {
    const timer = setTimeout(checkScrollButtons, 150);
    window.addEventListener('resize', checkScrollButtons);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollButtons);
    }
  }, [categories])

  const scrollFilters = (direction) => {
    if (!filtersRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    filtersRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollButtons, 350);
  }

  const handleFiltersWheel = (e) => {
    if (!filtersRef.current) return;
    if (e.deltaY !== 0) {
      e.preventDefault();
      filtersRef.current.scrollLeft += e.deltaY;
      checkScrollButtons();
    }
  }

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(12)
    if (selectedCategory !== 'Todos') {
      trackEvent('filter_category', { category: selectedCategory });
    }
  }, [selectedCategory])

  // Track search query with debounce
  useEffect(() => {
    setVisibleCount(12)
    if (searchTerm.trim().length >= 3) {
      const timer = setTimeout(() => {
        trackEvent('search_query', { query: searchTerm.trim() });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [searchTerm])

  // Reset gallery index on product select
  useEffect(() => {
    setCurrentImgIndex(0)
  }, [selectedProduct])

  // Copiar enlace del Gadget de forma directa y garantizada
  const handleCopyProductLink = async (product) => {
    trackEvent('share_click', { id: product.id, name: product.name });
    const shareUrl = `${window.location.origin}/?gadget=${product.id}`;
    const success = await copyTextToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      trackEvent('share_completed', { id: product.id, method: 'clipboard' });
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const handleShareWhatsApp = (product) => {
    trackEvent('share_product_whatsapp', { id: product.id, name: product.name });
    const shareUrl = `${window.location.origin}/?gadget=${product.id}`;
    const text = `✈️ ¡Mira este gadget para viajar que he encontrado en EquipajeSmart!\n\n*${product.name}* (${product.price}€)\n👉 ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div className="app-main">
      {/* Barra de Navegación Principal */}
      <nav className="nav-header">
        <div className="container nav-content">
          <div 
            className="logo" 
            onClick={() => navigateTo('home')} 
            style={{ cursor: 'pointer' }}
            title="Ir a la página principal"
          >
            <Plane className="logo-icon" size={22} />
            <span>EQUIPAJE<span style={{color: 'var(--accent)'}}>SMART</span></span>
          </div>

          <div className="nav-links">
            <button 
              className={`nav-btn-link ${currentRoute === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              Colección
            </button>
            <button 
              className={`nav-btn-link ${currentRoute === 'guia' ? 'active' : ''}`}
              onClick={() => navigateTo('guia')}
            >
              Guía de Viaje
            </button>
          </div>

          <div className="nav-actions-group">
            <button 
              className="nav-tool-btn" 
              onClick={() => openTools('airlines')}
              title="Herramientas de viaje (Medidas, Enchufes, Checklist)"
            >
              <Wrench size={14} />
              <span>Herramientas</span>
            </button>

            <button 
              className="nav-wishlist-btn"
              onClick={() => setWishlistOpen(true)}
              title="Ver mi maleta guardada"
            >
              <Heart size={15} fill={favorites.length > 0 ? 'var(--accent)' : 'none'} />
              <span>Mi Maleta</span>
              {favorites.length > 0 && (
                <span className="nav-wishlist-count">{favorites.length}</span>
              )}
            </button>

            <button 
              className="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
              aria-label="Cambiar tema de color"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Botón Hamburguesa Móvil */}
            <button 
              className="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              title="Menú"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* RENDERIZADO CONDICIONAL DE PÁGINA */}
      {currentRoute === 'guia' ? (
        <GuidePage 
          onBackToStore={() => navigateTo('home')}
          onSelectProduct={(id) => {
            const item = gadgetsData.find(g => g.id === id);
            if (item) openProductModal(item);
          }}
          trackEvent={trackEvent}
        />
      ) : (
        <>
          <header className="hero">
            <div className="container">
              <div className="badge-pill">
                <Sparkles size={14} color="var(--accent)" />
                <span>Selección Curada 2026</span>
              </div>
              <h1 className="title-main">Equipamiento esencial <br />para el viajero moderno.</h1>
              <p className="hero-subtitle">Descubre los gadgets más eficientes, ligeros y virales para optimizar tu equipaje de cabina sin facturar.</p>
              
              <div className="search-wrapper">
                <Search className="search-icon" size={18} />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Buscar por organizador, adaptador, peso, almohada..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Buscar gadgets y accesorios de equipaje"
                />
              </div>

              {/* Botones de acceso rápido a herramientas interactivas */}
              <div className="hero-tools-row">
                <button 
                  className="hero-tool-btn" 
                  onClick={() => openTools('airlines')}
                >
                  <Luggage size={16} color="var(--accent)" />
                  <span>Medidas Aerolíneas 2026</span>
                </button>
                <button 
                  className="hero-tool-btn" 
                  onClick={() => openTools('plugs')}
                >
                  <Zap size={16} color="var(--accent)" />
                  <span>Enchufes por País</span>
                </button>
                <button 
                  className="hero-tool-btn" 
                  onClick={() => openTools('checklist')}
                >
                  <CheckSquare size={16} color="var(--accent)" />
                  <span>Checklist de Maleta</span>
                </button>
              </div>
            </div>
          </header>

          <section className="container" id="store">
            <div className={`filters-container-wrapper ${isSticky ? 'is-sticky' : ''}`}>
              {canScrollLeft && (
                <button 
                  className="filters-scroll-btn left" 
                  onClick={() => scrollFilters('left')}
                  aria-label="Ver categorías anteriores"
                  title="Ver anteriores"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              <div 
                ref={filtersRef}
                className="filters"
                onScroll={checkScrollButtons}
                onWheel={handleFiltersWheel}
              >
                {categories.map(cat => (
                  <button 
                    key={cat}
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={(e) => {
                      setSelectedCategory(cat);
                      if (e?.currentTarget?.scrollIntoView) {
                        e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                      }
                    }}
                  >
                    {cat}
                  </button>
                ))}
                {/* Espaciador final para asegurar que ninguna categoría quede pegada ni cortada */}
                <span className="filters-end-spacer" />
              </div>

              {canScrollRight && (
                <button 
                  className="filters-scroll-btn right" 
                  onClick={() => scrollFilters('right')}
                  aria-label="Ver más categorías"
                  title="Ver más"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            <div className="grid">
              {paginatedGadgets.map(gadget => {
                const isFav = favorites.includes(gadget.id);
                const priceNum = parseFloat(gadget.price) || 0;
                const isTop = topSellerIds.includes(gadget.id);
                const isBargain = priceNum < 15;

                return (
                  <article key={gadget.id} className="card" onClick={() => openProductModal(gadget)}>
                    <div className="card-img-container">
                      {/* Badges de Conversión */}
                      {isTop && <span className="card-promo-badge top">🥇 Top Ventas</span>}
                      {!isTop && isBargain && <span className="card-promo-badge bargain">⚡ Chollo</span>}

                      {/* Botón de Guardar en Mi Maleta */}
                      <button 
                        className={`card-heart-btn ${isFav ? 'active' : ''}`}
                        onClick={(e) => toggleFavorite(gadget.id, e)}
                        title={isFav ? 'Quitar de mi maleta' : 'Guardar en mi maleta'}
                        aria-label="Añadir a favoritos"
                      >
                        <Heart size={16} fill={isFav ? '#ef4444' : 'none'} />
                      </button>

                      <img 
                        src={gadget.images[0]} 
                        alt={`${gadget.name} - Accesorio de viaje`} 
                        className="card-img" 
                        loading="lazy"
                      />
                    </div>
                    <div className="card-info">
                      <span className="card-cat">{gadget.category}</span>
                      <h3 className="card-title">{gadget.name}</h3>
                      <div className="card-footer">
                        <span className="card-price">{gadget.price}€</span>
                        <span className="view-btn">Ver Detalle <ArrowRight size={14} /></span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Intersection Observer Target */}
            <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }}>
              {visibleCount < filteredGadgets.length && (
                <p className="text-muted" style={{textAlign:'center'}}>Cargando más artículos recomendados...</p>
              )}
            </div>
          </section>

          {/* Banner de acceso a la Guía Completa de Viaje */}
          <section className="container" style={{ margin: '3rem auto 1rem' }}>
            <div 
              className="seo-card" 
              onClick={() => navigateTo('guia')}
              style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <BookOpen size={16} />
                  <span>MANUAL DE VIAJE 2026</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  La Guía Definitiva del Equipaje de Mano: Cómo Viajar sin Facturar
                </h3>
                <p style={{ color: 'var(--secondary)', fontSize: '0.95rem', margin: 0, maxWidth: '650px' }}>
                  Medidas exactas de Ryanair, Vueling e Iberia, la regla del 5-4-3-2-1 y los gadgets que te evitarán multas en el aeropuerto.
                </p>
              </div>
              <button className="cta-primary-btn" style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem' }}>
                Leer Guía Completa <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </>
      )}

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <div 
              className="logo" 
              onClick={() => navigateTo('home')} 
              style={{ cursor: 'pointer' }}
              title="Ir a la página principal"
            >
              <Plane className="logo-icon" size={20} />
              <span>EQUIPAJE<span style={{color: 'var(--accent)'}}>SMART</span></span>
            </div>
            <p className="footer-desc">
              Guía y catálogo independiente de equipamiento y accesorios de cabina para viajar ligero sin facturar.
            </p>
          </div>

          <div className="footer-links-row">
            <button className="footer-legal-link" onClick={() => openLegal('legal')}>
              Aviso Legal & Afiliados
            </button>
            <span className="footer-sep">•</span>
            <button className="footer-legal-link" onClick={() => openLegal('privacy')}>
              Política de Privacidad
            </button>
            <span className="footer-sep">•</span>
            <button className="footer-legal-link" onClick={() => openLegal('cookies')}>
              Política de Cookies
            </button>
          </div>

          <div className="footer-disclaimer-box">
            <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
              © 2026 EquipajeSmart. Todos los derechos reservados.
            </p>
            <p className="affiliate-disclosure">
              * <strong>Declaración de Afiliación:</strong> En calidad de Afiliado de Amazon, EquipajeSmart obtiene ingresos por las compras adscritas que cumplen los requisitos aplicables. Amazon y el logotipo de Amazon son marcas comerciales de Amazon.com, Inc. o de sus filiales. Los precios y la disponibilidad están sujetos a cambios en Amazon.es.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Producto con Acción Viral y Favorito */}
      {selectedProduct && (
        <div className="modal-overlay product-modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="modal-close" onClick={closeModal} aria-label="Cerrar modal">
              <X size={20} />
            </button>
            <div className="modal-grid">
              <div className="modal-img-container">
                <div className="gallery-main">
                  <img 
                    src={selectedProduct.images[currentImgIndex]} 
                    alt={selectedProduct.name} 
                    className="gallery-img" 
                  />
                  
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button 
                        className="gallery-nav prev" 
                        onClick={() => setCurrentImgIndex(prev => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1))}
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        className="gallery-nav next" 
                        onClick={() => setCurrentImgIndex(prev => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1))}
                        aria-label="Siguiente imagen"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="gallery-thumbs">
                    {selectedProduct.images.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt={`Miniatura ${idx + 1}`}
                        className={`thumb ${currentImgIndex === idx ? 'active' : ''}`} 
                        onClick={() => setCurrentImgIndex(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="card-cat">{selectedProduct.category}</span>
                  <button 
                    className="drawer-trash-btn" 
                    onClick={(e) => toggleFavorite(selectedProduct.id, e)}
                    style={{ color: favorites.includes(selectedProduct.id) ? '#ef4444' : 'var(--secondary)' }}
                    title={favorites.includes(selectedProduct.id) ? 'En mi maleta' : 'Guardar en mi maleta'}
                  >
                    <Heart size={20} fill={favorites.includes(selectedProduct.id) ? '#ef4444' : 'none'} />
                  </button>
                </div>

                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="rating" style={{display:'flex', gap:'4px', marginBottom:'1rem', alignItems: 'center'}}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? 'var(--accent)' : 'none'} color="var(--accent)" />)}
                  <span className="text-muted" style={{marginLeft:'8px', fontSize:'0.8rem'}}>(Top Ventas en Amazon)</span>
                </div>
                <p className="modal-price">{selectedProduct.price}€</p>
                
                <div className="modal-cta-group">
                  <a 
                    href={selectedProduct.amazonUrl} 
                    target="_blank" 
                    rel="nofollow sponsored noopener noreferrer" 
                    className="amazon-cta"
                    onClick={() => trackEvent('click_amazon_affiliate', { id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price })}
                  >
                    Comprar en Amazon.es
                    <ExternalLink size={16} />
                  </a>

                  {/* Acciones para Compartir */}
                  <div className="modal-share-actions-row">
                    <button 
                      className="share-whatsapp-btn"
                      onClick={() => handleShareWhatsApp(selectedProduct)}
                      title="Compartir por WhatsApp"
                    >
                      <WhatsAppIcon size={16} color="white" />
                      <span>WhatsApp</span>
                    </button>

                    <button 
                      className={`share-action-btn ${copied ? 'copied' : ''}`}
                      onClick={() => handleCopyProductLink(selectedProduct)}
                      title="Copiar enlace del gadget"
                    >
                      {copied ? <Check size={16} /> : <Share2 size={16} />}
                      <span>{copied ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
                    </button>
                  </div>
                </div>

                <div className="description-container">
                  <div className="modal-description">
                    {showFullDescription 
                      ? selectedProduct.description 
                      : `${selectedProduct.description.slice(0, 200)}${selectedProduct.description.length > 200 ? '...' : ''}`
                    }
                    {selectedProduct.description.length > 200 && (
                      <button 
                        className="toggle-desc-btn" 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                      >
                        {showFullDescription ? 'Ver menos' : 'Ver descripción completa'}
                      </button>
                    )}
                    <a 
                      href={selectedProduct.amazonUrl} 
                      target="_blank" 
                      rel="nofollow sponsored noopener noreferrer"
                      className="more-details-link"
                    >
                      Ver todas las especificaciones y opiniones en Amazon.es
                    </a>
                  </div>
                </div>
                <p className="disclaimer">
                  * El precio mostrado es orientativo y se actualiza periódicamente según disponibilidad en Amazon España.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Herramientas Interactivas (Aerolíneas, Enchufes, Checklist) */}
      <TravelToolsModal 
        isOpen={toolsModalOpen}
        onClose={() => setToolsModalOpen(false)}
        initialTab={toolsInitialTab}
        onSelectProduct={(id) => {
          const item = gadgetsData.find(g => g.id === id);
          if (item) openProductModal(item);
        }}
        onFilterCategory={(cat) => {
          setSelectedCategory(cat);
          if (currentRoute !== 'home') navigateTo('home');
        }}
        trackEvent={trackEvent}
      />

      {/* Drawer de Favoritos / "Mi Maleta" */}
      <WishlistDrawer 
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        favorites={favorites}
        products={gadgetsData}
        onRemoveFavorite={(id) => toggleFavorite(id)}
        onClearWishlist={clearAllFavorites}
        onSelectProduct={(product) => openProductModal(product)}
        trackEvent={trackEvent}
      />

      {/* Modal de Información Legal, Privacidad y Cookies */}
      <LegalModal 
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalInitialTab}
      />

      {/* Banner de Cookies no invasivo */}
      <CookieBanner onOpenCookiesInfo={(tab) => openLegal(tab)} />

      {/* Cajón Menú Móvil (Root Level para evitar recortes) */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="logo" onClick={() => navigateTo('home')}>
                <Plane className="logo-icon" size={20} />
                <span>EQUIPAJE<span style={{color: 'var(--accent)'}}>SMART</span></span>
              </div>
              <button 
                className="mobile-menu-close-btn" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-menu-nav">
              <button 
                className={`mobile-nav-item ${currentRoute === 'home' ? 'active' : ''}`}
                onClick={() => navigateTo('home')}
              >
                <Luggage size={18} />
                <span>Colección de Gadgets</span>
              </button>

              <button 
                className={`mobile-nav-item ${currentRoute === 'guia' ? 'active' : ''}`}
                onClick={() => navigateTo('guia')}
              >
                <BookOpen size={18} />
                <span>Guía de Viaje 2026</span>
              </button>

              <button 
                className="mobile-nav-item"
                onClick={() => { setMobileMenuOpen(false); openTools('airlines'); }}
              >
                <Wrench size={18} />
                <span>Herramientas Interactivas</span>
              </button>

              <button 
                className="mobile-nav-item"
                onClick={() => { setMobileMenuOpen(false); setWishlistOpen(true); }}
              >
                <Heart size={18} fill={favorites.length > 0 ? 'var(--accent)' : 'none'} />
                <span>Mi Maleta {favorites.length > 0 ? `(${favorites.length})` : ''}</span>
              </button>

              <button 
                className="mobile-nav-item"
                onClick={() => { setMobileMenuOpen(false); openLegal('legal'); }}
              >
                <ShieldCheck size={18} />
                <span>Aviso Legal & Privacidad</span>
              </button>
            </div>

            <div className="mobile-menu-footer">
              <p>EquipajeSmart © 2026 • Guía y Selección Curada</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
