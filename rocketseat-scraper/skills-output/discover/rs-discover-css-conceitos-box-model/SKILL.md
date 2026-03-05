---
name: rs-discover-css-conceitos-box-model
description: "Applies CSS Box Model mental model when writing HTML/CSS layouts. Use when user asks to 'create a layout', 'style elements', 'add spacing', 'fix margins', 'align elements', or any CSS positioning task. Enforces understanding that every HTML element is a box with content, padding, border, and margin. Distinguishes block vs inline display behavior. Make sure to use this skill whenever generating CSS that involves spacing, sizing, or element positioning. Not for JavaScript logic, animations, or backend code."
---

# CSS Box Model

> Todo elemento HTML e uma caixa com conteudo, padding, border e margin — entender isso e pre-requisito para qualquer layout.

## Rules

1. **Todo elemento e uma caixa** — HTML tags sao caixas com largura, altura, padding, border e margin, porque o navegador renderiza tudo como retangulos
2. **Padding e espaco interno** — `padding` empurra o conteudo para dentro da caixa, porque e o preenchimento entre conteudo e borda
3. **Margin e espaco externo** — `margin` cria distancia entre caixas irmas, porque e o espacamento ao redor da borda
4. **Block ocupa linha inteira** — elementos `display: block` pegam toda a largura disponivel e jogam o proximo elemento para baixo, porque e o comportamento padrao de `div`, `h1`, `p`, `header`
5. **Inline ocupa so o conteudo** — elementos `display: inline` ocupam apenas o tamanho do conteudo e permitem irmaos ao lado, porque e o comportamento padrao de `span`, `a`, `strong`
6. **Display e mutavel** — qualquer elemento pode ter seu display alterado via CSS, porque `display` e apenas uma propriedade como qualquer outra

## How to write

### Box com spacing completo

```css
.card {
  width: 300px;
  height: 200px;
  padding: 20px;    /* espaco interno */
  border: 1px solid #ccc;
  margin: 16px;     /* espaco externo */
}
```

### Mudando display behavior

```css
/* Transformar block em inline */
h1 { display: inline; }

/* Transformar inline em block */
span { display: block; }
```

## Example

**Before (sem entendimento do box model):**
```css
/* Tentando espacar elementos sem saber o que e padding vs margin */
.header {
  border: 1px solid red;
}
.header h1 {
  /* Sem spacing, conteudo colado na borda */
}
.info {
  /* Sem margin, elementos colados entre si */
}
```

**After (com box model aplicado):**
```css
.header {
  border: 1px solid red;
  padding: 60px;        /* preenchimento interno afasta conteudo da borda */
}
.header h1 {
  height: 60px;
  border: 1px solid green;
}
p {
  margin: 20px;         /* espaco ao redor da caixa */
  border: 1px solid purple;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Espaco entre conteudo e borda do proprio elemento | Use `padding` |
| Espaco entre dois elementos irmaos | Use `margin` |
| Elemento deve ocupar linha inteira | Use `display: block` (ou deixe padrao se ja for block) |
| Elementos devem ficar lado a lado | Use `display: inline` ou `display: inline-block` |
| Precisa ver os limites da caixa para debugar | Adicione `border: 1px solid red` temporariamente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Usar `margin` para espaco interno | Use `padding` para espaco entre conteudo e borda |
| Usar `padding` para separar elementos irmaos | Use `margin` para espaco entre caixas |
| Assumir que `span` quebra linha | `span` e inline por padrao — use `div` para block |
| Esquecer que `h1`, `p`, `div` sao block | Lembre que eles ocupam linha inteira por padrao |
| Tentar colocar largura/altura em inline puro | Mude para `inline-block` ou `block` primeiro |

## Display padrao das tags comuns

| Tag | Display padrao |
|-----|---------------|
| `div`, `header`, `main`, `footer`, `section` | block |
| `h1`-`h6`, `p`, `ul`, `ol`, `li` | block |
| `span`, `a`, `strong`, `em`, `img` | inline |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes