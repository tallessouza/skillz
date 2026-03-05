# Code Examples: Cores e Fundos no CSS

## 1. Cores Nomeadas

```css
/* As cores nomeadas mais comuns */
h1 {
  color: blue;
}

p {
  color: red;
}

a {
  color: green;
}

/* Cores nomeadas menos obvias mas uteis */
.warning {
  color: tomato;
}

.info {
  color: dodgerblue;
}

.success {
  color: forestgreen;
}
```

## 2. Cores Hexadecimais

```css
/* Formato completo: #RRGGBB */
h1 {
  color: #FF0000; /* vermelho puro */
}

p {
  color: #00FF00; /* verde puro */
}

a {
  color: #0000FF; /* azul puro */
}

/* Cores praticas do dia a dia */
body {
  color: #333333;           /* cinza escuro para texto */
  background-color: #F5F5F5; /* cinza claro para fundo */
}

.brand {
  color: #3498DB; /* azul suave */
}

/* Shorthand hex (quando pares repetem) */
.dark {
  color: #333; /* equivale a #333333 */
}

.light {
  background-color: #FFF; /* equivale a #FFFFFF */
}
```

## 3. Background Color

```css
/* Cor de fundo com nomeada */
.card {
  background-color: white;
}

/* Cor de fundo com hex */
.header {
  background-color: #1a1a2e;
}

/* Cor de fundo como fallback para imagem */
.hero {
  background-color: #222;
  background-image: url('hero.jpg');
}
```

## 4. Background Image

```css
/* Basico */
.banner {
  background-image: url('banner.jpg');
}

/* Com caminho relativo */
.section {
  background-image: url('../images/pattern.png');
}

/* Com URL externa */
.cover {
  background-image: url('https://example.com/image.jpg');
}
```

## 5. Background Repeat

```css
/* Nao repetir (mais comum para fotos) */
.hero {
  background-image: url('hero.jpg');
  background-repeat: no-repeat;
}

/* Repetir apenas horizontalmente (padrao decorativo) */
.divider {
  background-image: url('wave.png');
  background-repeat: repeat-x;
}

/* Repetir apenas verticalmente */
.sidebar {
  background-image: url('stripe.png');
  background-repeat: repeat-y;
}

/* Repetir em ambos os eixos (padrao — geralmente nao precisa declarar) */
.pattern {
  background-image: url('dots.png');
  background-repeat: repeat;
}
```

## 6. Background Position

```css
/* Centralizar */
.hero {
  background-image: url('hero.jpg');
  background-repeat: no-repeat;
  background-position: center;
}

/* Canto superior direito */
.badge {
  background-image: url('icon.png');
  background-repeat: no-repeat;
  background-position: top right;
}

/* Posicao com valores */
.custom {
  background-image: url('logo.png');
  background-repeat: no-repeat;
  background-position: 20px 40px;
}
```

## 7. Background Size

```css
/* Cover: preenche todo o elemento, pode cortar */
.hero {
  background-image: url('hero.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

/* Contain: mostra a imagem inteira, pode sobrar espaco */
.logo-area {
  background-image: url('logo.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

/* Tamanho fixo */
.thumbnail {
  background-image: url('thumb.jpg');
  background-repeat: no-repeat;
  background-size: 200px 150px;
}
```

## 8. Exemplo Completo: Card com Background

```css
.card {
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
}

.card-hero {
  background-color: #1a1a2e;
  background-image: url('card-hero.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 200px;
  border-radius: 8px 8px 0 0;
}
```

## 9. Exemplo Completo: Pagina com Fundo

```css
body {
  background-color: #F0F0F0;
  color: #333333;
}

.header {
  background-color: #2C3E50;
  color: #FFFFFF;
}

.hero-section {
  background-color: #1a1a2e;
  background-image: url('hero-background.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  color: #FFFFFF;
}

.content {
  background-color: #FFFFFF;
}

.footer {
  background-color: #2C3E50;
  color: #ECF0F1;
}
```