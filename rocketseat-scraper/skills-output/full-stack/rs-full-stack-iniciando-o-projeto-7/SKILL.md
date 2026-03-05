---
name: rs-full-stack-iniciando-o-projeto-7
description: "Guides responsive landing page project setup with HTML/CSS structure, Figma asset export, and Responsively App configuration for multi-device preview. Use when user asks to 'create a landing page', 'start a responsive project', 'setup responsive preview', or 'configure multi-device testing'. Make sure to use this skill whenever starting a new responsive web project from a Figma design. Not for React/framework projects, backend setup, or deployment."
---

# Setup de Projeto Responsivo com Landing Page

> Configure a estrutura inicial de um projeto HTML/CSS responsivo com assets do Figma e preview multi-device via Responsively App.

## Prerequisites

- Visual Studio Code (ou Insiders) com extensao Live Preview
- Figma com acesso ao Style Guide do projeto
- Responsively App instalado (gratuito em responsively.app)
- Git inicializado

## Steps

### Step 1: Criar estrutura de pastas e arquivos

```
projeto/
├── index.html
├── styles/
│   ├── index.css
│   └── global.css
└── assets/
    └── icons/
```

### Step 2: Criar o HTML base

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nome do Projeto</title>
  <link rel="stylesheet" href="styles/index.css">
</head>
<body>
</body>
</html>
```

### Step 3: Configurar CSS com import do global

```css
/* styles/index.css */
@import url("global.css");
```

### Step 4: Exportar assets do Figma

1. Abrir o Style Guide no Figma
2. Selecionar todos os assets (Ctrl+Shift+E / Cmd+Shift+E)
3. Clicar em Export e salvar na pasta `assets/`
4. Separar SVGs (icones) na subpasta `assets/icons/`
5. Manter PNGs (imagens maiores) na raiz de `assets/`

### Step 5: Configurar Responsively App

1. Abrir Responsively App
2. Em "Manage Suites", configurar duas telas:
   - **Mobile:** 375px de largura (ex: iPhone 6)
   - **Desktop:** 1280x800 (ex: Nest Hub Max)
3. Desmarcar todas as outras telas
4. Iniciar Live Preview no VS Code, copiar a URL
5. Colar a URL no Responsively App

### Step 6: Iniciar Git

```bash
# Criar .gitignore (Mac: incluir .DS_Store)
echo ".DS_Store" >> .gitignore

git init
git add .
git commit -m "chore: initial project setup"
```

## Output format

Projeto funcional com:
- `index.html` servindo via Live Preview
- CSS modular (index.css importa global.css)
- Assets organizados (icons/ para SVGs, raiz para PNGs)
- Preview simultaneo mobile + desktop no Responsively App

## Error handling

- Se Responsively App nao mostra a pagina: verificar se a URL do Live Preview esta correta e acessivel
- Se assets do Figma exportam sem cor: icones SVG podem precisar de ajuste via CSS (sera abordado em aulas seguintes)
- Se Live Preview nao atualiza: verificar se a extensao Live Preview esta instalada e ativa

## Verification

- Abrir Responsively App e confirmar que ambas as telas (375px e 1280px) renderizam o HTML
- Confirmar que `styles/index.css` carrega sem erro 404 no console
- Confirmar que o commit inicial foi criado com `git log`

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto tem muitos icones SVG | Separar em `assets/icons/` |
| Precisa testar breakpoints intermediarios | Adicionar telas extras no Responsively App |
| Design tem apenas mobile-first | Comecar com tela de 375px como base |
| Assets do Figma tem nomes ruins | Renomear para kebab-case descritivo antes de commitar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de projeto responsivo e ferramentas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes