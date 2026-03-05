# Code Examples: Assets no Angular — Imagens, Ícones e Fontes

## Nota sobre esta aula

Esta é uma aula introdutória/overview. O instrutor não demonstrou código específico — ele apresentou os tópicos que serão cobertos nas próximas aulas. Os exemplos abaixo são padrões canônicos do Angular para cada tópico mencionado.

## 1. Configuração de assets no angular.json

```json
{
  "projects": {
    "minha-app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ]
          }
        }
      }
    }
  }
}
```

Qualquer pasta listada em `assets[]` será copiada integralmente para o build output.

## 2. Referenciando imagem no template

```html
<!-- Caminho relativo à pasta assets -->
<img src="assets/images/hero-banner.png" alt="Banner principal" />

<!-- Com property binding (para path dinâmico) -->
<img [src]="imagePath" [alt]="imageAlt" />
```

```typescript
@Component({ ... })
export class HeroComponent {
  imagePath = 'assets/images/hero-banner.png';
  imageAlt = 'Banner principal';
}
```

## 3. SVG como imagem

```html
<img src="assets/icons/check.svg" alt="Confirmado" class="icon" />
```

```css
.icon {
  width: 24px;
  height: 24px;
}
```

## 4. FontAwesome via CDN

```html
<!-- src/index.html -->
<!doctype html>
<html lang="pt-BR">
<head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    integrity="sha512-..."
    crossorigin="anonymous"
  />
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

Uso no template:
```html
<i class="fa-solid fa-house"></i>
<i class="fa-solid fa-user"></i>
```

## 5. FontAwesome via npm

```bash
npm install @fortawesome/fontawesome-free
```

```json
// angular.json → architect.build.options.styles
"styles": [
  "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
  "src/styles.css"
]
```

Mesmo uso no template:
```html
<i class="fa-solid fa-house"></i>
```

## 6. Fonte customizada via @font-face

```css
/* src/styles.css */
@font-face {
  font-family: 'EmpresaFont';
  src: url('assets/fonts/EmpresaFont-Regular.woff2') format('woff2'),
       url('assets/fonts/EmpresaFont-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'EmpresaFont';
  src: url('assets/fonts/EmpresaFont-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'EmpresaFont', Arial, sans-serif;
}
```

## 7. Google Fonts via link

```html
<!-- src/index.html -->
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
    rel="stylesheet"
  />
</head>
```

```css
/* src/styles.css */
body {
  font-family: 'Roboto', sans-serif;
}
```

## 8. Google Fonts via @import (alternativa)

```css
/* src/styles.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
```