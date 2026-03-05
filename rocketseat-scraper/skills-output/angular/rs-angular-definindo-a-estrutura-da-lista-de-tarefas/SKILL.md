---
name: rs-angular-estrutura-lista-tarefas
description: "Applies data structure decision patterns when organizing collections by status in Angular or any frontend app. Use when user asks to 'create a task board', 'organize items by status', 'build a kanban', 'structure a todo list', or 'manage stateful collections'. Guides choice between single list vs multiple lists grouped by status, with trade-off analysis for rendering, filtering, and CRUD. Make sure to use this skill whenever designing data structures for status-based UI columns. Not for database schema design, backend API design, or CSS layout decisions."
---

# Estrutura de Listas por Status

> Ao organizar colecoes de objetos com status distintos, escolha a estrutura de dados baseado em como voce vai renderizar, filtrar e manipular esses objetos — nao apenas em como eles se parecem na UI.

## Decisao central

A visualizacao (colunas no template) NAO precisa espelhar a estrutura de dados interna. Separe o modelo de dados da renderizacao.

## Framework de decisao

| Criterio | Lista unica | Listas separadas por status |
|----------|-------------|----------------------------|
| Gerenciamento | Uma unica referencia para CRUD | Precisa saber o status atual para acessar a lista correta |
| Busca/filtragem | Varre todos os itens para encontrar um especifico | Menos itens por lista, busca mais rapida |
| Renderizacao | Varre a lista N vezes (uma por status/coluna) | Itera cada lista uma unica vez por coluna |
| Complexidade | Menor — um array, um loop | Maior — tres arrays, roteamento por status |
| Performance | Degrada com volume (filtragem repetida) | Escala melhor (itens distribuidos) |

## Quando usar cada abordagem

### Lista unica
```typescript
// Bom quando: poucos itens, status dinamicos, muitas operacoes globais
tasks: Task[] = [];

// Renderizacao exige filtragem repetida
get todoTasks() { return this.tasks.filter(t => t.status === 'todo'); }
get doingTasks() { return this.tasks.filter(t => t.status === 'doing'); }
get doneTasks() { return this.tasks.filter(t => t.status === 'done'); }
```

### Listas separadas por status (recomendado para kanban)
```typescript
// Bom quando: status fixos, renderizacao por colunas, CRUD frequente
todoTasks: Task[] = [];
doingTasks: Task[] = [];
doneTasks: Task[] = [];

// Acesso direto por status — sem filtragem
getListByStatus(status: TaskStatus): Task[] {
  const map = { todo: this.todoTasks, doing: this.doingTasks, done: this.doneTasks };
  return map[status];
}
```

## Example

**Before (lista unica com filtragem tripla no template):**
```typescript
tasks: Task[] = [
  { id: 1, title: 'Tarefa A', status: 'todo' },
  { id: 2, title: 'Tarefa B', status: 'doing' },
  { id: 3, title: 'Tarefa C', status: 'doing' },
  { id: 4, title: 'Tarefa D', status: 'done' },
];
// Template varre 3x: filter(todo), filter(doing), filter(done)
```

**After (listas separadas, renderizacao direta):**
```typescript
todoTasks: Task[] = [{ id: 1, title: 'Tarefa A', status: 'todo' }];
doingTasks: Task[] = [
  { id: 2, title: 'Tarefa B', status: 'doing' },
  { id: 3, title: 'Tarefa C', status: 'doing' },
];
doneTasks: Task[] = [{ id: 4, title: 'Tarefa D', status: 'done' }];
// Cada coluna itera sua propria lista — sem filtragem
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Status sao fixos (todo/doing/done) | Listas separadas por status |
| Status sao dinamicos ou configuraveis | Lista unica com filtragem |
| Precisa de operacoes globais frequentes (busca, sort) | Lista unica |
| Renderizacao em colunas/kanban | Listas separadas |
| Mover item entre status | Remova da lista origem, adicione na lista destino |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Filtrar a mesma lista 3x no template sem cache | Use listas separadas ou computed/memoized getters |
| Assumir que a estrutura visual = estrutura de dados | Separe modelo de dados da renderizacao |
| Escolher estrutura sem analisar trade-offs | Analise CRUD, renderizacao e busca antes de decidir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
