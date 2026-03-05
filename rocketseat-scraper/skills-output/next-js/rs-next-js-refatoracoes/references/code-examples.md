# Code Examples: Refatoracoes em Next.js

## 1. Movendo sections para templates/

### Antes: tudo em components/
```
components/
├── call-to-action/
├── customer-story/
├── hero-section/
├── feature-section/
├── support-section/
├── header/
├── footer/
├── layout/
├── button/
├── input/
└── logo/
```

### Depois: sections co-localizadas com landing-page
```
templates/
└── landing-page/
    ├── sections/
    │   ├── call-to-action.tsx
    │   ├── customer-story.tsx
    │   ├── feature-section.tsx
    │   ├── hero-section.tsx
    │   ├── support-section.tsx
    │   └── index.ts
    ├── landing-page.tsx
    └── index.ts
```

## 2. Barrel export para sections

```typescript
// templates/landing-page/sections/index.ts
export * from './call-to-action'
export * from './customer-story'
export * from './feature-section'
export * from './hero-section'
export * from './support-section'
```

## 3. Barrel export para landing-page

```typescript
// templates/landing-page/index.ts
export * from './landing-page'
```

## 4. Template com composicao e path alias

```tsx
// templates/landing-page/landing-page.tsx
import {
  HeroSection,
  FeatureSection,
  CustomerStory,
  CallToAction,
  SupportSection,
} from '@/templates/landing-page/sections'

export const LandingPage = () => {
  return (
    <div className="flex flex-col gap-10 md:gap-20">
      <HeroSection />
      <FeatureSection />
      <CustomerStory />
      <CallToAction />
      <SupportSection />
    </div>
  )
}
```

O instrutor usa `@/` como path alias para evitar imports relativos longos (`../../`).

## 5. Page simplificada

```tsx
// pages/index.tsx
import { LandingPage } from '@/templates/landing-page'

export default function Home() {
  return <LandingPage />
}
```

Antes, esse arquivo tinha dezenas de imports e toda a composicao da pagina. Depois do refactor, sao apenas 5 linhas.

## 6. Movendo header/footer para dentro de layout/

### Antes
```
components/
├── header/
├── footer/
└── layout/
    └── index.tsx  # importa de ../header e ../footer
```

### Depois
```
components/
└── layout/
    ├── header/
    ├── footer/
    └── index.tsx  # importa de ./header e ./footer
```

O layout.tsx atualiza os imports:
```tsx
// components/layout/index.tsx
import { Header } from './header'
import { Footer } from './footer'

export const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

## 7. Removendo variantes nao usadas do Button

### Antes (codigo morto do ShadCN)
```typescript
const buttonVariants = cva('...', {
  variants: {
    variant: {
      default: '...',
      primary: '...',
      secondary: '...',
      outline: '...',
      destructive: '...',
      ghost: '...',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
```

### Depois (apenas o que o projeto usa)
```typescript
const buttonVariants = cva('...', {
  variants: {
    variant: {
      primary: '...',
      secondary: '...',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})
```

Removidos: `default`, `outline`, `destructive`, `ghost` — nenhum era usado no projeto. O default foi alterado para `primary` que e a variante principal do design system.

## 8. Correcoes visuais (nao refatoracao)

### Header com largura errada
```tsx
// Antes: max-w-[80px] (digitou 80 por engano)
<header className="max-w-[80px]">

// Depois: corrigido para o valor correto
<header className="max-w-[1080px]">
```

### Gap responsivo entre sections
```tsx
// Mobile first: 40px default, 80px em telas maiores
<div className="flex flex-col gap-10 md:gap-20">
```

### Icone posicionado com absolute
```tsx
<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
  <Icon />
</div>
```

### Peso de fonte corrigido na Hero
```tsx
// Antes: spans sem classe de peso (herdando 700)
<span>texto</span>

// Depois: aplicado text-body-md para peso 400
<span className="text-body-md">texto</span>
```