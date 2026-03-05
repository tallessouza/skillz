---
name: rs-angular-analisando-proximos-passos
description: "Applies Angular service-as-source-of-truth pattern when structuring task management features. Use when user asks to 'create a task service', 'manage task state', 'organize tasks by status', 'build a kanban board', or 'structure task lists in Angular'. Enforces single source of truth via dedicated service with status-based lists (todo, doing, done). Make sure to use this skill whenever building task/kanban features in Angular. Not for backend API design, database modeling, or non-Angular state management."
---

# Angular Task Service como Fonte Unica de Verdade

> Antes de implementar CRUD de tarefas, crie um service centralizado que organiza tarefas em listas por status — esta e a fonte unica de verdade da aplicacao.

## Regra central

1. **Crie o service antes das features** — nunca implemente criar/editar/excluir tarefas sem antes ter o TaskService estruturado, porque todas as operacoes dependem dessa fonte de verdade
2. **Organize por status em listas separadas** — mantenha tres listas (`todo`, `doing`, `done`) no service, porque renderizacao em colunas e movimentacao dependem dessa separacao
3. **Service e a unica fonte de verdade** — componentes nunca gerenciam estado de tarefas localmente, porque isso causa inconsistencia entre colunas

## Ordem de implementacao

| Passo | O que fazer | Por que primeiro |
|-------|------------|-----------------|
| 1 | Criar TaskService com listas por status | Fundacao para todas as features |
| 2 | CRUD de tarefas (criar, editar, excluir) | Depende do service existir |
| 3 | Adicionar/remover comentarios | Depende da tarefa existir |
| 4 | Renderizar tarefas nas colunas | Depende das listas estarem populadas |
| 5 | Mover tarefas entre colunas | Depende de tudo acima |

## Como estruturar

```typescript
// task.service.ts — fonte unica de verdade
@Injectable({ providedIn: 'root' })
export class TaskService {
  private todoTasks: Task[] = [];
  private doingTasks: Task[] = [];
  private doneTasks: Task[] = [];

  // Cada operacao (create, edit, delete, move)
  // atualiza a lista correta baseada no status
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de CRUD de tarefas | Primeiro verifique se TaskService existe |
| Componente precisa de lista de tarefas | Injete TaskService, nunca crie estado local |
| Tarefa muda de status | Mova entre listas no service, nao no componente |
| Multiplos componentes mostram tarefas | Todos consomem do mesmo service |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| Estado de tarefas no componente | Estado centralizado no TaskService |
| Uma lista unica filtrando por status no template | Tres listas separadas no service |
| Implementar features antes do service | Service primeiro, features depois |
| Componentes comunicando estado entre si | Componentes leem do service compartilhado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
