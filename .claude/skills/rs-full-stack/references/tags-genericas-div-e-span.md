---
name: rs-full-stack-tags-genericas-div-e-span
description: "Enforces correct usage of div and span HTML elements when structuring markup. Use when user asks to 'create a layout', 'structure HTML', 'add a container', 'wrap elements', or 'build a page section'. Applies rules: div for block containers, span for inline wrappers, always add class/id/data attributes since they lack semantics. Make sure to use this skill whenever generating HTML structure with generic containers. Not for semantic HTML elements like header, nav, main, section, article, or footer."
---

# Tags Genéricas: Div e Span

> Use div para containers de bloco e span para wrappers em linha — sempre com atributos que deem significado, porque esses elementos não têm semântica própria.

## Rules

1. **Div é bloco, span é linha** — div ocupa a largura inteira e empurra o próximo elemento para baixo; span fica ao lado do elemento anterior, porque esse é o fluxo padrão de cada um
2. **Sem semântica = precisa de atributo** — sempre adicione `class`, `id` ou `data-*` em div/span, porque sem isso o elemento não comunica nada ao CSS, JS ou leitores de tela
3. **Prefira elementos semânticos** — use div/span apenas quando nenhum elemento semântico (`header`, `nav`, `section`, `article`, `footer`, `strong`, `em`) se aplica, porque semântica melhora acessibilidade e SEO
4. **Div contém blocos, span contém inline** — div é o "pai" que contém "filhos" (outras caixas); span envolve texto ou elementos em linha dentro de um bloco

## How to write

### Div como container de bloco

```html
<div class="card">
  <div class="card-header">
    <h2>Título</h2>
  </div>
  <div class="card-body">
    <p>Conteúdo aqui.</p>
  </div>
</div>
```

### Span como wrapper em linha

```html
<p>O valor total é <span class="price">R$ 49,90</span> com frete <span class="shipping-status">grátis</span>.</p>
```

## Example

**Before (sem atributos, sem propósito claro):**

```html
<div>
  <div>Título</div>
  <div>Conteúdo <span>destaque</span> aqui</div>
</div>
```

**After (com atributos que dão significado):**

```html
<div class="product-card" data-product-id="42">
  <div class="product-title">Título</div>
  <div class="product-description">Conteúdo <span class="highlight">destaque</span> aqui</div>
</div>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa de container para layout/CSS | Use `div` com `class` descritiva |
| Precisa destacar trecho de texto para estilizar | Use `span` com `class` |
| O container tem significado na página (navegação, cabeçalho, seção) | Use elemento semântico, não div |
| Precisa de gancho para JavaScript | Use `div`/`span` com `data-*` ou `id` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<div>` sem nenhum atributo | `<div class="container">` |
| `<span>` sem nenhum atributo | `<span class="badge">` |
| `<div>` onde `<section>` se aplica | `<section class="features">` |
| `<span>` onde `<strong>` ou `<em>` se aplica | `<strong>` ou `<em>` |
| Div dentro de span (bloco dentro de inline) | Span dentro de div |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fluxo de bloco vs linha e analogia pai/filho
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-tags-genericas-div-e-span/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-tags-genericas-div-e-span/references/code-examples.md)
