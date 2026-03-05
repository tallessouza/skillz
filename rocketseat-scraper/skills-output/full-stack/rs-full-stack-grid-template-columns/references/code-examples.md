# Code Examples: Grid Template Columns

## Exemplo 1: Colunas com pixels fixos

```css
.container {
  display: grid;
  grid-template-columns: 100px 200px 300px;
}
```

Resultado: 3 colunas com tamanhos fixos. Espaco sobrando no container fica vazio a direita.

## Exemplo 2: Colunas iguais com fr

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```

Resultado: 3 colunas de tamanho identico, preenchendo 100% do container.

## Exemplo 3: Coluna central maior

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}
```

Resultado: coluna do meio recebe o dobro do espaco das laterais.

## Exemplo 4: Proporcoes assimetricas

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr 2fr;
}
```

Resultado: total de 6 fracoes. Coluna 1 = 1/6, Coluna 2 = 3/6 (metade), Coluna 3 = 2/6.

## Exemplo 5: repeat() basico

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

Equivale a `1fr 1fr 1fr`.

## Exemplo 6: repeat() com mais colunas que itens

```html
<div class="container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}
```

Resultado: 3 itens preenchem as 3 primeiras colunas. Colunas 4, 5, 6 ficam vazias mas o espaco e reservado.

## Exemplo 7: Misturando unidades (cuidado com overflow)

```css
.container {
  display: grid;
  grid-template-columns: 1fr 200px 50% 30vw;
}
```

Resultado provavel: **overflow horizontal**. `200px + 50% + 30vw` facilmente ultrapassa 100% do container, deixando quase nada (ou valor negativo) para `1fr`.

## Exemplo 8: Layout sidebar + conteudo

```css
.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
}
```

Resultado: sidebar fixa de 280px, conteudo ocupa todo o restante.

## Exemplo 9: Layout holy grail (3 colunas)

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
}
```

Resultado: sidebar esquerda 200px, conteudo flexivel, sidebar direita 300px.

## Exemplo 10: Itens excedendo colunas (linhas automaticas)

```html
<div class="container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

Resultado:
- Linha 1: itens 1, 2, 3
- Linha 2: item 4 (coluna 1), colunas 2 e 3 vazias

## Exemplo 11: Grid de cards responsivo (variacao pratica)

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

Com 9 cards: grid perfeito 3x3. Com 10 cards: 3 linhas completas + 1 card na quarta linha.

## Exemplo 12: Duas colunas com repeat

```css
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
```

Tudo que sobrar de 2 colunas vai para a proxima linha. Com 5 itens: 2, 2, 1.