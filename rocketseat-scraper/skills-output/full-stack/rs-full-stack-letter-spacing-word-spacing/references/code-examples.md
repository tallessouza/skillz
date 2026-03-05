# Code Examples: Letter Spacing e Word Spacing

## Letter Spacing — Valores demonstrados na aula

```css
/* Valor em pixels — absoluto */
.example-px {
  letter-spacing: 2px;
}

/* Valor em rem — o instrutor mostrou que é "agressivo" */
.example-rem {
  letter-spacing: 1rem;
}

/* Valor sutil recomendado */
.example-subtle {
  letter-spacing: 0.05em;
}
```

## Word Spacing — Valores demonstrados na aula

```css
/* Valor em pixels */
.example-word-px {
  word-spacing: 2px;
}

/* Valor em rem — espaços bem maiores */
.example-word-rem {
  word-spacing: 1rem;
}

/* Valores numéricos demonstrados: 4, 20, 40 */
.example-word-numeric-4 {
  word-spacing: 4px;
}
.example-word-numeric-20 {
  word-spacing: 20px;
}
.example-word-numeric-40 {
  word-spacing: 40px;
}
```

## Padrões recomendados para produção

### Heading uppercase com letter-spacing
```css
.section-title {
  text-transform: uppercase;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}
```

### Subtítulo com spacing leve
```css
.subtitle {
  font-size: 1.25rem;
  letter-spacing: 0.02em;
  word-spacing: 0.05em;
}
```

### Resetando spacing herdado
```css
.parent {
  letter-spacing: 0.1em;
}

.parent .child-normal {
  letter-spacing: normal;
  word-spacing: normal;
}
```

### Combinação com outras propriedades de texto
```css
.styled-text {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: 0.01em;
  word-spacing: 0.05em;
  color: #333;
}
```

### Exemplo negativo (aproximar caracteres)
```css
/* Use com extremo cuidado — pode tornar ilegível */
.tight-heading {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}
```

### Variações por breakpoint
```css
.responsive-heading {
  letter-spacing: 0.02em;
}

@media (min-width: 768px) {
  .responsive-heading {
    letter-spacing: 0.05em;
  }
}
```