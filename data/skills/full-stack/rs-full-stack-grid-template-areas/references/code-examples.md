# Code Examples: Grid Template Areas

## Exemplo 1: Layout com letras (A, B, C, D)

Demonstração inicial do conceito com áreas genéricas.

```css
.app {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-areas:
    "A B B"
    "A C D";
}

.item-a { grid-area: A; }
.item-b { grid-area: B; }
.item-c { grid-area: C; }
.item-d { grid-area: D; }
```

**Resultado visual:**
```
┌─────┬───────────┐
│     │     B     │
│  A  ├─────┬─────┤
│     │  C  │  D  │
└─────┴─────┴─────┘
```

- A: ocupa coluna 1, linhas 1-2
- B: ocupa colunas 2-3, linha 1
- C: coluna 2, linha 2
- D: coluna 3, linha 2

## Exemplo 2: Layout semântico (header, main, aside, footer)

Layout clássico de página web com regiões nomeadas.

```css
.app {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-areas:
    "header header header"
    "main   main   aside"
    "footer footer footer";
}

.app-header { grid-area: header; }
.app-main   { grid-area: main; }
.app-aside  { grid-area: aside; }
.app-footer { grid-area: footer; }
```

**Resultado visual:**
```
┌─────────────────────┐
│       header        │
├──────────────┬──────┤
│              │      │
│     main     │aside │
│              │      │
├──────────────┴──────┤
│       footer        │
└─────────────────────┘
```

## Exemplo 3: Comparação — mesmo layout, duas abordagens

### Com grid-column / grid-row (posicionamento por linhas):

```css
.app {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}

.app-header {
  grid-column: 1 / 4;
  grid-row: 1;
}

.app-main {
  grid-column: 1 / 3;
  grid-row: 2;
}

.app-aside {
  grid-column: 3;
  grid-row: 2;
}

.app-footer {
  grid-column: 1 / 4;
  grid-row: 3;
}
```

### Com grid-template-areas:

```css
.app {
  display: grid;
  grid-template-areas:
    "header header header"
    "main   main   aside"
    "footer footer footer";
}

.app-header { grid-area: header; }
.app-main   { grid-area: main; }
.app-aside  { grid-area: aside; }
.app-footer { grid-area: footer; }
```

**Mesmo resultado visual, menos código, mais legível.**

## Exemplo 4: Variação — layout com sidebar à esquerda

```css
.app {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar main   main"
    "footer  footer  footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

```
┌─────────────────────┐
│       header        │
├──────┬──────────────┤
│      │              │
│ side │     main     │
│      │              │
├──────┴──────────────┤
│       footer        │
└─────────────────────┘
```

## Exemplo 5: Variação — dashboard com múltiplas áreas

```css
.dashboard {
  display: grid;
  grid-template-areas:
    "nav    nav    nav"
    "stats  stats  alerts"
    "chart  table  alerts";
  gap: 1rem;
}

.nav    { grid-area: nav; }
.stats  { grid-area: stats; }
.alerts { grid-area: alerts; }
.chart  { grid-area: chart; }
.table  { grid-area: table; }
```

```
┌─────────────────────┐
│        nav          │
├──────────────┬──────┤
│    stats     │      │
├───────┬──────┤alerts│
│ chart │table │      │
└───────┴──────┴──────┘
```

## Exemplo 6: Célula vazia com ponto (.)

Para deixar uma célula vazia no grid, use `.`:

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    ".      main   aside"
    "footer footer footer";
}
```

```
┌─────────────────────┐
│       header        │
├──────┬───────┬──────┤
│(vazio)│ main │aside │
├──────┴───────┴──────┤
│       footer        │
└─────────────────────┘
```

## Exemplo 7: Combinando com sizing explícito

Quando as frações iguais não são suficientes:

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas:
    "header header header"
    "sidebar main  main"
    "footer  footer footer";
}
```

Aqui `grid-template-columns` e `grid-template-rows` controlam o tamanho, enquanto `grid-template-areas` controla o posicionamento.