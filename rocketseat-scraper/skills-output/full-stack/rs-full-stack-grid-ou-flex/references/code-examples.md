# Code Examples: Grid ou Flex

## Exemplo 1: Menu horizontal (da aula)

### Com Flex (recomendado para este caso)

```css
.nav {
  display: flex;
  gap: 8px;
}
```

```html
<nav class="nav">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

### Com Grid (funciona, mas mais verboso)

```css
.nav {
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  gap: 16px;
}
```

Mesmo resultado visual, mas 4 propriedades ao inves de 2.

## Exemplo 2: Layout com sidebar (Grid e o obvio)

### Com Grid (recomendado)

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #1a1a2e;
}

.content {
  padding: 2rem;
}
```

### Com Flex (funciona, mas menos expressivo)

```css
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  background: #1a1a2e;
}

.content {
  flex: 1;
  padding: 2rem;
}
```

Ambos funcionam, mas Grid expressa a intencao de "colunas" mais claramente.

## Exemplo 3: Toolbar com acoes (Flex)

```css
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-spacer {
  flex: 1;
}
```

```html
<div class="toolbar">
  <button>Save</button>
  <button>Edit</button>
  <div class="toolbar-spacer"></div>
  <button>Settings</button>
</div>
```

O `flex: 1` no spacer empurra o ultimo botao para a direita. Com Grid isso exigiria `grid-template-columns` com fractions ou areas nomeadas — mais codigo.

## Exemplo 4: Galeria de cards (ambos funcionam bem)

### Com Grid

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

### Com Flex

```css
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.gallery-card {
  flex: 1 1 280px;
  max-width: 400px;
}
```

Neste caso Grid e mais limpo porque `auto-fill` + `minmax` faz o responsivo automaticamente, sem precisar de `max-width` no filho.

## Exemplo 5: Centralizacao (Flex ou Grid, igualmente simples)

```css
/* Flex */
.center-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Grid */
.center-grid {
  display: grid;
  place-items: center;
}
```

Grid ganha por 1 propriedade a menos (`place-items` e shorthand). Ambos sao perfeitamente aceitaveis.