---
name: rs-full-stack-funcoes-referencia-css
description: "Applies CSS reference functions (var(), url(), attr()) when writing stylesheets. Use when user asks to 'style a component', 'add background image', 'use CSS variables', 'create pseudo-element content', or 'write CSS'. Enforces correct usage contexts: var() for reusing custom properties, url() for backgrounds, attr() only inside content property of ::before/::after. Make sure to use this skill whenever generating CSS that involves variables, background images, or pseudo-elements. Not for JavaScript, HTML structure, or CSS layout/grid skills."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-functions
  tags: [css, var, url, attr, custom-properties, pseudo-elements]
---

# Funções CSS de Referência

> Funções de referência apontam para valores definidos em outro lugar — use cada uma no contexto correto.

## Rules

1. **`var()` referencia custom properties** — `var(--size)` nao `50px` repetido, porque centraliza mudancas em um unico lugar
2. **`url()` importa recursos externos** — usado em `background`, `background-image`, `cursor`, `list-style-image`, porque referencia um recurso externo por caminho
3. **`attr()` so funciona dentro de `content`** — exclusivo de `::before` e `::after`, porque a spec CSS atual limita attr() a essa propriedade
4. **`attr()` aceita qualquer atributo HTML** — `data-*`, `aria-label`, `title`, `href`, porque le o valor do atributo do elemento pai
5. **Combine background shorthand com url()** — `background: url(...) center/contain no-repeat`, porque evita declaracoes separadas desnecessarias

## How to write

### Custom properties com var()

```css
:root {
  --size: 80px;
  --primary: #3b82f6;
}

.box {
  width: var(--size);
  height: var(--size);
  background-color: var(--primary);
}
```

### Background com url()

```css
.hero {
  background: url("https://images.unsplash.com/photo-xxx") center/contain no-repeat;
}
```

### Pseudo-elementos com attr()

```css
/* Pega qualquer atributo do elemento HTML */
.tag::before {
  content: attr(data-content);
}

.link::after {
  content: " (" attr(href) ")";
}

/* Funciona com aria-label tambem */
.accessible::after {
  content: attr(aria-label);
}
```

## Example

**Before (valores repetidos, attr() no lugar errado):**

```css
.card {
  width: 80px;
  height: 80px;
  color: attr(data-color); /* NAO FUNCIONA */
}

.card-bg {
  background-image: url("image.jpg");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
```

**After (com esta skill aplicada):**

```css
:root {
  --card-size: 80px;
}

.card {
  width: var(--card-size);
  height: var(--card-size);
}

.card::before {
  content: attr(data-color); /* attr() dentro de content */
}

.card-bg {
  background: url("image.jpg") center/contain no-repeat;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Valor repetido em multiplas regras | Extrair para custom property, usar `var()` |
| Imagem de fundo | `background: url(...) center/contain no-repeat` shorthand |
| Exibir valor de atributo HTML | `::before` ou `::after` com `content: attr(nome-do-atributo)` |
| Atributo `data-*` decorativo | `attr(data-xxx)` em `content` de pseudo-elemento |
| Atributo `aria-label` visivel | `attr(aria-label)` em `content` — util para debug de acessibilidade |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `color: attr(data-color)` | `content: attr(data-color)` em `::before`/`::after` |
| `width: 80px` repetido 5 vezes | `--size: 80px` + `width: var(--size)` |
| `background-image` + `background-position` + `background-size` separados | `background: url(...) center/contain no-repeat` |
| `var(size)` sem `--` | `var(--size)` — custom properties exigem prefixo `--` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `var()` retorna valor vazio | Custom property nao definida ou fora de escopo | Verifique se `--nome` esta declarada em `:root` ou no escopo correto |
| `attr()` nao funciona fora de `content` | Limitacao da spec CSS atual | Use `attr()` apenas dentro de `content` em `::before`/`::after` |
| `var(size)` sem efeito | Falta prefixo `--` | Use `var(--size)` — custom properties exigem `--` |
| Background image nao aparece | Caminho relativo errado ou falta `url()` | Verifique o caminho e use `background: url("caminho/imagem.jpg")` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre contextos de uso e limitações de cada função
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações