---
name: rs-full-stack-order
description: "Applies CSS order property correctly in flexbox/grid layouts when writing CSS code. Use when user asks to 'reorder elements', 'change element order', 'rearrange layout', 'move element first/last', or any visual reordering task. Enforces visual-only reordering with accessibility awareness: order is visual not structural, default is 0, negative moves left/up, positive moves right/down. Make sure to use this skill whenever reordering flex/grid children visually. Not for changing HTML structure, DOM manipulation, or JavaScript sort operations."
---

# CSS Order Property

> Usar `order` para reordenar visualmente elementos flex/grid, sabendo que a mudanca e apenas visual e nao altera o HTML — o que pode impactar acessibilidade.

## Rules

1. **Order e visual, nao estrutural** — `order` muda a posicao visual mas NAO modifica o DOM/HTML, porque leitores de tela leem na ordem do HTML independente do CSS
2. **Valor padrao e 0** — todos os flex/grid items tem `order: 0` por padrao, porque e isso que mantem a ordem natural
3. **Negativo move para o inicio** — `order: -1` posiciona o elemento antes dos elementos com `order: 0`
4. **Positivo move para o final** — `order: 1` ou maior posiciona o elemento depois dos elementos com `order: 0`
5. **Avalie impacto em acessibilidade** — se a reordenacao visual muda o sentido da leitura sequencial, considere mudar o HTML ao inves de usar `order`, porque leitores de tela ignoram `order`

## How to write

### Mover elemento para o inicio
```css
.item-destaque {
  order: -1; /* Aparece primeiro visualmente, mas continua na mesma posicao no HTML */
}
```

### Mover elemento para o final
```css
.item-secundario {
  order: 1; /* Aparece por ultimo visualmente */
}
```

### Ordenacao relativa entre multiplos elementos
```css
.primeiro  { order: -2; }
.segundo   { order: -1; }
.padrao    { order: 0; }  /* Valor implicito, nao precisa declarar */
.penultimo { order: 1; }
.ultimo    { order: 2; }
```

## Example

**Before (reordenando via HTML — desnecessario):**
```html
<!-- Mudou a estrutura do HTML so pra mudar a ordem visual -->
<div class="container">
  <div class="item-2">2</div>
  <div class="item-1">1</div>
  <div class="item-3">3</div>
</div>
```

**After (com order — HTML intacto):**
```html
<div class="container">
  <div class="item-1">1</div>
  <div class="item-2">2</div>
  <div class="item-3">3</div>
</div>
```
```css
.container { display: flex; }
.item-2 { order: -1; } /* Item 2 aparece primeiro visualmente */
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Reordenacao puramente decorativa (ex: layout responsivo) | Usar `order` tranquilamente |
| Ordem impacta compreensao do conteudo (ex: passos de um formulario) | Mudar o HTML, nao usar `order` |
| Mover 1 elemento para destaque visual | `order: -1` no elemento |
| Precisa de ordenacao complexa com muitos niveis | Considerar mudar HTML — `order` com muitos valores fica dificil de manter |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Reordenar passos de formulario com `order` | Mudar a ordem no HTML |
| Usar `order` em navegacao onde a sequencia importa para acessibilidade | Alterar a estrutura HTML |
| Aplicar `order` sem `display: flex` ou `display: grid` no pai | Garantir que o container e flex ou grid |
| Usar valores arbitrarios grandes (`order: 999`) | Usar valores sequenciais simples (-1, 0, 1, 2) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre impacto em acessibilidade e quando usar vs nao usar order
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variacoes responsivas e casos de uso reais

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-order/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-order/references/code-examples.md)
