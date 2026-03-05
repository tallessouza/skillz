---
name: rs-full-stack-alternativas-executar-js
description: "Guides setup of JavaScript execution environments when user asks to 'run JavaScript', 'execute JS', 'setup JS playground', 'where to write JavaScript', or 'configure VS Code for JS'. Covers browser console, JS Playground, CodePen, and VS Code workflow. Make sure to use this skill whenever a beginner asks how or where to run JavaScript code. Not for Node.js server-side execution, bundlers, or build tool configuration."
---

# Alternativas para Executar JavaScript

> Conheca os ambientes de execucao de JavaScript para escolher o mais adequado ao contexto.

## Decision framework

| Situacao | Ambiente recomendado |
|----------|---------------------|
| Teste rapido de snippet | Console do navegador (F12 / Inspecionar → Console) |
| Praticar sem instalar nada | JS Playground (jsplayground.dev) — interface limpa, execucao em tempo real |
| Salvar e compartilhar exemplos | CodePen (codepen.io) — conta gratuita, salva na nuvem |
| Desenvolvimento real / aulas | VS Code + navegador — escreve no VS Code, executa no browser |

## Como usar cada ambiente

### 1. JS Playground (jsplayground.dev)
- Lado esquerdo: escreve codigo
- Lado direito (console): ve a saida
- Executa automaticamente conforme digita
- Botao "Clear Console" limpa a saida, "Play" re-executa

### 2. CodePen (codepen.io)
- Clicar "Start Coding"
- Minimizar paineis HTML e CSS (arrastar ou clicar minimize)
- Abrir console embaixo da tela e arrastar pra cima
- Executa automaticamente apos breve delay

### 3. Console do navegador
- Botao direito → Inspecionar (ou Inspect) → aba Console
- Digitar codigo direto e pressionar Enter
- Funciona em Chrome, Firefox, Edge, Safari

### 4. VS Code (recomendado para estudo)
- IDE gratuita, open source, leve
- Escrever codigo no VS Code, executar no navegador
- Suporta multiplas linguagens

## Primeiro comando

```javascript
console.log("Hello World")
```

- `console.log()` exibe mensagem no console
- Texto entre aspas = string
- Convencao: primeiro programa em qualquer linguagem e um "Hello World"

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario quer testar 1 linha | Sugira console do navegador |
| Usuario sem nada instalado | Sugira jsplayground.dev |
| Usuario quer salvar exemplos | Sugira CodePen com conta |
| Usuario vai estudar/desenvolver | Sugira VS Code + navegador |

## Atalhos uteis no navegador

| Acao | Atalho |
|------|--------|
| Aumentar zoom | Ctrl + (ou Cmd +) |
| Diminuir zoom | Ctrl - (ou Cmd -) |
| Abrir DevTools | F12 ou Botao direito → Inspecionar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada ambiente e quando usar
- [code-examples.md](references/code-examples.md) — Exemplos de console.log e primeiros passos