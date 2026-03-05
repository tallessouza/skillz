# Code Examples: Alinhamentos Self no CSS Grid

## Setup base do grid

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  height: 400px;
}

.grid-item {
  background: #ccc;
  padding: 20px;
}
```

## Exemplo 1: align-self isolado

```css
/* Segundo item alinhado ao topo da celula */
.grid-item:nth-child(2) {
  align-self: start;
}

/* Segundo item centralizado verticalmente */
.grid-item:nth-child(2) {
  align-self: center;
}

/* Segundo item no fundo da celula */
.grid-item:nth-child(2) {
  align-self: end;
}
```

## Exemplo 2: justify-self isolado

```css
/* Item centralizado horizontalmente */
.grid-item:nth-child(2) {
  justify-self: center;
}

/* Item a direita da celula */
.grid-item:nth-child(2) {
  justify-self: end;
}
```

## Exemplo 3: Combinando ambos os eixos

```css
/* Item no canto inferior central (da aula) */
.grid-item:nth-child(2) {
  align-self: end;
  justify-self: center;
}

/* Item no canto inferior esquerdo (da aula) */
.grid-item:nth-child(2) {
  align-self: end;
  justify-self: start;
}
```

## Exemplo 4: place-self shorthand

```css
/* Centralizado em ambos os eixos */
.grid-item:nth-child(2) {
  place-self: center center;
}

/* Equivalente a um unico valor quando iguais */
.grid-item:nth-child(2) {
  place-self: center;
}

/* Inferior direito */
.grid-item:nth-child(2) {
  place-self: end end;
}

/* Superior central */
.grid-item:nth-child(2) {
  place-self: start center;
}
```

## Exemplo 5: Todos os 9 posicionamentos possiveis

```css
/* Linha 1 */
.pos-top-left     { place-self: start start; }
.pos-top-center   { place-self: start center; }
.pos-top-right    { place-self: start end; }

/* Linha 2 */
.pos-mid-left     { place-self: center start; }
.pos-mid-center   { place-self: center center; }
.pos-mid-right    { place-self: center end; }

/* Linha 3 */
.pos-bot-left     { place-self: end start; }
.pos-bot-center   { place-self: end center; }
.pos-bot-right    { place-self: end end; }
```

## Exemplo 6: Combinando items (container) com self (item)

```css
/* Padrao: todos centralizados */
.grid-container {
  align-items: center;
  justify-items: center;
}

/* Excecao: primeiro item no canto superior esquerdo */
.grid-item:first-child {
  align-self: start;
  justify-self: start;
}

/* Excecao: ultimo item no canto inferior direito */
.grid-item:last-child {
  place-self: end end;
}
```

## Valores aceitos

| Valor | align-self (Y) | justify-self (X) |
|-------|----------------|-------------------|
| `start` | Topo da celula | Esquerda da celula |
| `center` | Centro vertical | Centro horizontal |
| `end` | Fundo da celula | Direita da celula |
| `stretch` | Ocupa toda altura (padrao) | Ocupa toda largura (padrao) |