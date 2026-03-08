---
name: rs-full-stack-criando-o-footer-do-projeto
description: "Applies CSS footer layout patterns using flexbox and nth-child selectors when building page footers or multi-section inline layouts. Use when user asks to 'create a footer', 'build a footer component', 'layout footer elements', 'use nth-child', or 'distribute items in a row with margin-right auto'. Make sure to use this skill whenever generating footer HTML/CSS or using nth-child pseudo-selectors. Not for header navigation, grid layouts, or JavaScript interactivity."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-layout
  tags: [css, flexbox, footer, nth-child, layout]
---

# Footer Layout com Flexbox e nth-child

> Construa footers usando flexbox com margin-right auto no primeiro filho para empurrar os demais elementos para a direita, e use nth-child entendendo que ele conta TODOS os filhos do container, nao apenas os do mesmo tipo.

## Rules

1. **Use flexbox no footer** — `display: flex` alinha os itens em linha, porque footer tipicamente tem elementos distribuidos horizontalmente
2. **Empurre com margin-right: auto no primeiro filho** — `footer span:nth-child(1) { margin-right: auto }` separa o logo/marca dos links, porque auto margin absorve todo o espaco disponivel
3. **nth-child conta TODOS os filhos** — se o container tem `<a>` + `<span>` + `<span>`, o primeiro span e nth-child(2), nao nth-child(1), porque a contagem inclui todos os filhos independente do tipo
4. **Use gap para espacamento entre elementos** — `gap: 24px` entre elementos irmaos, porque evita margin hack em cada item
5. **Use padding-block para espacamento vertical** — `padding-block: 24px` no footer, porque padding-block e mais semantico para espacamento vertical
6. **Use entidades HTML para simbolos** — `&copy;` para o simbolo de copyright, porque garante renderizacao correta em todos os navegadores

## How to write

### Estrutura HTML do footer

```html
<footer class="container">
  <span>TravelGram &copy; 2024</span>
  <span>Termos de uso</span>
  <span>Política de privacidade</span>
</footer>
```

### CSS do footer com nth-child

```css
footer {
  display: flex;
  padding-block: 24px;
  gap: 24px;
}

footer span:nth-child(1) {
  margin-right: auto;
}
```

## Example

**Before (margin manual em cada item):**
```css
footer { display: flex; }
footer span:first-child { flex: 1; }
footer span:nth-of-type(2) { margin-left: 20px; }
footer span:nth-of-type(3) { margin-left: 20px; }
```

**After (com esta skill aplicada):**
```css
footer {
  display: flex;
  padding-block: 24px;
  gap: 24px;
}

footer span:nth-child(1) {
  margin-right: auto;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Footer com logo/marca + links | margin-right: auto no primeiro filho |
| Espacamento uniforme entre links | gap no container flex |
| Simbolo de copyright | `&copy;` entity |
| Links de termos/politica no footer | Use span ou a, cada um como filho direto |
| Precisar selecionar filho por posicao | Lembre que nth-child conta TODOS os filhos do container |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `span:nth-child(1)` quando ha outros elementos antes do span | `span:nth-child(N)` onde N e a posicao real contando todos os filhos |
| `(c)` ou `(C)` para copyright | `&copy;` |
| `margin-left` em cada link para espacar | `gap` no container flex |
| `float: right` nos links do footer | `margin-right: auto` no primeiro filho |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre nth-child vs nth-of-type e margin auto
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| nth-child seleciona o elemento errado | Contagem inclui TODOS os filhos, nao so os do mesmo tipo | Conte todos os filhos do container, incluindo elementos de tipos diferentes |
| margin-right: auto nao empurra elementos | Container nao e flex | Adicione `display: flex` no container pai |
| Copyright aparece como texto `&copy;` | Entidade HTML usada fora do HTML (ex: JS string) | Em HTML use `&copy;`, em JS use `\u00A9` ou o caractere direto |
| Gap nao funciona entre elementos | Browser muito antigo sem suporte a `gap` em flex | Use margin como fallback ou atualize o browser |
| Footer nao fica no final da pagina | Conteudo insuficiente para empurrar o footer | Use `min-height: 100vh` no body com flex column |