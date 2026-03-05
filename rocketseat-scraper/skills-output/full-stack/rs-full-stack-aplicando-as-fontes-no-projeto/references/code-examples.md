# Code Examples: Tipografia Web com Google Fonts e Variáveis CSS

## Exemplo completo do HTML (head)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Preconnect (sempre antes do link da fonte) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="style.css">
  <title>Portal de Notícias</title>
</head>
<body>
  <h1>Título principal</h1>
  <h2>Subtítulo</h2>
  <a href="#">Link de exemplo</a>
  <p>Texto padrão do portal</p>
</body>
</html>
```

## Exemplo completo do CSS (variáveis + aplicação)

```css
:root {
  /* Cores */
  --brand-color-light: #8257e5;
  
  /* Font family base */
  --font-family: "Archivo", sans-serif;
  
  /* Hierarquia tipográfica: weight size/line-height family */
  --h1: 800 24px/135% var(--font-family);
  --h2: 800 16px/140% var(--font-family);
  --h3: 800 14px/140% var(--font-family);
  --text-span: 600 14px/145% var(--font-family);
  --text: 400 16px/140% var(--font-family);
  --text-sm: 400 14px/160% var(--font-family);
}

/* Aplicação base */
body {
  font: var(--text);
}

/* Reset de herança para headings */
h1, h2, h3 {
  font: inherit;
}

/* Links */
a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  color: var(--brand-color-light);
}
```

## Variação: Aplicando em cards com contextos diferentes

```css
/* Card de destaque — usa tipografia de h1 */
.card-destaque {
  font: var(--h1);
}

/* Card lateral — usa tipografia de h2 */
.card-lateral {
  font: var(--h2);
}

/* Card pequeno — usa tipografia de h3 */
.card-small {
  font: var(--h3);
}
```

```html
<!-- O h2 aqui herda font do .card-destaque (--h1) -->
<div class="card-destaque">
  <h2>Notícia em destaque</h2>
  <p>Texto da notícia...</p>
</div>

<!-- O h2 aqui herda font do .card-lateral (--h2) -->
<div class="card-lateral">
  <h2>Notícia lateral</h2>
  <p>Texto da notícia...</p>
</div>
```

## Variação: Usando as variáveis de texto em spans

```html
<p>Texto normal com <span class="highlight">destaque aqui</span> e mais texto.</p>
```

```css
.highlight {
  font: var(--text-span);
}
```

## Variação: Texto small para metadados

```css
.meta-info,
.caption,
.footer-text {
  font: var(--text-sm);
}
```

```html
<article>
  <h2>Título da notícia</h2>
  <span class="meta-info">Publicado em 01/03/2026</span>
  <p>Conteúdo da notícia...</p>
</article>
```

## .gitignore básico

```gitignore
# macOS
.DS_Store

# Windows
Thumbs.db

# IDEs
.vscode/
.idea/
```