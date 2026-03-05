---
name: rs-discover-display-none-inline-block
description: "Enforces correct use of CSS display property (block, inline, inline-block, none) when styling HTML elements. Use when user asks to 'align elements', 'center an image', 'put elements side by side', 'fix margin not working', or any CSS layout task. Applies rules: inline elements reject margin-top/bottom, block elements occupy full width, use text-align for inline centering, use margin auto for block centering. Make sure to use this skill whenever writing CSS that involves element alignment or display changes. Not for Flexbox, Grid, or responsive layout techniques."
---

# Display: none, inline, block e Alinhamento

> Entenda o display de cada elemento antes de tentar alinhá-lo — block e inline seguem regras de alinhamento completamente diferentes.

## Rules

1. **Elementos block ocupam toda a largura disponível** — forçam outros elementos para cima/baixo, porque o browser cria uma caixa que se estica horizontalmente
2. **Elementos inline ficam em linha** — lado a lado com outros elementos inline, porque o browser os trata como texto fluindo na mesma linha
3. **Inline não aceita margin-top/margin-bottom** — se `margin: auto` não centraliza verticalmente, provavelmente o elemento é inline
4. **Use `text-align: center` no PAI para centralizar elementos inline** — porque inline herda alinhamento do container pai
5. **Use `margin: 0 auto` no PRÓPRIO elemento block para centralizá-lo** — porque block tem largura definida e margin auto distribui o espaço restante
6. **`display: none` remove o elemento completamente** — não ocupa espaço, não é renderizado
7. **`inline-block` é híbrido** — mantém comportamento inline (fica em linha) mas aceita propriedades block (width, height, margin vertical)

## Elementos padrão

| Display padrão | Elementos comuns |
|---------------|-----------------|
| `block` | `div`, `p`, `h1`-`h6`, `section`, `header`, `footer` |
| `inline` | `a`, `img`, `span`, `strong`, `em` |

## How to write

### Centralizar elemento inline (imagem, link)

```css
/* Aplique text-align no PAI, não no elemento */
.profile {
  text-align: center;
}
```

### Centralizar elemento block (div com largura fixa)

```css
.container {
  width: 600px;
  margin: 0 auto;
}
```

### Forçar inline a aceitar margin vertical

```css
img {
  display: block;
  margin: 0 auto;
}
```

## Example

**Before (margin auto não funciona em inline):**
```css
/* img é inline por padrão — margin auto vertical é ignorado */
img {
  margin: auto;
}
```

**After (converter para block ou usar text-align no pai):**
```css
/* Opção 1: converter para block */
img {
  display: block;
  margin: 0 auto;
}

/* Opção 2: text-align no pai */
.profile {
  text-align: center;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| `margin: auto` não centraliza | Verifique se o elemento é inline |
| Elementos não ficam lado a lado | Verifique se são block (block força quebra de linha) |
| Quer esconder elemento | Use `display: none` |
| Quer inline que aceite margin/width | Use `display: inline-block` |
| `text-align: center` não funciona | Verifique se o elemento é block (block ignora text-align do pai) |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `margin: auto` em elemento inline | `text-align: center` no pai |
| `text-align: center` no pai de elemento block | `margin: 0 auto` no próprio elemento block |
| Frustrar-se sem verificar o display | Inspecione o display padrão do elemento primeiro |
| Forçar `display: block` em tudo | Entenda o display padrão e trabalhe com ele |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que inline e block existem, analogias do instrutor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula com variações