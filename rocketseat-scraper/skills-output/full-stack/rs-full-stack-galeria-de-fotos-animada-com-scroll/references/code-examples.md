# Code Examples: Galeria de Fotos Animada com Scroll

## HTML completo da galeria

```html
<section class="gallery">
  <header>
    <span>Galeria de fotos</span>
    <h2>#use snitap por aí</h2>
  </header>

  <div class="content">
    <figure>
      <img src="assets/images/01.png" alt="Foto 1">
      <figcaption>
        <img src="assets/images/person.png" alt="Avatar">
        <span>@lavinia.pereira</span>
      </figcaption>
    </figure>

    <figure data-delay>
      <img src="assets/images/02.png" alt="Foto 2">
      <figcaption>
        <img src="assets/images/person.png" alt="Avatar">
        <span>@lavinia.pereira</span>
      </figcaption>
    </figure>

    <figure>
      <img src="assets/images/03.png" alt="Foto 3">
      <figcaption>
        <img src="assets/images/person.png" alt="Avatar">
        <span>@lavinia.pereira</span>
      </figcaption>
    </figure>

    <figure data-delay>
      <img src="assets/images/04.png" alt="Foto 4">
      <figcaption>
        <img src="assets/images/person.png" alt="Avatar">
        <span>@lavinia.pereira</span>
      </figcaption>
    </figure>
  </div>
</section>
```

## CSS completo — gallery.css

```css
/* === Section container === */
.gallery {
  width: 100%;
  max-width: 80rem;
  padding: 2.5rem 2rem;
  margin-inline: auto;
}

/* === Header === */
.gallery header {
  text-align: center;
}

.gallery header span {
  font: 500 var(--text-sm) / 1.5 var(--ff-base);
}

/* === Content grid === */
.gallery .content {
  margin-top: 2rem;
  display: grid;
  grid-template-areas:
    "a b b"
    "c c d";
  gap: 2.5rem;
}

/* === Grid area assignment === */
.gallery .content figure:nth-child(1) { grid-area: a; }
.gallery .content figure:nth-child(2) { grid-area: b; }
.gallery .content figure:nth-child(3) { grid-area: c; }
.gallery .content figure:nth-child(4) { grid-area: d; }

/* === Figure base === */
.gallery figure {
  position: relative;
  border-radius: 2.5rem;
  overflow: hidden;
  line-height: 0;

  /* Scroll-driven animation */
  animation: image-appear linear backwards;
  animation-timeline: view();
  animation-range: 100px 350px;
}

/* === Stagger delay para elementos alternados === */
.gallery figure[data-delay] {
  animation-range: 150px 400px;
}

/* === Imagens dentro do figure === */
.gallery figure > img {
  width: 100%;
  height: 25rem;
  object-fit: cover;
  transition: scale 500ms;
}

/* === Todas as imagens do section (reset) === */
.gallery .content img {
  width: 100%;
  height: auto;
}

/* === Figcaption overlay === */
.gallery figcaption {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1.5rem 2rem;
  background: linear-gradient(to top, rgb(0 0 0 / 0.64), rgb(0 0 0 / 0));
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  font: 500 var(--text-sm) / 1.5 var(--ff-base);
  color: white;
  transform: translateY(100%);
  transition: transform 500ms;
}

/* === Avatar no figcaption === */
.gallery figcaption img {
  width: 2rem;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 50%;
}

/* === Hover effects === */
.gallery figure:hover > img {
  scale: 1.1;
}

.gallery figure:hover figcaption {
  transform: translateY(0);
}

/* === Keyframes === */
@keyframes image-appear {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

## Variacoes e cenarios adicionais

### Variacao 1: Grid 3 colunas simetrico

```css
.content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
```

### Variacao 2: Stagger com multiplos niveis de delay

```css
figure[data-delay="1"] { animation-range: 150px 400px; }
figure[data-delay="2"] { animation-range: 200px 450px; }
figure[data-delay="3"] { animation-range: 250px 500px; }
```

### Variacao 3: Fallback com @supports

```css
/* Base — sem animacao (funciona em todos os browsers) */
.gallery figure {
  opacity: 1;
}

/* Progressive enhancement — so aplica se suportado */
@supports (animation-timeline: view()) {
  .gallery figure {
    animation: image-appear linear backwards;
    animation-timeline: view();
    animation-range: 100px 350px;
  }

  .gallery figure[data-delay] {
    animation-range: 150px 400px;
  }
}
```

### Variacao 4: Hover com rotacao sutil

```css
figure:hover > img {
  scale: 1.05;
  rotate: 1deg;
}
```

### Variacao 5: Figcaption entrando pela esquerda

```css
figcaption {
  transform: translateX(-100%);
  transition: transform 500ms;
}

figure:hover figcaption {
  transform: translateX(0);
}
```

### Variacao 6: Keyframe com entrada lateral

```css
@keyframes image-appear-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
}

@keyframes image-appear-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
}

figure:nth-child(odd) {
  animation-name: image-appear-left;
}

figure:nth-child(even) {
  animation-name: image-appear-right;
}
```