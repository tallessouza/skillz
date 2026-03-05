# Code Examples: CSS Animations & Transitions — Projeto LP de Patins

## Animacao de Entrada — Hero Section

### Basico: Fade + Slide Up
```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  animation: fadeSlideUp 0.8s ease-out forwards;
}

.hero-subtitle {
  animation: fadeSlideUp 0.8s ease-out 0.2s forwards;
  opacity: 0; /* estado inicial antes da animacao comecar */
}

.hero-image {
  animation: fadeSlideUp 0.8s ease-out 0.4s forwards;
  opacity: 0;
}
```

### Variacao: Entrada lateral
```css
@keyframes slideFromLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Stagger com delay incremental
```css
.hero-element:nth-child(1) { animation-delay: 0s; }
.hero-element:nth-child(2) { animation-delay: 0.15s; }
.hero-element:nth-child(3) { animation-delay: 0.3s; }
.hero-element:nth-child(4) { animation-delay: 0.45s; }
```

## Transicao de Hover — Underline Animado

### Underline da esquerda para direita
```css
.nav-link {
  position: relative;
  text-decoration: none;
  color: #fff;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #fff;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

### Variacao: Underline do centro para fora
```css
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #fff;
  transition: width 0.3s ease, left 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
  left: 0;
}
```

### Hover em cards de produto
```css
.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.product-card img {
  transition: transform 0.4s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}
```

## Animacao de Scroll — IntersectionObserver

### CSS para os estados
```css
.scroll-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Variacao: entrada da esquerda */
.scroll-reveal-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.scroll-reveal-left.visible {
  opacity: 1;
  transform: translateX(0);
}
```

### JavaScript com IntersectionObserver
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // anima apenas uma vez
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.scroll-reveal, .scroll-reveal-left')
  .forEach(element => observer.observe(element));
```

### Stagger em lista de imagens no scroll
```css
.gallery-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.gallery-item.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Delay incremental via CSS custom property */
.gallery-item:nth-child(1) { transition-delay: 0s; }
.gallery-item:nth-child(2) { transition-delay: 0.1s; }
.gallery-item:nth-child(3) { transition-delay: 0.2s; }
.gallery-item:nth-child(4) { transition-delay: 0.3s; }
```

## Acessibilidade: prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Estrutura HTML tipica para o projeto

```html
<!-- Hero com animacoes de entrada -->
<section class="hero">
  <h1 class="hero-title">Patins Collection</h1>
  <p class="hero-subtitle">Descricao do produto</p>
  <img class="hero-image" src="patins.png" alt="Patins">
</section>

<!-- Navegacao com hover transitions -->
<nav>
  <a href="#" class="nav-link">Home</a>
  <a href="#" class="nav-link">Produtos</a>
  <a href="#" class="nav-link">Contato</a>
</nav>

<!-- Galeria com scroll animations -->
<section class="gallery">
  <img class="scroll-reveal gallery-item" src="img1.png" alt="">
  <img class="scroll-reveal gallery-item" src="img2.png" alt="">
  <img class="scroll-reveal gallery-item" src="img3.png" alt="">
</section>
```