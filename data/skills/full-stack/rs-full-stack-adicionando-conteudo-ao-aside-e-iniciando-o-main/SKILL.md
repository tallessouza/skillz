---
name: rs-full-stack-aside-main-content
description: "Enforces HTML semantic structure and CSS responsive image patterns when building page layouts with aside and main sections. Use when user asks to 'create a layout', 'build a page', 'add sidebar content', 'style images responsively', or 'structure HTML with aside/main'. Applies rules: global image max-width 100%, height auto for safety, semantic HTML nesting, CSS custom properties for colors/fonts, direct child selectors for scoped styling. Make sure to use this skill whenever generating HTML page layouts with sidebar patterns or responsive image styling. Not for JavaScript logic, form validation, or backend code."
---

# Estrutura de Conteudo Aside/Main e Imagens Responsivas

> Construa layouts HTML com estrutura semantica clara e garanta responsividade de imagens com max-width global.

## Rules

1. **Defina max-width: 100% e height: auto em imagens globalmente** — no CSS global, porque impede que imagens estourem containers e garante proporcao automatica em qualquer contexto
2. **Use seletores de filho direto para escopar estilos** — `.aside-container > img` nao `.aside-container img`, porque evita estilos vazando para imagens aninhadas em sub-elementos como header
3. **Aplique cores e fontes via custom properties no body** — `color: var(--text-secondary)`, `font-family: var(--text)`, porque centraliza mudancas e mantem consistencia
4. **Diferencie cores de heading e body text** — h1/h2 usam `var(--text-primary)` (escuro), body usa `var(--text-secondary)`, porque cria hierarquia visual clara
5. **Use span (nao strong) para destacar texto dentro de headings** — h2 ja e bold por padrao, entao strong nao faz diferenca visual; span permite estilizar com cor diferente via classe
6. **Crie variaveis de fonte quando o design pede valores nao previstos** — se o Figma pede semi-bold (600) e voce so tem bold (700), crie a variavel ao inves de improvisar

## How to write

### Estrutura HTML aside com header semantico

```html
<aside class="aside-container">
  <header>
    <img src="./assets/logo.svg" alt="Logo Estrelas do Amanhã">
    <h2>Cada conta, <span>o aprendizado</span></h2>
    <p>Inscreva seu filho na melhor escola da região</p>
  </header>
  <img src="./assets/illustration.svg" alt="Ilustração de uma professora com crianças prestando atenção">
</aside>
```

### CSS global para imagens responsivas

```css
img {
  max-width: 100%;
  height: auto;
}
```

### Seletor de filho direto para imagem especifica

```css
.aside-container > img {
  width: 100%;
  margin-top: 2rem;
}
```

### Cores e fontes globais

```css
body {
  font-family: var(--text);
  color: var(--text-secondary);
}

h1, h2 {
  color: var(--text-primary);
}

span {
  color: var(--text-highlight);
}
```

## Example

**Before (sem responsividade global):**
```css
/* Cada imagem estilizada individualmente */
.aside-container img { width: 100%; }
.main-container img { width: 100%; }
.card img { width: 100%; max-width: 100%; }
```

**After (com max-width global):**
```css
/* Global — todas as imagens respeitam o container */
img {
  max-width: 100%;
  height: auto;
}

/* Apenas ajustes especificos por contexto */
.aside-container > img {
  width: 100%;
  margin-top: 2rem;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem pode ser maior que o container pai | max-width: 100% global resolve |
| Duas imagens no mesmo container com estilos diferentes | Use seletor de filho direto `>` |
| Heading precisa de parte destacada com cor | Use `<span>` com classe, nao `<strong>` |
| Font-weight do design nao bate com variaveis existentes | Crie nova variavel ou aplique inline |
| Elemento precisa de espacamento do anterior | margin-top no elemento, nao margin-bottom no anterior |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<h2><strong>texto</strong></h2>` | `<h2><span>texto</span></h2>` (h2 ja e bold) |
| `.container img` (pega todas aninhadas) | `.container > img` (apenas filho direto) |
| `height: 300px` em imagem responsiva | `height: auto` (preserva proporcao) |
| Cores hardcoded `color: #333` | `color: var(--text-primary)` |
| Fontes repetidas em cada seletor | `font-family: var(--text)` no body |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre max-width global, seletores de filho direto e hierarquia visual
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e contexto expandido