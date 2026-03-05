# Code Examples: Flexbox — Container vs Filhos

## 1. flex-flow com um valor (so direction)

```css
.container {
  display: flex;
  flex-flow: column; /* equivale a flex-direction: column; flex-wrap: nowrap */
}
```

## 2. flex-flow com dois valores (direction + wrap)

```css
.container {
  display: flex;
  flex-flow: column wrap; /* flex-direction: column + flex-wrap: wrap */
}
```

## 3. flex-flow so com wrap

```css
.container {
  display: flex;
  flex-flow: wrap; /* flex-direction: row (default) + flex-wrap: wrap */
}
```

## 4. row-gap isolado

```css
.container {
  display: flex;
  flex-wrap: wrap;
  row-gap: 2rem; /* espaco so entre as linhas */
}
```

Resultado: itens na mesma linha ficam colados, mas linhas diferentes tem 2rem de espaco.

## 5. column-gap isolado

```css
.container {
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem; /* espaco so entre as colunas */
}
```

Resultado: itens na mesma linha tem 2rem entre si, mas linhas nao tem espaco extra.

## 6. gap combinado (shorthand)

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem; /* row-gap: 2rem + column-gap: 2rem */
}
```

## 7. gap com valores diferentes

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem 1rem; /* row-gap: 2rem, column-gap: 1rem */
}
```

## 8. align-content com wrap

```css
.container {
  display: flex;
  flex-wrap: wrap;
  height: 500px;
  align-content: center; /* centraliza as linhas no container */
}
```

## 9. align-content SEM wrap (nao funciona)

```css
/* ERRADO — align-content ignorado sem wrap */
.container {
  display: flex;
  height: 500px;
  align-content: center; /* nenhum efeito visual */
}
```

## 10. align-self nos filhos

```css
.container {
  display: flex;
  align-items: center; /* todos centralizados */
  height: 300px;
}

.item-2 {
  align-self: flex-start; /* so este vai para o topo */
}

.item-5 {
  align-self: flex-end; /* so este vai para o fundo */
}
```

## 11. flex-grow controlando esticamento

```css
/* Itens esticam para preencher o container */
.item {
  flex-grow: 1;
}

/* Remover flex-grow = item volta ao tamanho natural */
.item-sem-grow {
  flex-grow: 0; /* ou simplesmente nao declare */
}
```

## 12. Layout completo combinando tudo

```css
.card-grid {
  display: flex;
  flex-flow: row wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: stretch;
}

.card {
  flex: 0 1 300px; /* nao cresce, encolhe, base de 300px */
}

.card--featured {
  flex: 1 1 100%; /* cresce, ocupa linha inteira */
  align-self: center;
}
```

## 13. Debug: item esticando sem querer

```css
/* Problema: item ocupa toda a largura */
.item {
  flex: 1; /* equivale a flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
}

/* Solucao: resetar flex */
.item {
  flex: 0 1 auto; /* nao cresce, encolhe se necessario, tamanho natural */
}
```