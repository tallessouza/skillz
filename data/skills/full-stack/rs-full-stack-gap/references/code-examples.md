# Code Examples: CSS Gap

## Exemplo 1: Gap básico uniforme

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}
```

Resultado: 20px entre todas as linhas e colunas.

## Exemplo 2: Apenas row-gap

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 30px;
}
```

Resultado: 30px entre as linhas, 0px entre as colunas. Elementos na mesma linha ficam "juntinhos".

## Exemplo 3: Apenas column-gap

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 20px;
}
```

Resultado: 20px entre as colunas, 0px entre as linhas.

## Exemplo 4: Layout com grid-template-areas + gap

### Layout A (do instrutor)

```css
.container {
  display: grid;
  grid-template-areas:
    "a a"
    "b b"
    "c d";
  gap: 20px;
}

.section-a { grid-area: a; }
.section-b { grid-area: b; }
.section-c { grid-area: c; }
.section-d { grid-area: d; }
```

Observação: o `column-gap` não é visível nas linhas de `a` e `b` porque eles ocupam as duas colunas. Só é visível entre `c` e `d`.

## Exemplo 5: Layout "even" com gap + padding

```css
.app {
  display: grid;
  grid-template-areas:
    "a a"
    "b b"
    "c d";
  gap: 30px;
  padding: 30px;
  box-sizing: border-box;
  height: 100vh;
}
```

Resultado: espaçamento uniforme de 30px em todos os lados — entre elementos e nas bordas do container. Layout limpo, sem scroll.

## Exemplo 6: Gap com flexbox

```css
.nav {
  display: flex;
  gap: 16px;
}

.nav-item {
  /* sem margin necessário */
}
```

Gap funciona em flex containers da mesma forma que em grid.

## Exemplo 7: Gap shorthand com valores diferentes

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px 16px; /* 40px entre linhas, 16px entre colunas */
}
```

Equivalente a:

```css
.container {
  row-gap: 40px;
  column-gap: 16px;
}
```

## Variações de uso real

### Card grid

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
  box-sizing: border-box;
}
```

### Sidebar layout

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
  height: 100vh;
}
```

### Form fields

```css
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```