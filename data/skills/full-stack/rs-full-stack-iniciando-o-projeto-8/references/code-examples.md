# Code Examples: Setup Inicial de Projeto HTML/CSS

## Estrutura de pastas completa do projeto Patins Animation

```
patins-animation/
├── index.html
├── styles/
│   ├── index.css
│   └── global.css
└── assets/
    ├── images/
    │   ├── 01.png
    │   ├── 02.png
    │   ├── 03.png
    │   └── 04.png
    ├── icons/
    │   ├── facebook.png
    │   ├── tiktok.png
    │   ├── instagram.png
    │   ├── youtube.png
    │   ├── play.png
    │   └── shopping-bag.png
    └── hero/
        ├── ellipse.png
        ├── patins.png
        └── star-1.png
```

## index.html completo da aula

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sneetap Patins</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cine:wght@700&family=Inter:wght@500&family=Montserrat:wght@500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/index.css">
</head>
<body>
</body>
</html>
```

## index.css

```css
@import url("global.css");
```

## global.css completo da aula

```css
* {
  margin: 0;
  padding: 0;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}

:root {
  /* Cores do Style Guide - Sneetap */
  --sneetap-sun: #valor;
  --sneetap-sky-mid: #valor;
  --color-text: #valor;
  --color-highlight: #valor;
  --color-background: #valor;

  /* Tipografia */
  --ff-base: "Montserrat", sans-serif;

  /* Tamanhos de texto */
  --text-small: 0.875rem;    /* 14px */
  --text-base: 1rem;          /* 16px */
  --text-large: 2.5rem;       /* 40px */
  --text-extra-large: 4rem;   /* 64px */
}

html {
  font-family: var(--ff-base);
  font-weight: 500;
}

h1, h2 {
  font-family: "Cine", sans-serif;
}

h1 {
  font-size: var(--text-extra-large); /* 4rem = 64px */
  line-height: 1.25;                  /* 125% */
}

h2 {
  font-size: var(--text-large);       /* 2.5rem = 40px */
  line-height: 1.2;                   /* 120% */
}
```

## Tabela de conversao px → rem usada na aula

```
14px  / 16 = 0.875rem
16px  / 16 = 1rem
40px  / 16 = 2.5rem
64px  / 16 = 4rem
```

## Variacao: projeto com mais fontes

```html
<!-- Se o Style Guide tiver mais pesos/fontes -->
<link href="https://fonts.googleapis.com/css2?family=Cine:wght@400;700&family=Inter:wght@400;500;700&family=Montserrat:ital,wght@0,500;1,500&display=swap" rel="stylesheet">
```

## Variacao: CSS variables para line-height

```css
:root {
  --lh-tight: 1.2;
  --lh-normal: 1.25;
  --lh-relaxed: 1.5;
}

h1 {
  font-size: var(--text-extra-large);
  line-height: var(--lh-normal);
}

h2 {
  font-size: var(--text-large);
  line-height: var(--lh-tight);
}
```

## Teste rapido para verificar se CSS esta conectado

```css
/* Adicionar temporariamente no global.css */
body {
  background-color: deeppink;
}
/* Se aparecer rosa, o import esta funcionando. Remover depois. */
```

## Git init e primeiro commit

```bash
git init
git add .
git commit -m "Initial commit"
```