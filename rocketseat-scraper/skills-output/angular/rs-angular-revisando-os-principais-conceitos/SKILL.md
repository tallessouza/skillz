---
name: rs-angular-revisando-principais-conceitos
description: "Enforces Angular project organization patterns including folder structure, naming conventions, BehaviorSubject state management, and centralized modal services. Use when user asks to 'create angular component', 'organize angular project', 'manage state in angular', 'open modal dialog', or 'structure angular app'. Applies rules: folder-per-type separation, filename-matches-export naming, BehaviorSubject with immutable clone pattern, centralized dialog services. Make sure to use this skill whenever scaffolding or reviewing Angular 19+ projects. Not for React, Vue, or non-Angular state management."
---

# Organizacao de Projeto Angular

> Separe por tipo, padronize nomes, proteja o estado, centralize modais.

## Rules

1. **Separe pastas por tipo** — `components/`, `enums/`, `interfaces/`, `services/`, `types/`, `utils/`, porque localizar um enum ou interface por pasta e instantaneo em projetos grandes
2. **Nome do arquivo = nome do export** — `task-status-enum.ts` exporta `TaskStatusEnum`, `i-task-form-controls.ts` exporta `ITaskFormControls`, porque elimina adivinhacao ao navegar o codebase
3. **Um componente, uma responsabilidade** — extraia header, task-card, task-comments-modal como componentes isolados, porque tudo no app.component vira impossivel de manter
4. **BehaviorSubject como fonte de verdade** — retorne clone via Observable, nunca a instancia original, porque impede mutacao acidental pelos componentes
5. **Atualize estado apenas via metodos do service** — componentes nunca acessam o BehaviorSubject diretamente, porque garante previsibilidade e rastreabilidade
6. **Centralize abertura de modais em um service** — `dialog-service.open()` em vez de `this.dialog.open()` em cada componente, porque refatorar nome de modal afeta apenas um lugar
7. **Remova imports nao utilizados** — nao deixe sujeira no componente, porque o compilador Angular reclama e polui o codigo
8. **Padronize espacamentos** — entre chaves, propriedades de interface com ponto-e-virgula, itens de enum alinhados, porque consistencia visual acelera code review

## How to write

### Estrutura de pastas

```
src/app/
├── components/
│   ├── header/
│   ├── task-card/
│   └── task-comments-modal/
├── enums/
│   └── task-status-enum.ts
├── interfaces/
│   ├── i-comment.ts
│   └── i-task-form-controls.ts
├── services/
│   ├── task.service.ts
│   └── dialog.service.ts
├── types/
│   └── task-status.type.ts
└── utils/
    └── create-id.ts
```

### State service com BehaviorSubject

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  // Retorna clone, nunca a instancia original
  get tasks$(): Observable<Task[]> {
    return this.tasksSubject.asObservable().pipe(
      map(tasks => structuredClone(tasks))
    );
  }

  // Unico caminho para atualizar estado
  addTask(task: Task): void {
    const current = this.tasksSubject.getValue();
    this.tasksSubject.next([...current, task]);
  }

  updateTask(id: string, changes: Partial<Task>): void {
    const updated = this.tasksSubject.getValue().map(t =>
      t.id === id ? { ...t, ...changes } : t
    );
    this.tasksSubject.next(updated);
  }
}
```

### Dialog service centralizado

```typescript
@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: Dialog) {}

  openTaskCommentsModal(taskId: string): DialogRef<Comment[]> {
    return this.dialog.open(TaskCommentsModalComponent, {
      data: { taskId }
    });
  }
}
```

## Example

**Before (modal aberto em cada componente):**
```typescript
// task-card.component.ts
this.dialog.open(TaskCommentsModalComponent, { data: { taskId } });

// task-list.component.ts
this.dialog.open(TaskCommentsModalComponent, { data: { taskId } });

// dashboard.component.ts
this.dialog.open(TaskCommentsModalComponent, { data: { taskId } });
```

**After (centralizado no service):**
```typescript
// Qualquer componente
this.dialogService.openTaskCommentsModal(taskId);
// Refatorou o modal? Muda apenas o DialogService.
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao usada em 2+ locais | Mova para `utils/` com arquivo proprio |
| Enum usado como tipo de propriedade | Crie um `type` derivado do enum para tipagem mais limpa |
| Modal aberto em 2+ componentes | Centralize no DialogService |
| Estado compartilhado entre componentes | BehaviorSubject no service, Observable para consumo |
| Import nao utilizado apos refatoracao | Remova imediatamente |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Todo HTML no app.component | Componentes isolados por responsabilidade |
| `this.dialog.open()` em cada componente | `this.dialogService.openX()` centralizado |
| Retornar instancia original do BehaviorSubject | Retornar clone via `structuredClone()` ou spread |
| Arquivo `task-status.ts` exportando `StatusEnum` | Arquivo `task-status-enum.ts` exportando `TaskStatusEnum` |
| Componente acessando `.next()` do subject | Componente chamando metodo do service |
| Funcao utilitaria dentro de um componente | Arquivo proprio em `utils/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
