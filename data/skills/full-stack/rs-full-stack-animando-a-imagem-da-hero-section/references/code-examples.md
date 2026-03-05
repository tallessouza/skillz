# Code Examples: Animacao de Entrada da Hero Section

## Estrutura HTML

```html
<section class="hero">
  <!-- Lado esquerdo: texto -->
  <div>
    <h1>Titulo do Hero</h1>
    <p>Descricao</p>
    <div class="buttons">...</div>
  </div>

  <!-- Lado direito: imagens animadas -->
  <div>
    <div class="content">
      <img src="./assets/hero/elipse.svg" alt="Elipse">
      <img src="./assets/hero/patins.png" alt="Patins">
      <img src="./assets/hero/stars-1.svg" alt="Stars 1">
      <img src="./assets/hero/stars-2.svg" alt="Stars 2">
    </div>
  </div>
</section>
```

## CSS Completo — Container

```css
/* Hero layout */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Container da imagem (segundo filho) */
.hero > div:nth-child(2) {
  display: block;
  width: 100%;
  max-width: 30.5rem;
  height: 30.5rem;
  overflow: hidden;
}

/* Content wrapper */
.hero .content {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Todas as imagens dentro do content */
.hero .content img {
  position: absolute;
  width: 100%;
}
```

## CSS Completo — Posicionamento dos Elementos

```css
/* Elipse (bolinha azul de fundo) */
.hero .content img[src*="elipse"] {
  width: 94%;
  top: 3%;
  left: 3%;
  transform: translateX(200%);
  animation: slideIn 3s 200ms ease forwards;
}

/* Patins (elemento principal, por cima) */
.hero .content img[src*="patins"] {
  z-index: 1;
  transform: translateX(200%);
  animation: slideIn 3s ease forwards;
}

/* Stars 1 (estrelinha maior) */
.hero .content img[src*="stars-1"] {
  max-width: 5.5rem;
  top: 30%;
  z-index: 0;
  opacity: 0;
  transform: translateX(400%);
  animation: slideIn 2s 800ms ease forwards,
             appear 100ms 800ms both;
}

/* Stars 2 (estrelinha menor) */
.hero .content img[src*="stars-2"] {
  max-width: 2.5rem;
  right: 0;
  bottom: 35%;
  transform: translateX(400px);
  animation: slideIn 2.2s 800ms ease forwards;
}
```

## CSS Completo — Keyframes

```css
@keyframes slideIn {
  50% {
    transform: translateX(-20px); /* overshoot */
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes appear {
  to {
    opacity: 1;
  }
}
```

## Variacao: Delay entre secoes (texto apos imagem)

```css
/* Animacao do lado esquerdo do hero (texto) */
.hero > div:nth-child(1) {
  animation: heroTextEntry 5s 2s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes heroTextEntry {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Variacao: Entrada pela esquerda

```css
/* Trocar translateX positivo por negativo para entrar pela esquerda */
.element-from-left {
  transform: translateX(-200%);
  animation: slideInFromLeft 3s ease forwards;
}

@keyframes slideInFromLeft {
  50% {
    transform: translateX(20px); /* overshoot para direita */
  }
  100% {
    transform: translateX(0);
  }
}
```

## Variacao: Entrada de baixo para cima

```css
.element-from-bottom {
  transform: translateY(200%);
  animation: slideUp 3s ease forwards;
}

@keyframes slideUp {
  50% {
    transform: translateY(-10px); /* overshoot para cima */
  }
  100% {
    transform: translateY(0);
  }
}
```

## Variacao: Escala + Slide combinados

```css
.element-scale-slide {
  transform: translateX(200%) scale(0.8);
  opacity: 0;
  animation: scaleSlideIn 2.5s ease forwards;
}

@keyframes scaleSlideIn {
  50% {
    transform: translateX(-10px) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}
```

## Debug temporario

```css
/* Use durante desenvolvimento, remova depois */
html {
  zoom: 0.5; /* ver pagina inteira */
}

.hero .content {
  border: 2px solid black; /* visualizar limites */
}

.hero > div:nth-child(2) {
  border: 2px solid pink; /* visualizar container */
}
```

## Responsividade (dica do instrutor)

```css
@media (max-width: 768px) {
  .hero {
    flex-direction: column-reverse;
  }

  .hero > div:nth-child(2) {
    max-width: 100%;
    height: 20rem;
  }
}
```

## Tabela de Timing (resumo visual)

```
Tempo:  0ms    200ms   800ms   2000ms  3000ms
        |       |       |       |       |
Patins: [=============================>]  3s, delay 0
Elipse: ..[===========================>]  3s, delay 200ms
Stars1: ........[===============>]          2s, delay 800ms
Stars2: ........[=================>]        2.2s, delay 800ms
Appear: ........[>]                         100ms, delay 800ms
```