# Code Examples: Caminhos Absolutos e Relativos

## Estrutura base para todos os exemplos

```
projeto/
├── index.html
├── about.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── images/
│   └── logo.png
└── pages/
    ├── contact.html
    └── blog/
        └── post.html
```

## 1. Caminhos absolutos — URLs externas

```html
<!-- Protocolo HTTPS completo -->
<a href="https://google.com/">Google</a>
<a href="https://skillz.com.br/">Skillz</a>

<!-- CDN externo -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css">
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
```

## 2. Caminho absoluto local (file://) — apenas para testes

```html
<!-- Mac -->
<a href="file:///Users/mike/Desktop/projeto/index.html">Home</a>

<!-- Windows (note as barras) -->
<a href="file:///C:/Users/mike/Desktop/projeto/index.html">Home</a>

<!-- NUNCA use isso em producao — vai quebrar em outra maquina -->
```

## 3. Caminhos relativos — mesma pasta

```html
<!-- De index.html para about.html (ambos na raiz do projeto) -->
<a href="about.html">Sobre</a>
<a href="./about.html">Sobre</a>  <!-- equivalente -->
```

## 4. Caminhos relativos — entrando em subpastas

```html
<!-- De index.html para arquivos em subpastas -->
<link rel="stylesheet" href="css/style.css">
<script src="js/app.js"></script>
<img src="images/logo.png" alt="Logo">
<a href="pages/contact.html">Contato</a>

<!-- Subpasta dentro de subpasta -->
<a href="pages/blog/post.html">Post do Blog</a>
```

## 5. Caminhos relativos — subindo niveis

```html
<!-- De pages/contact.html para index.html -->
<a href="../index.html">Home</a>

<!-- De pages/contact.html para css/style.css -->
<link rel="stylesheet" href="../css/style.css">

<!-- De pages/blog/post.html para index.html (subir 2 niveis) -->
<a href="../../index.html">Home</a>

<!-- De pages/blog/post.html para css/style.css (subir 2, entrar em css/) -->
<link rel="stylesheet" href="../../css/style.css">

<!-- De pages/blog/post.html para pages/contact.html (subir 1 nivel) -->
<a href="../contact.html">Contato</a>
```

## 6. Comparacao lado a lado

```html
<!-- ERRADO: caminho absoluto local -->
<img src="/Users/mike/Desktop/projeto/images/logo.png" alt="Logo">
<link rel="stylesheet" href="C:\Users\joao\projeto\css\style.css">

<!-- CORRETO: caminho relativo -->
<img src="images/logo.png" alt="Logo">
<link rel="stylesheet" href="css/style.css">

<!-- CORRETO: URL externa com protocolo -->
<img src="https://example.com/images/logo.png" alt="Logo">
```

## 7. Exemplo completo — pagina com todos os tipos de caminho

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Meu Projeto</title>
    
    <!-- Relativo: CSS local na subpasta -->
    <link rel="stylesheet" href="css/style.css">
    
    <!-- Absoluto: CSS externo via CDN -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">
</head>
<body>
    <!-- Relativo: imagem na subpasta -->
    <img src="images/logo.png" alt="Logo">
    
    <!-- Relativo: link para pagina na mesma pasta -->
    <a href="about.html">Sobre</a>
    
    <!-- Relativo: link para pagina em subpasta -->
    <a href="pages/contact.html">Contato</a>
    
    <!-- Absoluto: link externo -->
    <a href="https://skillz.com.br/">Skillz</a>
    
    <!-- Relativo: script local -->
    <script src="js/app.js"></script>
</body>
</html>
```

## 8. Exemplo de navegacao entre paginas

### index.html (raiz)
```html
<nav>
    <a href="pages/contact.html">Contato</a>
    <a href="pages/blog/post.html">Blog</a>
</nav>
```

### pages/contact.html
```html
<nav>
    <a href="../index.html">Home</a>
    <a href="blog/post.html">Blog</a>
</nav>
```

### pages/blog/post.html
```html
<nav>
    <a href="../../index.html">Home</a>
    <a href="../contact.html">Contato</a>
</nav>
<!-- Imagem que esta em images/ na raiz do projeto -->
<img src="../../images/logo.png" alt="Logo">
```

## 9. Terminal — verificando caminhos

```bash
# Ver pasta atual (caminho absoluto)
pwd
# /Users/mike/Desktop/projeto

# Listar arquivos na pasta atual
ls
# index.html  about.html  css/  js/  images/  pages/

# A barra / sozinha e a raiz do computador
ls /
# Applications  Library  System  Users  ...
```