---
name: rs-full-stack-iniciando-o-projeto-8
description: "Applies initial project setup workflow for CSS animation landing pages. Use when user asks to 'start a new project', 'setup HTML CSS project', 'configure a landing page', 'initialize frontend project', or 'create project structure'. Follows folder organization, font imports, CSS variables, and Git init patterns from Skillz methodology. Make sure to use this skill whenever creating a new vanilla HTML/CSS project from scratch. Not for React/Next.js projects, backend setup, or existing project modifications."
---

# Setup Inicial de Projeto HTML/CSS

> Configurar a estrutura completa de um projeto frontend vanilla antes de escrever qualquer codigo de producao.

## Prerequisites

- Visual Studio Code (ou editor equivalente)
- Live Preview plugin (Microsoft) ou Live Server
- Git instalado
- Acesso ao Google Fonts

## Steps

### Step 1: Criar estrutura de pastas

```
projeto/
├── index.html
├── styles/
│   ├── index.css
│   └── global.css
└── assets/
    ├── images/
    ├── icons/
    └── hero/
```

Cuidado: `assets/` deve ficar na raiz, nao dentro de `styles/`.

### Step 2: Configurar index.html

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nome do Projeto</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fonte1&family=Fonte2&display=swap" rel="stylesheet">
  <!-- Styles -->
  <link rel="stylesheet" href="styles/index.css">
</head>
<body>
</body>
</html>
```

### Step 3: Configurar index.css com import do global

```css
@import url("global.css");
```

### Step 4: Configurar global.css com reset e variaveis

```css
* {
  margin: 0;
  padding: 0;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}

:root {
  /* Cores do Style Guide */
  --color-primary: #valor;
  --color-secondary: #valor;
  --color-background: #valor;

  /* Tipografia */
  --ff-base: "Montserrat", sans-serif;
  --ff-heading: "Cine", sans-serif;

  /* Tamanhos */
  --text-small: 0.875rem;
  --text-base: 1rem;
  --text-large: 2.5rem;
  --text-extra-large: 4rem;
}

html {
  font-family: var(--ff-base);
  font-weight: 500;
}

h1, h2 {
  font-family: var(--ff-heading);
}

h1 {
  font-size: var(--text-extra-large);
  line-height: 1.25;
}

h2 {
  font-size: var(--text-large);
  line-height: 1.2;
}
```

### Step 5: Organizar assets do Style Guide

1. Exportar assets do Figma (Ctrl+Shift+E / Cmd+Shift+E)
2. Separar em subpastas: `images/`, `icons/`, `hero/`
3. Renomear arquivos para minusculo com hifens: `star-1.png`, `ellipse.png`
4. Numerar imagens sequenciais: `01.png`, `02.png`

### Step 6: Extrair cores do Style Guide para CSS variables

Abrir o Style Guide no Figma, copiar cada cor e nomear conforme o design token original.

### Step 7: Importar fontes do Google Fonts

1. Ir em fonts.google.com
2. Selecionar cada fonte com os pesos necessarios (bold, medium)
3. Get Embed Code → copiar o link
4. Colar no `<head>` do HTML, antes do link do CSS

### Step 8: Inicializar Git

```bash
git init
git add .
git commit -m "Initial commit"
```

## Output format

Projeto pronto para desenvolvimento com:
- HTML base configurado com lang, viewport, fonts e CSS linkados
- CSS global com reset, box-sizing, variaveis de cor e tipografia
- Assets organizados em subpastas nomeadas consistentemente
- Repositorio Git inicializado com primeiro commit

## Verification

- Abrir com Live Preview e verificar se CSS esta sendo aplicado (testar com background-color temporario)
- Confirmar que `@import` do global.css funciona no index.css
- Verificar que todas as fontes carregam (inspecionar Network tab)

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto vanilla HTML/CSS | Usar esta estrutura |
| Projeto com framework (React, Next) | Seguir convencoes do framework |
| Assets com nomes maiusculos/espacos | Renomear para minusculo com hifens |
| Fonte nao aparece no Style Guide mas esta no design | Verificar no Figma os estilos aplicados |
| Duvida se imagem esta na proporcao correta | Exportar como esta, ajustar depois se necessario |

## Anti-patterns

| Evitar | Fazer |
|--------|-------|
| Pasta assets dentro de styles | Assets na raiz do projeto |
| Nomes de arquivo com espaco ou maiuscula | `star-1.png` minusculo com hifen |
| Escrever CSS sem variaveis de cor | Extrair cores do Style Guide para `:root` primeiro |
| Comecar a codar sem commit inicial | `git init` + commit antes de qualquer feature |
| Usar valores magicos de font-size | Converter px para rem (dividir por 16) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de projeto e workflow do instrutor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes