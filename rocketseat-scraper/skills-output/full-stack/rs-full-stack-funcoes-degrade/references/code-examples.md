# Code Examples: Funções Degradê CSS

## Linear gradient — todas as variações da aula

### Com ângulo em graus

```css
/* 90 graus: esquerda para direita */
.example-1 {
  background: linear-gradient(90deg, red, blue);
}

/* 0 graus: baixo para cima */
.example-2 {
  background: linear-gradient(0deg, red, blue);
}

/* 180 graus: cima para baixo (padrão) */
.example-3 {
  background: linear-gradient(180deg, red, blue);
}

/* 45 graus: diagonal */
.example-4 {
  background: linear-gradient(45deg, red, blue);
}
```

### Com keyword de direção

```css
/* Equivalente a 90deg */
.example-5 {
  background: linear-gradient(to right, red, blue);
}

/* Diagonal */
.example-6 {
  background: linear-gradient(to top right, red, blue);
}
```

### Com ponto de transição

```css
/* 80% vermelho sólido, transição rápida para azul */
.example-7 {
  background: linear-gradient(90deg, red 80%, blue);
}

/* Divisão sólida sem transição */
.example-8 {
  background: linear-gradient(90deg, red 50%, blue 50%);
}

/* Três cores com stops customizados */
.example-9 {
  background: linear-gradient(90deg, red 30%, yellow 60%, blue);
}
```

## Radial gradient — todas as variações da aula

### Básico

```css
/* Centro para bordas, distribuição uniforme */
.example-10 {
  background-image: radial-gradient(red, blue);
}
```

### Com porcentagem

```css
/* 50% vermelho sólido no centro */
.example-11 {
  background-image: radial-gradient(red 50%, blue);
}
```

## Aplicações práticas (extrapolações)

### Hero section com overlay gradiente

```css
.hero {
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)),
    url('hero-image.jpg') center/cover;
}
```

### Botão com efeito de profundidade

```css
.button {
  background: radial-gradient(circle at 30% 30%, #5b86e5, #36d1dc);
}
```

### Fundo com gradiente sutil

```css
.page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
```

### Listras CSS (sem transição)

```css
.stripes {
  background: linear-gradient(
    90deg,
    #ff6b6b 33.33%,
    #feca57 33.33% 66.66%,
    #48dbfb 66.66%
  );
}
```