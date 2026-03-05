# Code Examples: Setup de Projeto Responsivo

## Estrutura completa de arquivos

```
zyngen/
├── index.html
├── styles/
│   ├── index.css
│   └── global.css
├── assets/
│   ├── icons/
│   │   ├── check.svg
│   │   ├── baseline-discord.svg
│   │   ├── tiktok.svg
│   │   ├── twitter.svg
│   │   └── users-tree.svg
│   ├── tela-app.png
│   └── hero-image.png
└── .gitignore
```

## index.html completo

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zyngen</title>
  <link rel="stylesheet" href="styles/index.css">
</head>
<body>
</body>
</html>
```

## styles/index.css

```css
@import url("global.css");

/* Estilos especificos da pagina serao adicionados aqui */
```

## styles/global.css

```css
/* Reset e variaveis globais serao adicionados aqui */
```

## .gitignore

```gitignore
# macOS
.DS_Store

# Editor
.vscode/
```

## Variacao: projeto com multiplas paginas

```
projeto/
├── index.html
├── about.html
├── styles/
│   ├── index.css
│   ├── about.css
│   └── global.css
└── assets/
    └── icons/
```

Cada pagina HTML importa seu proprio CSS, que por sua vez importa o global:

```css
/* styles/about.css */
@import url("global.css");

/* Estilos especificos de about */
```

## Configuracao do Responsively App

### Telas recomendadas para landing page responsiva

| Device | Largura | Altura | Uso |
|--------|---------|--------|-----|
| iPhone 6/7/8 | 375px | 667px | Mobile base |
| Nest Hub Max | 1280px | 800px | Desktop base |

### Telas extras para projetos mais complexos

| Device | Largura | Uso |
|--------|---------|-----|
| iPhone SE | 320px | Menor mobile |
| iPad | 768px | Tablet |
| Laptop | 1024px | Desktop pequeno |
| Full HD | 1920px | Monitor grande |

## Comandos Git para setup inicial

```bash
# Inicializar repositorio
git init

# Criar .gitignore antes do primeiro commit
echo ".DS_Store" >> .gitignore

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "chore: initial project setup with HTML/CSS structure and assets"
```

## Atalhos mencionados na aula

| Acao | Mac | Windows/Linux |
|------|-----|---------------|
| Exportar assets no Figma | Cmd+Shift+E | Ctrl+Shift+E |
| Recortar | Cmd+X | Ctrl+X |
| Colar | Cmd+V | Ctrl+V |