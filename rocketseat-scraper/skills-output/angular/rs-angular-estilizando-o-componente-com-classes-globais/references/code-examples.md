# Code Examples: Estilos Globais no Angular (styles.css)

## 1. Reset CSS completo

```css
/* src/styles/reset.css */

/* Box-sizing global — padding e border inclusos no calculo de dimensoes */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove margin e padding padrao de todos os elementos */
* {
  margin: 0;
  padding: 0;
}

/* Font-size responsivo — nunca menor que 16px, cresce com a tela */
html {
  font-size: clamp(16px, 1vw + 12px, 22px);
}

/* Fonte base e line-height para toda a aplicacao */
body {
  font-family: Arial, sans-serif;
  line-height: 1.5;
}

/* Elementos de midia como block com max-width */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/* Remove marcadores de listas */
ul, ol {
  list-style: none;
}
```

## 2. Variaveis CSS

```css
/* src/styles/variables.css */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
}
```

### Uso em componente

```css
/* qualquer-componente.component.css */
p {
  color: var(--primary-color); /* aplica azul #3498db */
}
```

## 3. Classes utilitarias com prefixo c-

```css
/* No styles.css ou em styles/utilities.css */
.c-text-center {
  text-align: center;
}

.c-mt-16 {
  margin-top: 16px;
}

.c-hidden {
  display: none;
}
```

### Uso no template do componente

```html
<!-- Misturando classe local (container) com global (c-text-center) -->
<div class="container c-text-center">
  <p>Este paragrafo fica centralizado</p>
</div>
```

```css
/* componente.component.css — classe local */
.container {
  padding: 16px;
  background: #f5f5f5;
}
```

## 4. Classes de layout globais com prefixo g-

```css
/* styles.css */
.g-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.g-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
```

### Uso em multiplos componentes

```html
<!-- two-way-data-binding.component.html -->
<div class="g-container g-grid">
  <div>Coluna 1</div>
  <div>Coluna 2</div>
</div>
```

```html
<!-- property-binding.component.html -->
<div class="g-container">
  <p>Conteudo centralizado com max-width</p>
</div>
```

## 5. Override de componentes externos (Angular Material)

### Override geral — afeta todos os mat-slider

```css
/* styles.css */
.mat-slider .mat-slider-thumb {
  border-color: blue;
}
```

### Override especifico — apenas um instance

```html
<!-- componente.component.html -->
<mat-slider id="meu-slider"></mat-slider>
```

```css
/* styles.css */
#meu-slider .mat-slider-thumb {
  border-color: blue;
}
```

## 6. Organizacao em arquivos separados

### Estrutura de pastas

```
src/
├── styles/
│   ├── reset.css
│   └── variables.css
├── styles.css          ← arquivo raiz
└── app/
```

### styles.css com imports

```css
/* src/styles.css */
@import './styles/reset.css';
@import './styles/variables.css';

/* Classes utilitarias e globais adicionais */
.c-text-center {
  text-align: center;
}

.g-container {
  max-width: 1200px;
  margin: 0 auto;
}
```

### Ordem dos imports importa

```css
/* CORRETO — reset primeiro, variaveis depois */
@import './styles/reset.css';
@import './styles/variables.css';

/* INCORRETO — variaveis podem ser resetadas */
@import './styles/variables.css';
@import './styles/reset.css';  /* pode sobrescrever algo das variaveis */
```

## 7. Variacao: estrutura mais completa de styles/

```
src/
├── styles/
│   ├── reset.css        # Box-sizing, margin, padding
│   ├── variables.css    # Cores, espacamentos, fontes
│   ├── utilities.css    # Classes c-* atomicas
│   └── layouts.css      # Classes g-* de layout
├── styles.css           # Apenas imports
└── app/
```

```css
/* styles.css */
@import './styles/reset.css';
@import './styles/variables.css';
@import './styles/utilities.css';
@import './styles/layouts.css';
```