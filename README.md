# Adris Beach Club

Experiencia ecommerce mobile-first para Adris, una tienda de bikinis en Trujillo, Perú.

## Stack

- React 19 + TypeScript
- Vite 7
- Motion para React (antes Framer Motion)
- Lucide React

## Funcionalidad

- Catálogo filtrable de 12 productos
- Tallas, favoritos y bolsa persistente con `localStorage`
- Resumen de pedido listo para WhatsApp
- Hero editorial ligero con animaciones CSS y Motion
- Animaciones de entrada, scroll, gestos y transiciones de layout
- Carrusel de videos verticales con salida directa a TikTok
- Menú y dock de compra optimizados para móvil
- Compatibilidad con `prefers-reduced-motion`

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run preview
```

La carpeta lista para publicar se genera en `dist/`.

## Agregar videos

Guarda los MP4 verticales dentro de `assets/` y agrega `videoSrc` al reel correspondiente en `src/data.ts`:

```ts
{
  id: 1,
  label: 'Nuevo ingreso',
  poster: '/product-1.jpg',
  videoSrc: '/reel-nuevo-ingreso.mp4',
  views: '12K',
  href: 'https://www.tiktok.com/@adrisoficial_'
}
```

El video se reproducirá sin sonido, en loop y con `playsInline`; al tocarlo se abrirá TikTok.

## Antes de publicar

1. Añadir el número real de Adris a los enlaces `wa.me`.
2. Confirmar nombres, precios y stock.
3. Sustituir capturas por fotografías originales de producto en alta resolución.
4. Configurar el enlace real de Instagram.

## Fuentes editoriales

- [Campaña principal — Fika Photo](https://www.pexels.com/photo/woman-in-bikini-on-beach-11175758/)
- [Escena inclusiva — Jennifer Enujiugha](https://www.pexels.com/photo/a-woman-in-a-bikini-standing-on-the-beach-28050243/)
- [Lifestyle — RDNE Stock project](https://www.pexels.com/photo/smiling-woman-in-swimwear-posing-at-the-beach-8760645/)
- [Paisaje tropical — Alexis Ricardo Alaurin](https://www.pexels.com/photo/scenic-tropical-beach-with-swaying-palm-trees-33258519/)

Consulta la [licencia de Pexels](https://www.pexels.com/license/) antes de redistribuir los recursos fuera del proyecto.
