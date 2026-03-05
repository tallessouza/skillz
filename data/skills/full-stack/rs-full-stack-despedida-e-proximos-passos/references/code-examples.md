# Code Examples: Referência de Funções CSS por Categoria

## Exemplos por família de funções

Esta aula não apresentou código específico — é uma aula de encerramento e orientação de estudo. Os exemplos abaixo ilustram as famílias de funções mencionadas pelo instrutor para servir como ponto de partida.

### Funções de Transformação

```css
/* Básicas (vistas no curso) */
.element {
  transform: translate(50px, 100px);
  transform: rotate(45deg);
  transform: scale(1.5);
}

/* Avançadas (para explorar) */
.element-3d {
  transform: perspective(500px) rotateY(45deg);
  transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  transform: translate3d(10px, 20px, 30px);
}
```

### Funções Matemáticas

```css
/* Básicas (vistas no curso) */
.container {
  width: calc(100% - 2rem);
  font-size: clamp(1rem, 2.5vw, 2rem);
  width: min(90%, 1200px);
}

/* Avançadas (para explorar) */
.advanced {
  /* Trigonométricas */
  transform: rotate(atan2(1, 1));
  width: calc(sin(45deg) * 100px);

  /* Exponenciais */
  font-size: pow(2, 3); /* experimental */
  opacity: sqrt(0.25);  /* experimental */
}
```

### Funções de Filtro

```css
/* Vistas no curso */
.image {
  filter: blur(5px);
  filter: brightness(1.2);
  filter: contrast(1.5);
  filter: grayscale(100%);
}

/* Para explorar */
.image-advanced {
  filter: sepia(60%) saturate(1.5);
  filter: hue-rotate(90deg);
  filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.5));
  backdrop-filter: blur(10px);
}
```

### Funções de Cor

```css
/* Vistas no curso (2-3) */
.text {
  color: rgb(255, 100, 50);
  background: hsl(210, 80%, 50%);
}

/* Para explorar — muitas opções */
.text-advanced {
  color: oklch(70% 0.15 200);
  color: oklab(70% -0.05 0.1);
  color: hwb(210 10% 20%);
  color: color(display-p3 0.5 0.8 0.2);
  background: color-mix(in oklch, blue 60%, red);
  color: light-dark(#333, #ccc);
}
```

### Funções de Gradient

```css
/* Vistas no curso (2) */
.bg {
  background: linear-gradient(to right, red, blue);
  background: radial-gradient(circle, red, blue);
}

/* Para explorar */
.bg-advanced {
  background: conic-gradient(from 45deg, red, yellow, green, blue, red);
  background: repeating-linear-gradient(45deg, red 0px, red 10px, blue 10px, blue 20px);
  background: repeating-radial-gradient(circle, red 0px, red 10px, blue 10px, blue 20px);
}
```

### Funções de Referência

```css
/* Quase todas vistas no curso */
:root {
  --primary: #3490dc;
}

.element {
  color: var(--primary);
  content: attr(data-label);
  background: url('/images/bg.png');
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Funções de Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-template-columns: fit-content(300px) 1fr fit-content(300px);
}
```

### Funções de Contador

```css
body {
  counter-reset: section;
}

h2::before {
  counter-increment: section;
  content: counter(section) ". ";
}

/* Contadores aninhados */
ol {
  counter-reset: item;
  list-style: none;
}

li::before {
  counter-increment: item;
  content: counters(item, ".") " ";
}
```

### Funções de Animação

```css
.animated {
  /* Curva de timing personalizada */
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Steps para animação frame-a-frame */
  animation: sprite 1s steps(8) infinite;

  /* Linear com pontos de controle */
  animation-timing-function: linear(0, 0.5 25%, 1);
}
```

### Verificando compatibilidade (fluxo do DevDocs)

```
1. Acessar: https://devdocs.io/css/css_functions
2. Buscar a função desejada (ex: "color-mix")
3. Rolar até "Browser compatibility"
4. Verde = suporte ✓
5. Vermelho/vazio = sem suporte ✗
6. Flag = experimental ⚠
```