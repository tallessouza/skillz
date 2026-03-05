# Code Examples: Caminhos Relativos na Mesma Pasta

## Exemplo base da aula

### Estrutura de pastas

```
projeto/
├── index.html
└── second.html
```

### index.html — com ./

```html
<!DOCTYPE html>
<html>
<head>
    <title>Index</title>
</head>
<body>
    <a href="./second.html">Ver o second</a>
</body>
</html>
```

### index.html — sem ./

```html
<!DOCTYPE html>
<html>
<head>
    <title>Index</title>
</head>
<body>
    <a href="second.html">Ver o second</a>
</body>
</html>
```

### second.html

```html
<!DOCTYPE html>
<html>
<head>
    <title>Second</title>
</head>
<body>
    <p>Estou no second</p>
    <a href="index.html">Voltar</a>
</body>
</html>
```

## Variacoes praticas

### Navegacao com multiplas paginas na mesma pasta

```
projeto/
├── index.html
├── about.html
├── contact.html
└── services.html
```

```html
<!-- Navegacao reutilizavel em todas as paginas -->
<nav>
    <a href="index.html">Home</a>
    <a href="about.html">Sobre</a>
    <a href="services.html">Servicos</a>
    <a href="contact.html">Contato</a>
</nav>
```

### Referenciando imagens na mesma pasta

```
projeto/
├── index.html
├── logo.png
└── foto.jpg
```

```html
<img src="logo.png" alt="Logo">
<img src="./foto.jpg" alt="Foto">
<!-- Ambas as formas funcionam -->
```

### Referenciando CSS e JS na mesma pasta

```
projeto/
├── index.html
├── style.css
└── script.js
```

```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

## Comparacao: relativo vs absoluto

```html
<!-- RELATIVO (correto para projetos) -->
<a href="second.html">Link</a>
<img src="foto.jpg" alt="Foto">
<link rel="stylesheet" href="style.css">

<!-- ABSOLUTO com file:// (nunca use em codigo) -->
<a href="file:///Users/joao/projeto/second.html">Link</a>
<img src="file:///Users/joao/projeto/foto.jpg" alt="Foto">

<!-- ABSOLUTO com http (so com servidor rodando) -->
<a href="http://localhost:3000/second.html">Link</a>
```

## Atalhos de teclado mencionados na aula

| Acao | Windows | Mac |
|------|---------|-----|
| Salvar | Ctrl + S | Cmd + S |
| Atualizar navegador | Ctrl + R | Cmd + R |