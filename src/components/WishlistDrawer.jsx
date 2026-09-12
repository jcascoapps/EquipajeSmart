import React, { useState } from 'react'
import { 
  X, 
  Trash2, 
  Share2, 
  ExternalLink, 
  Luggage, 
  ArrowRight, 
  Check, 
  Sparkles,
  Heart
} from 'lucide-react'
import { copyTextToClipboard } from '../utils/clipboard'
import WhatsAppIcon from './WhatsAppIcon'

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  favorites = [], 
  products = [], 
  onRemoveFavorite, 
  onClearWishlist,
  onSelectProduct,
  trackEvent 
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null;

  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  
  const totalPrice = favoriteProducts.reduce((acc, p) => {
    const num = parseFloat(p.price) || 0;
    return acc + num;
  }, 0).toFixed(2);

  const handleShareWhatsApp = () => {
    trackEvent('share_wishlist_whatsapp', { count: favoriteProducts.length, total: totalPrice });
    
    let text = `✈️ *Mi Maleta de Viaje en EquipajeSmart* (Total: ${totalPrice}€):\n\n`;
    favoriteProducts.forEach((p, idx) => {
      text += `${idx + 1}. *${p.name}* (${p.price}€)\n${window.location.origin}/?gadget=${p.id}\n\n`;
    });
    text += `Ver catálogo completo: ${window.location.origin}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = async () => {
    trackEvent('share_wishlist_copy', { count: favoriteProducts.length });
    const ids = favorites.join(',');
    const url = `${window.location.origin}/?wishlist=${ids}`;
    
    const success = await copyTextToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer-content" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <Heart size={20} fill="var(--accent)" color="var(--accent)" />
            <h2>Mi Maleta de Viaje</h2>
            <span className="drawer-count-badge">{favoriteProducts.length}</span>
          </div>
          <div className="drawer-header-actions">
            {favoriteProducts.length > 0 && (
              <button 
                className="drawer-clear-all-btn"
                onClick={() => {
                  if (window.confirm('¿Seguro que quieres vaciar todos los productos de tu maleta?')) {
                    if (onClearWishlist) onClearWishlist();
                  }
                }}
                title="Vaciar toda la maleta"
              >
                <Trash2 size={13} />
                <span>Vaciar maleta</span>
              </button>
            )}
            <button className="drawer-close-btn" onClick={onClose} aria-label="Cerrar maleta">
              <X size={18} />
            </button>
          </div>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="drawer-empty-state">
            <div className="empty-icon-wrap">
              <Luggage size={48} color="var(--secondary)" />
            </div>
            <h3>Tu maleta está vacía</h3>
            <p>Pulsa el icono de corazón ❤️ en cualquier gadget para guardarlo aquí y armar tu kit de viaje ideal.</p>
            <button className="cta-primary-btn" onClick={onClose} style={{ marginTop: '1.5rem' }}>
              Explorar Gadgets
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-items-list">
              {favoriteProducts.map(product => (
                <div key={product.id} className="drawer-item-card">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="drawer-item-thumb" 
                    onClick={() => onSelectProduct(product)}
                  />
                  <div className="drawer-item-info">
                    <span className="card-cat" style={{ fontSize: '0.7rem' }}>{product.category}</span>
                    <h4 
                      onClick={() => onSelectProduct(product)}
                      title={product.name}
                    >
                      {product.name}
                    </h4>
                    <div className="drawer-item-footer">
                      <span className="drawer-item-price">{product.price}€</span>
                      <div className="drawer-actions">
                        <a 
                          href={product.amazonUrl} 
                          target="_blank" 
                          rel="nofollow sponsored noopener noreferrer" 
                          className="drawer-amazon-link"
                          title="Comprar en Amazon"
                        >
                          Amazon <ExternalLink size={12} />
                        </a>
                        <button 
                          className="drawer-trash-btn"
                          onClick={() => {
                            onRemoveFavorite(product.id);
                            trackEvent('remove_favorite', { id: product.id });
                          }}
                          title="Quitar de mi maleta"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <div className="drawer-total-row">
                <span>Presupuesto Estimado:</span>
                <span className="drawer-total-sum">{totalPrice}€</span>
              </div>

              <div className="drawer-cta-col">
                <button className="whatsapp-share-btn" onClick={handleShareWhatsApp}>
                  <WhatsAppIcon size={18} color="white" />
                  <span>Compartir maleta por WhatsApp</span>
                </button>

                <button className={`drawer-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyLink}>
                  {copied ? <Check size={16} /> : <Share2 size={16} />}
                  <span>{copied ? '¡Enlace copiado!' : 'Copiar lista para compartir'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
