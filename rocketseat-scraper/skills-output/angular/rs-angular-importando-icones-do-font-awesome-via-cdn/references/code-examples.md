# Code Examples: Font Awesome via CDN no Angular

## Setup completo passo a passo

### 1. Gerar componente de teste

```bash
ng generate component components/font-awesome-cdn
```

Estrutura gerada:
```
src/app/components/font-awesome-cdn/
├── font-awesome-cdn.component.ts
├── font-awesome-cdn.component.html
├── font-awesome-cdn.component.css
└── font-awesome-cdn.component.spec.ts  # pode remover
```

### 2. Adicionar CDN no index.html

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MeuApp</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- Font Awesome CDN Kit -->
  <script src="https://kit.fontawesome.com/SEU_KIT_ID.js" crossorigin="anonymous"></script>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### 3. Importar componente no app

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { FontAwesomeCdnComponent } from './components/font-awesome-cdn/font-awesome-cdn.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FontAwesomeCdnComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-font-awesome-cdn></app-font-awesome-cdn>
```

### 4. Usar icones no template do componente

```html
<!-- font-awesome-cdn.component.html -->

<!-- Icone basico -->
<i class="fa-solid fa-car"></i>

<!-- Com estilo inline -->
<i class="fa-solid fa-car" style="color: red;"></i>

<!-- Com classe CSS -->
<i class="fa-solid fa-car icon-large"></i>
```

```css
/* font-awesome-cdn.component.css */
.icon-large {
  font-size: 2rem;
  color: red;
}
```

### 5. Variacoes de icones

```html
<!-- Solid -->
<i class="fa-solid fa-car"></i>

<!-- Regular -->
<i class="fa-regular fa-heart"></i>

<!-- Brands -->
<i class="fa-brands fa-github"></i>
```

## Comparacao: SVG inline vs CDN

### SVG inline (verboso)
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor">
  <path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
</svg>
```

### CDN (limpo)
```html
<i class="fa-solid fa-car"></i>
```

O script do CDN faz a substituicao automatica no DOM, produzindo o mesmo resultado visual.