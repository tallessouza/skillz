---
name: rs-angular-estilos-globais-styles-css
description: "Enforces correct usage of Angular's global styles.css file when structuring CSS resets, variables, utility classes, and layout classes. Use when user asks to 'style an Angular app', 'add CSS reset', 'create utility classes', 'organize styles.css', 'customize Angular Material components', or 'set up global styles'. Make sure to use this skill whenever working with Angular global styling, even for simple resets. Not for component-scoped styles, SCSS modules, or Tailwind configuration."
---

# Estilos Globais no Angular (styles.css)

> O styles.css e o ponto central para estilos que afetam todos os componentes — resets, variaveis, classes utilitarias e overrides de componentes externos.

## Rules

1. **Use styles.css apenas para estilos verdadeiramente globais** — resets, variaveis CSS, classes utilitarias e layouts reutilizaveis, porque estilos especificos de componente pertencem ao .css do proprio componente
2. **Sempre aplique um reset CSS** — remova margins, paddings e estilos padrao do navegador, porque sem reset voce vai repetir remocoes em cada componente
3. **Use box-sizing: border-box globalmente** — aplique em todos os elementos via seletor universal, porque facilita o calculo de dimensoes com padding e border inclusos
4. **Prefixe classes utilitarias** — use `c-` para utility classes e `g-` para layout classes, porque diferencia classes globais de classes locais do componente
5. **Separe styles.css em arquivos** — use `@import` para dividir em reset.css, variables.css etc, porque evita um arquivo gigantesco e melhora a organizacao
6. **A ordem dos imports faz diferenca** — coloque reset antes de variables antes de utilities, porque CSS cascata depende da ordem de declaracao

## How to write

### Reset CSS global

```css
/* styles/reset.css */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

html {
  font-size: clamp(16px, 1vw + 12px, 22px);
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.5;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

ul, ol {
  list-style: none;
}
```

### Variaveis CSS globais

```css
/* styles/variables.css */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
}
```

### Classes utilitarias (prefixo c-)

```css
/* No styles.css ou styles/utilities.css */
.c-text-center { text-align: center; }
.c-mt-16 { margin-top: 16px; }
.c-hidden { display: none; }
```

### Classes de layout globais (prefixo g-)

```css
.g-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.g-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
```

### Organizacao com imports

```css
/* styles.css */
@import './styles/reset.css';
@import './styles/variables.css';

/* Estilos globais adicionais aqui */
```

### Override de componentes externos (Angular Material)

```css
/* Mudar todos os mat-slider */
.mat-slider .mat-slider-thumb {
  border-color: blue;
}

/* Mudar apenas um especifico via id */
#meu-slider .mat-slider-thumb {
  border-color: blue;
}
```

## Example

**Before (estilos repetidos em cada componente):**
```css
/* component-a.css */
p { margin: 0; padding: 0; color: #3498db; }

/* component-b.css */
h1 { margin: 0; padding: 0; }
p { color: #3498db; }
```

**After (com styles.css bem organizado):**
```css
/* styles/reset.css — importado globalmente */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* styles/variables.css — importado globalmente */
:root { --primary-color: #3498db; }

/* component-a.css — apenas estilos especificos */
p { color: var(--primary-color); }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estilo usado em 3+ componentes | Mova para styles.css como classe global |
| Reset de margin/padding | Coloque em reset.css importado no styles.css |
| Cor ou espacamento repetido | Crie variavel CSS no :root |
| Classe utilitaria simples (1 propriedade) | Prefixe com `c-` |
| Layout reutilizavel (container, grid) | Prefixe com `g-` |
| Override de lib externa (Angular Material) | Use styles.css com seletor especifico |
| styles.css ficando grande (>100 linhas) | Separe em arquivos com @import |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Repetir reset em cada componente | Um unico reset.css importado globalmente |
| Hardcodar cores em cada componente | Variavel CSS no :root: `var(--primary-color)` |
| Classe utilitaria sem prefixo (`text-center`) | Com prefixo: `c-text-center` |
| Um styles.css com 500+ linhas | Separar em reset.css, variables.css, utilities.css |
| Override de lib externa no componente | Override no styles.css global |
| Ignorar ordem dos @import | Reset primeiro, variaveis depois, utilities por ultimo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
