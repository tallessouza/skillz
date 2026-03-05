# Code Examples: Conhecendo o Projeto

## Limpeza do projeto (demonstrada pelo instrutor)

Esta aula e primariamente de overview e limpeza. O instrutor demonstrou a remocao de:

### Antes (codigo sujo do boilerplate)

```typescript
// pages/index.tsx — com residuos de aulas anteriores
import Image from 'next/image'

export default function Home() {
  console.log('teste')
  console.log('alguma coisa')
  
  return (
    <div>
      <Image src="/exemplo.png" alt="exemplo" width={100} height={100} />
      <h1>Pagina inicial</h1>
    </div>
  )
}
```

### Depois (projeto limpo, pronto para comecar)

```typescript
// pages/index.tsx — limpo, pronto para a landing page
export default function Home() {
  return (
    <main>
      {/* Landing page sera construida aqui */}
    </main>
  )
}
```

## Estrutura de pastas limpa

O instrutor removeu pastas que nao seriam utilizadas, deixando apenas o essencial:

```
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx          # Sera a landing page
├── public/
├── styles/
└── package.json
```

## Proximos passos (antecipados pelo instrutor)

A partir desta base limpa, o projeto evoluira para:

```typescript
// pages/index.tsx — estrutura final esperada
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { CallToAction } from '@/components/CallToAction'
import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <CallToAction />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
```

## Estrutura do blog (mencionada para futuro)

```typescript
// pages/blog/index.tsx — lista de posts
export default function Blog() {
  return (
    <main>
      {/* Lista de posts do blog */}
    </main>
  )
}

// pages/blog/[slug].tsx — post individual
import { useRouter } from 'next/router'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query
  
  return (
    <article>
      {/* Conteudo do post */}
    </article>
  )
}
```