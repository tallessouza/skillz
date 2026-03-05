# Code Examples: Tags header, main, aside e footer

## Exemplo 1: Página mínima

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha Página</title>
</head>
<body>
  <header>
    <h1>Meu Site</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/sobre">Sobre</a>
    </nav>
  </header>

  <main>
    <h2>Bem-vindo</h2>
    <p>Este é o conteúdo principal da página.</p>
  </main>

  <footer>
    <p>&copy; 2024 Meu Site</p>
  </footer>
</body>
</html>
```

## Exemplo 2: Blog com aside

```html
<body>
  <header>
    <h1>Blog de Tecnologia</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/artigos">Artigos</a>
      <a href="/contato">Contato</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>Como aprender HTML</h2>
      <p>HTML é a base de toda página web...</p>
      <p>Comece pelos fundamentos e pratique bastante.</p>
    </article>
  </main>

  <aside>
    <h3>Artigos Relacionados</h3>
    <ul>
      <li><a href="/css-basico">CSS Básico</a></li>
      <li><a href="/javascript-intro">Introdução ao JavaScript</a></li>
    </ul>
  </aside>

  <footer>
    <nav>
      <a href="/privacidade">Privacidade</a>
      <a href="/termos">Termos de Uso</a>
    </nav>
    <p>&copy; 2024 Blog Tech</p>
  </footer>
</body>
```

## Exemplo 3: Landing page (sem aside)

```html
<body>
  <header>
    <img src="logo.png" alt="Logo da Empresa">
    <nav>
      <a href="#features">Features</a>
      <a href="#pricing">Preços</a>
      <a href="#contact">Contato</a>
    </nav>
  </header>

  <main>
    <section id="hero">
      <h1>O melhor produto do mercado</h1>
      <p>Resolva seus problemas com nossa solução.</p>
    </section>

    <section id="features">
      <h2>Features</h2>
      <p>Rápido, seguro e fácil de usar.</p>
    </section>

    <section id="pricing">
      <h2>Preços</h2>
      <p>A partir de R$ 29/mês.</p>
    </section>
  </main>

  <footer>
    <p>Empresa LTDA — CNPJ 00.000.000/0001-00</p>
    <p>&copy; 2024</p>
  </footer>
</body>
```

## Exemplo 4: Aside como extensão do conteúdo

```html
<main>
  <h1>Receita de Bolo de Chocolate</h1>
  <p>Ingredientes: farinha, ovos, chocolate...</p>
  <p>Modo de preparo: misture tudo e leve ao forno...</p>
</main>

<aside>
  <h2>Dicas do Chef</h2>
  <p>Use chocolate 70% para um sabor mais intenso.</p>
  <p>Deixe esfriar antes de desenformar.</p>
</aside>
```

## Exemplo 5: Footer com navegação (mencionado pelo instrutor)

```html
<footer>
  <nav>
    <h3>Navegação</h3>
    <a href="/">Home</a>
    <a href="/sobre">Sobre</a>
    <a href="/contato">Contato</a>
  </nav>

  <div>
    <h3>Redes Sociais</h3>
    <a href="https://twitter.com/exemplo">Twitter</a>
    <a href="https://github.com/exemplo">GitHub</a>
  </div>

  <p>&copy; 2024 Meu Site. Todos os direitos reservados.</p>
</footer>
```