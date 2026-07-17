import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  House,
  Grid2X2,
  MapPin,
  Menu,
  MessageCircle,
  Play,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import { products, reels, tiktokUrl, type CartItem, type Category, type Product } from './data'

const sizes = ['S', 'M', 'L'] as const
type Filter = 'all' | Category | 'favorites'

const reveal = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
}

function Flower({ className = '' }: { className?: string }) {
  return <span className={`flower ${className}`} aria-hidden="true">✿</span>
}

function ProductCard({
  product,
  favorite,
  selectedSize,
  onFavorite,
  onSize,
  onAdd,
}: {
  product: Product
  favorite: boolean
  selectedSize: 'S' | 'M' | 'L'
  onFavorite: () => void
  onSize: (size: 'S' | 'M' | 'L') => void
  onAdd: () => void
}) {
  return (
    <motion.article
      layout
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="product-card"
    >
      <div className="product-media">
        <motion.img whileHover={{ scale: 1.055 }} transition={{ duration: 0.7 }} src={product.image} alt={`Bikini ${product.name}`} loading="lazy" />
        <span className="product-badge">{product.badge}</span>
        <button className={`heart-button ${favorite ? 'active' : ''}`} type="button" onClick={onFavorite} aria-label={`Guardar ${product.name}`} aria-pressed={favorite}>
          <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />
        </button>
        <motion.button whileTap={{ scale: 0.86 }} className="add-button" type="button" onClick={onAdd} aria-label={`Agregar ${product.name}, talla ${selectedSize}`}>
          <Plus size={20} />
        </motion.button>
      </div>
      <div className="product-info">
        <div className="product-heading"><h3>{product.name}</h3><strong>S/ {product.price}</strong></div>
        <div className="product-options">
          <div className="size-options" aria-label={`Talla de ${product.name}`}>
            {sizes.map(size => (
              <button key={size} type="button" className={selectedSize === size ? 'active' : ''} onClick={() => onSize(size)}>{size}</button>
            ))}
          </div>
          <div className="swatches" aria-label="Colores disponibles">
            {product.colors.map(color => <i key={color} style={{ background: color }} />)}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function ReelCard({ reel, index }: { reel: (typeof reels)[number]; index: number }) {
  return (
    <motion.a
      href={reel.href}
      target="_blank"
      rel="noreferrer"
      className="reel-card"
      initial={{ opacity: 0, y: 35, rotate: index % 2 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.55 }}
      whileHover={{ y: -8 }}
    >
      {reel.videoSrc ? (
        <video src={reel.videoSrc} poster={reel.poster} muted loop playsInline autoPlay preload="metadata" />
      ) : (
        <img src={reel.poster} alt={reel.label} loading="lazy" />
      )}
      <div className="reel-shade" />
      <span className="reel-number">0{index + 1}</span>
      <span className="reel-play"><Play size={18} fill="currentColor" /></span>
      <div className="reel-meta"><strong>{reel.label}</strong><span>{reel.views} vistas · TikTok <ArrowUpRight size={13} /></span></div>
    </motion.a>
  )
}

function App() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  const heroImageY = useTransform(scrollYProgress, [0, 0.32], [0, -42])
  const [filter, setFilter] = useState<Filter>('all')
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [toast, setToast] = useState('')
  const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('adris-cart') || '[]') as CartItem[])
  const [favorites, setFavorites] = useState<number[]>(() => JSON.parse(localStorage.getItem('adris-favorites') || '[]') as number[])
  const [selectedSizes, setSelectedSizes] = useState<Record<number, 'S' | 'M' | 'L'>>({})

  const visibleProducts = useMemo(
    () => products.filter(product => filter === 'all' || (filter === 'favorites' ? favorites.includes(product.id) : product.category === filter)),
    [favorites, filter],
  )
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + (products.find(product => product.id === item.id)?.price ?? 0) * item.quantity, 0)

  useEffect(() => localStorage.setItem('adris-cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('adris-favorites', JSON.stringify(favorites)), [favorites])
  useEffect(() => {
    document.body.classList.toggle('locked', cartOpen || menuOpen)
    return () => document.body.classList.remove('locked')
  }, [cartOpen, menuOpen])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2300)
    return () => window.clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 24)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  function addProduct(product: Product) {
    const size = selectedSizes[product.id] ?? 'M'
    setCart(current => {
      const existing = current.find(item => item.id === product.id && item.size === size)
      if (existing) return current.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, { id: product.id, size, quantity: 1 }]
    })
    setToast(`${product.name} · Talla ${size}`)
  }

  function removeProduct(id: number, size: string) {
    setCart(current => current.filter(item => !(item.id === id && item.size === size)))
  }

  const orderLines = cart.map(item => {
    const product = products.find(candidate => candidate.id === item.id)!
    return `• ${product.name} — talla ${item.size}${item.quantity > 1 ? ` — ${item.quantity} unidades` : ''}`
  })
  const whatsappMessage = `Hola Adris 🌸 Quiero hacer este pedido:\n\n${orderLines.join('\n')}\n\nTotal estimado: S/ ${cartTotal}\n¿Me confirman disponibilidad y entrega?`

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="grain" aria-hidden="true" />

      <div className="announcement"><span>ENVÍOS A TODO EL PERÚ</span><Flower /><span>NUEVOS INGRESOS CADA SEMANA</span><Flower /><span>COMPRA DIRECTO POR WHATSAPP</span></div>

      <header className={`site-header ${headerScrolled ? 'scrolled' : ''}`}>
        <motion.nav className="nav shell" aria-label="Navegación principal" initial={reduceMotion ? false : { opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <a className="brand" href="#inicio">Adris<Flower /></a>
          <div className="nav-links"><a href="#coleccion">Colección</a><a href="#club">El club</a><a href="#tiktok">TikTok</a><a href="#tienda">Tienda</a></div>
          <div className="nav-actions">
            <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><Menu /></button>
            <motion.button whileTap={{ scale: 0.92 }} className="bag-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir bolsa, ${cartCount} productos`}>
              <ShoppingBag size={18} /><span>Mi bolsa</span><b>{cartCount}</b>
            </motion.button>
          </div>
        </motion.nav>
      </header>

      <main>
        <section id="inicio" className="hero shell">
          <div className="hero-intro">
            <motion.p variants={reveal} initial={reduceMotion ? false : 'hidden'} animate="visible" transition={{ delay: 0.12 }} className="eyebrow">WELCOME TO ADRIS</motion.p>
            <motion.h1 variants={reveal} initial={reduceMotion ? false : 'hidden'} animate="visible" transition={{ delay: 0.15, duration: 0.75 }}>
              <span>Demasiado tú</span>
              <span className="hero-title-bridge">para ser</span>
              <em className="hero-title-accent">básica.</em>
            </motion.h1>
          </div>
          <div className="hero-details">
            <motion.p variants={reveal} initial={reduceMotion ? false : 'hidden'} animate="visible" transition={{ delay: 0.28 }} className="hero-lead">Bikinis con color, actitud y el fit que te hace sentir invencible. Diseñados para celebrar tu forma de ser.</motion.p>
            <motion.div variants={reveal} initial={reduceMotion ? false : 'hidden'} animate="visible" transition={{ delay: 0.34 }} className="hero-actions">
              <a className="button dark" href="#coleccion">Encontrar mi bikini <ArrowRight size={18} /></a>
              <a className="play-link" href={tiktokUrl} target="_blank" rel="noreferrer"><span><Play size={14} fill="currentColor" /></span> Ver el mood</a>
            </motion.div>
            <motion.div variants={reveal} initial={reduceMotion ? false : 'hidden'} animate="visible" transition={{ delay: 0.42 }} className="hero-proof">
              <div className="avatar-stack" aria-hidden="true"><img src="/product-3.jpg" alt="" /><img src="/product-5.jpg" alt="" /><img src="/product-7.jpg" alt="" /><img src="/product-2.jpg" alt="" /></div>
              <div className="proof-rating"><div><strong>4.9</strong><span className="stars">★★★★★</span></div><p><strong>+1,200 chicas ya</strong><br />son parte del club.</p></div>
            </motion.div>
          </div>

          <motion.div className="hero-art" initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}>
            <div className="hero-blob" />
            <div className="hero-photo"><motion.img style={{ y: reduceMotion ? 0 : heroImageY }} src="/MODELOADRI-hero.png" alt="Modelo luciendo un bikini rosa y blanco de Adris" fetchPriority="high" /></div>
            <motion.div className="hero-new-badge" animate={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [-3, 0, -3] }} transition={{ repeat: Infinity, duration: 4.2 }}><strong>NEW</strong><span>Colección</span><small>Verano '26</small></motion.div>
          </motion.div>
        </section>

        <div className="ticker" aria-hidden="true"><div><span>BIKINIS</span><Flower /><span>BEACHWEAR</span><Flower /><span>SUN KISSED</span><Flower /><span>FEEL GOOD</span><Flower /><span>BIKINIS</span><Flower /><span>BEACHWEAR</span><Flower /><span>SUN KISSED</span><Flower /><span>FEEL GOOD</span><Flower /></div></div>

        <section className="collection-stories shell" aria-labelledby="stories-title">
          <div className="stories-heading"><h2 id="stories-title">Explora nuestras colecciones</h2><a href="#coleccion">Ver todas <ArrowRight size={14} /></a></div>
          <div className="stories-grid">
            {[
              { name: 'Neón', image: '/editorial-hero.jpg', note: 'Colección' },
              { name: 'Minimal', image: '/editorial-lifestyle.jpg', note: 'Colección' },
              { name: 'Tropical', image: '/editorial-tropical.jpg', note: 'Colección' },
            ].map((story, index) => (
              <motion.a key={story.name} href="#coleccion" className="story-card" onClick={() => setFilter(index === 1 ? 'clasico' : 'bikini')} whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }}>
                <img src={story.image} alt={`Colección ${story.name}`} loading="lazy" />
                <span><small>{story.note}</small><strong>{story.name}</strong></span>
              </motion.a>
            ))}
          </div>
        </section>

        <section id="coleccion" className="collection section shell">
          <motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div><p className="eyebrow">SHOP THE DROP</p><h2>Lo más<br /><em>amado.</em></h2></div>
            <a className="section-view-all" href="#coleccion" onClick={() => setFilter('all')}>Ver todo <ArrowRight size={15} /></a>
          </motion.div>
          <div className="filters" role="tablist" aria-label="Filtrar colección">
            {([['all', 'Todo'], ['bikini', 'Bikinis'], ['tejido', 'Tejidos'], ['clasico', 'Clásicos'], ['favorites', 'Favoritos']] as [Filter, string][]).map(([value, label]) => (
              <button key={value} type="button" className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} role="tab" aria-selected={filter === value}>
                {label}{value === 'all' && <sup>{products.length}</sup>}
              </button>
            ))}
          </div>
          <motion.div layout className="product-grid">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favorite={favorites.includes(product.id)}
                  selectedSize={selectedSizes[product.id] ?? 'M'}
                  onFavorite={() => setFavorites(current => current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id])}
                  onSize={size => setSelectedSizes(current => ({ ...current, [product.id]: size }))}
                  onAdd={() => addProduct(product)}
                />
              ))}
            </AnimatePresence>
            {filter === 'favorites' && visibleProducts.length === 0 && <div className="favorites-empty"><Heart size={25} /><strong>Aún no guardaste favoritos</strong><span>Toca el corazón de un bikini para verlo aquí.</span></div>}
          </motion.div>
        </section>

        <section id="club" className="manifesto section">
          <div className="manifesto-photo"><img src="/editorial-inclusive.jpg" alt="Mujer disfrutando un día de playa" loading="lazy" /><span>REAL BODIES<br />REAL SUMMER</span></div>
          <div className="manifesto-copy">
            <p className="eyebrow">EL MANIFIESTO ADRIS</p>
            <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>No hacemos bikinis para esconderte.<br /><em>Los hacemos para celebrarte.</em></motion.h2>
            <div className="manifesto-bottom">
              <p>Tu cuerpo no necesita una temporada, una tendencia ni una aprobación. Solo necesita un bikini que se sienta tan auténtico como tú.</p>
              <div className="manifesto-stats"><div><strong>70+</strong><span>colores</span></div><div><strong>4.9</strong><span>experiencia</span></div><div><strong>100%</strong><span>actitud</span></div></div>
            </div>
          </div>
        </section>

        <section id="tiktok" className="social-section section shell">
          <div className="social-title">
            <div><p className="eyebrow">ADRIS EN MOVIMIENTO</p><h2>Del feed<br />a la <em>playa.</em></h2></div>
            <a className="tiktok-profile" href={tiktokUrl} target="_blank" rel="noreferrer"><span><Play size={15} fill="currentColor" /></span><div><small>SÍGUENOS EN TIKTOK</small><strong>@adrisoficial_</strong></div><ArrowUpRight /></a>
          </div>
          <div className="reels-grid">{reels.map((reel, index) => <ReelCard key={reel.id} reel={reel} index={index} />)}</div>
          <p className="video-note"><Sparkles size={14} /> La sección acepta videos verticales MP4: agrega <code>videoSrc</code> a cualquier reel para reproducirlo automáticamente.</p>
        </section>

        <section className="experience section shell">
          <div className="experience-card">
            <img src="/editorial-tropical.jpg" alt="Costa tropical" loading="lazy" />
            <div className="experience-shade" />
            <div className="experience-copy"><p className="eyebrow">YOUR SUMMER ERA</p><h2>Más sol.<br />Más color.<br /><em>Más tú.</em></h2><a className="button lime" href="#coleccion">Comprar el mood <ArrowDownRight /></a></div>
            <span className="experience-side">COAST · COLOR · CONFIDENCE</span>
          </div>
        </section>

        <section id="tienda" className="store section shell">
          <div className="store-image"><img src="/tienda.jpeg" alt="Tienda Adris en Trujillo" loading="lazy" /><span><i /> Estamos aquí</span></div>
          <div className="store-copy"><p className="eyebrow">PRUÉBATE EL MOOD</p><h2>Ven al<br /><em>Beach Club.</em></h2><p>Combina modelos, descubre nuevos ingresos y recibe asesoría para encontrar el fit que se sienta tuyo.</p><address><MapPin size={18} /><div><small>ENCUÉNTRANOS EN</small><strong>Centro Comercial YA<br />Trujillo, Perú</strong></div></address><div className="store-actions"><a className="button light" href={tiktokUrl} target="_blank" rel="noreferrer">Cómo llegar <ArrowUpRight /></a><a className="circle-button" href="https://wa.me/?text=Hola%20Adris%2C%20quiero%20visitar%20la%20tienda" target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp"><MessageCircle /></a></div></div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-grid"><div><a className="brand footer-brand" href="#inicio">Adris<Flower /></a><p>Demasiado tú para ser básica.</p></div><div className="footer-links"><a href="#coleccion">Colección</a><a href="#club">El club</a><a href="#tiktok">TikTok</a><a href="#tienda">Tienda</a></div><div className="footer-links"><a href={tiktokUrl} target="_blank" rel="noreferrer">TikTok ↗</a><a href="#">Instagram ↗</a><a href="https://www.pexels.com/" target="_blank" rel="noreferrer">Fotos: Pexels ↗</a></div><div className="footer-note"><span>TRUJILLO · PERÚ</span><small>© 2026 ADRIS BEACH CLUB</small></div></div>
        <div className="footer-word">ADRIS<Flower /></div>
      </footer>

      <nav className="mobile-dock" aria-label="Acciones rápidas">
        <a className="dock-home" href="#inicio"><span><House size={18} /></span><small>Inicio</small></a>
        <a href="#coleccion"><span><Grid2X2 size={18} /></span><small>Colección</small></a>
        <button className={filter === 'favorites' ? 'active' : ''} type="button" onClick={() => { setFilter('favorites'); document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' }) }}><span><Heart size={18} fill={favorites.length ? 'currentColor' : 'none'} /></span><small>Favoritos</small></button>
        <a href={tiktokUrl} target="_blank" rel="noreferrer"><span><UserRound size={18} /></span><small>Perfil</small></a>
        <button type="button" onClick={() => setCartOpen(true)}><span><ShoppingBag size={18} /><b>{cartCount}</b></span><small>Bolsa</small></button>
      </nav>

      <AnimatePresence>
        {menuOpen && <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="mobile-menu-panel" initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}><div className="mobile-menu-head"><a className="brand" href="#inicio">Adris<Flower /></a><button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"><X /></button></div><div className="mobile-menu-links">{[['#coleccion', 'Colección'], ['#club', 'El club'], ['#tiktok', 'TikTok'], ['#tienda', 'Tienda']].map(([href, label], index) => <a key={href} href={href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}<ArrowDownRight /></a>)}</div><a className="button lime" href={tiktokUrl} target="_blank" rel="noreferrer">Seguir a @adrisoficial_ <ArrowUpRight /></a></motion.div></motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && <motion.aside className="cart-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Bolsa de compra"><button className="cart-backdrop" type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar bolsa" /><motion.div className="cart-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 260 }}><div className="cart-head"><div><p className="eyebrow">TU SELECCIÓN</p><h2>Mi bolsa <span>{cartCount}</span></h2></div><button type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar"><X /></button></div>{cart.length ? <><div className="cart-items">{cart.map(item => { const product = products.find(candidate => candidate.id === item.id)!; return <motion.article layout key={`${item.id}-${item.size}`} className="cart-item"><img src={product.image} alt={product.name} /><div><h3>{product.name}{item.quantity > 1 && ` ×${item.quantity}`}</h3><p>Talla {item.size} · S/ {product.price * item.quantity}</p></div><button type="button" onClick={() => removeProduct(item.id, item.size)} aria-label={`Quitar ${product.name}`}><Trash2 size={17} /></button></motion.article> })}</div><div className="cart-summary"><div><span>Total estimado</span><strong>S/ {cartTotal}</strong></div><a className="button whatsapp" href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer">Pedir por WhatsApp <ArrowUpRight /></a><small>Confirmaremos stock, pago y entrega contigo.</small></div></> : <div className="cart-empty"><ShoppingBag /><h3>Tu bolsa pide verano</h3><p>Elige un favorito y comienza tu próximo look.</p><button className="button dark" type="button" onClick={() => setCartOpen(false)}>Ver colección</button></div>}</motion.div></motion.aside>}
      </AnimatePresence>

      <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 25, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15 }}><span><Check size={15} /></span><div><strong>Agregado a tu bolsa</strong><small>{toast}</small></div></motion.div>}</AnimatePresence>
    </>
  )
}

export default App
