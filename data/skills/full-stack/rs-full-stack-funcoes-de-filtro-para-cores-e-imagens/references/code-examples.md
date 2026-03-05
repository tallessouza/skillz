# Code Examples: Funções de Filtro CSS

## 1. Blur — Embaçamento

```css
/* Blur leve para fundo */
.background-blur {
  filter: blur(5px);
}

/* Blur forte para efeito de carregamento */
.loading-blur {
  filter: blur(10px);
  transition: filter 0.5s ease;
}
.loading-blur.loaded {
  filter: blur(0);
}
```

## 2. Brightness — Brilho

```css
/* Escurecer imagem para texto sobreposto */
.hero-image {
  filter: brightness(0.6);
}

/* Clarear no hover */
.card-image {
  filter: brightness(0.8);
  transition: filter 0.3s;
}
.card-image:hover {
  filter: brightness(1);
}
```

## 3. Contrast — Contraste

```css
/* Tom pastel (contraste reduzido) */
.pastel {
  filter: contrast(0.7);
}

/* Alto contraste para destaque */
.highlight {
  filter: contrast(1.5);
}
```

## 4. Drop-shadow

```css
/* Sombra básica */
.icon {
  filter: drop-shadow(5px 5px 1rem grey);
}

/* Sombra colorida */
.floating-button {
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
}

/* Sombra em PNG transparente */
.logo-png {
  filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.5));
}
```

## 5. Opacity via filter

```css
/* Quase invisível */
.ghost {
  filter: opacity(0.1);
}

/* Semi-transparente */
.watermark {
  filter: opacity(0.3);
}
```

## 6. Invert — Inversão de cores

```css
/* Inversão total (modo escuro rápido) */
.dark-mode-hack {
  filter: invert(1);
}

/* Inversão parcial */
.subtle-invert {
  filter: invert(0.8);
}
```

## 7. Hue-rotate — Rotação de matiz

```css
/* Mudar esquema de cores */
.theme-variation {
  filter: hue-rotate(200deg);
}

/* Animação de cores */
@keyframes color-cycle {
  from { filter: hue-rotate(0deg); }
  to { filter: hue-rotate(360deg); }
}
.rainbow {
  animation: color-cycle 3s linear infinite;
}
```

## 8. Saturate — Saturação

```css
/* Preto e branco */
.grayscale {
  filter: saturate(0);
}

/* Cores super vívidas */
.vivid {
  filter: saturate(2);
}

/* Preto e branco que colore no hover */
.photo {
  filter: saturate(0);
  transition: filter 0.4s;
}
.photo:hover {
  filter: saturate(1);
}
```

## 9. Sepia — Efeito vintage

```css
.vintage-photo {
  filter: sepia(1);
}

.subtle-warm {
  filter: sepia(0.3);
}
```

## 10. Combos — Múltiplos filtros combinados

```css
/* Hover reveal: opaco + blur → limpo */
.reveal-card {
  filter: opacity(0.1) blur(2px);
  transition: filter 0.3s ease;
}
.reveal-card:hover {
  filter: unset;
}

/* Foto vintage completa */
.retro-photo {
  filter: sepia(0.8) contrast(1.2) brightness(0.9);
}

/* Imagem de fundo com overlay */
.hero-bg {
  filter: brightness(0.5) blur(3px) contrast(1.1);
}

/* Disabled state */
.disabled-element {
  filter: saturate(0) opacity(0.5);
  pointer-events: none;
}

/* Efeito dramático */
.dramatic {
  filter: contrast(1.8) brightness(0.9) saturate(1.3);
}
```

## 11. Padrão completo: Card com hover reveal

```html
<div class="filter-card">
  <img src="photo.jpg" alt="Foto">
  <p>Passe o mouse para revelar</p>
</div>
```

```css
.filter-card {
  background-color: coral;
  filter: opacity(0.1) blur(2px);
  transition: filter 0.3s ease;
}

.filter-card:hover {
  filter: unset;
}
```