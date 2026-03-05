# Code Examples: CSS Value Functions

## Exemplo basico — estrutura da funcao

```css
/* funcao(argumento) aplicada como VALOR de uma propriedade */
.box {
  /* 1 argumento */
  filter: blur(5px);

  /* 2 argumentos */
  transform: translate(10px, 20px);

  /* 3+ argumentos */
  color: rgb(255, 100, 50);

  /* argumento complexo com operacoes */
  width: calc(100% - 2rem);
}
```

## Por categoria

### Transformacao

```css
.card {
  transform: rotate(15deg);
  transform: scale(1.2);
  transform: translate(50px, 100px);
  /* Multiplas funcoes encadeadas */
  transform: rotate(15deg) scale(1.2) translateX(50px);
}
```

### Matematica

```css
.container {
  width: calc(100vw - 4rem);
  font-size: clamp(1rem, 2.5vw, 2rem);
  padding: min(5vw, 3rem);
  margin: max(1rem, 2vw);
}
```

### Filtros

```css
.image {
  filter: blur(4px);
  filter: brightness(1.2) contrast(1.1);
  filter: grayscale(100%);
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));
}
```

### Cores

```css
.text {
  color: rgb(59, 130, 246);
  background-color: hsl(220, 90%, 56%);
  border-color: rgba(59, 130, 246, 0.5);
  accent-color: oklch(0.7 0.15 250);
}
```

### Degrades

```css
.hero {
  background: linear-gradient(to right, #667eea, #764ba2);
  background: radial-gradient(circle, #fff, #000);
  background: conic-gradient(from 45deg, red, blue, red);
}
```

### Formatos

```css
.avatar {
  clip-path: circle(50%);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  clip-path: inset(10px 20px 30px 40px);
}
```

### Referencia

```css
:root {
  --primary: #3b82f6;
  --spacing: 1rem;
}

.element {
  color: var(--primary);
  padding: var(--spacing);
  /* fallback value */
  background: var(--bg-color, white);
}
```

## Composicao de funcoes

```css
/* Funcoes podem ser aninhadas e compostas */
.responsive-box {
  /* calc() dentro de clamp() */
  width: clamp(300px, calc(50vw - 2rem), 800px);

  /* var() dentro de calc() */
  padding: calc(var(--spacing) * 2);

  /* funcao de cor com var() */
  background: hsl(var(--hue), 90%, 56%);

  /* multiplos filtros */
  filter: blur(2px) brightness(0.8) saturate(1.5);
}
```