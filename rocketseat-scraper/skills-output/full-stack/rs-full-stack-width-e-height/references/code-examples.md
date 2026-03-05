# Code Examples: Width e Height no CSS

## Setup basico do instrutor

```html
<div>Conteudo block aqui com texto grande...</div>
<span>Conteudo inline aqui</span>
```

## Exemplo 1: Width em block vs inline

```css
/* Block: width funciona */
div {
  width: 200px;
  border: 1px solid black;
}
/* O texto longo quebra linha dentro dos 200px */

/* Inline: width ignorado */
span {
  width: 200px; /* NAO FUNCIONA — span e inline */
  border: 1px solid red;
}
/* O span continua com a largura do conteudo */
```

## Exemplo 2: min-width criando piso

```css
div {
  min-width: 200px;
  /* Sem width definido: ocupa 100% do pai (block normal) */
  /* Com width: 100px → resultado sera 200px (min vence) */
  /* Com width: 500px → resultado sera 500px (acima do minimo, OK) */
}
```

## Exemplo 3: max-width criando teto

```css
div {
  max-width: 300px;
  /* Com width: 500px → resultado sera 300px (max vence) */
  /* Com width: 200px → resultado sera 200px (abaixo do maximo, OK) */
}
```

## Exemplo 4: Faixa de trabalho (min + max)

```css
div {
  min-width: 200px;
  max-width: 300px;
  /* width so funciona entre 200 e 300 */
  width: 250px; /* OK, dentro da faixa */
  width: 100px; /* resultado: 200px */
  width: 500px; /* resultado: 300px */
}
```

## Exemplo 5: Height e overflow

```css
div {
  height: 200px;
  border: 1px solid black;
  /* Caixa visivel com 200px de altura */
}
```

## Exemplo 6: Overflow por caixa pequena

```css
div {
  width: 50px;
  height: 50px;
  border: 1px solid red;
  /* Texto longo TRANSBORDA — sai da caixa */
  /* A caixa continua com 50x50, mas o conteudo vaza */
}
```

## Exemplo 7: min-height e max-height

```css
div {
  min-height: 200px;  /* no minimo 200px */
  max-height: 300px;  /* no maximo 300px */
  /* height: 500px → resultado: 300px (max vence) */
  /* height: 1500px → resultado: 300px (max vence) */
  /* height: 100px → resultado: 200px (min vence) */
}
```

## Exemplo 8: Debug visual com border

```css
/* Adicione temporariamente para ver a caixa */
div {
  width: 300px;
  min-height: 100px;
  border: 1px solid red; /* REMOVER depois do debug */
}
```

## Variacoes praticas

### Card seguro (sem overflow)

```css
.card {
  max-width: 400px;
  min-height: 120px;
  /* Altura cresce com conteudo, largura limitada */
  border: 1px solid #ccc;
  padding: 16px;
}
```

### Container centralizado com limites

```css
.container {
  width: 100%;
  max-width: 1200px;
  min-width: 320px;
  margin: 0 auto;
}
```

### Inline-block para sizing em elemento inline

```css
span.badge {
  display: inline-block; /* agora aceita width/height */
  width: 80px;
  height: 24px;
  text-align: center;
}
```