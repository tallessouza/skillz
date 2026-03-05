# Code Examples: Alinhamentos de Content no CSS Grid

## Setup base usado na aula

### HTML

```html
<div class="grid">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
</div>
```

### CSS Reset + Grid base

```css
* {
  margin: 0;
  box-sizing: border-box;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 8px;
  height: 100vh;
  width: 100vw;
  background-color: black;
}

.grid div {
  background-color: coral;
}
```

## align-content (eixo Y)

### start (padrao)

```css
.grid {
  align-content: start;
  /* Items ficam no topo — comportamento padrao */
}
```

### center

```css
.grid {
  align-content: center;
  /* Items centralizados verticalmente */
}
```

### end

```css
.grid {
  align-content: end;
  /* Items empurrados para baixo */
}
```

### space-around

```css
.grid {
  align-content: space-around;
  /* Espaco ao redor de cada row */
}
```

### space-between

```css
.grid {
  align-content: space-between;
  /* Espaco entre rows, sem espaco no topo/fundo */
}
```

### space-evenly

```css
.grid {
  align-content: space-evenly;
  /* Espaco perfeitamente igual em todos os gaps */
}
```

## justify-content (eixo X)

### start (padrao)

```css
.grid {
  justify-content: start;
  /* Items ficam a esquerda — comportamento padrao */
}
```

### center

```css
.grid {
  justify-content: center;
  /* Items centralizados horizontalmente */
}
```

### end

```css
.grid {
  justify-content: end;
  /* Items empurrados para direita */
}
```

### space-around

```css
.grid {
  justify-content: space-around;
  /* Espaco ao redor de cada coluna */
}
```

### space-between

```css
.grid {
  justify-content: space-between;
  /* Espaco entre colunas, sem espaco nas laterais */
}
```

### space-evenly

```css
.grid {
  justify-content: space-evenly;
  /* Espaco perfeitamente igual entre e nas laterais */
}
```

## place-content (shorthand)

### Centralizar nos dois eixos

```css
.grid {
  place-content: center;
  /* Equivale a: align-content: center; justify-content: center; */
}
```

### Empurrar pro canto inferior direito

```css
.grid {
  place-content: end;
  /* Equivale a: align-content: end; justify-content: end; */
}
```

### space-between nos dois eixos

```css
.grid {
  place-content: space-between;
  /* Distribui rows E columns com espaco entre */
}
```

### space-around nos dois eixos

```css
.grid {
  place-content: space-around;
  /* Espaco ao redor de cada row E cada column */
}
```

### space-evenly nos dois eixos

```css
.grid {
  place-content: space-evenly;
  /* Espaco uniforme em todas as direcoes */
}
```

### Valores diferentes para cada eixo

```css
.grid {
  place-content: end start;
  /* align-content: end (baixo), justify-content: start (esquerda) */
  /* Resultado: canto inferior esquerdo */
}

.grid {
  place-content: start end;
  /* align-content: start (topo), justify-content: end (direita) */
  /* Resultado: canto superior direito */
}
```

## Combinacoes uteis no mundo real

### Grid centralizado com gap

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 300px);
  grid-template-rows: repeat(2, 200px);
  gap: 16px;
  min-height: 100vh;
  place-content: center;
}
```

### Footer sempre no fundo, header no topo

```css
.page-grid {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  align-content: space-between;
}
```

### Cards distribuidos uniformemente

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 250px);
  gap: 24px;
  justify-content: space-evenly;
}
```