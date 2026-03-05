# Code Examples: Grid Column

## Exemplo 1: Setup basico do container

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

/* Border para visualizacao */
.container > * {
  border: 1px solid #333;
}
```

## Exemplo 2: Versao longa (didatica)

```css
/* Primeiro item: ocupa todas as 3 colunas */
div:nth-child(1) {
  grid-column-start: 1;
  grid-column-end: 4;
}
```

Explicacao passo a passo:
- `grid-column-start: 1` → comeca na linha virtual 1 (inicio do grid)
- `grid-column-end: 4` → termina na linha virtual 4 (fim do grid com 3 colunas)
- Resultado: ocupa colunas 1, 2 e 3

## Exemplo 3: Versao shorthand

```css
/* Segundo item: ocupa 2 colunas */
div:nth-child(2) {
  grid-column: 1 / 3;
}

/* Quarto item: ocupa todas as 3 colunas */
div:nth-child(4) {
  grid-column: 1 / 4;
}
```

## Exemplo 4: Layout semantico completo

```html
<div class="container">
  <header>1</header>
  <main>2</main>
  <aside>3</aside>
  <footer>4</footer>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.container > * {
  border: 1px solid #333;
}

header {
  grid-column: 1 / 4;
}

main {
  grid-column: 1 / 3;
}

/* aside: nao precisa de grid-column, fluxo automatico resolve */

footer {
  grid-column: 1 / 4;
}
```

Resultado visual:
```
+--header (colunas 1-3)---+
|                          |
+---------+--------+-------+
|  main   | (col2) | aside |
| (col 1) |        |       |
+---------+--------+-------+
+--footer (colunas 1-3)---+
|                          |
+--------------------------+
```

## Exemplo 5: Variacoes de span

```css
/* Usando span em vez de linha final explicita */
.item { grid-column: span 2; }        /* ocupa 2 colunas a partir da posicao atual */
.item { grid-column: 2 / span 2; }    /* comeca na linha 2, ocupa 2 colunas */

/* Usando -1 para "ate o final" */
.full { grid-column: 1 / -1; }        /* todas as colunas, independente de quantas */
```

## Exemplo 6: Mapeamento linhas virtuais

Para um grid de 3 colunas:

| grid-column | Colunas ocupadas | Linhas virtuais |
|-------------|-----------------|-----------------|
| `1 / 2` | 1 coluna (col 1) | 1→2 |
| `1 / 3` | 2 colunas (col 1-2) | 1→3 |
| `1 / 4` | 3 colunas (col 1-3) | 1→4 |
| `2 / 4` | 2 colunas (col 2-3) | 2→4 |
| `2 / 3` | 1 coluna (col 2) | 2→3 |
| `3 / 4` | 1 coluna (col 3) | 3→4 |