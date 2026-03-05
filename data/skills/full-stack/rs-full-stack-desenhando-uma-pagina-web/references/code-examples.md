# Code Examples: Estrutura Semantica de Paginas HTML

## Exemplo 1: Pagina basica (do instrutor)

O instrutor descreve esta estrutura visual:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Minha Pagina</title>
</head>
<body>
  <!-- Parte superior: logo + navegacao -->
  <header>
    <img src="logo.svg" alt="Logo do site" />
    <nav>
      <a href="/">Home</a>
      <a href="/sobre">Sobre</a>
      <a href="/contato">Contato</a>
    </nav>
  </header>

  <!-- Meio: informacoes principais -->
  <main>
    <section>
      <h1>Bem-vindo ao site</h1>
      <p>Esta e a secao principal com informacoes importantes.</p>
    </section>

    <section>
      <h2>Nossos servicos</h2>
      <p>Descricao dos servicos oferecidos.</p>
    </section>
  </main>

  <!-- Lateral: coisinhas extras -->
  <aside>
    <h3>Links uteis</h3>
    <ul>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/faq">FAQ</a></li>
    </ul>
  </aside>

  <!-- Rodape -->
  <footer>
    <p>&copy; 2026 Meu Site. Todos os direitos reservados.</p>
  </footer>
</body>
</html>
```

## Exemplo 2: Landing page

```html
<body>
  <header>
    <img src="brand.svg" alt="Brand" />
    <nav>
      <a href="#features">Features</a>
      <a href="#pricing">Precos</a>
      <a href="#contact">Contato</a>
    </nav>
  </header>

  <main>
    <section id="hero">
      <h1>Transforme sua produtividade</h1>
      <p>A ferramenta que voce precisa.</p>
      <a href="#pricing">Comece agora</a>
    </section>

    <section id="features">
      <h2>Features</h2>
      <article>
        <h3>Velocidade</h3>
        <p>10x mais rapido.</p>
      </article>
      <article>
        <h3>Seguranca</h3>
        <p>Criptografia de ponta a ponta.</p>
      </article>
    </section>

    <section id="pricing">
      <h2>Precos</h2>
      <p>A partir de R$29/mes.</p>
    </section>
  </main>

  <footer>
    <nav>
      <a href="/termos">Termos</a>
      <a href="/privacidade">Privacidade</a>
    </nav>
    <p>&copy; 2026 Brand</p>
  </footer>
</body>
```

## Exemplo 3: Blog com aside

```html
<body>
  <header>
    <h1>Meu Blog</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/categorias">Categorias</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>Como aprender HTML semantico</h2>
      <p>HTML semantico e a base de qualquer pagina web bem construida...</p>
    </article>

    <article>
      <h2>CSS Grid vs Flexbox</h2>
      <p>Entenda quando usar cada um...</p>
    </article>
  </main>

  <aside>
    <section>
      <h3>Sobre o autor</h3>
      <p>Desenvolvedor front-end.</p>
    </section>
    <section>
      <h3>Posts populares</h3>
      <ul>
        <li><a href="/post-1">Post 1</a></li>
        <li><a href="/post-2">Post 2</a></li>
      </ul>
    </section>
  </aside>

  <footer>
    <p>&copy; 2026 Meu Blog</p>
  </footer>
</body>
```

## Variacao: Sem aside (pagina simples)

```html
<body>
  <header>
    <nav>
      <a href="/">Home</a>
    </nav>
  </header>

  <main>
    <section>
      <h1>Pagina simples</h1>
      <p>Nem toda pagina precisa de aside.</p>
    </section>
  </main>

  <footer>
    <p>Rodape minimo.</p>
  </footer>
</body>
```