# Code Examples: Adicionando CSS no HTML

## Forma 1: Atributo style inline (evitar)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Exemplo Inline</title>
</head>
<body style="background-color: red">
  <h1>Conteudo</h1>
</body>
</html>
```

Qualquer tag aceita o atributo style. Funciona, mas a especificidade altissima torna impossivel sobrescrever via CSS externo sem `!important`.

## Forma 2: Tag `<style>` embutida (evitar)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Exemplo Embutido</title>
  <style>
    body {
      background-color: blue;
    }
  </style>
</head>
<body>
  <h1>Conteudo</h1>
</body>
</html>
```

Funciona e tem especificidade normal, mas mistura HTML com CSS no mesmo arquivo.

## Forma 3: Arquivo externo (recomendado)

### index.html
```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Exemplo Externo</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Conteudo</h1>
</body>
</html>
```

### style.css
```css
body {
  background-color: bisque;
}
```

## Variacao: CSS em subpasta

### Estrutura
```
projeto/
├── index.html
├── css/
│   └── style.css
└── pages/
    └── about.html
```

### index.html (raiz)
```html
<link rel="stylesheet" href="css/style.css">
```

### pages/about.html (subpasta)
```html
<link rel="stylesheet" href="../css/style.css">
```

## Variacao: Multiplos arquivos CSS

```html
<head>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
```

A ordem importa — o ultimo arquivo tem prioridade na cascata quando especificidades sao iguais.

## Autocomplete do VS Code

O instrutor mostra que ao digitar `link` dentro do `<head>`, o VS Code sugere `link:css`. Ao pressionar Enter, gera automaticamente:

```html
<link rel="stylesheet" href="style.css">
```

O VS Code tambem autocompleta o valor do `href` baseado nos arquivos `.css` existentes no projeto. Isso so funciona se o arquivo ja foi criado antes de digitar o link.