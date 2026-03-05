---
name: rs-angular-debugando-vscode-debugger
description: "Applies VS Code Debugger workflow for Angular applications when user asks to 'debug Angular app', 'track data flow', 'set breakpoints', 'use VS Code debugger', or 'find a bug in Angular'. Guides through breakpoint placement, debug mode execution, Step Over vs Step Into decisions, and variable inspection. Make sure to use this skill whenever debugging Angular components or tracking data flow in VS Code. Not for console.log debugging, browser DevTools, or backend debugging."
---

# Debugando Aplicacao Angular com VS Code Debugger

> Use o VS Code Debugger para rastrear o fluxo de dados colocando breakpoints estrategicos e inspecionando variaveis em tempo real.

## Prerequisites

- Projeto Angular com `ng serve` configurado
- VS Code com painel "Run and Debug" disponivel
- Projeto compilavel (sem erros de build)

## Steps

### Step 1: Colocar breakpoints estrategicos

Clique na margem esquerda (gutter) da linha desejada para criar a bolinha vermelha do breakpoint.

**Onde colocar breakpoints:**
- Metodos que recebem eventos (handlers como `onCardDrop`, `onSubmit`)
- Metodos que alteram estado (`updateTaskStatus`, `save`)
- Inicio de metodos de service que processam dados

```typescript
// Coloque breakpoint na linha do metodo handler
onCardDrop(event: CdkDragDrop<Task[]>) {  // ← breakpoint aqui
  const taskId = event.item.data.id;
  this.updateTaskStatus(taskId, newStatus);
}
```

### Step 2: Executar em modo debug

1. Abrir painel **Run and Debug** (icone de play com bug na sidebar)
2. Selecionar configuracao **ng serve**
3. Clicar em play — VS Code executa `npm run start` internamente
4. Se porta 4200 estiver em uso, aceitar porta alternativa

### Step 3: Disparar o breakpoint

Interagir com a aplicacao no browser para executar o codigo onde o breakpoint foi colocado. O VS Code pausa a execucao automaticamente.

### Step 4: Inspecionar variaveis

- **Hover** sobre qualquer variavel para ver seu valor atual
- Painel **Variables** mostra todas as variaveis do escopo
- Expandir objetos para ver propriedades aninhadas (ex: `event.item.data`)

### Step 5: Navegar pelo codigo

| Acao | Quando usar |
|------|-------------|
| **Step Over** (F10) | Executar a linha sem entrar em detalhes internos |
| **Step Into** (F11) | Entrar dentro do metodo chamado na linha atual |
| **Step Out** (Shift+F11) | Sair do metodo atual e voltar ao chamador |
| **Continue** (F5) | Continuar execucao ate o proximo breakpoint |

## Heuristics

| Situacao | Acao |
|----------|------|
| Quer ver parametros de um metodo | Breakpoint na primeira linha do metodo, hover nas variaveis |
| Quer ver o fluxo completo | Breakpoints em cada metodo da cadeia, use Step Over |
| Quer entrar em metodo do SEU codigo | Step Into |
| Caiu em arquivo interno (node_modules, rxjs internals) | Step Out imediatamente, depois Step Over |
| Arquivo `.mjs` ou classe como `BehaviorSubject` abriu | Voce saiu do seu source code — use Step Out |

## Error handling

- Se a porta 4200 estiver em uso: aceitar porta alternativa quando VS Code perguntar
- Se breakpoint nao dispara: verificar se o codigo realmente executa naquele ponto
- Se redirecionou para arquivo interno: **Step Out** para voltar ao seu codigo

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Step Into em chamadas de bibliotecas externas (rxjs, Angular core) | Step Over para pular internals |
| Continuar navegando quando caiu em `core.mjs` ou `behavior_subject.js` | Step Out imediatamente |
| Colocar breakpoints em linhas de declaracao de variavel simples | Colocar em linhas que executam logica ou chamam metodos |
| Ignorar o painel de Variables | Usar hover + painel para inspecionar estado completo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
