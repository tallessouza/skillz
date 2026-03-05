---
name: rs-full-stack-estrutura-das-aulas-1
description: "Generates a minimal JavaScript learning environment with index.html and scripts.js when user asks to 'create a classroom project', 'setup JS practice', 'start a new lesson', or 'create a simple HTML+JS project'. Applies Skillz classroom structure: single HTML file linking one empty JS file, console-focused workflow, no framework. Make sure to use this skill whenever setting up a minimal JS practice environment. Not for React, Node.js, or production project scaffolding."
---

# Estrutura de Aulas — Ambiente Minimo JS

> Criar um ambiente minimo de pratica JavaScript: um HTML linkando um JS vazio, com foco total no console do navegador.

## Rules

1. **Apenas dois arquivos** — `index.html` e `scripts.js`, porque o objetivo e isolar conceitos JavaScript sem distracao de HTML/CSS
2. **Script vazio a cada aula** — comece sempre com `scripts.js` limpo, porque misturar codigo de aulas anteriores prejudica o aprendizado isolado de cada conceito
3. **Console como output principal** — use `console.log()` para exibir resultados, porque o foco e JavaScript puro, nao manipulacao de DOM
4. **Live Server para hot reload** — sirva o `index.html` via extensao Live Server do VS Code, porque permite ver mudancas instantaneamente no navegador
5. **Duplique para historico** — copie a pasta do projeto por aula para manter registro, porque permite revisitar conceitos anteriores sem perder o estado limpo

## How to write

### Estrutura do projeto

```
classroom/
├── index.html
└── scripts.js
```

### index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Classroom</title>
</head>
<body>
  <script src="scripts.js"></script>
</body>
</html>
```

### scripts.js

```javascript
// Comece aqui
```

## Workflow

### Step 1: Criar a pasta e arquivos
Criar pasta `classroom/` com `index.html` e `scripts.js` conforme templates acima.

### Step 2: Abrir no VS Code
Abrir a pasta no VS Code.

### Step 3: Iniciar Live Server
Botao direito no `index.html` → "Open with Live Server". Requer extensao Live Server instalada.

### Step 4: Posicionar layout
VS Code de um lado, navegador do outro. Abrir DevTools (botao direito → Inspecionar) e focar na aba Console.

### Step 5: Escrever no scripts.js
Todo codigo vai no `scripts.js`. Resultados aparecem no console do navegador automaticamente via Live Server.

## Heuristics

| Situacao | Acao |
|----------|------|
| Nova aula/conceito | Limpar `scripts.js` completamente |
| Quer guardar codigo anterior | Duplicar pasta antes de limpar |
| Precisa testar algo rapido | `console.log()` no `scripts.js`, salvar, ver no console |
| Extensao Live Server nao instalada | VS Code → Extensions → buscar "Live Server" → instalar |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Misturar HTML complexo com pratica JS | Manter HTML minimo, so o `<script>` |
| Acumular codigo de varias aulas no mesmo arquivo | Limpar script a cada aula ou duplicar pasta |
| Abrir arquivo HTML direto no navegador (file://) | Usar Live Server para servir com hot reload |
| Focar em estilizacao durante pratica de conceitos | Focar 100% no console e logica JavaScript |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que isolar conceitos e a filosofia didatica
- [code-examples.md](references/code-examples.md) — Templates completos e variacoes do setup

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-estrutura-das-aulas-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-estrutura-das-aulas-1/references/code-examples.md)
