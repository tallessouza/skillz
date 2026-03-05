---
name: rs-full-stack-display
description: "Applies CSS display property concepts (block vs inline) when writing HTML/CSS layouts. Use when user asks to 'create a layout', 'style elements', 'fix element positioning', 'make elements side by side', or 'stack elements vertically'. Enforces correct understanding of HTML flow, block vs inline behavior, and display context (outer vs inner). Make sure to use this skill whenever generating HTML structure or CSS layout code. Not for flexbox, grid, or advanced layout techniques."
---

# Display CSS — Block vs Inline

> Ao escrever HTML/CSS, escolha o display correto baseado em como a caixa deve se comportar em relacao as caixas ao redor.

## Rules

1. **Entenda o flow padrao do HTML** — elementos block empilham verticalmente, elementos inline ficam lado a lado, porque esse e o fluxo natural do documento
2. **Block ocupa a linha inteira** — `div`, `h1`-`h6`, `p`, `section` sao block por padrao, porque o navegador aplica `display: block` automaticamente
3. **Inline ocupa apenas seu conteudo** — `a`, `span`, `strong`, `em` sao inline por padrao, porque devem fluir dentro do texto
4. **Display controla comportamento externo** — block/inline define como a caixa se comporta em relacao as vizinhas, nao como o conteudo interno se organiza
5. **Separe comportamento externo de interno** — `display: flex` e `display: grid` controlam o comportamento das caixas DENTRO do container, block/inline controlam o comportamento ao REDOR

## How to write

### Elementos block (empilham verticalmente)

```html
<!-- Cada elemento ocupa uma linha inteira -->
<h1>Titulo</h1>
<p>Paragrafo abaixo do titulo</p>
<div>Div abaixo do paragrafo</div>
```

### Elementos inline (lado a lado)

```html
<!-- Elementos fluem na mesma linha -->
<p>Texto com <a href="#">link</a> e <strong>negrito</strong> na mesma linha</p>
```

### Mudando o display

```css
/* Transformar inline em block */
a {
  display: block; /* agora o link ocupa a linha toda */
}

/* Transformar block em inline */
li {
  display: inline; /* agora os itens ficam lado a lado */
}
```

## Example

**Before (confuso sobre layout):**
```html
<!-- Por que esses links nao ficam um embaixo do outro? -->
<a href="#">Link 1</a>
<a href="#">Link 2</a>
<a href="#">Link 3</a>
```

**After (com entendimento de display):**
```html
<!-- Links sao inline por padrao, ficam lado a lado -->
<!-- Para empilhar, mude para block -->
<style>
  a { display: block; }
</style>
<a href="#">Link 1</a>
<a href="#">Link 2</a>
<a href="#">Link 3</a>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento deve ocupar linha inteira | Use ou mantenha `display: block` |
| Elemento deve fluir no texto | Use ou mantenha `display: inline` |
| Precisa de block + inline | Use `display: inline-block` |
| Precisa organizar filhos internos | Use `display: flex` ou `display: grid` (topico separado) |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Usar `<div>` para texto inline | Use `<span>` que ja e inline |
| Forcar `float` para colocar block lado a lado | Mude o display ou use flex |
| Ignorar o display padrao da tag | Consulte se a tag e block ou inline antes de estilizar |
| Confundir display externo com interno | Block/inline = ao redor; flex/grid = dentro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre flow, analogias e contexto de display
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes