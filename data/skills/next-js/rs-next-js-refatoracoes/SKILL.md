---
name: rs-next-js-refatoracoes
description: "Enforces refactoring patterns in Next.js Pages Router projects when organizing components, templates, and page structure. Use when user asks to 'refactor components', 'organize project structure', 'clean up Next.js pages', 'move sections to templates', or 'remove dead code'. Applies rules: templates pattern for page composition, co-location of page-specific components, barrel exports, dead code removal, Boy Scout Rule. Make sure to use this skill whenever reorganizing a Next.js project or cleaning up component structure. Not for creating new features, styling, or routing logic."
---

# Refatoracoes em Next.js (Pages Router)

> Reestruture o codigo interno sem alterar o comportamento externo — melhore legibilidade e manutenabilidade com mudancas pequenas e incrementais.

## Rules

1. **Separe templates de pages** — crie `templates/` para montar paginas, `pages/` apenas importa e exporta, porque pages e roteamento e nao composicao
2. **Co-localize componentes especificos** — sections usadas apenas em uma pagina ficam dentro da pasta dessa pagina em templates, nao em `components/`, porque components e para compartilhados entre todas as paginas
3. **Use barrel exports (index files)** — cada pasta com multiplos arquivos recebe um `index.tsx` re-exportando tudo, porque simplifica importacoes e facilita manutencao
4. **Remova codigo morto sem medo** — variantes nao utilizadas, console.logs, codigo comentado devem ser apagados, porque o Git preserva o historico e codigo morto degrada legibilidade
5. **Agrupe componentes acoplados** — header e footer que so existem dentro do layout ficam na pasta `layout/`, nao em `components/` raiz, porque nunca sao usados isoladamente
6. **Aplique a Regra do Escoteiro** — ao tocar um arquivo, deixe-o mais limpo do que encontrou, porque pequenas melhorias incrementais previnem entropia do codigo

## How to write

### Estrutura de templates

```
components/
├── ui/              # Componentes compartilhados (button, input)
├── layout/
│   ├── header/
│   ├── footer/
│   └── index.tsx    # Layout component + barrel export
└── logo/

templates/
├── landing-page/
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── feature-section.tsx
│   │   ├── call-to-action.tsx
│   │   └── index.ts         # Barrel export
│   ├── landing-page.tsx      # Composicao da pagina
│   └── index.ts              # Barrel export

pages/
├── index.tsx        # Apenas importa e renderiza <LandingPage />
```

### Page file (pages/index.tsx)

```tsx
// A page so importa o template — zero logica de composicao aqui
import { LandingPage } from '@/templates/landing-page'

export default function Home() {
  return <LandingPage />
}
```

### Template file (templates/landing-page/landing-page.tsx)

```tsx
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

### Barrel export (sections/index.ts)

```tsx
export * from './call-to-action'
export * from './customer-story'
export * from './feature-section'
export * from './hero-section'
export * from './support-section'
```

## Example

**Before (tudo em components/ e pages/ inchada):**
```
components/
├── header/
├── footer/
├── hero-section/
├── feature-section/
├── call-to-action/
├── button/
└── input/

pages/
└── index.tsx  # 80+ linhas com todas as sections importadas
```

**After (com templates e co-localizacao):**
```
components/
├── layout/
│   ├── header/
│   ├── footer/
│   └── index.tsx
├── ui/
│   ├── button/
│   └── input/
└── logo/

templates/
└── landing-page/
    ├── sections/    # Sections co-localizadas com a pagina
    ├── landing-page.tsx
    └── index.ts

pages/
└── index.tsx        # 5 linhas
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Componente usado em 1 pagina apenas | Mova para dentro de `templates/{pagina}/` |
| Componente usado em 2+ paginas | Mantenha em `components/` |
| Header/Footer sempre usados via Layout | Mova para dentro de `components/layout/` |
| Variante de componente UI nao utilizada | Remova e ajuste o default |
| Pasta com 2+ arquivos exportados | Crie barrel export (`index.ts`) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Montar pagina inteira dentro de `pages/index.tsx` | Importe template: `<LandingPage />` |
| Colocar sections especificas em `components/` | Co-localize em `templates/{pagina}/sections/` |
| Manter variantes nao usadas de componentes UI | Remova e confie no Git para historico |
| Deixar header/footer soltos em `components/` | Agrupe em `components/layout/` |
| Importar 10+ componentes direto dos paths | Use barrel exports |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
