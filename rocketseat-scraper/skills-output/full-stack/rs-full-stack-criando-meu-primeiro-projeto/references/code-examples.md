# Code Examples: Criando Meu Primeiro Projeto HTML

## Exemplo completo do projeto da aula

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Site</title>
</head>
<body>
  <nav>
    <a href="#home">Home</a>
    <a href="#blog">Blog</a>
    <a href="#contato">Contato</a>
  </nav>
  <main>
    <section id="home">
      <h1>Bom te ver aqui no meu site ❤️</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
    </section>
    <section id="blog">
      <h2>Meu Blog</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
    </section>
    <section id="contato">
      <h2>Contato</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
    </section>
  </main>
</body>
</html>
```

## Variação: Link placeholder vs link com âncora

```html
<!-- Placeholder — não leva a lugar nenhum -->
<a href="#">Link sem destino</a>

<!-- Âncora interna — rola até o elemento com id="sobre" -->
<a href="#sobre">Sobre</a>

<!-- Destino da âncora -->
<section id="sobre">
  <h2>Sobre</h2>
</section>
```

## Variação: Estrutura mínima com Emmet

```html
<!-- Digitando ! + Enter no VS Code gera: -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>

<!-- Ajustes recomendados: -->
<!-- 1. lang="en" → lang="pt-br" -->
<!-- 2. title "Document" → nome do seu site -->
```

## Variação: Duplicando linhas para criar múltiplos links

```html
<!-- Passo 1: Escrever o primeiro link -->
<a href="#">Home</a>

<!-- Passo 2: Ctrl+C, Ctrl+V com cursor na linha (sem selecionar nada) -->
<a href="#">Home</a>
<a href="#">Home</a>
<a href="#">Home</a>

<!-- Passo 3: Editar cada um -->
<a href="#home">Home</a>
<a href="#blog">Blog</a>
<a href="#contato">Contato</a>
```

## Estrutura de pastas do projeto

```
projeto/
└── index.html    ← único arquivo nesta aula
```

Em projetos futuros, a estrutura cresce:

```
projeto/
├── index.html
├── styles/
│   └── style.css
├── scripts/
│   └── main.js
└── assets/
    └── images/
```