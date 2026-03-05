---
name: rs-csharp-dotnet-maui-figma-export
description: "Guides exporting assets from Figma prototypes for .NET MAUI mobile app development. Use when user asks to 'export from Figma', 'get images from prototype', 'download assets for app', or 'setup Figma for mobile project'. Covers SVG/PNG/JPG export workflow and light/dark mode asset organization. Make sure to use this skill whenever working with Figma assets in mobile app projects. Not for Figma design creation, UI/UX design principles, or code implementation."
---

# Exportando Assets do Figma para Projetos Mobile

> Ao trabalhar com prototipos do Figma, exporte assets corretamente usando a ferramenta de selecao e a secao Export, organizando por tema (light/dark mode).

## Prerequisitos

- Conta gratuita no Figma (registrar em figma.com)
- Acesso ao link do prototipo compartilhado (modo visualizacao)
- Navegador web (Chrome recomendado)

## Steps

### Step 1: Acessar o prototipo

Abrir o link do Figma compartilhado no navegador. O acesso sera em modo visualizacao — permite ver e exportar, nao editar.

### Step 2: Selecionar a ferramenta correta

Garantir que a **seta de selecao** (primeiro icone, nao a mao) esta ativa na barra de ferramentas do Figma. Quando ativa, fica azul.

| Ferramenta | Icone | Funcao |
|-----------|-------|--------|
| **Selecao (usar esta)** | Seta/cursor | Selecionar elementos individuais para inspecionar e exportar |
| Mao (nao usar) | Mao aberta | Apenas mover o canvas, nao seleciona elementos |

### Step 3: Exportar o asset

1. Clicar no elemento desejado (imagem, icone, ilustracao)
2. No painel direito, localizar a secao **Export**
3. Escolher o formato: `SVG`, `PNG` ou `JPG`
4. Clicar em **Exportar**

### Step 4: Organizar por tema

O prototipo contem duas versoes das telas:
- **Light mode** — tema claro
- **Dark mode** — tema escuro

Exportar assets de ambos os temas quando necessario para suportar temas no app.

## Formatos de imagem

| Formato | Quando usar |
|---------|------------|
| SVG | Icones e ilustracoes vetoriais (escalaveis sem perda) |
| PNG | Imagens com transparencia |
| JPG | Fotos e imagens sem transparencia |

## Error handling

- Se nao conseguir clicar em elementos: verificar se a ferramenta de selecao (seta) esta ativa, nao a mao
- Se a secao Export nao aparecer: garantir que um elemento esta selecionado (borda azul visivel)
- Se o link nao abrir: verificar se esta logado no Figma com conta registrada

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
