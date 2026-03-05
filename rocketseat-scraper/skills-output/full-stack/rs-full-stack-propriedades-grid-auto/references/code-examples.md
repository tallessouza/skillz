# Code Examples: Propriedades Grid Auto

## Setup base usado na aula

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
</ul>
```

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ul {
  display: grid;
  list-style: none;
}
```

## Exemplo 1: grid-auto-flow row (padrao)

```css
ul {
  display: grid;
  height: 100vh;
  /* grid-auto-flow: row; — nao precisa, ja e padrao */
}
```

Resultado: cada item ocupa uma row de 1fr (distribuicao igual da altura do viewport).

## Exemplo 2: grid-auto-rows com loop de dois valores

```css
ul {
  display: grid;
  height: 100vh;
  grid-auto-rows: 50px 1fr;
}
```

Resultado:
- Item 1: 50px
- Item 2: 1fr
- Item 3: 50px
- Item 4: 1fr
- Item 5: 50px (loop reinicia)

## Exemplo 3: grid-auto-rows com loop de tres valores

```css
ul {
  display: grid;
  height: 100vh;
  grid-auto-rows: 1fr 2fr 3fr;
}
```

Resultado:
- Item 1: 1fr
- Item 2: 2fr
- Item 3: 3fr
- Item 4: 1fr (loop reinicia)
- Item 5: 2fr

## Exemplo 4: grid-auto-flow column

```css
ul {
  display: grid;
  grid-auto-flow: column;
  /* grid-auto-columns: 1fr; — padrao, todas colunas iguais */
}
```

Resultado: todos os 5 itens ficam lado a lado em colunas de largura igual.

## Exemplo 5: grid-auto-columns com tamanhos fixos

```css
ul {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 50px 100px 200px;
}
```

Resultado:
- Item 1: 50px
- Item 2: 100px
- Item 3: 200px
- Item 4: 50px (loop)
- Item 5: 100px (loop)

Nota: com tamanhos fixos que somam mais que a largura do viewport, itens podem sair da tela (overflow).

## Exemplo 6: grid-auto-columns com max-content (caso de uso mais pratico)

```css
ul {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 16px;
}
```

Resultado: cada coluna tem exatamente a largura do seu conteudo, com 16px de espaco entre elas.

## Variacoes praticas

### Tags/badges horizontais

```css
.tags {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 8px;
}
```

### Dashboard com rows alternadas

```css
.dashboard {
  display: grid;
  height: 100vh;
  grid-auto-rows: 60px 1fr 1fr;
  /* header 60px, duas rows iguais, repete se houver mais */
}
```

### Galeria com colunas ciclicas

```css
.gallery {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr 2fr;
  gap: 12px;
  /* coluna estreita, coluna larga, estreita, larga... */
}
```