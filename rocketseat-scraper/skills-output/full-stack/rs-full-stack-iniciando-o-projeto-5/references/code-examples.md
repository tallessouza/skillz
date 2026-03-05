# Code Examples: Iniciando Projeto HTML/CSS

## Exemplo 1: HTML base do projeto

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles/index.css">
  <title>travel-gram</title>
</head>
<body>
</body>
</html>
```

**Pontos-chave:**
- O `<link>` aponta para `styles/index.css`, nao para `global.css`
- O path inclui a pasta: `styles/index.css`
- Emmet shortcut no VS Code: digite `!` e pressione Tab

## Exemplo 2: index.css como hub de imports

```css
@import url("global.css");
```

**Conforme o projeto cresce:**

```css
@import url("global.css");
@import url("header.css");
@import url("profile.css");
@import url("gallery.css");
@import url("footer.css");
```

A ordem dos imports define a cascata — `global.css` sempre primeiro.

## Exemplo 3: global.css — reset universal

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

**Variacao com mais resets comuns (alem do que a aula mostra):**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

img {
  max-width: 100%;
  display: block;
}

a {
  text-decoration: none;
  color: inherit;
}

ul, ol {
  list-style: none;
}
```

## Exemplo 4: .gitignore

**Mac:**
```gitignore
.DS_Store
```

**Windows:**
```gitignore
Thumbs.db
desktop.ini
```

**Completo para projetos web:**
```gitignore
.DS_Store
Thumbs.db
node_modules/
.env
*.log
```

## Exemplo 5: Comandos git

```bash
# Inicializar git na pasta atual
git init .

# Verificar status
git status

# Adicionar tudo ao stage
git add .

# Commit inicial
git commit -m "initial commit"
```

## Exemplo 6: Estrutura final do projeto

```
projeto-travel-gram/
├── .git/
├── .gitignore
├── index.html
└── styles/
    ├── index.css      # @import url("global.css");
    └── global.css     # * { margin: 0; padding: 0; box-sizing: border-box; }
```