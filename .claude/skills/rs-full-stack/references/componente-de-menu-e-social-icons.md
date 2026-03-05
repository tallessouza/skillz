---
name: rs-full-stack-menu-social-icons
description: "Applies gradient text links and SVG social icon patterns when building navigation menus or social link components. Use when user asks to 'create a menu', 'add social icons', 'make gradient text links', 'build navigation with icons', or 'style SVG icons with hover effects'. Covers CSS linear-gradient text clipping, SVG fill replacement for hover states, and CSS custom properties for background-image swapping. Make sure to use this skill whenever creating navigation or social media link sections in HTML/CSS projects. Not for JavaScript interactivity, icon library setup (Font Awesome, Lucide), or React/Vue component architecture."
---

# Menu e Social Icons com Degradê CSS

> Links usam linear-gradient com background-clip text para degradê, e ícones sociais usam SVG com troca de background-image via CSS custom properties no hover.

## Rules

1. **Aplique degradê em todos os links globalmente** — defina no seletor `a:hover` no CSS global, porque a consistência visual deve ser o padrão e exceções são removidas onde necessário
2. **Use background-clip text para degradê em texto** — requer 3 passos: background linear-gradient, -webkit-background-clip: text + background-clip: text, color: transparent, porque é a única forma cross-browser de aplicar gradiente em texto
3. **Ícones sociais são links com background-image, não `<img>`** — use `<a>` com aria-label, classe `.social`, e CSS custom property para a imagem, porque permite hover state e acessibilidade simultaneamente
4. **Defina largura e altura explícitas nos ícones** — `width: 1.5rem; height: 1.5rem; display: block`, porque links inline não respeitam dimensões sem display block
5. **Use CSS custom properties para troca de ícone no hover** — `--bg-image` começa vazio e muda no hover, porque centraliza a manutenção e evita repetição de `background-image`
6. **SVGs com degradê usam `<linearGradient>` no `<defs>` e `fill: url(#id)`** — copie o bloco `<defs>` do SVG com degradê e substitua o `fill` do path, porque é assim que SVGs referenciam gradientes internamente
7. **Resete background-clip no `.social` link** — defina `background-clip: initial` e `-webkit-background-clip: initial` nos ícones sociais, porque o gradient text clip global interfere com o background-image dos ícones

## How to write

### Links com degradê (global)

```css
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

### HTML dos ícones sociais

```html
<a href="#" aria-label="tiktok" class="social">
<a href="#" aria-label="instagram" class="social">
<a href="#" aria-label="twitter" class="social">
<a href="#" aria-label="discord" class="social">
```

### CSS dos ícones sociais

```css
.social {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  --bg-image: ;
  background-image: var(--bg-image);
  -webkit-background-clip: initial;
  background-clip: initial;
}

.social[aria-label="tiktok"] {
  --bg-image: url(../assets/icons/tiktok.svg);
}
.social[aria-label="tiktok"]:hover {
  --bg-image: url(../assets/icons/tiktok-hover.svg);
}

.social[aria-label="instagram"] {
  --bg-image: url(../assets/icons/instagram.svg);
}
.social[aria-label="instagram"]:hover {
  --bg-image: url(../assets/icons/instagram-hover.svg);
}
```

### SVG com degradê (hover variant)

```xml
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient-fill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--brand-color-secondary)" />
      <stop offset="100%" stop-color="var(--brand-color-primary)" />
    </linearGradient>
  </defs>
  <path fill="url(#gradient-fill)" d="..." />
</svg>
```

## Example

**Before (ícones como imagens sem hover):**
```html
<img src="icons/tiktok.svg" alt="tiktok" />
<img src="icons/instagram.svg" alt="instagram" />
```

**After (com hover degradê e acessibilidade):**
```html
<a href="#" aria-label="tiktok" class="social"></a>
<a href="#" aria-label="instagram" class="social"></a>
```
```css
.social {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  --bg-image: ;
  background-image: var(--bg-image);
  -webkit-background-clip: initial;
  background-clip: initial;
}
.social[aria-label="tiktok"] { --bg-image: url(../assets/icons/tiktok.svg); }
.social[aria-label="tiktok"]:hover { --bg-image: url(../assets/icons/tiktok-hover.svg); }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Link de texto com degradê | Aplique os 3 passos: gradient background → background-clip text → color transparent |
| Ícone social com hover colorido | Crie dois SVGs (normal + hover), troque via CSS custom property |
| Ícone social dentro de link com gradient global | Resete background-clip para `initial` no seletor do ícone |
| SVG precisa de degradê interno | Adicione `<defs>` com `<linearGradient>` e use `fill: url(#id)` no path |
| Múltiplos ícones do mesmo tamanho | Classe compartilhada (`.social`) com dimensões, seletores `[aria-label]` para imagens |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| `<img src="icon.svg">` para ícone social clicável | `<a aria-label="nome" class="social">` com background-image |
| Repetir `background-image` no normal e hover | Use `--bg-image` custom property, mude só no hover |
| Ícone sem `width`/`height`/`display: block` | Sempre defina dimensões explícitas e display block |
| `aria-label` escrito como `arial-label` | Atenção ao typo — é `aria-label` |
| Aplicar gradient text clip em elementos com background-image | Resete `background-clip: initial` no seletor específico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre degradê em texto, SVG fills e estratégia de CSS custom properties
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-componente-de-menu-e-social-icons/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-componente-de-menu-e-social-icons/references/code-examples.md)
