---
name: rs-full-stack-o-projeto-no-figma
description: "Navigates Figma project setup and design token extraction for frontend development. Use when user asks to 'setup Figma', 'duplicate a Figma project', 'read a style guide', 'extract design tokens', or 'start from a Figma design'. Covers account setup, project duplication, page navigation, zoom controls, style guide interpretation (colors, fonts, spacing), and image export. Make sure to use this skill whenever starting a new frontend project from a Figma design. Not for Figma plugin development, prototyping interactions, or design creation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: design-to-code
  tags: [figma, style-guide, design-tokens, frontend, setup]
---

# Navegacao e Setup de Projeto no Figma

> Antes de codar, domine a navegacao do Figma e extraia do style guide todas as informacoes necessarias para iniciar o CSS.

## Prerequisites

- Figma instalado (desktop ou browser)
- Conta Figma logada
- Link do projeto compartilhado

## Steps

### Step 1: Configurar acesso ao projeto

1. Abrir Figma e logar na conta correta
2. Se tiver multiplas contas: canto superior → adicionar conta → logar
3. Ao abrir link compartilhado pela primeira vez, o projeto aparece como read-only ("Ask to edit")

### Step 2: Duplicar o projeto

1. Clicar em **"Duplicate to your drafts"**
2. Uma copia aparece na home com sufixo "(copy)"
3. Agora voce tem acesso completo para inspecionar — nao precisa pedir edicao

### Step 3: Navegar entre paginas

1. Na aba lateral esquerda, alternar entre paginas do projeto
2. Paginas tipicas: **Projeto** (layout final), **Style Guide** (tokens de design)
3. Zoom: `Ctrl + scroll do mouse` — segue a posicao do cursor

### Step 4: Extrair informacoes do Style Guide

O style guide contem tudo que voce precisa para comecar o CSS:

| Informacao | Onde encontrar | Como usar no CSS |
|------------|---------------|------------------|
| Cores | Paleta no style guide | Variáveis CSS (`--color-primary`) |
| Fontes | Nome da fonte + link Google Fonts | `@import` ou `<link>` no HTML |
| Tipografia | Estilos de h1, h2, p | `font-size`, `font-weight`, `line-height` |
| Icones | Biblioteca indicada (ex: Phosphor Icons) | Importar biblioteca no projeto |
| Imagens | Origem indicada (ex: Unsplash) | Exportar direto do Figma |

### Step 5: Exportar assets

1. Selecionar o elemento (imagem, icone)
2. No painel direito, secao "Export"
3. Escolher formato (PNG, SVG, JPG) e escala
4. Clicar em "Export"

### Exemplo de variaveis CSS extraidas do style guide

```css
:root {
  --color-primary: #835afd;
  --color-background: #f8f8f8;
  --color-text: #29292e;
  --font-family: 'Roboto', sans-serif;
  --font-size-heading: 2.25rem;
  --font-weight-bold: 700;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto compartilhado sem permissao de edicao | Duplicate to your drafts antes de inspecionar |
| Precisa ver espacamentos e tamanhos | Selecione o elemento, veja painel direito |
| Quer comecar CSS antes do HTML | Extraia cores e fontes do style guide primeiro |
| Modo de codigo disponivel na conta | Use para copiar propriedades CSS diretamente |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Editar o projeto original compartilhado | Duplicar para seus drafts |
| Chutar valores de cor/fonte olhando o layout | Consultar o style guide para valores exatos |
| Ignorar o style guide e comecar direto no codigo | Ler o style guide, criar variaveis CSS, depois codar |
| Exportar imagens sem verificar a origem | Verificar se a imagem vem do Unsplash ou e asset proprio |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Projeto aparece como read-only | Nao duplicou para seus drafts | Clique em "Duplicate to your drafts" |
| Nao consegue inspecionar elementos | Conta sem permissao ou nao duplicou | Duplique o projeto e abra a copia |
| Valores de cor/fonte parecem errados | Consultando o layout em vez do style guide | Sempre extraia valores do style guide, nao do layout |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre fluxo Figma-to-code e navegacao
- [code-examples.md](references/code-examples.md) — Exemplos de variaveis CSS extraidas de style guides