# Code Examples: Classes Utilitárias Responsivas

## Exemplo completo de variáveis

```css
:root {
  /* Padding vertical (Y axis) */
  --py-base: 1rem;      /* 16px */
  --py-lg: 1.5rem;      /* 24px */
  --py-xl: 3rem;        /* 48px */

  /* Padding horizontal (X axis) */
  --px-lg: 1.5rem;      /* 24px */
}

@media (min-width: 768px) {
  :root {
    --py-base: 1.5rem;  /* 24px */
    --py-lg: 2.5rem;    /* 40px */
    --py-xl: 5rem;      /* 80px */
  }
}
```

## Classes de padding completas

```css
/* Vertical (block = cima/baixo) */
.py-base { padding-block: var(--py-base); }
.py-lg   { padding-block: var(--py-lg); }
.py-xl   { padding-block: var(--py-xl); }

/* Horizontal (inline = esquerda/direita) */
.px-lg   { padding-inline: var(--px-lg); }
```

## Classe de visibilidade — desktop-only

```css
/* Mobile first: escondido por padrão */
.desktop-only {
  display: none;
}

/* Aparece apenas em telas grandes */
@media (min-width: 768px) {
  .desktop-only {
    display: initial; /* Restaura o display padrão da tag */
  }
}
```

### Uso no HTML

```html
<!-- Essa nav só aparece no desktop -->
<nav class="desktop-only">
  <a href="#features">Features</a>
  <a href="#pricing">Pricing</a>
</nav>
```

### Variação: mobile-only (inverso)

```css
.mobile-only {
  display: initial; /* Visível no mobile */
}

@media (min-width: 768px) {
  .mobile-only {
    display: none; /* Escondido no desktop */
  }
}
```

### Caso real: duas versões de imagem

```html
<!-- Imagem mobile (aparece só no mobile) -->
<img src="hero-mobile.png" class="mobile-only" alt="Hero">

<!-- Imagem desktop (aparece só no desktop) -->
<img src="hero-desktop.png" class="desktop-only" alt="Hero">
```

## Even Columns

```css
.even-columns {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .even-columns {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
  }
}
```

### Uso no HTML — 3 colunas

```html
<div class="even-columns">
  <div class="card">Feature 1</div>
  <div class="card">Feature 2</div>
  <div class="card">Feature 3</div>
</div>
```

**Mobile:** cada card ocupa uma linha (um abaixo do outro)
**Desktop:** 3 colunas iguais lado a lado com 1rem de gap

### Uso com 2 colunas

```html
<div class="even-columns">
  <div>Texto explicativo</div>
  <div><img src="screenshot.png" alt=""></div>
</div>
```

### Variação: gap customizado

```css
.even-columns { gap: var(--gap, 1rem); }
```

```html
<div class="even-columns" style="--gap: 2rem">
  <!-- gap de 2rem neste caso específico -->
</div>
```

## Combinando utility classes no HTML

```html
<section class="py-xl">
  <div class="even-columns px-lg">
    <div class="py-lg">
      <h2>Título</h2>
      <p>Descrição do recurso</p>
    </div>
    <div class="py-lg">
      <img src="feature.png" alt="Feature" class="desktop-only">
      <img src="feature-mobile.png" alt="Feature" class="mobile-only">
    </div>
  </div>
</section>
```

## Testando visualmente

```html
<!-- Teste rápido para verificar classes -->
<div class="desktop-only" style="background: red; padding: 1rem;">
  Só aparece no desktop
</div>

<div class="py-xl" style="background: lightblue;">
  Padding vertical responsivo (48px mobile → 80px desktop)
</div>

<div class="even-columns" style="background: lightyellow;">
  <div style="background: coral; padding: 1rem;">A</div>
  <div style="background: lightgreen; padding: 1rem;">B</div>
  <div style="background: lightpink; padding: 1rem;">C</div>
</div>
```

## Erro comum corrigido na aula

O instrutor inicialmente confundiu `padding-block` com horizontal:

```css
/* ERRADO — block é vertical, não horizontal */
.px-lg { padding-block: var(--px-lg); }

/* CORRETO — inline é horizontal */
.px-lg { padding-inline: var(--px-lg); }
```

Mnemônico:
- **block** = blocos empilhados = vertical (↕)
- **inline** = texto na linha = horizontal (↔)