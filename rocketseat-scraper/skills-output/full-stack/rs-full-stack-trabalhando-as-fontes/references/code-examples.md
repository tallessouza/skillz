# Code Examples: Trabalhando as Fontes

## Exemplo completo do HTML (head)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagina de Receita</title>

  <link rel="stylesheet" href="style.css">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alice&display=swap" rel="stylesheet">
</head>
<body>
  <!-- conteudo -->
</body>
</html>
```

## CSS completo da aula

```css
:root {
  font-family: "Alice", serif;
  line-height: 150%;
  color: #4F5666;
}

h1 {
  font-size: 40px;
  line-height: 140%;
  color: #1B1B1F;
}

h2 {
  font-size: 24px;
  color: #1B1B1F;
}
```

## Variacao: multiplas fontes

Se o projeto tivesse duas fontes (ex: Alice para headings, Inter para corpo):

```html
<link href="https://fonts.googleapis.com/css2?family=Alice&family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

```css
:root {
  font-family: "Inter", sans-serif;
  line-height: 150%;
  color: #4F5666;
}

h1, h2, h3 {
  font-family: "Alice", serif;
  color: #1B1B1F;
}

h1 {
  font-size: 40px;
  line-height: 140%;
}

h2 {
  font-size: 24px;
}
```

## Variacao: usando CSS custom properties para cores

```css
:root {
  --text-color-primary: #1B1B1F;
  --text-color-secondary: #4F5666;

  font-family: "Alice", serif;
  line-height: 150%;
  color: var(--text-color-secondary);
}

h1 {
  font-size: 40px;
  line-height: 140%;
  color: var(--text-color-primary);
}

h2 {
  font-size: 24px;
  color: var(--text-color-primary);
}
```

## Variacao: font-size com clamp (responsivo)

```css
h1 {
  font-size: clamp(28px, 5vw, 40px);
  line-height: 140%;
  color: #1B1B1F;
}

h2 {
  font-size: clamp(20px, 3vw, 24px);
  color: #1B1B1F;
}
```

## Checklist de implementacao

1. [ ] Fonte importada no `<head>` via Google Fonts link
2. [ ] `font-family` aplicado no `:root`
3. [ ] `line-height` padrao definido no `:root`
4. [ ] `color` geral (secundaria) definida no `:root`
5. [ ] `h1` com font-size, line-height e color especificos
6. [ ] `h2` com font-size e color especificos
7. [ ] Paragrafos herdam do `:root` (nenhuma declaracao extra necessaria)