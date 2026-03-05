# Code Examples: Tags nav, section e article

## Exemplo 1: Nav basico com lista de links

Direto da aula — navegacao com logomarca e lista:

```html
<nav>
  <a href="#">Logomarca</a>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#contato">Contato</a></li>
    <li><a href="#projetos">Projetos</a></li>
  </ul>
</nav>
```

## Exemplo 2: Nav dentro de header

```html
<header>
  <nav>
    <a href="#">Logomarca</a>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#contato">Contato</a></li>
      <li><a href="#projetos">Projetos</a></li>
    </ul>
  </nav>
</header>
```

## Exemplo 3: Nav fora de header (igualmente valido)

```html
<nav>
  <a href="#">Logomarca</a>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#contato">Contato</a></li>
  </ul>
</nav>
<header>
  <h1>Bem-vindo ao meu site</h1>
</header>
```

## Exemplo 4: Sections nomeadas da aula

```html
<section id="home">
  <h2>Home</h2>
  <p>Conteudo da pagina inicial.</p>
</section>

<section id="projetos">
  <h2>Projetos</h2>
  <p>Lista de projetos.</p>
</section>

<section id="contato">
  <h2>Contato</h2>
  <p>Formulario de contato.</p>
</section>
```

## Exemplo 5: Section dentro de aside

```html
<aside>
  <section id="links-uteis">
    <h2>Links Uteis</h2>
    <ul>
      <li><a href="#">Documentacao</a></li>
      <li><a href="#">Tutorial</a></li>
    </ul>
  </section>
  <section id="sobre-autor">
    <h2>Sobre o Autor</h2>
    <p>Informacoes complementares.</p>
  </section>
</aside>
```

## Exemplo 6: Article basico da aula

```html
<article>
  <h1>Titulo do Artigo</h1>
  <p>Conteudo do artigo...</p>
</article>
```

## Exemplo 7: Article com sections internas (subtitulos)

```html
<main>
  <article>
    <h1>Como Aprender HTML Semantico</h1>

    <section>
      <h2>Por que semantica importa</h2>
      <p>Tags semanticas comunicam significado...</p>
    </section>

    <section>
      <h2>Tags estruturais principais</h2>
      <p>Header, main, footer, nav, section, article...</p>
    </section>

    <section>
      <h2>Conclusao</h2>
      <p>Use a tag certa no lugar certo.</p>
    </section>
  </article>
</main>
```

## Exemplo 8: Pagina completa com todas as tags estruturais

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu Site</title>
</head>
<body>
  <header>
    <nav>
      <a href="#">Logo</a>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#projetos">Projetos</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h1>Bem-vindo</h1>
      <section>
        <h2>Sobre</h2>
        <p>Apresentacao do site.</p>
      </section>
      <section>
        <h2>Destaques</h2>
        <p>Conteudo em destaque.</p>
      </section>
    </article>
  </main>

  <aside>
    <section id="links-uteis">
      <h2>Links Uteis</h2>
      <ul>
        <li><a href="#">Recurso 1</a></li>
        <li><a href="#">Recurso 2</a></li>
      </ul>
    </section>
  </aside>

  <footer>
    <p>Rodape do site</p>
  </footer>
</body>
</html>
```

## Exemplo 9: Article sem main (pattern alternativo mencionado na aula)

Algumas pessoas usam article diretamente sem main:

```html
<body>
  <header>
    <nav>...</nav>
  </header>

  <article>
    <h1>Meu Post</h1>
    <p>Conteudo principal sem tag main envolvendo.</p>
  </article>

  <footer>...</footer>
</body>
```

Funciona, mas `<main><article>` e semanticamente mais completo.

## Variacoes: Multiplos navs na mesma pagina

```html
<!-- Nav principal no header -->
<header>
  <nav aria-label="Principal">
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#sobre">Sobre</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>...</article>
</main>

<!-- Nav secundario no footer -->
<footer>
  <nav aria-label="Rodape">
    <ul>
      <li><a href="#privacidade">Privacidade</a></li>
      <li><a href="#termos">Termos</a></li>
    </ul>
  </nav>
</footer>
```