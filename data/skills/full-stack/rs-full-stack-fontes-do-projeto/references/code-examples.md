# Code Examples: Fontes do Projeto

## 1. Setup completo do HTML head

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Preconnect (sempre primeiro) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <title>Meu Projeto</title>
  <link rel="stylesheet" href="./global.css" />

  <!-- Fonte (sempre por ultimo) -->
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
    rel="stylesheet"
  />
</head>
```

## 2. global.css — Variaveis de tipografia completas

```css
:root {
  /* Font family base */
  --font-family: "Poppins", sans-serif;

  /* Text sizes usando font shorthand */
  /* font: [weight] size/line-height family */
  --text-lg: bold 32px/125% var(--font-family);
  --text-md: 14px/175% var(--font-family);
  --text-sm: 14px/175% var(--font-family);
  --text: 16px/1.5 var(--font-family);
}
```

## 3. Aplicando as variaveis

```css
body {
  font: var(--text);
}

h1, h2 {
  font: var(--text-lg);
}

p {
  font: var(--text-md);
}

small, .caption {
  font: var(--text-sm);
}
```

## 4. Font shorthand — todas as variacoes

```css
/* Apenas size e family (obrigatorios) */
font: 16px "Poppins", sans-serif;

/* Com line-height */
font: 16px/1.5 "Poppins", sans-serif;

/* Com weight */
font: bold 16px/1.5 "Poppins", sans-serif;

/* Com style (italico) */
font: italic bold 16px/1.5 "Poppins", sans-serif;

/* Weight numerico */
font: 700 32px/125% "Poppins", sans-serif;
```

## 5. Line-height — equivalencias

```css
/* Todos produzem 24px de line-height para font-size 16px */
font: 16px/24px "Poppins", sans-serif;  /* valor absoluto */
font: 16px/1.5 "Poppins", sans-serif;   /* multiplicador (preferido) */
font: 16px/150% "Poppins", sans-serif;  /* porcentagem */
```

## 6. Selecionando pesos no Google Fonts

Para selecionar apenas Regular (400) e Bold (700):

URL direta:
```
https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap
```

Se precisasse de mais pesos (ex: Light, Regular, Medium, Bold):
```
https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap
```

## 7. Copiando CSS do Figma (versao filtrada)

O Figma exporta algo assim:
```css
/* Copy as CSS do Figma (raw) */
width: 320px;
height: auto;
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 150%;
color: #333;
```

Filtre para apenas:
```css
/* O que importa */
font-family: Poppins;
font-size: 16px;
font-weight: 400; /* regular = padrao, pode omitir */
line-height: 150%; /* ou 1.5 */
```

Converta para shorthand:
```css
font: 16px/1.5 "Poppins", sans-serif;
```