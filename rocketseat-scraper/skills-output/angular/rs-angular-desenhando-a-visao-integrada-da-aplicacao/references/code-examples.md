# Code Examples: Visao Integrada da Aplicacao

## Estrutura completa do GoTask (conforme o instrutor desenhou)

```
AppComponent
├── HeaderComponent
│   (sem filhos, sem services — fluxo termina aqui)
│
└── MainContentComponent
    ├── WelcomeSectionComponent
    │   ├── [injeta] TaskService
    │   │   - Motivo: ao criar tarefa, chama metodo de criacao
    │   │   - Metodos usados: createTask()
    │   │
    │   └── [injeta] ModalControllerService
    │       ├── TaskFormModalComponent (modal de criacao)
    │       └── TaskCommentsModalComponent
    │
    └── TaskListSectionComponent
        ├── [injeta] TaskService
        │   - Motivo: ao mover tarefa entre colunas, atualiza status
        │   - Metodos usados: updateTaskStatus()
        │
        └── TaskCardComponent
            ├── [injeta] TaskService
            │   - Motivo: deletar card, editar tarefa, gerenciar comentarios
            │   - Metodos usados: deleteTask(), editTask(), updateComments()
            │
            └── [injeta] ModalControllerService
                ├── TaskFormModalComponent (modal de edicao)
                └── TaskCommentsModalComponent (modal de comentarios)
```

## Services detalhados

### TaskService — Fonte Unica de Verdade

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  // Tres listas baseadas no status
  toDo: Task[] = [];
  doing: Task[] = [];
  done: Task[] = [];

  // Metodos de gerenciamento
  createTask(task: Task): void { /* ... */ }
  updateTaskStatus(taskId: string, newStatus: TaskStatus): void { /* ... */ }
  deleteTask(taskId: string): void { /* ... */ }
  editTask(taskId: string, updates: Partial<Task>): void { /* ... */ }
  updateComments(taskId: string, comments: Comment[]): void { /* ... */ }
}
```

### ModalControllerService — Centralizador de Modais

```typescript
@Injectable({ providedIn: 'root' })
export class ModalControllerService {
  // Abre modal de formulario (criacao ou edicao)
  openTaskFormModal(task?: Task): void { /* ... */ }

  // Abre modal de comentarios
  openTaskCommentsModal(taskId: string): void { /* ... */ }

  // Fecha modal ativo
  closeModal(): void { /* ... */ }
}
```

## Mapeamento de quem injeta o que

| Componente | TaskService | ModalControllerService |
|------------|:-----------:|:----------------------:|
| HeaderComponent | — | — |
| WelcomeSectionComponent | criar tarefa | abrir modal criacao |
| TaskListSectionComponent | atualizar status | — |
| TaskCardComponent | deletar, editar, comentarios | abrir modal edicao/comentarios |

## Template para aplicar em outros projetos

```
{RootComponent}
├── {ComponenteA}
│   ├── [injeta] {ServiceX} — motivo: {acao}
│   └── {ComponenteFilhoA1}
│       └── [injeta] {ServiceY} — motivo: {acao}
├── {ComponenteB}
│   (sem filhos, sem services)
└── {ComponenteC}
    ├── [injeta] {ServiceX} — motivo: {acao diferente}
    └── {ComponenteFilhoC1}
```