# Code Examples: HTML Semântico

## Exemplo 1: Página completa com semântica

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Site</title>
</head>
<body>
  <header>
    <h1>Nome do Site</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/sobre">Sobre</a></li>
        <li><a href="/contato">Contato</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h2>Artigo Principal</h2>
      <p>Conteúdo do artigo com <a href="/referencia">um link</a>.</p>
      <figure>
        <img src="foto.jpg" alt="Descrição da foto">
        <figcaption>Legenda da imagem</figcaption>
      </figure>
    </article>

    <aside>
      <h3>Links Relacionados</h3>
      <ul>
        <li><a href="/post-1">Post 1</a></li>
        <li><a href="/post-2">Post 2</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2025 Meu Site. Todos os direitos reservados.</p>
  </footer>
</body>
</html>
```

## Exemplo 2: A pergunta "tem uma tag pra isso?"

| Eu preciso de... | Tag semântica | Em vez de... |
|-------------------|---------------|--------------|
| Um título | `<h1>` a `<h6>` | `<div class="title">` |
| Um parágrafo | `<p>` | `<div class="text">` |
| Um link | `<a href="...">` | `<span onclick="...">` |
| Um botão | `<button>` | `<div class="btn">` |
| Uma imagem | `<img>` | `<div>` com background-image |
| Um vídeo | `<video>` | `<div>` com iframe genérico |
| Uma lista | `<ul>` / `<ol>` | `<div>` com `<div>` filhos |
| Uma tabela de dados | `<table>` | `<div>` com grid CSS |
| Navegação | `<nav>` | `<div class="navigation">` |
| Cabeçalho | `<header>` | `<div class="header">` |
| Rodapé | `<footer>` | `<div class="footer">` |
| Conteúdo principal | `<main>` | `<div class="content">` |
| Conteúdo independente | `<article>` | `<div class="post">` |
| Barra lateral | `<aside>` | `<div class="sidebar">` |
| Agrupamento temático | `<section>` | `<div class="section">` |

## Exemplo 3: Formulário semântico

```html
<form action="/contato" method="post">
  <fieldset>
    <legend>Dados Pessoais</legend>

    <label for="nome">Nome completo:</label>
    <input type="text" id="nome" name="nome" required>

    <label for="email">E-mail:</label>
    <input type="email" id="email" name="email" required>
  </fieldset>

  <fieldset>
    <legend>Mensagem</legend>

    <label for="assunto">Assunto:</label>
    <input type="text" id="assunto" name="assunto">

    <label for="mensagem">Mensagem:</label>
    <textarea id="mensagem" name="mensagem" rows="5"></textarea>
  </fieldset>

  <button type="submit">Enviar</button>
</form>
```

## Exemplo 4: Mídia semântica

```html
<!-- Imagem com contexto -->
<figure>
  <img src="grafico-vendas.png" alt="Gráfico mostrando crescimento de 40% nas vendas em 2025">
  <figcaption>Crescimento de vendas no primeiro trimestre de 2025</figcaption>
</figure>

<!-- Vídeo com fallback -->
<video controls width="640">
  <source src="tutorial.mp4" type="video/mp4">
  <source src="tutorial.webm" type="video/webm">
  <p>Seu navegador não suporta vídeo. <a href="tutorial.mp4">Baixe aqui</a>.</p>
</video>

<!-- Áudio -->
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg">
  <p>Seu navegador não suporta áudio. <a href="podcast.mp3">Baixe aqui</a>.</p>
</audio>
```

## Exemplo 5: Elementos semânticos menos conhecidos

```html
<!-- Detalhes expansíveis -->
<details>
  <summary>Perguntas Frequentes</summary>
  <p>Aqui estão as respostas para as perguntas mais comuns.</p>
</details>

<!-- Texto marcado/destacado -->
<p>O resultado da busca: <mark>HTML semântico</mark> é fundamental.</p>

<!-- Data/hora legível por máquina -->
<p>Publicado em <time datetime="2025-06-15">15 de junho de 2025</time>.</p>

<!-- Progresso -->
<label for="upload">Upload:</label>
<progress id="upload" value="70" max="100">70%</progress>

<!-- Abreviação -->
<p><abbr title="Search Engine Optimization">SEO</abbr> depende de HTML semântico.</p>
```