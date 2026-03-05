# Code Examples: O Projeto no Figma

## Variaveis CSS extraidas de um style guide tipico

```css
/* Cores extraidas do style guide */
:root {
  --color-background: #0D1117;
  --color-text-primary: #E1E1E6;
  --color-text-secondary: #C4C4CC;
  --color-accent: #00B37E;
  --color-accent-dark: #015F43;
}
```

## Importando fonte do Google Fonts

Apos identificar a fonte no style guide:

```html
<!-- No <head> do HTML -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Roboto', sans-serif;
}
```

## Tipografia baseada no style guide

```css
/* Hierarquia tipografica do style guide */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.3;
}

h2 {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.4;
}

p {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
}
```

## Importando icones (Phosphor Icons)

```html
<!-- Via CDN -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>
```

```html
<!-- Uso no HTML -->
<i class="ph ph-timer"></i>
<i class="ph ph-fork-knife"></i>
```

## Estrutura HTML inicial de um projeto de receita

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <title>Pagina de Receita</title>
</head>
<body>
  <!-- Construir parte a parte, seguindo o layout do Figma -->
</body>
</html>
```

## Reset basico antes de aplicar estilos do style guide

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}
```