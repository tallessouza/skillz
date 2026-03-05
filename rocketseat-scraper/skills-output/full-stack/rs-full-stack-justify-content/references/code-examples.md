# Code Examples: Justify Content

## Setup base usado na aula

```css
.container {
  display: flex;
  width: 100%;
}

.item {
  width: 50px;
  height: 50px;
  background: coral;
}
```

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>
```

## Todos os valores demonstrados

### flex-start (padrao)
```css
.container {
  display: flex;
  justify-content: flex-start; /* padrao, pode omitir */
}
/* Resultado: |1 2 3 4              | */
```

### flex-end
```css
.container {
  display: flex;
  justify-content: flex-end;
}
/* Resultado: |              1 2 3 4| */
```

### center
```css
.container {
  display: flex;
  justify-content: center;
}
/* Resultado: |       1 2 3 4       | */
```

### space-between
```css
.container {
  display: flex;
  justify-content: space-between;
}
/* Resultado: |1      2      3      4| */
```

### space-around
```css
.container {
  display: flex;
  justify-content: space-around;
}
/* Resultado: | 1    2    3    4 | */
/* Espaco nas bordas = metade do espaco entre items */
```

### space-evenly
```css
.container {
  display: flex;
  justify-content: space-evenly;
}
/* Resultado: |  1   2   3   4  | */
/* Todos os espacos sao identicos */
```

## Com row-reverse

```css
.container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
}
/* Resultado: |              4 3 2 1| */
/* flex-start agora e a DIREITA porque o eixo foi invertido */
```

```css
.container {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
}
/* Resultado: |4 3 2 1              | */
/* flex-end agora e a ESQUERDA */
```

## Com column — altura obrigatoria

```css
/* NAO FUNCIONA — sem altura definida */
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* Items empilhados sem espaco — container nao tem altura sobrando */

/* FUNCIONA — com altura definida */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
}
/* Items distribuidos verticalmente com espaco entre eles */
```

## Variacoes praticas

### Navbar classica
```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}
```
```html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
</nav>
```

### Cards centralizados
```css
.card-grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
```

### Footer com colunas distribuidas
```css
.footer {
  display: flex;
  justify-content: space-evenly;
  padding: 2rem;
}
```

### Botoes alinhados ao final
```css
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
```