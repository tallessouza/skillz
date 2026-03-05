---
name: rs-a11y-react-testando-acessibilidade
description: "Applies accessibility testing workflow using Lighthouse, axe-core extension, and @axe-core/react in React/Next.js projects. Use when user asks to 'test accessibility', 'check a11y', 'setup axe-core', 'audit page accessibility', 'add accessibility testing', or 'configure accessibility linter'. Ensures proper tool selection (Lighthouse for quick audits, axe-core for comprehensive real-time feedback) and correct SSR-safe integration. Make sure to use this skill whenever setting up accessibility tooling or diagnosing a11y issues in React projects. Not for fixing specific accessibility issues, writing ARIA attributes, or semantic HTML refactoring."
---

# Testando Acessibilidade da Pagina

> Configure ferramentas de teste de acessibilidade em camadas: auditoria rapida (Lighthouse), extensao do navegador (axe DevTools), e feedback em tempo real no codigo (@axe-core/react).

## Rules

1. **Lighthouse nao cobre tudo** — mesmo com score 100%, ainda podem existir problemas de acessibilidade, porque o Lighthouse usa apenas um subconjunto dos testes do axe-core
2. **axe-core/react somente em desenvolvimento** — instale como devDependency e proteja com `process.env.NODE_ENV === 'development'`, porque nao deve ir para producao
3. **Garanta execucao client-side no Next.js** — use `useEffect` para executar o axe-core, porque ele depende da DOM e nao funciona em SSR
4. **Use imports dinamicos dentro da condicao** — use `await require()` dentro do bloco de desenvolvimento para evitar bundle em producao
5. **Headings devem ser sequenciais** — nunca pule niveis (H2 → H4), porque HTML nao e responsavel por estilizacao, use CSS para tamanho
6. **Integre no time, nao individualmente** — prefira @axe-core/react no codigo ao inves de extensoes de navegador, porque extensoes dependem de cada dev instalar

## How to write

### Accessibility Reporter (Next.js / React)

```typescript
// src/utils/accessibilityReporter.ts
export async function accessibilityReporter() {
  if (process.env.NODE_ENV === 'development') {
    const axe = await require('@axe-core/react')
    const React = await require('react')
    const ReactDOM = await require('react-dom')
    axe(React, ReactDOM, 1000)
  }
}
```

### Integracao no App (Next.js com SSR-safe)

```typescript
// app.tsx ou layout.tsx
import { useEffect } from 'react'
import { accessibilityReporter } from '@/utils/accessibilityReporter'

export default function App() {
  useEffect(() => {
    accessibilityReporter()
  }, [])

  return <>{/* ... */}</>
}
```

### Instalacao

```bash
# Dependencia de desenvolvimento apenas
npm install -D @axe-core/react
# ou
yarn add -D @axe-core/react
```

## Example

**Before (sem teste de acessibilidade):**
```typescript
// Nenhum feedback — problemas so descobertos em auditoria manual
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

**After (com axe-core integrado):**
```typescript
import { useEffect } from 'react'
import { accessibilityReporter } from '@/utils/accessibilityReporter'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    accessibilityReporter()
  }, [])

  return <Component {...pageProps} />
}
// Console agora mostra: severity, elemento afetado, descricao do erro
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Auditoria rapida de uma pagina | Lighthouse no DevTools (desmarque tudo exceto Accessibility) |
| Feedback continuo durante desenvolvimento | @axe-core/react integrado no codigo |
| Inspecao pontual com detalhes extras | Extensao axe DevTools no navegador |
| Linting no editor | eslint-plugin-jsx-a11y + axe Accessibility Linter (VS Code) |
| Projeto com time grande | @axe-core/react no codigo (todos recebem feedback automaticamente) |
| Next.js com SSR | useEffect para garantir execucao client-side |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Confiar apenas no Lighthouse score 100% | Combine Lighthouse + axe-core para cobertura completa |
| Instalar axe-core como dependencia de producao | `npm install -D @axe-core/react` (devDependency) |
| Importar axe-core no top-level | Import dinamico dentro de condicao `NODE_ENV === 'development'` |
| Chamar axe-core fora de useEffect no Next.js | Sempre dentro de useEffect para evitar erro de SSR |
| Usar `typeof window !== 'undefined'` sozinho | Prefira useEffect, mais confiavel para garantir client-side |
| Depender de extensao do navegador para o time | Integre @axe-core/react no codigo, automatico para todos |
| Usar H4/H6 para texto pequeno | Use o heading correto (H2→H3→H4 sequencial) e estilize com CSS |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
