# Code Examples: Evolucao dos Media Queries

## Range Syntax — comparacao completa

### Sintaxe classica (Level 4)
```css
/* Largura minima */
@media (min-width: 768px) {
  .container { max-width: 720px; }
}

/* Largura maxima */
@media (max-width: 767px) {
  .container { padding: 1rem; }
}

/* Faixa (range) */
@media (min-width: 768px) and (max-width: 1024px) {
  .container { max-width: 960px; }
}
```

### Range Syntax (Level 5)
```css
/* Largura minima */
@media (width >= 768px) {
  .container { max-width: 720px; }
}

/* Largura maxima */
@media (width < 768px) {
  .container { padding: 1rem; }
}

/* Faixa (range) */
@media (768px <= width <= 1024px) {
  .container { max-width: 960px; }
}
```

### Operadores disponiveis
```css
@media (width > 600px) { }   /* maior que */
@media (width >= 600px) { }  /* maior ou igual */
@media (width < 600px) { }   /* menor que */
@media (width <= 600px) { }  /* menor ou igual */
@media (400px <= width <= 800px) { }  /* entre */
```

## prefers-color-scheme

### Implementacao basica de dark mode
```css
/* Tema claro (padrao) */
:root {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
  --border-color: #e5e5e5;
}

/* Tema escuro — ativado automaticamente pelo SO */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #f5f5f5;
    --border-color: #333333;
  }
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

## Combinando Range Syntax com outras features

```css
/* Mobile em dark mode */
@media (width < 768px) and (prefers-color-scheme: dark) {
  .card {
    background: #2a2a2a;
    padding: 0.75rem;
  }
}

/* Desktop em light mode */
@media (width >= 1024px) and (prefers-color-scheme: light) {
  .card {
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

## Breakpoints com Range Syntax — sistema completo

```css
/* Mobile first */
.container { width: 100%; padding: 1rem; }

/* Tablet */
@media (width >= 640px) {
  .container { max-width: 640px; margin: 0 auto; }
}

/* Desktop */
@media (width >= 1024px) {
  .container { max-width: 960px; }
}

/* Wide */
@media (width >= 1280px) {
  .container { max-width: 1200px; }
}
```

## Fallback pattern para browsers antigos

```css
/* Fallback — funciona em todos os browsers */
@media (min-width: 768px) {
  .sidebar { display: block; }
}

/* Override moderno — browsers que suportam Range ignoram o de cima por especificidade igual (ultimo vence se mesmo seletor) */
@media (width >= 768px) {
  .sidebar { display: block; }
}
```

Na pratica, como ambos produzem o mesmo resultado, basta usar Range Syntax diretamente se seu publico usa browsers modernos (verificar no caniuse).