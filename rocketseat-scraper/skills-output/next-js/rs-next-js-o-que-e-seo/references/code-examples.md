# Code Examples: O Que e SEO

## Nota sobre esta aula

Esta aula e conceitual/teorica — nao contem exemplos de codigo diretos. O instrutor menciona que a implementacao pratica (meta tags, sitemap XML, etc.) sera abordada nas proximas aulas.

Porem, o instrutor referencia elementos do Next.js que ja foram utilizados no curso e que se conectam com SEO:

## Componente Link do Next.js (mencionado como exemplo de On-Page SEO)

```tsx
// O componente Link do Next.js ajuda no On-Page SEO
// porque faz pre-fetch das paginas e melhora a navegacao interna
import Link from 'next/link'

// Links internos sao um fator de On-Page SEO
<Link href="/products/camiseta-ai-side">
  Ver produto
</Link>
```

O instrutor menciona que o componente `Link` do Next.js, que ja foi utilizado no curso, ajuda no On-Page SEO por facilitar a criacao de links internos otimizados.

## Checklist de SEO para aplicar em Next.js

Baseado nos conceitos da aula, aqui esta o que sera implementado nas proximas aulas:

### On-Page SEO
```tsx
// Meta tags (sera implementado nas proximas aulas)
export const metadata = {
  title: 'Nome da Pagina',
  description: 'Descricao otimizada com palavras-chave',
}

// Texto alternativo em imagens
<Image
  src="/product.jpg"
  alt="Camiseta preta com estampa AI Side, tamanho M"
  width={500}
  height={500}
/>

// Links internos
<Link href="/blog/server-components">O que sao Server Components</Link>
```

### Technical SEO
```tsx
// HTTPS: garantido pelo deploy na Vercel (automatico)

// Sitemap XML (sera implementado nas proximas aulas)
// Next.js tem suporte nativo para gerar sitemap

// Performance: Next.js otimiza por padrao com:
// - Server-side rendering
// - Image optimization
// - Code splitting automatico
```

## Estrutura dos 3 tipos de SEO (referencia rapida)

```
SEO
├── On-Page (conteudo da pagina)
│   ├── Palavras-chave
│   ├── Meta tags (title, description, OG)
│   ├── Textos alternativos (alt em imagens)
│   ├── Links internos (componente Link)
│   └── Qualidade do conteudo
│
├── Off-Page (fora da pagina)
│   ├── Redes sociais (YouTube, LinkedIn, Instagram, X)
│   ├── Backlinks (links externos apontando para o site)
│   └── Marketing de conteudo externo
│
└── Technical SEO (infraestrutura)
    ├── Performance (Core Web Vitals)
    ├── Responsividade (UX mobile, nao so visual)
    ├── HTTPS (seguranca)
    ├── Sitemap XML
    └── Navegacao otimizada
```