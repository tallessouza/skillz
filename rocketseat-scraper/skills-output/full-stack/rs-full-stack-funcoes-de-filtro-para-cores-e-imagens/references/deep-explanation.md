# Deep Explanation: Funções de Filtro CSS

## A propriedade `filter` como hub unificado

A propriedade CSS `filter` aceita uma ou mais funções de filtro como valor. A grande sacada é que você pode combinar (fazer "combos") de múltiplos filtros numa única declaração. Isso é fundamental porque, diferente de outras propriedades CSS, declarar `filter` duas vezes não acumula — a segunda sobrescreve a primeira.

```css
/* ERRADO — só o blur será aplicado */
.element {
  filter: brightness(2);
  filter: blur(5px); /* sobrescreve o brightness */
}

/* CORRETO — ambos aplicados */
.element {
  filter: brightness(2) blur(5px);
}
```

## Filtros em detalhe

### blur(valor)

Aceita `px` ou `rem`. Quanto maior o valor, mais embaçado/borrado fica o elemento. O instrutor usa a analogia de "borradinho" — pense em vidro fosco. Aplicável especialmente em imagens de fundo para criar efeitos de profundidade de campo.

### brightness(número)

O valor padrão é `1` (estado natural). A escala é multiplicativa:
- `brightness(2)` = dobro do brilho
- `brightness(3)` = triplo
- `brightness(0)` = completamente preto
- `brightness(0.5)` = metade do brilho

Valores fracionários vão escurecendo progressivamente até chegar ao preto total. Valores altos vão clareando até sumir no branco.

### contrast(número)

Também com default `1`. Valores menores que 1 criam um "tom pastel" — o instrutor descreve como "ficando mais sem gracinha". Valores maiores intensificam as diferenças entre claro e escuro. O efeito é mais visível em imagens com variedade de cores do que em cores sólidas.

### drop-shadow(offsetX offsetY blur cor)

Funciona como `box-shadow`, mas aplicado via filtro. A grande diferença: `drop-shadow` respeita a forma real do elemento (incluindo transparência de PNGs), enquanto `box-shadow` aplica sombra na caixa retangular.

Parâmetros:
- **offsetX**: deslocamento horizontal
- **offsetY**: deslocamento vertical
- **blur**: espalhamento/borrado da sombra
- **cor**: cor da sombra (ex: `grey`, `rgba()`, etc.)

### opacity(número)

De 0 a 1. O valor 1 é totalmente visível, 0 é invisível. Semelhante à propriedade `opacity`, mas como função do `filter` pode ser combinada com outros filtros numa mesma declaração.

### invert(número)

Inverte as cores completamente. O que era preto vira branco, o que era azul vira vermelho (cor complementar na roda de cores). `invert(1)` é inversão total, `invert(0)` é nenhuma inversão.

### hue-rotate(ângulo)

Este filtro gira as cores na roda HSL (Hue-Saturation-Lightness). O instrutor destaca a "rodinha Hue" — um círculo de cores que vai do vermelho (0°), passa por amarelo, verde, ciano, azul, magenta, e volta ao vermelho em 360°.

O valor deve sempre incluir a unidade `deg`. Por exemplo, `hue-rotate(200deg)` gira todas as cores 200 graus na roda. É útil para criar variações de tema sem alterar o CSS base.

### saturate(número)

Controla a vivacidade das cores:
- `saturate(0)` = completamente preto e branco (dessaturado)
- `saturate(1)` = normal
- `saturate(2)` = cores mais vívidas

### sepia(número)

Aplica um tom sépia (marrom-amarelado vintage). `sepia(1)` é efeito total, `sepia(0)` é nenhum efeito.

## O padrão hover reveal

Um dos padrões mais úteis demonstrados: aplicar filtros que "escondem" o elemento no estado normal e usar `:hover` com `filter: unset` para revelar. O `unset` reseta a propriedade para seu valor padrão, removendo todos os filtros de uma vez.

```css
.element {
  filter: opacity(0.1) blur(2px);
}
.element:hover {
  filter: unset;
}
```

Adicionar `transition: filter 0.3s ease` torna a revelação suave em vez de instantânea.

## Aplicação em imagens

O instrutor enfatiza que filtros são especialmente poderosos quando aplicados a imagens de fundo. Uma imagem pode ser completamente transformada visualmente sem edição no Photoshop — blur para efeito de profundidade, brightness/contrast para ajustes, sepia/hue-rotate para mudanças de estilo.