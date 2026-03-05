# Code Examples: Estrutura de Listas por Status

## Contexto do projeto GoTask

O projeto GoTask e um gerenciador de tarefas em Angular com tres colunas de status: a fazer (todo), fazendo (doing) e concluido (done). Cada tarefa e representada por um objeto com propriedades definidas em aula anterior.

## Abordagem 1: Lista unica

```typescript
// Uma unica lista guarda todos os objetos independente do status
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
}

// Todas as tarefas juntas
tasks: Task[] = [
  { id: '1', title: 'Tarefa A', description: '...', status: 'todo' },
  { id: '2', title: 'Tarefa B', description: '...', status: 'doing' },
  { id: '3', title: 'Tarefa C', description: '...', status: 'doing' },
  { id: '4', title: 'Tarefa D', description: '...', status: 'done' },
  { id: '5', title: 'Tarefa E', description: '...', status: 'todo' },
];

// Para renderizar colunas, precisa filtrar 3x:
get todoTasks(): Task[] {
  return this.tasks.filter(task => task.status === 'todo');
}
get doingTasks(): Task[] {
  return this.tasks.filter(task => task.status === 'doing');
}
get doneTasks(): Task[] {
  return this.tasks.filter(task => task.status === 'done');
}

// Para deletar, varre toda a lista
deleteTask(id: string): void {
  this.tasks = this.tasks.filter(task => task.id !== id);
}
```

## Abordagem 2: Tres listas separadas por status (escolha do instrutor)

```typescript
// Tres listas, cada uma com tarefas de um unico status
todoTasks: Task[] = [
  { id: '1', title: 'Tarefa A', description: '...', status: 'todo' },
  { id: '5', title: 'Tarefa E', description: '...', status: 'todo' },
];

doingTasks: Task[] = [
  { id: '2', title: 'Tarefa B', description: '...', status: 'doing' },
  { id: '3', title: 'Tarefa C', description: '...', status: 'doing' },
];

doneTasks: Task[] = [
  { id: '4', title: 'Tarefa D', description: '...', status: 'done' },
];

// Renderizacao direta — cada coluna itera sua lista, sem filtro
// No template:
// @for (task of todoTasks; track task.id) { ... }
// @for (task of doingTasks; track task.id) { ... }
// @for (task of doneTasks; track task.id) { ... }

// Para deletar, acessa a lista correta pelo status
deleteTask(id: string, status: 'todo' | 'doing' | 'done'): void {
  const list = this.getListByStatus(status);
  const index = list.findIndex(task => task.id === id);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

// Helper para rotear para a lista correta
getListByStatus(status: 'todo' | 'doing' | 'done'): Task[] {
  const map = {
    todo: this.todoTasks,
    doing: this.doingTasks,
    done: this.doneTasks,
  };
  return map[status];
}

// Mover tarefa entre status
moveTask(id: string, fromStatus: 'todo' | 'doing' | 'done', toStatus: 'todo' | 'doing' | 'done'): void {
  const fromList = this.getListByStatus(fromStatus);
  const index = fromList.findIndex(task => task.id === id);
  if (index !== -1) {
    const [task] = fromList.splice(index, 1);
    task.status = toStatus;
    this.getListByStatus(toStatus).push(task);
  }
}
```

## Comparacao visual do fluxo de renderizacao

```
LISTA UNICA:
tasks[] ──filter(todo)──→ coluna "A Fazer"
tasks[] ──filter(doing)──→ coluna "Fazendo"       // 3 varreduras da mesma lista
tasks[] ──filter(done)──→ coluna "Concluido"

LISTAS SEPARADAS:
todoTasks[] ──iterate──→ coluna "A Fazer"
doingTasks[] ──iterate──→ coluna "Fazendo"         // 1 iteracao direta por lista
doneTasks[] ──iterate──→ coluna "Concluido"
```