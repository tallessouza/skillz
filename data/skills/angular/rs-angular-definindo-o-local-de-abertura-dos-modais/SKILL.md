---
name: rs-angular-modal-service-pattern
description: "Enforces centralized modal/dialog opening via Angular services instead of spreading dialog logic across components. Use when user asks to 'open a modal', 'create a dialog', 'add a modal service', 'implement dialog in Angular', or builds any Angular Material CDK dialog feature. Applies pattern: components trigger, service centralizes open/close/config logic. Make sure to use this skill whenever implementing Angular Material dialogs or modals. Not for modal template/layout styling, non-Angular projects, or simple alert/confirm dialogs."
---

# Centralizar Abertura de Modais em Services

> Componentes disparam a abertura; um service centraliza toda a logica de abertura, configuracao e comunicacao dos modais.

## Rules

1. **Nunca coloque logica de abertura de modal no componente** — componentes injetam o service e chamam um metodo especifico, porque se o mesmo modal e aberto em 5 componentes, uma mudanca exige 5 atualizacoes
2. **Um service, um metodo por modo de abertura** — `openTaskCreation()`, `openTaskEdition(task)`, `openTaskComments(taskId)`, porque cada metodo nomeia explicitamente o que abre e em qual modo
3. **Configuracoes compartilhadas ficam no service** — largura, altura, panelClass e outras configs do dialog vivem no service, porque evita replicacao de objetos de configuracao identicos em multiplos componentes
4. **Componente so faz o trigger** — o componente injeta o service e chama o metodo no evento de click, nada mais, porque separa responsabilidades claramente
5. **Subscribe no afterClosed dentro do service** — retorne o Observable do `afterClosed()` para o componente reagir se necessario, porque mantem a logica de ciclo de vida do modal centralizada

## How to write

### Service centralizado

```typescript
@Injectable({ providedIn: 'root' })
export class ModalService {
  private dialog = inject(Dialog);

  openTaskCreation(): Observable<Task | undefined> {
    const dialogRef = this.dialog.open(TaskFormModalComponent, {
      width: '500px',
      data: { mode: 'create' },
    });
    return dialogRef.closed;
  }

  openTaskEdition(task: Task): Observable<Task | undefined> {
    const dialogRef = this.dialog.open(TaskFormModalComponent, {
      width: '500px',
      data: { mode: 'edit', task },
    });
    return dialogRef.closed;
  }

  openTaskComments(taskId: string): Observable<void> {
    const dialogRef = this.dialog.open(TaskCommentsModalComponent, {
      width: '600px',
      data: { taskId },
    });
    return dialogRef.closed;
  }
}
```

### Componente que dispara

```typescript
@Component({ /* ... */ })
export class TaskCardComponent {
  private modalService = inject(ModalService);

  onEdit(task: Task): void {
    this.modalService.openTaskEdition(task).subscribe((updatedTask) => {
      if (updatedTask) this.handleUpdate(updatedTask);
    });
  }

  onComments(taskId: string): void {
    this.modalService.openTaskComments(taskId).subscribe();
  }
}
```

## Example

**Before (logica espalhada nos componentes):**
```typescript
// welcome-section.component.ts
export class WelcomeSectionComponent {
  private dialog = inject(Dialog);

  openCreate(): void {
    this.dialog.open(TaskFormModalComponent, {
      width: '500px',
      data: { mode: 'create' },
    });
  }
}

// task-card.component.ts
export class TaskCardComponent {
  private dialog = inject(Dialog);

  openEdit(task: Task): void {
    this.dialog.open(TaskFormModalComponent, {
      width: '500px', // duplicado
      data: { mode: 'edit', task },
    });
  }
}
```

**After (centralizado no service):**
```typescript
// modal.service.ts — unica fonte de verdade
// welcome-section.component.ts
export class WelcomeSectionComponent {
  private modalService = inject(ModalService);
  openCreate(): void {
    this.modalService.openTaskCreation().subscribe();
  }
}

// task-card.component.ts
export class TaskCardComponent {
  private modalService = inject(ModalService);
  onEdit(task: Task): void {
    this.modalService.openTaskEdition(task).subscribe();
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Modal aberto em 1 unico componente | Service ainda e preferivel, porque facilita futura reutilizacao |
| Modal com configuracoes diferentes por contexto | Aceite parametros no metodo do service, nao duplique metodos |
| Precisa reagir ao fechamento do modal | Use o Observable retornado pelo metodo do service |
| Multiplos modais com configs identicas | Extraia config base como constante privada no service |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `this.dialog.open(...)` dentro de um componente | `this.modalService.openSpecificModal(...)` |
| Configs de dialog duplicadas em 3+ componentes | Config centralizada no service |
| Logica de `afterClosed` dentro do componente | Retorne `dialogRef.closed` do service, subscribe no componente |
| Um metodo generico `openModal(component, config)` | Metodos nomeados por caso de uso: `openTaskCreation()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
