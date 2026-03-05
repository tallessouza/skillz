# Code Examples: Debugando com VS Code Debugger

## Exemplo 1: Breakpoint em handler de evento

O instrutor coloca breakpoint no metodo `onCardDrop` do componente `TaskListSection`:

```typescript
// task-list-section.component.ts — linha 25
onCardDrop(event: CdkDragDrop<Task[]>) {  // ← BREAKPOINT aqui
  const taskId = event.item.data.id;
  const currentStatus = event.item.data.status;
  this.taskService.updateTaskStatus(taskId, newStatus);
}
```

### O que o debugger mostra ao parar aqui

Ao fazer hover sobre `event`:
- `event` e um objeto com varias propriedades
- `event.item` contem o item sendo arrastado
- `event.item.data` contem as informacoes do card (taskId, status, etc.)

## Exemplo 2: Breakpoint em metodo de service

```typescript
// task.service.ts
updateTaskStatus(taskId: string, newStatus: string) {  // ← BREAKPOINT aqui
  // Ao parar aqui, hover sobre taskId e newStatus mostra os valores recebidos
  const tasks = this.tasksSubject.value;
  const updated = tasks.map(t =>
    t.id === taskId ? { ...t, status: newStatus } : t
  );
  this.tasksSubject.next(updated);  // ⚠️ NAO faca Step Into aqui — entra no rxjs
}
```

## Exemplo 3: Navegacao Step Over vs Step Into

```typescript
onCardDrop(event: CdkDragDrop<Task[]>) {
  // Debugger parou aqui ↓
  const taskId = event.item.data.id;        // F10 (Step Over) — ver valor de taskId
  const currentStatus = event.item.data.status;  // F10 — ver valor de currentStatus
  this.updateTaskStatus(taskId, newStatus);  // F11 (Step Into) — entrar no metodo
}

// Agora dentro de updateTaskStatus:
updateTaskStatus(taskId: string, newStatus: string) {
  const tasks = this.tasksSubject.value;     // F10 — Step Over
  const updated = tasks.map(t => ...);       // F10 — Step Over
  this.tasksSubject.next(updated);           // F10 — Step Over (NAO Step Into!)
}
// Se fizer Step Into no .next(), cai no BehaviorSubject interno do rxjs
```

## Exemplo 4: O que acontece com Step Into em codigo interno

Sequencia demonstrada pelo instrutor:

1. Step Into em `this.tasksSubject.next(updated)`
2. VS Code abre `behavior_subject.js` (arquivo do rxjs)
3. Mostra classe `BehaviorSubject` — codigo interno, nao seu
4. Outro Step Into → entra mais fundo nos internals
5. Abre `core.mjs` do Angular — mais codigo interno

**Solucao:** Step Out (Shift+F11) ate voltar ao seu codigo, depois Step Over (F10).

## Configuracao do VS Code para Debug Angular

O VS Code oferece configuracao pronta para Angular. No painel **Run and Debug**:

1. Selecionar **ng serve** na lista de configuracoes
2. Clicar no botao de play
3. VS Code executa internamente: `npm run start` → `ng serve`
4. Se porta 4200 ocupada, aceitar porta alternativa

A configuracao tipica em `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## Atalhos essenciais do debugger

| Atalho | Acao | Quando usar |
|--------|------|-------------|
| F5 | Continue | Ir ate o proximo breakpoint |
| F10 | Step Over | Pular linha sem entrar em detalhes |
| F11 | Step Into | Entrar no metodo da linha (so se for SEU codigo) |
| Shift+F11 | Step Out | Sair do metodo atual |
| Ctrl+Shift+F5 | Restart | Reiniciar sessao de debug |
| Shift+F5 | Stop | Parar debug |