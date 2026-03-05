# Code Examples: Componentes Link e Image do Next.js

## Exemplo basico da aula: Pagina Home com Link e Image

```tsx
// pages/index.tsx — Pagina Home
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>

      {/* Link para pagina de usuarios — prefetch automatico no hover */}
      <Link href="/users">Pagina Users</Link>

      {/* Imagem otimizada — src referencia public/assets/ */}
      <Image
        src="/assets/exemplo.png"
        width={400}
        height={300}
        alt="Exemplo de imagem otimizada"
      />
    </div>
  )
}
```

```tsx
// pages/users.tsx — Pagina de Usuarios
import Link from 'next/link'

export default function Users() {
  return (
    <div>
      <h1>Usuarios</h1>
      <Link href="/">Voltar para Home</Link>
    </div>
  )
}
```

## Estrutura de pastas para assets

```
project/
├── public/
│   └── assets/
│       └── exemplo.png    ← acessivel como /assets/exemplo.png
├── pages/
│   ├── index.tsx
│   └── users.tsx
```

## Variacoes praticas

### Navegacao com lista de links

```tsx
import Link from 'next/link'

const routes = [
  { href: '/', label: 'Home' },
  { href: '/users', label: 'Usuarios' },
  { href: '/about', label: 'Sobre' },
]

export function Nav() {
  return (
    <nav>
      {routes.map((route) => (
        <Link key={route.href} href={route.href}>
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
```

### Image com fill (quando nao sabe dimensoes exatas)

```tsx
import Image from 'next/image'

// Container precisa ter position: relative e dimensoes definidas
<div style={{ position: 'relative', width: '100%', height: 300 }}>
  <Image
    src="/assets/banner.png"
    fill
    alt="Banner responsivo"
    style={{ objectFit: 'cover' }}
  />
</div>
```

### Configuracao para imagens externas

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'exemplo.com',
      },
    ],
  },
}
```

```tsx
// Agora pode usar imagens de exemplo.com
<Image
  src="https://exemplo.com/foto.jpg"
  width={600}
  height={400}
  alt="Imagem de fonte externa"
/>
```

### As 4 propriedades essenciais (mencionadas na aula)

```tsx
<Image
  src="/assets/foto.png"    // 1. src — caminho da imagem
  width={400}               // 2. width — largura em pixels
  height={300}              // 3. height — altura em pixels
  alt="Descricao da foto"   // 4. alt — texto alternativo (SEO + acessibilidade)
/>
```