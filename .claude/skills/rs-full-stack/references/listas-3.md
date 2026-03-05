---
name: rs-full-stack-listas-3
description: "Applies HTML list markup conventions when writing ordered and unordered lists. Use when user asks to 'create a list', 'add ingredients', 'make a step-by-step', 'write HTML list', or any task involving ul/ol/li elements. Enforces correct semantic choice between ol and ul based on content intent. Make sure to use this skill whenever generating HTML that contains sequential or grouped items. Not for CSS list styling, JavaScript list manipulation, or data structure lists."
---

# Listas HTML — Ordenadas e Não Ordenadas

> Escolha `<ul>` quando a ordem não importa (ingredientes), `<ol>` quando a sequência é o significado (passo a passo).

## Rules

1. **Use `<ul>` para itens sem ordem implícita** — ingredientes, features, opções, porque trocar a ordem não muda o significado
2. **Use `<ol>` para sequências** — passos, rankings, instruções, porque a posição numérica carrega informação
3. **Cada item é um `<li>`** — nunca use `<p>` ou `<div>` solto dentro de `<ul>`/`<ol>`, porque quebra a semântica de lista
4. **Descanse o mouse na tag para entender** — editores como VSCode mostram descrição ao passar o mouse sobre tags HTML, porque isso confirma o uso correto sem sair do editor

## How to write

### Lista não ordenada (itens sem ordem)

```html
<ul>
  <li>Farinha - 300g</li>
  <li>Cacau em pó - 100g</li>
  <li>Cenoura ralada - 1 unidade</li>
</ul>
```

Renderiza com bullet points (•).

### Lista ordenada (sequência importa)

```html
<ol>
  <li>Pegar a farinha e colocar no recipiente</li>
  <li>Misturar com o cacau</li>
  <li>Misturar a cenoura</li>
</ol>
```

Renderiza com números (1, 2, 3).

## Example

**Before (sem semântica de lista):**

```html
<p>Farinha - 300g</p>
<p>Cacau em pó - 100g</p>
<p>Cenoura ralada</p>

<p>1. Colocar farinha no recipiente</p>
<p>2. Misturar com cacau</p>
<p>3. Misturar cenoura</p>
```

**After (com listas semânticas):**

```html
<h2>Ingredientes</h2>
<ul>
  <li>Farinha - 300g</li>
  <li>Cacau em pó - 100g</li>
  <li>Cenoura ralada</li>
</ul>

<h2>Modo de preparo</h2>
<ol>
  <li>Colocar farinha no recipiente</li>
  <li>Misturar com cacau</li>
  <li>Misturar cenoura</li>
</ol>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Itens que podem ser reordenados sem perder sentido | `<ul>` |
| Passo a passo, tutorial, ranking | `<ol>` |
| Lista dentro de lista | Aninhe `<ul>`/`<ol>` dentro de um `<li>` |
| Dúvida sobre a tag | Descanse o mouse sobre ela no editor |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<div>Item 1</div><div>Item 2</div>` | `<ul><li>Item 1</li><li>Item 2</li></ul>` |
| `<p>1. Primeiro passo</p>` | `<ol><li>Primeiro passo</li></ol>` |
| `<ul><p>Item</p></ul>` | `<ul><li>Item</li></ul>` |
| `<ol>` para ingredientes | `<ul>` para ingredientes |
| `<ul>` para passo a passo | `<ol>` para passo a passo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-listas-3/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-listas-3/references/code-examples.md)
