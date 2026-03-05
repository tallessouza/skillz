# Code Examples: Display Inline

## Exemplo 1: Inline ocupa apenas o espaco do conteudo

```html
<span>inline</span>
```

```css
span {
  border: 1px solid black;
}
```

Resultado: a borda envolve apenas o texto "inline", sem expandir para a linha toda.

## Exemplo 2: Dois spans em linha

```html
<span>Primeiro</span>
<span>Segundo</span>
```

Resultado: "Primeiro" e "Segundo" ficam lado a lado na mesma linha.

## Exemplo 3: Block quebrando o fluxo inline

```html
<span>Inline 1</span>
<div>Block</div>
<span>Inline 2</span>
```

Resultado: Inline 1 fica numa linha, div ocupa a proxima linha inteira, Inline 2 fica na linha seguinte.

## Exemplo 4: Width e height ignorados

```css
span {
  width: 200px;   /* sem efeito */
  height: 100px;  /* sem efeito */
  border: 1px solid black;
}
```

A caixa continua do tamanho do conteudo. Nenhuma mudanca visivel.

## Exemplo 5: Margin — so horizontal funciona

```html
<span>A</span>
<span>B</span>
```

```css
span {
  margin: 20px;
  border: 1px solid black;
}
```

Resultado:
- `margin-left` e `margin-right`: aplicados, espaco entre os spans
- `margin-top` e `margin-bottom`: ignorados completamente

## Exemplo 6: Padding — renderiza mas nao empurra vertical

```html
<span>Span 1</span>
<div>Div separadora</div>
<span>Span 2</span>
```

```css
span {
  padding: 20px;
  border: 1px solid black;
}
```

Resultado:
- Laterais: padding empurra conteudo vizinho
- Vertical: padding aparece visualmente mas a div nao e empurrada — o padding do span se sobrepoem com a div

### Sem padding vs com padding

```css
/* Sem padding */
span { border: 1px solid black; }

/* Com padding 20px */
span { padding: 20px; border: 1px solid black; }
```

Com padding, as laterais expandem normalmente. Em cima e embaixo, o preenchimento aparece mas se sobrepoem com elementos adjacentes.

## Exemplo 7: Border — mesma logica do padding

```css
span {
  border: 10px solid blue;
}
```

Resultado:
- Bordas laterais empurram elementos vizinhos
- Bordas verticais aparecem mas se sobrepoem com elementos acima/abaixo

## Exemplo 8: Solucao com inline-block

```css
/* Problema: inline ignora width/height */
span {
  display: inline; /* padrao */
  width: 200px;    /* ignorado */
}

/* Solucao: inline-block mantem em linha + aceita dimensoes */
span {
  display: inline-block;
  width: 200px;    /* funciona */
  height: 100px;   /* funciona */
  margin: 20px;    /* funciona em todas direcoes */
  padding: 20px;   /* funciona em todas direcoes */
}
```

## Variacoes praticas

### Link estilizado (inline por padrao)

```css
/* Errado — nao tera efeito */
a {
  width: 150px;
  height: 40px;
}

/* Correto — se precisa de dimensoes fixas */
a {
  display: inline-block;
  width: 150px;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
```

### Badge com span

```css
/* Errado — margem vertical ignorada */
span.badge {
  margin-top: 10px;
  padding: 5px 10px;
  background: #eee;
}

/* Correto */
span.badge {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 10px;
  background: #eee;
}
```