# Code Examples: Menu e Social Icons com Degradê CSS

## 1. Reset global de links e degradê no hover

```css
/* global.css */
a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  background: linear-gradient(
    to right,
    var(--brand-color-secondary) 0%,
    var(--brand-color-primary) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

## 2. HTML do menu

```html
<nav>
  <ul role="list">
    <li>
      <a href="#">Menu Item</a>
    </li>
    <li>
      <a href="#">Menu Item</a>
    </li>
  </ul>
</nav>
```

Nota: `role="list"` é adicionado ao `<ul>` porque em alguns casos o reset de CSS remove a semântica de lista.

## 3. HTML completo dos ícones sociais

```html
<div class="social-icons" style="display: flex; gap: 0.5rem;">
  <a href="#" aria-label="tiktok" class="social"></a>
  <a href="#" aria-label="instagram" class="social"></a>
  <a href="#" aria-label="twitter" class="social"></a>
  <a href="#" aria-label="discord" class="social"></a>
</div>
```

## 4. CSS completo dos ícones sociais (social.css)

```css
.social {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  --bg-image: ;
  background-image: var(--bg-image);
  background-size: contain;
  background-repeat: no-repeat;
  /* Reset do gradient text clip global */
  -webkit-background-clip: initial;
  background-clip: initial;
}

/* TikTok */
.social[aria-label="tiktok"] {
  --bg-image: url(../assets/icons/tiktok.svg);
}
.social[aria-label="tiktok"]:hover {
  --bg-image: url(../assets/icons/tiktok-hover.svg);
}

/* Instagram */
.social[aria-label="instagram"] {
  --bg-image: url(../assets/icons/instagram.svg);
}
.social[aria-label="instagram"]:hover {
  --bg-image: url(../assets/icons/instagram-hover.svg);
}

/* Twitter */
.social[aria-label="twitter"] {
  --bg-image: url(../assets/icons/twitter.svg);
}
.social[aria-label="twitter"]:hover {
  --bg-image: url(../assets/icons/twitter-hover.svg);
}

/* Discord */
.social[aria-label="discord"] {
  --bg-image: url(../assets/icons/discord.svg);
}
.social[aria-label="discord"]:hover {
  --bg-image: url(../assets/icons/discord-hover.svg);
}
```

## 5. Estrutura de um SVG com degradê (hover variant)

```xml
<!-- tiktok-hover.svg -->
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8B5CF6" />    <!-- brand-color-secondary -->
      <stop offset="1" stop-color="#06B6D4" /> <!-- brand-color-primary -->
    </linearGradient>
  </defs>
  <path fill="url(#paint0_linear)" d="M19.59 6.69a4.83..." />
</svg>
```

### Como converter SVG normal para hover:

```xml
<!-- ANTES: tiktok.svg (cor sólida) -->
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FFFFFF" d="M19.59 6.69a4.83..." />
</svg>

<!-- DEPOIS: tiktok-hover.svg (com degradê) -->
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8B5CF6" />
      <stop offset="1" stop-color="#06B6D4" />
    </linearGradient>
  </defs>
  <path fill="url(#paint0_linear)" d="M19.59 6.69a4.83..." />
</svg>
```

Passos:
1. Copie o SVG original
2. Adicione o bloco `<defs>` com `<linearGradient>` (copie de um que já funciona)
3. Substitua o `fill` do `<path>` de `fill="#FFFFFF"` para `fill="url(#paint0_linear)"`
4. O ID do gradient (`paint0_linear`) deve coincidir entre o `<linearGradient id="...">` e o `fill="url(#...)"`

## 6. Importação do CSS

```css
/* styles.css ou main.css */
@import './social.css';
```

## 7. Organização de arquivos dos ícones

```
assets/
└── icons/
    ├── tiktok.svg
    ├── tiktok-hover.svg
    ├── instagram.svg
    ├── instagram-hover.svg
    ├── twitter.svg
    ├── twitter-hover.svg
    ├── discord.svg
    └── discord-hover.svg
```

## 8. Variação: usando a mesma técnica para outros contextos

### Ícones em cards (mencionado pelo instrutor)

```html
<div class="card">
  <a href="#" aria-label="discord" class="social"></a>
  <!-- Mesmo componente, mesmo tamanho (1.5rem), mesmo comportamento -->
</div>
```

### Com gap utilitário para espaçamento

```html
<div class="flex gap-sm">
  <a href="#" aria-label="tiktok" class="social"></a>
  <a href="#" aria-label="instagram" class="social"></a>
  <a href="#" aria-label="twitter" class="social"></a>
  <a href="#" aria-label="discord" class="social"></a>
</div>
```

```css
.flex { display: flex; }
.gap-sm { gap: 0.5rem; }
```