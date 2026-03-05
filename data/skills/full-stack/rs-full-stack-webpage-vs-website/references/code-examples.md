# Code Examples: WebPage vs WebSite

## Estrutura de uma WebPage simples

Uma unica pagina, um unico arquivo HTML (com CSS e JS opcionais):

```
minha-pagina/
├── index.html
├── style.css
└── script.js
```

```html
<!-- index.html — Uma WebPage completa -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minha Pagina</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Bem-vindo a minha pagina</h1>
  <p>Isso e uma WebPage — um unico documento acessado por uma URL.</p>
  <script src="script.js"></script>
</body>
</html>
```

Acessada pela URL: `https://meusite.com/` — essa e uma WebPage.

## Estrutura de um WebSite

Multiplas paginas conectadas por navegacao:

```
meu-site/
├── index.html          ← Home (WebPage 1)
├── catalogo.html       ← Catalogo (WebPage 2)
├── blog.html           ← Blog (WebPage 3)
├── sobre.html          ← Sobre (WebPage 4)
├── css/
│   └── style.css       ← Estilo compartilhado
└── js/
    └── script.js       ← Script compartilhado
```

```html
<!-- index.html — Home do WebSite -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>SkillzCity - Home</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav>
    <!-- Navegacao conecta as WebPages, formando o WebSite -->
    <a href="index.html">Home</a>
    <a href="catalogo.html">Catalogo</a>
    <a href="blog.html">Blog</a>
    <a href="sobre.html">Sobre</a>
  </nav>

  <main>
    <h1>Bem-vindo ao SkillzCity</h1>
    <p>Explore nosso catalogo e blog.</p>
  </main>
</body>
</html>
```

```html
<!-- catalogo.html — Outra WebPage do mesmo WebSite -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>SkillzCity - Catalogo</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav>
    <a href="index.html">Home</a>
    <a href="catalogo.html">Catalogo</a>
    <a href="blog.html">Blog</a>
    <a href="sobre.html">Sobre</a>
  </nav>

  <main>
    <h1>Nosso Catalogo</h1>
    <p>Cada produto pode ter sua propria WebPage tambem.</p>
  </main>
</body>
</html>
```

## Visualizacao da relacao

```
WebSite (skillzcity.com.br)
│
├── WebPage: /              → index.html    (Home)
├── WebPage: /catalogo      → catalogo.html (Catalogo)
├── WebPage: /blog          → blog.html     (Blog)
└── WebPage: /sobre         → sobre.html    (Sobre)

Cada URL = 1 WebPage
Todas juntas = 1 WebSite
```

## Exemplo com framework moderno (Next.js)

Em frameworks modernos, a mesma distincao se aplica via rotas:

```
app/
├── page.tsx            ← WebPage: / (Home)
├── catalogo/
│   └── page.tsx        ← WebPage: /catalogo
├── blog/
│   └── page.tsx        ← WebPage: /blog
└── sobre/
    └── page.tsx        ← WebPage: /sobre
```

Cada `page.tsx` representa uma WebPage. O conjunto de todas as rotas forma o WebSite. A tecnologia muda, mas o conceito permanece identico.