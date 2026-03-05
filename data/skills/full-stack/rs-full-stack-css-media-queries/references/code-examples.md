# Code Examples: CSS Media Queries

## 1. Meta Viewport (HTML obrigatorio)

```html
<!-- Padrao — use sempre -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Escala inicial 50% (zoom out) — raramente usado -->
<meta name="viewport" content="width=device-width, initial-scale=0.5">

<!-- Escala inicial 200% (zoom in) — raramente usado -->
<meta name="viewport" content="width=device-width, initial-scale=2.0">
```

## 2. Media Query via atributo na tag link

```html
<!-- Carrega CSS apenas em telas no modo retrato -->
<link rel="stylesheet" href="portrait.css" media="screen and (orientation: portrait)">

<!-- Carrega CSS apenas em telas com largura minima de 768px -->
<link rel="stylesheet" href="desktop.css" media="screen and (min-width: 768px)">
```

## 3. Media Query via @import

```css
/* Importa CSS apenas para telas no modo retrato */
@import url("screen.css") screen and (orientation: portrait);

/* Importa CSS apenas para telas grandes */
@import url("desktop.css") screen and (min-width: 1024px);
```

## 4. Media Query inline (metodo principal)

### Breakpoint unico

```css
body {
  font-size: 16px;
}

@media screen and (min-width: 576px) {
  body {
    font-size: 18px;
  }
}
```

### Multiplos breakpoints (mobile-first)

```css
/* Mobile (base) */
h1 {
  font-size: 24px;
  padding: 16px;
}

p {
  font-size: 14px;
  line-height: 1.5;
}

/* Tablet (768px+) */
@media screen and (min-width: 768px) {
  h1 {
    font-size: 36px;
    padding: 24px;
  }

  p {
    font-size: 16px;
    line-height: 1.6;
  }
}

/* Desktop (1024px+) */
@media screen and (min-width: 1024px) {
  h1 {
    font-size: 48px;
    padding: 40px;
  }

  p {
    font-size: 18px;
    line-height: 1.7;
    max-width: 720px;
  }
}
```

### Orientacao

```css
/* Modo retrato (vertical) */
@media screen and (orientation: portrait) {
  .gallery {
    grid-template-columns: 1fr;
  }
}

/* Modo paisagem (horizontal) */
@media screen and (orientation: landscape) {
  .gallery {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

### Combinando condicoes

```css
/* Tela de pelo menos 768px E no modo paisagem */
@media screen and (min-width: 768px) and (orientation: landscape) {
  .sidebar {
    display: block;
    width: 250px;
  }
}
```

## 5. Breakpoints comuns de referencia

```css
/* Small (celular grande) */
@media screen and (min-width: 576px) { }

/* Medium (tablet) */
@media screen and (min-width: 768px) { }

/* Large (desktop) */
@media screen and (min-width: 1024px) { }

/* Extra large (tela grande) */
@media screen and (min-width: 1200px) { }
```

## 6. Exemplo completo da aula

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Media Queries</title>
  <style>
    h1 {
      font-size: 20px;
      color: #333;
    }

    p {
      font-size: 14px;
      color: #666;
    }

    @media screen and (min-width: 576px) {
      h1 {
        font-size: 32px;
      }

      p {
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <h1>Title Goes Here</h1>
  <p>Lorem ipsum dolor sit amet...</p>
</body>
</html>
```