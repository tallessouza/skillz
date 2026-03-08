---
name: rs-next-js-ajustando-as-fontes
description: "Enforces centralized font configuration in Next.js Pages Router projects. Use when user asks to 'configure fonts', 'organize typography', 'refactor fonts in Next.js', 'set up Google Fonts', or 'fix font imports in layout'. Applies pattern: declare all fonts in layout file, use CSS variables with Tailwind, set default font on container, override explicitly where needed. Make sure to use this skill whenever setting up or refactoring fonts in Next.js Pages Router. Not for App Router font configuration, CSS-in-JS theming, or font file hosting."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: fonts-typography
  tags: [fonts, next-font, google-fonts, css-variables, tailwind, pages-router]
---

# Centralizacao de Fontes no Next.js Pages Router

> Declare todas as fontes uma unica vez no layout, distribua via CSS variables do Tailwind, e defina uma fonte padrao no container raiz.

## Rules

1. **Instancie fontes apenas no layout** — nunca em componentes individuais, porque instanciar em cada secao cria duplicacao e dificulta manutencao
2. **Use CSS variables via `variable`** — cada fonte recebe uma `variable` que mapeia para o `tailwind.config`, porque permite usar classes utilitarias como `font-sans` e `font-inter`
3. **Defina a fonte padrao no container do layout** — aplique a classe da fonte principal (ex: `font-inter`) no div/container que envolve `{children}`, porque o layout executa tanto no servidor quanto no client
4. **Nao aplique fontes no `_document`** — o `_document` so executa no servidor, entao configuracoes de fonte que precisam do client devem ficar no layout
5. **Override explicito onde necessario** — secoes que usam fonte diferente da padrao recebem a classe diretamente (ex: `font-sans` nos titulos), porque mantem a intencao clara
6. **Passe `weight` como array quando ha multiplos pesos** — `weight: ['400', '500']` para Inter, `weight: '700'` para PT Sans Caption, porque cada fonte pode ter pesos diferentes

## How to write

### Layout centralizado com fontes

```typescript
// layout.tsx (ou componente de layout)
import { Inter, PT_Sans_Caption } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
})

const ptSansCaption = PT_Sans_Caption({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-sans',
})

export default function Layout({ children }) {
  return (
    <div className={`${inter.variable} ${ptSansCaption.variable} font-inter`}>
      <Header />
      <main className="mt-10">{children}</main>
      <Footer />
    </div>
  )
}
```

### Tailwind config com font families

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        inter: 'var(--font-inter)',
        sans: 'var(--font-sans)',
      },
    },
  },
}
```

### Titulo com fonte alternativa

```tsx
<h1 className="font-sans text-4xl">Titulo com PT Sans Caption</h1>
<p>Este paragrafo herda font-inter do container pai</p>
```

## Example

**Before (fonte instanciada em cada secao):**
```typescript
// features-section.tsx
import { PT_Sans_Caption } from 'next/font/google'
const ptSans = PT_Sans_Caption({ subsets: ['latin'], weight: '700' })

export function FeaturesSection() {
  return <h2 className={ptSans.className}>Features</h2>
}

// support-section.tsx
import { PT_Sans_Caption } from 'next/font/google'
const ptSans = PT_Sans_Caption({ subsets: ['latin'], weight: '700' })

export function SupportSection() {
  return <h2 className={ptSans.className}>Suporte</h2>
}
```

**After (fonte centralizada no layout):**
```typescript
// layout.tsx — unica instanciacao
const ptSansCaption = PT_Sans_Caption({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-sans',
})

// features-section.tsx — usa classe Tailwind
export function FeaturesSection() {
  return <h2 className="font-sans">Features</h2>
}

// support-section.tsx — mesma classe
export function SupportSection() {
  return <h2 className="font-sans">Suporte</h2>
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Fonte usada em 2+ componentes | Mover para layout, usar CSS variable |
| Fonte usada apenas 1 vez | Ainda preferir layout para consistencia |
| Precisa aplicar fonte no header e footer | Aplicar no container que envolve tudo no layout, nao no `_document` |
| Novo peso necessario | Adicionar ao array de `weight` na instanciacao do layout |
| Fonte padrao para toda a pagina | Classe utilitaria no container raiz do layout |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Instanciar mesma fonte em cada componente | Uma instancia no layout, classes Tailwind nos componentes |
| Aplicar fonte no `_document` body | Aplicar no container do layout (executa server + client) |
| Usar `className={font.className}` em cada elemento | Usar CSS variable + classe Tailwind (`font-sans`) |
| Esquecer de definir fonte padrao | Adicionar classe da fonte principal no container raiz |
| Template literal desnecessario `` `${ptSans.className}` `` | String simples quando so ha uma classe |

## Troubleshooting

### Estilos Tailwind nao aplicam
**Symptom:** Classes Tailwind no JSX nao geram CSS correspondente
**Cause:** Arquivo/pasta nao esta mapeado no array `content` do tailwind.config
**Fix:** Adicionar o path da pasta no `content` do tailwind.config: `'./src/{nova-pasta}/**/*.{js,ts,jsx,tsx}'`. Reiniciar o servidor de desenvolvimento

### Fontes customizadas nao carregam
**Symptom:** Fonte do Google Fonts/local nao aparece, fallback e usado
**Cause:** Configuracao incorreta do next/font ou CSS variable nao aplicada
**Fix:** Usar `next/font/google` ou `next/font/local` e aplicar a className no elemento raiz do layout. Verificar que a variavel CSS esta sendo referenciada no Tailwind config

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-ajustando-as-fontes/references/deep-explanation.md) — O instrutor explica um ponto crucial da arquitetura Next.js Pages Router: o `_document` so executa n
- [code-examples.md](../../../data/skills/next-js/rs-next-js-ajustando-as-fontes/references/code-examples.md) — // src/components/layout.tsx
