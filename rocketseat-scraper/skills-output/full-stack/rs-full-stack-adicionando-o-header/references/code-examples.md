# Code Examples: Header com Animações CSS

## HTML completo do header

```html
<header>
  <a href="#" title="Página inicial">
    <img src="assets/logo.svg" alt="Logo" />
  </a>
  <a href="#" title="Carrinho de compras">
    <img src="assets/icons/shopping-bag.svg" alt="Carrinho" />
    <span>1</span>
  </a>
</header>
```

## CSS completo — header.css

```css
header {
  max-width: 80rem;       /* 1280px */
  width: 100%;
  padding: 1.25rem 2rem;  /* 20px top/bottom, 32px left/right */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

header img {
  width: 2rem;
  height: 2rem;
}

/* Transição base para todas as imagens do header */
header img {
  transition: transform 500ms;
}

/* Logo — gira 90° no hover */
img[src*="logo"]:hover {
  transform: rotate(90deg);
}

/* Shopping bag — balança -30° no hover */
img[src*="shopping"]:hover {
  transform: rotate(-30deg);
}

/* Links sem estilo padrão */
header a {
  position: relative;
  color: inherit;
  text-decoration: none;
}

/* Badge do carrinho */
header span {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 500 0.75rem/1.3 "Inter", sans-serif;
}
```

## CSS global relevante

```css
a {
  color: inherit;
  text-decoration: none;
}
```

## Variações do hover

### Rotação com escala (mais dramático)
```css
img[src*="logo"]:hover {
  transform: rotate(90deg) scale(1.1);
}
```

### Rotação com ease diferente
```css
header img {
  transition: transform 500ms ease-in-out;
}
```

### Rotação contínua (keyframes)
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

img[src*="logo"]:hover {
  animation: spin 1s linear infinite;
}
```

## Variações do badge

### Badge com borda
```css
header span {
  /* ...base styles... */
  border: 2px solid white;
}
```

### Badge escondido quando zero
```css
header span:empty,
header span[data-count="0"] {
  display: none;
}
```

### Badge com animação de entrada
```css
@keyframes pop {
  0% { transform: scale(0); }
  80% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

header span {
  animation: pop 300ms ease-out;
}
```

## Seletores de atributo — variações

```css
/* Exato */
img[src="assets/logo.svg"] { }

/* Contém substring */
img[src*="logo"] { }

/* Começa com */
img[src^="assets/icons"] { }

/* Termina com */
img[src$=".svg"] { }

/* Contém palavra separada por espaço (para alt/title) */
a[title~="carrinho"] { }
```

## Padrão completo: Header responsivo

```css
header {
  max-width: 80rem;
  width: 100%;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto; /* centraliza se viewport > max-width */
}

@media (max-width: 480px) {
  header {
    padding: 1rem;
  }

  header img {
    width: 1.5rem;
    height: 1.5rem;
  }
}
```