# Code Examples: Atributo Style (Inline CSS)

## Exemplo basico do atributo style

O atributo aceita qualquer propriedade CSS valida como valor:

```html
<!-- Uma propriedade -->
<p style="color: red;">Texto vermelho</p>

<!-- Multiplas propriedades separadas por ponto e virgula -->
<p style="color: red; font-size: 20px; font-weight: bold;">Texto estilizado</p>

<!-- Qualquer tag pode receber style (e atributo global) -->
<div style="background-color: lightblue; padding: 16px;">
  <h1 style="margin: 0;">Titulo</h1>
  <p style="color: gray;">Paragrafo</p>
</div>
```

## Problema de especificidade demonstrado

```html
<!-- No HTML -->
<p class="texto" style="color: red;">Que cor eu sou?</p>
```

```css
/* No CSS externo */
.texto {
  color: blue; /* NAO vai funcionar — inline style vence */
}

#especial .texto {
  color: green; /* TAMBEM nao funciona — inline style tem especificidade maior */
}

.texto {
  color: purple !important; /* SO ISSO sobrescreve o inline style */
}
```

## Migracao de inline para classes

### Antes (inline styles espalhados):

```html
<nav>
  <a href="/" style="color: white; text-decoration: none; padding: 8px 16px;">Home</a>
  <a href="/about" style="color: white; text-decoration: none; padding: 8px 16px;">Sobre</a>
  <a href="/contact" style="color: white; text-decoration: none; padding: 8px 16px;">Contato</a>
</nav>
```

Problema: para mudar a cor de todos os links, precisa editar 3 lugares. Com 50 links, 50 lugares.

### Depois (classes CSS):

```html
<nav>
  <a href="/" class="nav-link">Home</a>
  <a href="/about" class="nav-link">Sobre</a>
  <a href="/contact" class="nav-link">Contato</a>
</nav>
```

```css
.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
}
```

Agora, mudar a cor de todos os links requer alterar uma unica linha no CSS.

## As tres formas de aplicar CSS

### 1. Inline (evitar)
```html
<p style="color: red;">Texto</p>
```

### 2. Interno (tag style no head)
```html
<head>
  <style>
    p {
      color: red;
    }
  </style>
</head>
<body>
  <p>Texto</p>
</body>
```

### 3. Externo (arquivo .css linkado — preferido)
```html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <p>Texto</p>
</body>
```

```css
/* styles.css */
p {
  color: red;
}
```

## Manipulacao via JavaScript (uso legitimo de inline style)

```javascript
// JavaScript aplica inline styles via element.style
const elemento = document.querySelector('.animado');

// Isso gera: style="transform: translateX(100px)"
elemento.style.transform = 'translateX(100px)';

// Para animacoes e manipulacoes dinamicas, inline style via JS e padrao
elemento.style.opacity = '0.5';
elemento.style.transition = 'all 0.3s ease';
```

## CSS Custom Properties inline (uso legitimo)

```html
<!-- Passar variaveis CSS para componentes -->
<div class="card" style="--card-color: blue; --card-padding: 16px;">
  <h2>Titulo</h2>
  <p>Conteudo</p>
</div>
```

```css
.card {
  color: var(--card-color, black);
  padding: var(--card-padding, 8px);
}
```