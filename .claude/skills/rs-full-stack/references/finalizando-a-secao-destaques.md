---
name: rs-full-stack-finalizando-secao-destaques
description: "Applies CSS :has() selector patterns and semantic HTML figure/figcaption structure when building card-based news layouts. Use when user asks to 'create a card component', 'build a news section', 'conditional styling based on children', or 'use figcaption'. Enforces :has() for parent styling based on child content, semantic figure/figcaption markup, and consistent card patterns. Make sure to use this skill whenever building card grids or news portal layouts. Not for JavaScript interactivity, responsive breakpoints, or CSS Grid/Flexbox layout systems."
---

# Finalizando Seção de Destaques — CSS :has() e Figure/Figcaption

> Use markup semantico com figure/figcaption para cards de noticia e CSS :has() para estilizar condicionalmente baseado no conteudo filho.

## Rules

1. **Use figure/figcaption para cards de conteudo** — `<figure>` wraps a imagem e `<figcaption>` wraps os metadados (tag, titulo, texto), porque e semanticamente correto e acessivel
2. **Atributo alt descreve o conteudo da imagem** — use o titulo da noticia como alt text, porque se a imagem nao carregar o usuario ainda entende o contexto
3. **Aplique :has() para estilizar pai baseado em filho** — `figcaption:has(.text-large)` aplica padding diferente, porque evita classes extras e mantem o CSS declarativo
4. **Reutilize classes de card consistentemente** — aplique a mesma classe `.card` em todos os items da grid, porque garante uniformidade visual sem duplicacao de CSS
5. **Controle linhas de texto via conteudo** — ajuste o texto para caber no design (ex: 3 linhas), porque layouts fixos quebram com texto variavel

## How to write

### Estrutura semantica de card

```html
<figure class="card">
  <img src="image.jpg" alt="Titulo descritivo da noticia" />
  <figcaption>
    <span class="content-tag">Categoria</span>
    <h3>Titulo da noticia</h3>
    <p class="text-large">Resumo em ate tres linhas...</p>
  </figcaption>
</figure>
```

### CSS :has() para padding condicional

```css
/* Se figcaption contem .text-large, aplica padding menor */
figcaption:has(.text-large) {
  padding: 12px;
}

/* Caso contrario, padding padrao */
figcaption {
  padding: 24px;
}
```

## Example

**Before (div generica sem semantica):**
```html
<div class="card">
  <img src="hologramas.jpg" />
  <div>
    <span>Tecnologia</span>
    <h3>Hologramas</h3>
    <p>Texto da noticia...</p>
  </div>
</div>
```

**After (com figure/figcaption e :has()):**
```html
<figure class="card">
  <img src="hologramas.jpg" alt="Hologramas" />
  <figcaption>
    <span class="content-tag">Tecnologia</span>
    <h3>Hologramas</h3>
    <p class="text-large">Texto da noticia...</p>
  </figcaption>
</figure>
```

```css
figcaption {
  padding: 24px;
}

figcaption:has(.text-large) {
  padding: 12px;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Card com imagem + texto descritivo | Use `<figure>` + `<figcaption>` |
| Estilo do pai depende de classe do filho | Use `:has()` no CSS |
| Multiplos cards identicos | Aplique mesma classe `.card` em todos |
| Alt text de imagem de noticia | Use o titulo da noticia como alt |
| Texto precisa caber em N linhas | Ajuste conteudo ou use `line-clamp` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `<div class="card"><div class="caption">` | `<figure class="card"><figcaption>` |
| `<img src="x.jpg" />` (sem alt) | `<img src="x.jpg" alt="Descricao" />` |
| `.card-small { padding: 12px }` (classe extra) | `figcaption:has(.text-large) { padding: 12px }` |
| Padding diferente via classes manuais | `:has()` para detectar conteudo e ajustar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre :has(), analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-finalizando-a-secao-destaques/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-finalizando-a-secao-destaques/references/code-examples.md)
