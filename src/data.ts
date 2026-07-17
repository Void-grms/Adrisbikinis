export type Category = 'bikini' | 'tejido' | 'clasico'

export type Product = {
  id: number
  name: string
  price: number
  category: Category
  image: string
  badge: string
  colors: string[]
}

export type CartItem = {
  id: number
  size: 'S' | 'M' | 'L'
  quantity: number
}

export type Reel = {
  id: number
  label: string
  poster: string
  views: string
  href: string
  videoSrc?: string
}

export const products: Product[] = [
  { id: 1, name: 'Coral Crush', price: 79, category: 'tejido', image: '/product-10.jpg', badge: 'New', colors: ['#e95e3e', '#f3c8c0', '#171b17'] },
  { id: 2, name: 'Pearl Lines', price: 89, category: 'clasico', image: '/product-9.jpg', badge: 'Best seller', colors: ['#f2eee2', '#171b17', '#d7c2a2'] },
  { id: 3, name: 'Ocean Knit', price: 85, category: 'tejido', image: '/product-11.jpg', badge: 'Limited', colors: ['#eeeae0', '#79c8c7', '#3b75a5'] },
  { id: 4, name: 'Lime Aura', price: 72, category: 'bikini', image: '/product-7.jpg', badge: 'Vibrante', colors: ['#c9ed4f', '#f0568a', '#1e482b'] },
  { id: 5, name: 'Mono Muse', price: 92, category: 'clasico', image: '/product-8.jpg', badge: 'Icónico', colors: ['#f5f0e7', '#181918', '#9c9c92'] },
  { id: 6, name: 'Graphic Wave', price: 88, category: 'clasico', image: '/product-12.jpg', badge: 'Limitado', colors: ['#f4f1e8', '#181918', '#f0568a'] },
  { id: 7, name: 'Cherry Tide', price: 76, category: 'bikini', image: '/product-1.jpg', badge: 'Nuevo', colors: ['#e53d45', '#f2a2a6', '#fff0e8'] },
  { id: 8, name: 'Pink Bloom', price: 82, category: 'bikini', image: '/product-2.jpg', badge: 'Top ventas', colors: ['#ee75a3', '#f8cedd', '#f6efe6'] },
  { id: 9, name: 'Cocoa Sun', price: 86, category: 'clasico', image: '/product-3.jpg', badge: 'Esencial', colors: ['#6e3f2d', '#d5b28c', '#202820'] },
  { id: 10, name: 'Blue Lagoon', price: 84, category: 'bikini', image: '/product-4.jpg', badge: 'Fresh', colors: ['#3f8ead', '#a8dce2', '#f4f1e8'] },
  { id: 11, name: 'Sunset Loop', price: 90, category: 'tejido', image: '/product-5.jpg', badge: 'Hecho a mano', colors: ['#f08c54', '#f6d36b', '#f0568a'] },
  { id: 12, name: 'Tropical Pop', price: 78, category: 'bikini', image: '/product-6.jpg', badge: 'Color', colors: ['#25885d', '#f0c839', '#ec5b80'] },
]

export const tiktokUrl = 'https://www.tiktok.com/@adrisoficial_'

export const reels: Reel[] = [
  { id: 1, label: 'Bikinis 2026', poster: '/editorial-hero.jpg', views: '21.8K', href: tiktokUrl },
  { id: 2, label: 'El fit perfecto', poster: '/editorial-lifestyle.jpg', views: '4.2K', href: tiktokUrl },
  { id: 3, label: 'Nuevos ingresos', poster: '/catalogo.jpg', views: '7.9K', href: tiktokUrl },
  { id: 4, label: 'Adris en vivo', poster: '/tienda.jpeg', views: '12K', href: tiktokUrl },
]
