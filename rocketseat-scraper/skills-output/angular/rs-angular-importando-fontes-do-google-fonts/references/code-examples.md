# Code Examples: Importando Fontes do Google Fonts

## Exemplo completo: index.html com Roboto

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MeuApp</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">

  <!-- Google Fonts - Roboto -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

## Exemplo: CSS do componente aplicando a fonte

```css
/* google-fonts.component.css */
p {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-style: normal;
}
```

## Variacoes de peso e estilo

```css
/* Light */
.text-light {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-style: normal;
}

/* Bold */
.text-bold {
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-style: normal;
}

/* Italico */
.text-italic {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-style: italic;
}

/* Extra bold */
.text-black {
  font-family: "Roboto", sans-serif;
  font-weight: 900;
  font-style: normal;
}
```

## Exemplo: URL para peso unico (300 normal apenas)

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
```

## Exemplo: URL para peso unico italico

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,300&display=swap" rel="stylesheet">
```

## Anti-pattern: @import no CSS (evitar)

```css
/* styles.css - NAO RECOMENDADO */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');

/* Bloqueia renderizacao - usar <link> no index.html em vez disso */
```

## Criando o componente para teste

```bash
ng generate component components/google-fonts
```

```typescript
// app.component.ts
import { GoogleFontsComponent } from './components/google-fonts/google-fonts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GoogleFontsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-google-fonts></app-google-fonts>
```

```html
<!-- google-fonts.component.html -->
<p>Google Font Works</p>
```