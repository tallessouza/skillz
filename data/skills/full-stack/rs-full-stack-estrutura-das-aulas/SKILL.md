---
name: rs-full-stack-estrutura-das-aulas
description: "Generates the standard Skillz classroom project structure with index.html and script.js for JavaScript practice. Use when user asks to 'setup classroom', 'create practice environment', 'start JS exercises', or 'prepare for Skillz lessons'. Sets up HTML+JS with Live Server workflow. Make sure to use this skill whenever creating a new JavaScript practice workspace. Not for React, Node.js, or framework project scaffolding."
---

# Estrutura de Aulas — Classroom Setup

> Criar a estrutura minima de arquivos para praticar JavaScript com feedback instantaneo via Live Server.

## Prerequisites

- VS Code instalado
- Extensao **Live Server** instalada no VS Code
- Se nao encontrada: instalar via Extensions (Ctrl+Shift+X), buscar "Live Server" por Ritwick Dey

## Steps

### Step 1: Criar pasta e arquivos

Criar pasta `classroom/` com dois arquivos:

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aulas de JavaScript</title>
</head>
<body>
  <h1>Aulas de JavaScript</h1>
  <script src="script.js"></script>
</body>
</html>
```

```javascript
// script.js
// (arquivo vazio — ponto de partida para cada aula)
```

### Step 2: Abrir com Live Server

1. Abrir pasta `classroom/` no VS Code
2. Botao direito no `index.html` → **Open with Live Server**
3. No navegador, abrir DevTools (botao direito → Inspecionar → Console)

### Step 3: Configurar layout de trabalho

Posicionar lado a lado:
- **Esquerda:** VS Code com `script.js` aberto
- **Direita:** Navegador com Console do DevTools visivel

## Output format

```
classroom/
├── index.html    # Estrutura HTML minima com link para script.js
└── script.js     # Vazio — limpar a cada nova aula
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Nova aula/exercicio | Limpar `script.js`, manter `index.html` intacto |
| Foco e JavaScript puro | Ignorar HTML, trabalhar apenas em `script.js` |
| Precisa ver output | Usar `console.log()` no script, verificar no Console do navegador |
| Pagina nao atualiza | Live Server recarrega automaticamente ao salvar — verificar se extensao esta ativa |

## Verification

- Live Server abre o navegador automaticamente ao clicar "Open with Live Server"
- Adicionar `console.log("teste")` em `script.js`, salvar, e verificar que aparece no Console sem recarregar manualmente