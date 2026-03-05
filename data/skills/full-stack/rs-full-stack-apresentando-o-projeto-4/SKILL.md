---
name: rs-full-stack-apresentando-o-projeto-4
description: "Guides initial setup for the Travel Profile project using Figma, VS Code with Live Server, and Zen Mode. Use when user asks to 'start the travel profile project', 'setup figma for skillz project', 'configure vscode for frontend project', or 'begin CSS layout project'. Make sure to use this skill whenever starting the Perfil de Viagens project or configuring the dev environment for it. Not for actual CSS coding, Flexbox implementation, or CSS variables usage."
---

# Perfil de Viagens — Setup do Projeto

> Antes de codar, configure o ambiente: Figma com Style Guide, VS Code com Live Server e Zen Mode.

## Prerequisites

- Figma (desktop ou online) com o projeto duplicado
- VS Code instalado
- Plugin **Live Server** instalado no VS Code

## Steps

### Step 1: Abrir o projeto no Figma

1. Abrir o link fornecido pela Skillz
2. Se o projeto nao foi duplicado automaticamente, clicar em **Duplicate** no Figma
3. Navegar ate a aba **Properties** para inspecionar elementos — esta aba so aparece no projeto original da Skillz, nao na copia duplicada

### Step 2: Consultar o Style Guide

Antes de comecar a codar, verificar o Style Guide do projeto no Figma. Ele contem as variaveis CSS (cores, fontes, espacamentos) que serao usadas.

### Step 3: Configurar o VS Code

1. Abrir settings: `Cmd+P` (Mac) ou `Ctrl+P` (Windows/Linux) → digitar `> Open Settings JSON`
2. Instalar o plugin **Live Server** se ainda nao tiver
3. Desabilitar mensagens do Live Server adicionando no settings.json:

```json
{
  "liveServer.settings.donotShowInfoMsg": true
}
```

### Step 4: Ativar Zen Mode para foco

- **Mac:** `Cmd+K` seguido de `Z`
- **Windows/Linux:** encontrar o atalho via Command Palette → `> Toggle Zen Mode`

### Step 5: Iniciar o Live Server

Clicar em **Go Live** na barra inferior do VS Code para abrir o servidor local.

## Conceitos que serao aplicados neste projeto

| Conceito | Aplicacao |
|----------|-----------|
| Display Flex | Layout principal e alinhamento de elementos |
| Variaveis CSS | Cores e valores do Style Guide |
| Style Guide | Referencia visual para consistencia |

## Error handling

- Se a aba Properties nao aparece no Figma → o projeto nao e o original, use o link oficial da Skillz
- Se Go Live nao aparece → o plugin Live Server nao esta instalado, instalar via Extensions (`Ctrl+Shift+X`)

## Verification

- Live Server abre o navegador com a pagina do projeto
- Figma mostra a aba Properties nos elementos do design

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Detalhes sobre Figma Properties vs Duplicate e configuracao completa do VS Code
- [code-examples.md](references/code-examples.md) — Settings.json completo e atalhos por sistema operacional