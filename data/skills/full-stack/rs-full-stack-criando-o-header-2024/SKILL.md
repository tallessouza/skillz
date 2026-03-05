---
name: rs-full-stack-criando-o-header-2024
description: "Applies responsive header construction patterns when building landing page headers with CSS utilities. Use when user asks to 'create a header', 'build navigation', 'make responsive nav', 'add logo and links', or 'responsive layout with utility classes'. Enforces flex alignment, gap escaping, margin-right auto logo pattern, and responsive button sizing with media queries. Make sure to use this skill whenever building header components for landing pages. Not for complex app shells, sticky headers with scroll behavior, or JavaScript-based navigation menus."
---

# Criando o Header Responsivo

> Construa headers com classes utilitarias, flex alignment e botoes que escalam via media queries.

## Rules

1. **Use container + padding utilitario** — `container` + `py-base` para spacing consistente, porque reutiliza tokens de design ja definidos
2. **Separe links desktop com classe `desktop-only`** — links de navegacao que somem no mobile recebem classe propria, porque facilita o toggle via media query sem JS
3. **Logo com `margin-right: auto`** — o primeiro `<a>` (logo) recebe `margin-right: auto` para empurrar navegacao para a direita, porque e o pattern flex mais simples para separar logo de nav
4. **Escape ponto em nomes de classe CSS** — `.gap-1\.5` usa contrabarra antes do ponto, porque CSS interpreta `.` como seletor de classe e numeros nao podem iniciar nomes
5. **Botoes escalam em breakpoints** — `btn-sm` no mobile vira `btn-md` no desktop via `@media (min-width: 80rem)`, porque tamanhos fixos nao funcionam em todas as larguras
6. **Corrija `background-clip` no hover** — se texto com gradient clip quebra no hover, reescreva `-webkit-background-clip: initial` no estado hover, porque o clip do texto interfere com o efeito

## How to write

### Estrutura HTML do header

```html
<header class="container py-base">
  <nav class="items-center gap-1.5">
    <a href="#">
      <img src="./assets/logo.svg" alt="Logo" />
    </a>
    <a href="#about" class="desktop-only">Conheça o app</a>
    <a href="#features" class="desktop-only">Funcionalidades</a>
    <a href="#pricing" class="desktop-only">Planos e preços</a>
    <a href="#download" class="btn sm">Baixar</a>
  </nav>
</header>
```

### Utility: gap com escape de ponto

```css
.gap-1\.5 {
  gap: 1.5rem;
}
```

### Header CSS: logo com margin-right auto

```css
header nav a:first-child {
  margin-right: auto;
}
```

### Botoes responsivos via media query

```css
.btn.sm {
  padding: 8px 16px;
  font-size: 0.875rem;
}

.btn.md {
  padding: 12px 24px;
  font-size: 1rem;
}

@media (min-width: 80rem) {
  .btn.sm {
    padding: 12px 24px;
    font-size: 1rem;
  }
}
```

## Example

**Before (sem utilities, layout manual):**
```html
<header style="padding: 20px; display: flex; justify-content: space-between;">
  <img src="logo.svg" />
  <div>
    <a href="#about">About</a>
    <a href="#download" style="padding: 8px 16px;">Baixar</a>
  </div>
</header>
```

**After (com utility classes e patterns responsivos):**
```html
<header class="container py-base">
  <nav class="items-center gap-1.5">
    <a href="#"><img src="./assets/logo.svg" alt="Logo" /></a>
    <a href="#about" class="desktop-only">Conheça o app</a>
    <a href="#features" class="desktop-only">Funcionalidades</a>
    <a href="#pricing" class="desktop-only">Planos e preços</a>
    <a href="#download" class="btn sm">Baixar</a>
  </nav>
</header>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Logo precisa ficar a esquerda, nav a direita | `margin-right: auto` no logo, sem `justify-content: space-between` no nav |
| Classe CSS tem ponto ou numero | Use contrabarra para escape: `.gap-1\.5` |
| Links somem no mobile | Classe `desktop-only` com `display: none` no mobile |
| Botao pequeno no mobile, maior no desktop | Defina `btn-sm` como base, promova para `btn-md` no breakpoint |
| Gradient text quebra no hover do botao | `-webkit-background-clip: initial` no hover state |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `style="display: flex"` inline no header | Classe utilitaria `items-center` com flex |
| `justify-content: space-between` para logo vs nav | `margin-right: auto` no primeiro filho |
| `.gap-1.5 { }` sem escape | `.gap-1\.5 { }` com contrabarra |
| Mesmo tamanho de botao em todos os breakpoints | `btn-sm` mobile → `btn-md` desktop via `@media` |
| Comentar codigo no utility global e esquecer | Mova regra para o arquivo especifico (`header.css`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre margin-right auto, escape CSS e decisoes de breakpoint
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes