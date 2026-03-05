# Code Examples: Caminhos Relativos em Pastas Diferentes

## Estrutura de projeto usada na aula

```
projeto/
├── index.html
└── subpasta/
    └── second.html
```

## Exemplo 1: index.html linkando para second.html (subpasta)

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Índice</title>
</head>
<body>
    <!-- Forma 1: com ponto-barra explicito -->
    <a href="./subpasta/second.html">Ver second (com ./)</a>

    <!-- Forma 2: sem ponto-barra (mais comum) -->
    <a href="subpasta/second.html">Ver second</a>
</body>
</html>
```

## Exemplo 2: second.html voltando para index.html (subir nivel)

```html
<!-- subpasta/second.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Second</title>
</head>
<body>
    <a href="../index.html">Voltar ao índice</a>
</body>
</html>
```

## Variacao: estrutura mais profunda

```
projeto/
├── index.html
├── pages/
│   ├── about.html
│   └── contact.html
├── styles/
│   └── main.css
├── scripts/
│   └── app.js
└── images/
    └── logo.png
```

### De index.html para about.html

```html
<a href="pages/about.html">Sobre</a>
```

### De about.html para index.html

```html
<a href="../index.html">Home</a>
```

### De about.html para contact.html (mesma pasta)

```html
<a href="contact.html">Contato</a>
<!-- ou -->
<a href="./contact.html">Contato</a>
```

### De about.html para main.css (pasta irma)

```html
<link rel="stylesheet" href="../styles/main.css">
```

### De about.html para logo.png (pasta irma)

```html
<img src="../images/logo.png" alt="Logo">
```

### De about.html para app.js (pasta irma)

```html
<script src="../scripts/app.js"></script>
```

## Variacao: dois niveis de profundidade

```
projeto/
├── index.html
└── pages/
    └── blog/
        └── post.html
```

### De post.html para index.html (subir dois niveis)

```html
<a href="../../index.html">Home</a>
```

## Exemplo de erro: caminho incorreto

```html
<!-- second.html esta em subpasta/, mas o link aponta direto -->
<a href="second.html">Ver second</a>
<!-- Resultado: 404 File Not Found -->

<!-- Correcao: -->
<a href="subpasta/second.html">Ver second</a>
```

## Resumo visual de resolucao

```
Arquivo atual: /projeto/pages/about.html

"contact.html"           → /projeto/pages/contact.html       (mesma pasta)
"./contact.html"         → /projeto/pages/contact.html       (mesma pasta, explicito)
"../index.html"          → /projeto/index.html               (subiu 1 nivel)
"../styles/main.css"     → /projeto/styles/main.css          (subiu 1, desceu em styles)
"../../outro/file.html"  → /outro/file.html                  (subiu 2 niveis, desceu em outro)
```