# Deep Explanation: Bordas Degradê e Estilizacao Premium

## Por que bordas degradê precisam de pseudo-elements?

CSS tem `border-image` que aceita gradients, mas quando voce combina `border-image` com `border-radius`, o radius e **silenciosamente ignorado**. Isso e uma limitacao da spec CSS — `border-image` desenha sobre o border box antes do clipping de radius.

A solucao e a tecnica do "livro embaixo": imagine dois livros empilhados. O de baixo (pseudo-element) tem capa colorida/degradê e e ligeiramente maior. O de cima (card) tem capa cinza/escura e e 2px menor em cada lado. O resultado visual: voce ve a borda do livro de baixo como uma "moldura" degradê.

### Anatomia da tecnica

```
[pseudo-element ::before]  ← gradient background, z-index: -1
  [container .premium]     ← padding: 2px (revela o ::before)
    [.card]                ← background solido, conteudo real
```

O `inset: 0` no pseudo-element faz ele ocupar exatamente o mesmo espaco do pai. O `z-index: -1` coloca atras. O `padding: 2px` do pai empurra o card para dentro, revelando 2px do gradient em todas as direcoes.

## Cantos seletivos no badge

O instrutor usa `border-top-left-radius` e `border-bottom-right-radius` separadamente, em vez de `border-radius` shorthand. Isso cria o efeito de "etiqueta recortada" — arredondado apenas em cantos diagonais opostos.

## Analogia do livro (do instrutor)

> "Imagina um livro que ta embaixo, e ai voce coloca um livro em cima de capa cinza, que e um pouquinho menor do que o livro de degradê que ta la embaixo. Ai voce consegue ver um pouquinho o livro de baixo, consegue ver muito mais o livro de cima."

Essa analogia e perfeita para explicar a tecnica. O "pouquinho" que se ve e exatamente o `padding: 2px`.

## Cascata CSS para overrides de componente

Na aula, o botao tinha tamanho MD globalmente, mas no desktop crescia. No layout do Figma, o botao do pricing deveria manter MD mesmo no desktop. A solucao: copiar a definicao MD e colocar dentro do bloco de media query do pricing.

Isso funciona porque na cascata CSS, quando dois seletores tem a mesma especificidade, o que aparece **depois** no codigo vence. Como o pricing vem depois das definicoes globais de botao, ele sobrescreve naturalmente.

## Dica do Figma: Copy CSS

Clique direito no elemento > Copy/Paste > Copy CSS. Vem "sujeira" (propriedades desnecessarias como `display`, `position` que o Figma infere), mas tambem valores precisos:
- `font-size`, `font-weight`, `font-family`
- `color` (em hex ou rgb)
- `text-transform`, `letter-spacing`
- `line-height`

Filtre o util e descarte o resto.

## Alinhamento entre cards

O instrutor percebeu que para alinhar os botoes dos 3 cards, precisava ajustar:
1. `padding-bottom: 6rem` no card premium (maior que os outros)
2. `margin-block: 1.5rem` no separator do ultimo card (em vez de 2rem dos outros)

Isso e trabalho de observacao — medir no Figma as diferencas de espacamento entre cards e compensar individualmente.

## `small` com seletor contextual

O `li + small` seleciona o `<small>` que vem imediatamente apos um `<li>`. O instrutor destaca que esse seletor e bem especifico — so existe uma vez no design inteiro. Mesmo assim, estiliza-lo corretamente ("cada detalhe importa"):
- `display: block` (small e inline por padrao)
- `margin-top: 1.5rem`
- `font-size: 0.875rem`
- `color: var(--text-color-secondary)`