# Code Examples: Shorthand grid-template

## Exemplo 1: Apenas areas (sem rows/columns)

```css
/* Shorthand simplificado — so areas */
.container {
  display: grid;
  grid-template:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  gap: 10px;
}
```

Equivalente a:
```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  gap: 10px;
}
```

## Exemplo 2: Areas + rows (sem columns)

```css
.container {
  display: grid;
  grid-template:
    "header header header" 80px
    "sidebar content content" 40px
    "footer footer footer" 50px;
  gap: 10px;
}
```

Equivalente a:
```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  grid-template-rows: 80px 40px 50px;
  gap: 10px;
}
```

## Exemplo 3: Areas + rows + columns (completo)

```css
.container {
  display: grid;
  grid-template:
    "header header header" 80px
    "sidebar content content" 40px
    "footer footer footer" 50px
    / 80px 1fr 2fr;
  gap: 10px;
}
```

Equivalente a:
```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  grid-template-rows: 80px 40px 50px;
  grid-template-columns: 80px 1fr 2fr;
  gap: 10px;
}
```

## Exemplo 4: Rows com unidades mistas

```css
.container {
  display: grid;
  grid-template:
    "nav nav" 60px
    "main aside" 1fr
    "foot foot" auto
    / 3fr 1fr;
}
```

A linha `main` ocupa o espaco restante com `1fr`. A linha `foot` ajusta ao conteudo com `auto`.

## Exemplo 5: Layout de dashboard

```css
.dashboard {
  display: grid;
  height: 100vh;
  grid-template:
    "topbar topbar topbar" 56px
    "sidebar main panel" 1fr
    / 240px 1fr 300px;
  gap: 0;
}

.topbar { grid-area: topbar; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.panel { grid-area: panel; }
```

## Exemplo 6: Verificando no DevTools

Para inspecionar o grid shorthand no navegador:

1. Abra DevTools (F12)
2. Selecione o elemento grid container
3. Clique no badge "grid" ao lado do elemento
4. O overlay mostra:
   - Linhas tracejadas para os gaps
   - Tamanhos de cada track (80px, 1fr, 2fr)
   - Nomes das areas

As propriedades computadas sempre mostram os valores expandidos (`grid-template-rows`, `grid-template-columns`, `grid-template-areas`), mesmo quando voce escreveu shorthand.