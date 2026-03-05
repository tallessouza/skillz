# Code Examples: Footer com Animações CSS

## Exemplo completo: Footer CSS

### HTML

```html
<footer>
  <div class="logo">
    <img src="assets/logo.svg" alt="Sneetap logo">
    <span>Sneetap</span>
  </div>

  <nav>
    <a href="#">Sobre</a>
    <a href="#">Nossas lojas</a>
    <a href="#">Política de privacidade</a>
  </nav>

  <div class="social-links">
    <a href="#" title="Instagram">
      <img src="assets/icons/instagram.svg" alt="">
    </a>
    <a href="#" title="Facebook">
      <img src="assets/icons/facebook.svg" alt="">
    </a>
    <a href="#" title="YouTube">
      <img src="assets/icons/youtube.svg" alt="">
    </a>
    <a href="#" title="TikTok">
      <img src="assets/icons/tiktok.svg" alt="">
    </a>
  </div>
</footer>
```

### CSS completo

```css
/* === Footer container === */
footer {
  max-width: 80rem;
  width: 100%;
  padding: 4rem 2rem 2rem;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* === Logo === */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.3rem;
  font-family: "Cine", sans-serif;
}

.logo img {
  width: 2rem;
  transition: rotate 350ms;
}

.logo img:hover {
  rotate: 90deg;
  /* Fallback for older browsers: */
  /* transform: rotate(90deg); */
}

/* === Navigation === */
nav {
  display: flex;
  gap: 2rem;
}

nav a {
  position: relative;
  width: fit-content;
}

nav a::after {
  content: "";
  width: 100%;
  height: 2px;
  background-color: var(--sniptap-sky-mid);
  position: absolute;
  bottom: 0;
  left: 0;
  transform: scaleX(0);
  opacity: 0;
  transition: transform 200ms linear;
}

nav a:hover::after {
  transform: scaleX(1);
  opacity: 1;
}

/* === Social Links === */
.social-links {
  display: flex;
  align-items: center;
}

.social-links a {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5rem;
  position: relative;
}

.social-links a::before {
  content: "";
  width: inherit;
  height: inherit;
  border-radius: inherit;
  background-color: var(--sniptap-sun);
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  transform: scale(0);
  transition: scale 200ms;
}

.social-links a:hover::before {
  transform: scale(1);
}

.social-links a img {
  width: 1.5rem;
  height: auto;
}
```

## Variação: Underline grow from left

```css
nav a::after {
  content: "";
  width: 100%;
  height: 2px;
  background-color: var(--accent);
  position: absolute;
  bottom: 0;
  left: 0;
  transform: scaleX(0);
  transform-origin: left; /* muda: cresce da esquerda */
  transition: transform 200ms ease-out;
}

nav a:hover::after {
  transform: scaleX(1);
}
```

## Variação: Underline grow from right to left on mouse leave

```css
nav a::after {
  transform-origin: right; /* sai pela direita */
  transition: transform 200ms ease-out;
}

nav a:hover::after {
  transform: scaleX(1);
  transform-origin: left; /* entra pela esquerda */
}
```

## Variação: Circle reveal com cor diferente por rede social

```css
.social-links a.instagram:hover::before {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.social-links a.facebook:hover::before {
  background-color: #1877f2;
}

.social-links a.youtube:hover::before {
  background-color: #ff0000;
}

.social-links a.tiktok:hover::before {
  background-color: #010101;
}
```

## Variação: Logo com bounce ao invés de rotate

```css
.logo img {
  width: 2rem;
  transition: transform 300ms ease;
}

.logo img:hover {
  transform: scale(1.2) rotate(10deg);
}
```

## Padrão reutilizável: Reveal com pseudo-elemento

```css
/* Base pattern for any element that reveals on hover */
.reveal-parent {
  position: relative;
}

.reveal-parent::before {
  content: "";
  position: absolute;
  inset: 0; /* shorthand for top/right/bottom/left: 0 */
  border-radius: inherit;
  background-color: var(--reveal-color);
  z-index: -1;
  transform: scale(0);
  transition: transform 200ms ease;
}

.reveal-parent:hover::before {
  transform: scale(1);
}
```