---
name: rs-full-stack-fundamentos-do-grid-no-codigo
description: "Applies CSS Grid fundamentals when writing layout code. Use when user asks to 'create a layout', 'use grid', 'style a container', 'arrange elements', or any CSS layout task. Enforces container/items mental model, display grid vs inline-grid selection, and understanding of how grid changes child behavior. Make sure to use this skill whenever generating CSS Grid code. Not for Flexbox-only layouts, animations, or JavaScript logic."
---

# Fundamentos do Grid no Código

> Todo Grid começa com um container (pai) que recebe `display: grid` e controla o comportamento dos seus items (filhos).

## Rules

1. **Sempre defina o container primeiro** — aplique `display: grid` no elemento pai, porque o Grid é controlado pelo container e não pelos filhos
2. **Elementos inline viram blocos dentro do grid** — `<span>`, `<a>`, `<em>` dentro de um grid container se comportam como blocos, porque o grid assume controle total do layout dos filhos
3. **Use `display: grid` por padrão** — `inline-grid` existe mas é rarissimamente usado; ele faz o container ter largura do conteudo em vez de 100%, mas o grid interno funciona igual
4. **Grid cria rows automaticamente** — sem propriedades adicionais, o grid cria uma linha (row) para cada filho direto do container
5. **`inline-grid` aceita margin-top** — diferente de `display: inline` puro que rejeita margin-top, `inline-grid` aceita propriedades de bloco mantendo largura de conteudo

## How to write

### Container e Items basico

```css
/* Container (pai) recebe o grid */
.container {
  display: grid;
}

/* Filhos sao automaticamente controlados pelo grid */
/* Mesmo spans e elementos inline viram blocos */
```

```html
<div class="container">
  <div>1</div>
  <span>2</span>
  <span>3</span>
</div>
```

### Quando usar inline-grid (raro)

```css
/* Container com largura do conteudo, nao 100% */
.container {
  display: inline-grid;
}
```

## Example

**Before (sem grid):**

```html
<div id="app">
  <div>1</div>
  <span>2</span>
  <span>3</span>
</div>
```

```css
/* div ocupa linha toda (block), spans ficam lado a lado (inline) */
```

**After (com grid aplicado):**

```css
#app {
  display: grid;
}
```

```
/* Resultado: todos os 3 filhos agora ocupam uma row cada,
   inclusive os spans que antes eram inline */
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de layout em linhas e colunas | `display: grid` no container |
| Container nao deve ocupar 100% da largura | Considere `inline-grid` (raro) |
| Elemento inline dentro do grid nao se comporta como esperado | Lembre que grid transforma filhos em blocos |
| Nenhuma propriedade de grid definida alem de display | Grid cria rows automaticas, uma por filho |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Colocar `display: grid` nos filhos | Colocar `display: grid` no container pai |
| Esperar que `<span>` dentro do grid fique inline | Aceitar que todos os filhos viram blocos no grid |
| Usar `inline-grid` por padrao | Usar `display: grid` — inline-grid e para casos muito especificos |
| Esquecer a relacao container/items | Sempre pensar: pai = container com grid, filhos = items controlados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre display grid vs inline-grid e comportamento dos filhos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes