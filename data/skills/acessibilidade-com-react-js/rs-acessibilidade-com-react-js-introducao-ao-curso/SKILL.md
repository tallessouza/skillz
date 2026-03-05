---
name: rs-acessibilidade-reactjs-introducao
description: "Guides accessibility implementation in React applications following WCAG guidelines. Use when user asks to 'make accessible', 'add a11y', 'improve accessibility', 'semantic HTML', 'add ARIA', or 'screen reader support' in React projects. Covers semantic HTML, landmarks, consistent layouts, browser extensions, VS Code extensions, and React a11y libraries. Make sure to use this skill whenever building React UI components or reviewing frontend code for accessibility. Not for backend APIs, database design, or non-React frameworks."
---

# Acessibilidade com React

> Toda aplicacao React deve ser acessivel desde o inicio — acessibilidade nao e feature opcional, e requisito base.

## Key concept

Acessibilidade (a11y) em React abrange desde HTML semantico basico ate ferramentas e bibliotecas especializadas. O trabalho se divide em tres camadas: teoria (guidelines WCAG), estrutura (HTML semantico, landmarks, layout consistente) e ferramental (extensoes e bibliotecas que automatizam verificacoes).

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Criando componente React novo | HTML semantico + ARIA roles apropriados |
| Elementos interativos (botoes, forms, modais) | Navegacao por teclado + labels acessiveis |
| Layout de pagina | Landmarks semanticos (`nav`, `main`, `aside`, `header`, `footer`) |
| Imagens e icones | `alt` descritivo ou `aria-hidden` para decorativos |
| Conteudo dinamico (SPAs) | Anuncios para screen readers via live regions |
| Review de codigo frontend | Rodar eslint-plugin-jsx-a11y + extensao axe DevTools |

## Camadas de implementacao

### 1. HTML Semantico (base)
```tsx
// Usar elementos nativos em vez de divs genericas
<nav aria-label="Menu principal">
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Titulo da pagina</h1>
    <p>Conteudo principal</p>
  </article>
</main>
```

### 2. Landmarks e Layout Consistente
```tsx
// Estrutura de pagina com landmarks claros
<header>{/* Logo + navegacao */}</header>
<nav aria-label="Navegacao principal">{/* Links */}</nav>
<main>{/* Conteudo unico da pagina */}</main>
<aside>{/* Conteudo complementar */}</aside>
<footer>{/* Informacoes do rodape */}</footer>
```

### 3. Ferramental React
```tsx
// Bibliotecas para componentes acessiveis
// Radix UI, React Aria, Reach UI — componentes com a11y built-in
import * as Dialog from '@radix-ui/react-dialog'

// ESLint plugin para pegar erros em tempo de desenvolvimento
// eslint-plugin-jsx-a11y
```

## Ferramentas recomendadas

| Categoria | Ferramenta | Uso |
|-----------|-----------|-----|
| Extensao navegador | axe DevTools | Auditar pagina renderizada |
| Extensao navegador | WAVE | Visualizar erros de a11y |
| Extensao VS Code | axe Accessibility Linter | Erros em tempo de escrita |
| Biblioteca React | eslint-plugin-jsx-a11y | Lint de JSX para a11y |
| Biblioteca React | Radix UI / React Aria | Componentes acessiveis prontos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `<div onClick={handler}>` como botao | `<button onClick={handler}>` porque botao tem semantica e teclado nativos |
| `<div class="header">` para layout | `<header>` porque landmarks sao reconhecidos por screen readers |
| Ignorar a11y e "adicionar depois" | Implementar desde o primeiro componente porque retrofit e 3x mais caro |
| Apenas testes visuais | Testar com teclado + screen reader + ferramentas automatizadas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
