---
name: rs-full-stack-criando-layout-css
description: "Applies split-panel layout patterns with fixed and scrollable sides using CSS Grid. Use when user asks to 'create a layout', 'split screen layout', 'fixed sidebar with scrollable content', 'two-column layout', or 'dashboard layout'. Enforces viewport height, overflow control, max-width with auto margins, and CSS nesting. Make sure to use this skill whenever building layouts with a fixed panel and a scrollable content area. Not for responsive mobile layouts, flexbox-only layouts, or CSS animations."
---

# Layout CSS: Painel Fixo + Conteudo com Rolagem

> Construa layouts de duas colunas onde um lado permanece fixo e o outro rola, usando CSS Grid com controle preciso de overflow e largura maxima.

## Rules

1. **Use CSS Grid para dividir colunas** — `display: grid` com `grid-template-columns` usando porcentagens calculadas, porque grid garante alinhamento preciso entre paineis
2. **Trave a altura com viewport height** — `height: 100vh` no container, porque o layout fixo depende de ocupar exatamente a area visivel
3. **Remova margin e padding globais** — reset com `* { margin: 0; padding: 0; box-sizing: border-box }`, porque margins default do body causam barras de rolagem indesejadas
4. **Bloqueie overflow no body e html** — `overflow: hidden` em ambos, porque a rolagem so deve existir dentro do painel de conteudo
5. **Habilite rolagem apenas no painel de conteudo** — `overflow: auto` no main, porque auto so mostra scrollbar quando necessario
6. **Limite largura maxima com margin auto** — `max-width` + `margin-left: auto` ou `margin: 0 auto`, porque em telas grandes o conteudo esticado prejudica legibilidade
7. **Converta pixels para rem** — divida por 16 (`64px / 16 = 4rem`), porque rem escala com preferencias do usuario

## How to write

### Estrutura HTML com Emmet

```html
<!-- Emmet: main.main-container+aside.aside-container -->
<main class="main-container">
  <!-- conteudo com rolagem -->
</main>
<aside class="aside-container">
  <!-- painel fixo -->
</aside>
```

### Layout Grid com colunas proporcionais

```css
body {
  display: grid;
  grid-template-columns: 51.25% 48.75%;
  height: 100vh;
}
```

### Controle de overflow

```css
html, body {
  overflow: hidden;
}

main {
  overflow: auto;
  padding: 4rem;
}
```

### Largura maxima com centralizacao

```css
.main-container {
  max-width: 33rem;
  margin-left: auto;
}

.aside-container {
  max-width: 31rem;
}
```

## Example

**Before (layout quebrado em telas grandes):**
```css
body {
  display: flex;
}
main {
  width: 50%;
}
aside {
  width: 50%;
}
```

**After (com esta skill aplicada):**
```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow: hidden;
}

body {
  display: grid;
  grid-template-columns: 51.25% 48.75%;
  height: 100vh;
}

main {
  overflow: auto;
  padding: 4rem;

  & .main-container {
    max-width: 33rem;
    margin-left: auto;
  }
}

aside {
  padding: 4rem;
  background-color: var(--surface-secondary);

  & .aside-container {
    max-width: 31rem;
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Calcular proporcao de colunas | Regra de 3: `(largura_coluna * 100) / largura_total` |
| Converter px para rem | Divida por 16: `64px / 16 = 4rem` |
| Tela muito larga estica conteudo | Adicione `max-width` + `margin auto` |
| Scrollbar aparece no body | `overflow: hidden` em html e body |
| CSS Nesting nao funciona | Extraia para seletores tradicionais: `main .main-container {}` |
| Usar `&` no CSS Nesting | Sempre prefixe com `&` para garantir especificidade correta |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `width: 50%` sem calculo | `grid-template-columns: 51.25% 48.75%` calculado do design |
| `height: 100%` no container | `height: 100vh` para viewport completa |
| `overflow: scroll` (sempre mostra barra) | `overflow: auto` (mostra so quando necessario) |
| `px` para padding/max-width | `rem` (divide px por 16) |
| CSS Nesting sem fallback | Tenha versao com seletor tradicional como alternativa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre viewport, overflow e regra de 3 para colunas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-o-arquivo-layout-css/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-o-arquivo-layout-css/references/code-examples.md)
