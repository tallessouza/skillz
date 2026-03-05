# Code Examples: Background Shorthand

## Exemplo 1: Shorthand sobrescreve individuais

```css
/* Propriedades individuais aplicadas primeiro */
body {
  background-color: gray;
  background-image: url('https://example.com/photo.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

/* Shorthand aplicado depois — TUDO acima desaparece */
body {
  background: lightblue;
}
/* Resultado: fundo azul claro, SEM imagem */
```

## Exemplo 2: Shorthand so com URL

```css
body {
  background: url('https://example.com/photo.jpg');
}
/* O CSS reconhece automaticamente como background-image */
```

## Exemplo 3: URL + no-repeat

```css
body {
  background: url('https://example.com/photo.jpg') no-repeat;
}
```

## Exemplo 4: URL + no-repeat + center

```css
body {
  background: url('https://example.com/photo.jpg') no-repeat center;
}
```

## Exemplo 5: Completo com position/size

```css
body {
  background: url('https://example.com/photo.jpg') no-repeat center / cover;
}
```

## Exemplo 6: Position composta (top center)

```css
body {
  background: url('https://example.com/photo.jpg') no-repeat top center / cover;
}
```

## Exemplo 7: Completo com cor de fundo

```css
body {
  background: #f0f0f0 url('https://example.com/photo.jpg') no-repeat center / cover;
}
/* Cor aparece onde a imagem nao cobre */
```

## Exemplo 8: Com contain em vez de cover

```css
body {
  background: #f0f0f0 url('https://example.com/photo.jpg') no-repeat center / contain;
}
```

## Exemplo 9: Com tamanho fixo

```css
body {
  background: #f0f0f0 url('https://example.com/photo.jpg') no-repeat center / 300px;
}
```

## Exemplo 10: Aplicando em uma div

```html
<div></div>
```

```css
div {
  width: 300px;
  height: 300px;
  background: url('https://example.com/photo.jpg') no-repeat center / cover;
}
```

## Variacoes de size

```css
/* Cover: imagem cobre todo o elemento, pode cortar */
background: url('img.jpg') no-repeat center / cover;

/* Contain: imagem inteira visivel, pode sobrar espaco */
background: url('img.jpg') no-repeat center / contain;

/* Tamanho fixo em pixels */
background: url('img.jpg') no-repeat center / 300px;

/* Tamanho fixo com dois valores (largura altura) */
background: url('img.jpg') no-repeat center / 300px 200px;
```

## Variacoes de position

```css
/* Centro (padrao mais comum) */
background: url('img.jpg') no-repeat center / cover;

/* Topo centralizado */
background: url('img.jpg') no-repeat top center / cover;

/* Canto inferior direito */
background: url('img.jpg') no-repeat bottom right / cover;

/* Posicao com porcentagem */
background: url('img.jpg') no-repeat 50% 25% / cover;
```

## Anti-pattern: misturar shorthand com individuais

```css
/* PROBLEMA: shorthand reseta background-image */
div {
  background-image: url('img.jpg');
  background-repeat: no-repeat;
  background: gray; /* imagem desaparece! */
}

/* SOLUCAO 1: tudo no shorthand */
div {
  background: gray url('img.jpg') no-repeat center / cover;
}

/* SOLUCAO 2: individual DEPOIS do shorthand */
div {
  background: gray;
  background-image: url('img.jpg'); /* isso funciona */
  background-repeat: no-repeat;
}
```