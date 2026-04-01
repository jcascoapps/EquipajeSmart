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
  ChevronRight
} from 'lucide-react'
import gadgetsData from './data/gadgets.json'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(12)
  const [isSticky, setIsSticky] = useState(false)
  
  const observerTarget = useRef(null)

  const categories = ['Todos', ...new Set(gadgetsData.map(g => g.category))]

  const closeModal = () => {
    setSelectedProduct(null);
    setShowFullDescription(false);
  }

  const filteredGadgets = useMemo(() => {
    return gadgetsData.filter(gadget => {
      const name = gadget.name || ''
      const desc = gadget.description || ''
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          desc.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'Todos' || gadget.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const paginatedGadgets = useMemo(() => {
    return filteredGadgets.slice(0, visibleCount)
  }, [filteredGadgets, visibleCount])

  // Infinity Scroll Observer
  useEffect(() => {
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
  }, [visibleCount, filteredGadgets.length])

  // Sticky Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 250)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(8)
  }, [searchTerm, selectedCategory])

  // Reset gallery index on product select
  useEffect(() => {
    setCurrentImgIndex(0)
  }, [selectedProduct])

  return (
    <div className="app-main">
      <nav className="nav-header">
        <div className="container nav-content">
          <div className="logo">
            <Plane className="logo-icon" size={20} />
            <span>EQUIPAJE<span style={{color: 'var(--accent)'}}>SMART</span></span>
          </div>
          <div className="nav-links">
            <a href="#store">Colección</a>
            <a href="#about">Contacto</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <h1 className="title-main">Equipamiento esencial <br />para el viajero moderno.</h1>
          <p className="hero-subtitle">Una selección curada de piezas de alta calidad con links directos a Amazon España.</p>
          
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input"
              placeholder="Buscar en la galería..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <section className="container" id="store">
        <div className={`filters ${isSticky ? 'is-sticky' : ''}`}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid">
          {paginatedGadgets.map(gadget => (
            <div key={gadget.id} className="card" onClick={() => setSelectedProduct(gadget)}>
              <div className="card-img-container">
                <img src={gadget.images[0]} alt={gadget.name} className="card-img" />
              </div>
              <div className="card-info">
                <span className="card-cat">{gadget.category}</span>
                <h3 className="card-title">{gadget.name}</h3>
                <div className="card-footer">
                  <span className="card-price">{gadget.price}€</span>
                  <span className="view-btn">Ver Detalle <ArrowRight size={14} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Intersection Observer Target */}
        <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }}>
          {visibleCount < filteredGadgets.length && <p className="text-muted" style={{textAlign:'center'}}>Cargando más tesoros...</p>}
        </div>
      </section>

      <footer className="footer" id="about">
        <div className="container">
          <p className="text-muted">© 2026 EquipajeSmart. Selección de accesorios premium.</p>
          <p className="text-muted" style={{fontSize:'0.7rem', marginTop:'10px'}}>Como afiliados de Amazon, recibimos comisiones por compras cualificadas.</p>
        </div>
      </footer>

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={20} />
            </button>
            <div className="modal-grid">
              <div className="modal-img-container">
                <div className="gallery-main">
                  <img src={selectedProduct.images[currentImgIndex]} alt={selectedProduct.name} className="gallery-img" />
                  
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button className="gallery-nav prev" onClick={() => setCurrentImgIndex(prev => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1))}>
                        <ChevronLeft size={20} />
                      </button>
                      <button className="gallery-nav next" onClick={() => setCurrentImgIndex(prev => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1))}>
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
                <div className="gallery-thumbs">
                  {selectedProduct.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      className={`thumb ${currentImgIndex === idx ? 'active' : ''}`} 
                      onClick={() => setCurrentImgIndex(idx)}
                    />
                  ))}
                </div>
              </div>
              <div className="modal-details">
                <span className="card-cat">{selectedProduct.category}</span>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="rating" style={{display:'flex', gap:'4px', marginBottom:'1rem'}}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? 'var(--accent)' : 'none'} color="var(--accent)" />)}
                  <span className="text-muted" style={{marginLeft:'8px', fontSize:'0.8rem'}}>(Top Ventas)</span>
                </div>
                <p className="modal-price">{selectedProduct.price}€</p>
                <a href={selectedProduct.amazonUrl} target="_blank" rel="noopener noreferrer" className="amazon-cta">
                  Comprar en Amazon.es
                </a>

                <div className="description-container">
                  <p className="modal-description">
                    {showFullDescription 
                      ? selectedProduct.description 
                      : `${selectedProduct.description.slice(0, 180)}${selectedProduct.description.length > 180 ? '...' : ''}`
                    }
                    {selectedProduct.description.length > 180 && (
                      <button 
                        className="toggle-desc-btn" 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                      >
                        {showFullDescription ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                    <a 
                      href={selectedProduct.amazonUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="more-details-link"
                    >
                      Ver todos los detalles en Amazon.es
                    </a>
                  </p>
                </div>
                <p className="disclaimer">
                  * El precio mostrado es orientativo y puede variar en Amazon.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
