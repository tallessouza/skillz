# Code Examples: Reset CSS e Variáveis CSS com Responsividade

## Exemplo 1: Reset completo

```css
/* Reset de box-sizing incluindo pseudo-elementos */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Reset universal: margin, padding, fonte e smoothing */
* {
  margin: 0;
  padding: 0;
  font: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Por que separar em dois blocos?

O `box-sizing` é isolado com pseudo-elementos porque é a única propriedade que precisa ser declarada explicitamente neles. As outras propriedades (`margin`, `padding`, `font`) não se aplicam a pseudo-elementos da mesma forma.

## Exemplo 2: Variáveis completas do :root

```css
:root {
  /* === Cores === */
  --bg-color: #09090b;
  --surface-color: #121214;
  --stroke-color: #18181b;
  --text-color-primary: #f4f4f5;
  --text-color-secondary: #a1a1a1;
  --brand-color-primary: #f7b733;
  --brand-color-secondary: #fc4a1a;

  /* === Font Family === */
  --ff-sans: "Inter", system-ui, sans-serif;

  /* === Font Weight === */
  --fw-base: 400;
  --fw-md: 500;
  --fw-bold: 800;

  /* === Font Size (mobile-first) === */
  --fs-sm: 0.875rem;    /* 14px / 16 = 0.875 */
  --fs-base: 1rem;      /* 16px / 16 = 1     */
  --fs-lg: 1.25rem;     /* 20px / 16 = 1.25  */
  --fs-xl: 1.5rem;      /* 24px / 16 = 1.5   */
  --fs-2xl: 2.5rem;     /* 40px / 16 = 2.5   */
}
```

## Exemplo 3: Media query com override de variáveis

```css
/* 80em × 16px = 1280px */
@media (min-width: 80em) {
  :root {
    --fs-lg: 2rem;     /* 32px / 16 = 2   */
    --fs-xl: 3rem;     /* 48px / 16 = 3   */
    --fs-2xl: 4rem;    /* 64px / 16 = 4   */
  }
}
```

### Variação: múltiplos breakpoints

```css
/* Tablet: 48em = 768px */
@media (min-width: 48em) {
  :root {
    --fs-lg: 1.5rem;
    --fs-xl: 2rem;
    --fs-2xl: 3rem;
  }
}

/* Desktop: 80em = 1280px */
@media (min-width: 80em) {
  :root {
    --fs-lg: 2rem;
    --fs-xl: 3rem;
    --fs-2xl: 4rem;
  }
}
```

## Exemplo 4: Estilos base do documento

```css
html {
  font-family: var(--ff-sans);
  font-weight: var(--fw-base);
  font-size: var(--fs-base);
  line-height: 1.6;
  color: var(--text-color-primary);
}

body {
  background-color: var(--bg-color);
}
```

## Exemplo 5: Headings com variáveis

```css
h1, h2, h3 {
  line-height: 1.2;
  color: var(--text-color-primary);
  font-weight: var(--fw-bold);
  letter-spacing: -0.04em;  /* Figma mostra -4% */
}

h1 { font-size: var(--fs-2xl); }
h2 { font-size: var(--fs-xl); }
h3 { font-size: var(--fs-lg); }
```

### Como isso responde ao media query automaticamente

Não é necessário escrever:
```css
/* NÃO faça isso */
@media (min-width: 80em) {
  h1 { font-size: 4rem; }
  h2 { font-size: 3rem; }
  h3 { font-size: 2rem; }
}
```

As variáveis já mudam no `:root`, e os headings refletem automaticamente.

## Exemplo 6: Reset de links

```css
a {
  text-decoration: none;
  color: inherit;
}
```

`color: inherit` faz o link herdar a cor do elemento pai, removendo o azul padrão do navegador.

## Exemplo 7: Lista acessível sem bolinhas

```css
ul[role="list"] {
  list-style: none;
}
```

```html
<!-- Com role: sem bolinhas, acessível -->
<ul role="list">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- Sem role: mantém bolinhas (comportamento padrão) -->
<ul>
  <li>Item com bolinha</li>
</ul>
```

## Exemplo 8: Importando fonte do Google Fonts

```html
<!-- No <head> do index.html, ANTES do CSS -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;800&display=swap" rel="stylesheet">
```

### Variação: só os pesos necessários

Importe apenas os font-weights que você declarou nas variáveis (`400`, `500`, `800`) para não carregar pesos desnecessários.

## Exemplo 9: Arquivo global.css completo

```css
/* ========== RESET ========== */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
  font: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ========== VARIABLES ========== */
:root {
  --bg-color: #09090b;
  --surface-color: #121214;
  --stroke-color: #18181b;
  --text-color-primary: #f4f4f5;
  --text-color-secondary: #a1a1a1;
  --brand-color-primary: #f7b733;
  --brand-color-secondary: #fc4a1a;

  --ff-sans: "Inter", system-ui, sans-serif;

  --fw-base: 400;
  --fw-md: 500;
  --fw-bold: 800;

  --fs-sm: 0.875rem;
  --fs-base: 1rem;
  --fs-lg: 1.25rem;
  --fs-xl: 1.5rem;
  --fs-2xl: 2.5rem;
}

@media (min-width: 80em) {
  :root {
    --fs-lg: 2rem;
    --fs-xl: 3rem;
    --fs-2xl: 4rem;
  }
}

/* ========== BASE ========== */
html {
  font-family: var(--ff-sans);
  font-weight: var(--fw-base);
  font-size: var(--fs-base);
  line-height: 1.6;
  color: var(--text-color-primary);
}

body {
  background-color: var(--bg-color);
}

h1, h2, h3 {
  line-height: 1.2;
  color: var(--text-color-primary);
  font-weight: var(--fw-bold);
  letter-spacing: -0.04em;
}

h1 { font-size: var(--fs-2xl); }
h2 { font-size: var(--fs-xl); }
h3 { font-size: var(--fs-lg); }

a {
  text-decoration: none;
  color: inherit;
}

ul[role="list"] {
  list-style: none;
}
```

## Tabela de conversão rápida PX → REM

| Pixels | REM | Variável usada |
|--------|-----|----------------|
| 14px | 0.875rem | `--fs-sm` |
| 16px | 1rem | `--fs-base` |
| 20px | 1.25rem | `--fs-lg` (mobile) |
| 24px | 1.5rem | `--fs-xl` (mobile) |
| 32px | 2rem | `--fs-lg` (desktop) |
| 40px | 2.5rem | `--fs-2xl` (mobile) |
| 48px | 3rem | `--fs-xl` (desktop) |
| 64px | 4rem | `--fs-2xl` (desktop) |

**Fórmula:** `valor_em_px / 16 = valor_em_rem`
**Inverso:** `valor_em_rem × 16 = valor_em_px`