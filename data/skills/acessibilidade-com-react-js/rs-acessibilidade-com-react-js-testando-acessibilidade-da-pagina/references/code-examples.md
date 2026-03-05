# Code Examples: Testando Acessibilidade da Pagina

## 1. Usando Lighthouse no Chrome DevTools

```
1. Abra o DevTools (F12 ou Inspecionar Elemento)
2. Clique na seta ">>" caso "Lighthouse" nao apareca na barra
3. Selecione "Lighthouse"
4. Desmarque tudo exceto "Accessibility"
5. Escolha dispositivo: Mobile ou Desktop
6. Clique em "Analyze page load"
7. Analise o score e os feedbacks individuais
```

## 2. Usando axe DevTools (extensao)

```
1. Instale "axe DevTools" na Chrome Web Store
2. Abra DevTools (F12)
3. Clique na seta ">>" e selecione "axe DevTools"
4. Selecione sua profissao (ex: Developer)
5. Aceite os termos
6. Clique em "Scan" para escanear a pagina
7. Analise os problemas retornados (mais completo que Lighthouse)
```

## 3. Instalacao do @axe-core/react

```bash
# Com yarn
yarn add -D @axe-core/react

# Com npm
npm install -D @axe-core/react

# Com pnpm
pnpm add -D @axe-core/react
```

## 4. Accessibility Reporter completo

```typescript
// src/utils/accessibilityReporter.ts
export async function accessibilityReporter() {
  if (process.env.NODE_ENV === 'development') {
    const axe = await require('@axe-core/react')
    const React = await require('react')
    const ReactDOM = await require('react-dom')
    axe(React, ReactDOM, 1000) // 1000ms = timeout entre testes
  }
}
```

**Por que `await require()` ao inves de `import`?**
- Imports dinamicos garantem que o bundle de producao nao inclua o axe-core
- O `await` e necessario porque o require retorna uma promise nesse contexto

## 5. Integracao com Next.js (SSR-safe)

```typescript
// pages/_app.tsx ou app/layout.tsx
import { useEffect } from 'react'
import { accessibilityReporter } from '@/utils/accessibilityReporter'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    accessibilityReporter()
  }, [])

  return <Component {...pageProps} />
}
```

**Alternativa sem useEffect (menos recomendada):**
```typescript
if (typeof window !== 'undefined') {
  accessibilityReporter()
}
```

## 6. Configuracao do eslint-plugin-jsx-a11y

```bash
# Instalacao
npm install -D eslint-plugin-jsx-a11y
```

```json
// .eslintrc.json
{
  "plugins": ["jsx-a11y"],
  "extends": ["plugin:jsx-a11y/recommended"]
}
```

Regras que o plugin cobre:
- `alt-text` — imagens devem ter texto alternativo
- `anchor-has-content` — ancoras devem ter conteudo acessivel
- `heading-order` — headings em ordem sequencial
- E muitas outras (ver documentacao do plugin)

## 7. Exemplo de saida do axe-core no console

```
[serious] image elements must have an alt attribute
  Element: <img src="/blog-image.jpg">
  Fix: Add an alt attribute describing the image content

[moderate] Elements must have sufficient color contrast
  Element: <h2 class="title">Blog Title</h2>
  Expected ratio: 4.5:1, Actual: 3.2:1

[serious] Links must have discernible text
  Element: <a href="https://github.com/..."><svg>...</svg></a>
  Fix: Add aria-label or visible text to the link

[moderate] <html> element must have a lang attribute
  Element: <html>
  Fix: Add lang="pt-BR" to the html element

[moderate] Heading levels should only increase by one
  Element: <h4>Subtitle</h4> (after <h2>)
  Fix: Use <h3> instead of <h4>
```

## 8. axe Accessibility Linter (VS Code)

```
1. Instale a extensao "axe Accessibility Linter" no VS Code
2. Reload o VS Code (Ctrl+Shift+P > "Reload Window")
3. Abra arquivos JSX/TSX
4. Veja warnings inline sobre problemas de acessibilidade
```

**Limitacao conhecida:** A extensao pode nao reconhecer componentes customizados (ex: `<Image>` do Next.js). Funciona melhor com elementos HTML nativos como `<img>`.