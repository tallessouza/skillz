# Code Examples: Web Fonts

## Exemplo 1: Fonte unica (Roboto) com dois pesos

### HTML
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <meta charset="UTF-8">
  <title>Web Fonts</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" rel="stylesheet">
</head>
<body>
  <h1>Titulo</h1>
  <p>Paragrafo com fonte leve</p>
</body>
</html>
```

### CSS
```css
body {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}

h1 {
  font-weight: 700;
}
```

## Exemplo 2: Duas fontes (titulo + corpo)

### HTML
```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <meta charset="UTF-8">
  <title>Duas Fontes</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&family=Roboto:wght@300;700&display=swap" rel="stylesheet">
</head>
```

### CSS
```css
body {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}

h1 {
  font-family: "Playfair Display", serif;
}
```

## Exemplo 3: @import no CSS (nao recomendado)

```css
/* NAO RECOMENDADO — mais lento que o metodo link */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap');

body {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}
```

Motivo: o navegador precisa baixar e processar o CSS antes de descobrir que precisa buscar a fonte. Com link no HTML, a pre-conexao ja esta ativa.

## Exemplo 4: @font-face para fonte local

```css
@font-face {
  font-family: "MinhaFontePaga";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("./fonts/minha-fonte-regular.woff2") format("woff2"),
       url("./fonts/minha-fonte-regular.woff") format("woff");
}

@font-face {
  font-family: "MinhaFontePaga";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("./fonts/minha-fonte-bold.woff2") format("woff2"),
       url("./fonts/minha-fonte-bold.woff") format("woff");
}

body {
  font-family: "MinhaFontePaga", sans-serif;
}
```

## Exemplo 5: O que o Google Fonts gera por baixo

Acessando a URL do Google Fonts no navegador, voce ve algo como:

```css
/* latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5fBBc4.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

Cada bloco @font-face define:
- **font-family** — nome que voce usa no CSS
- **font-weight** — peso especifico deste bloco
- **font-display: swap** — mostra texto generico enquanto carrega, depois troca
- **src** — URL do arquivo da fonte no CDN do Google
- **unicode-range** — subconjunto de caracteres (otimizacao — so baixa os glifos necessarios para o idioma)

## Variacoes de URL do Google Fonts

### Um peso:
```
https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap
```

### Multiplos pesos:
```
https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap
```

### Multiplas fontes:
```
https://fonts.googleapis.com/css2?family=Playfair+Display&family=Roboto:wght@300;700&display=swap
```

### Com italico:
```
https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,700;1,300;1,700&display=swap
```