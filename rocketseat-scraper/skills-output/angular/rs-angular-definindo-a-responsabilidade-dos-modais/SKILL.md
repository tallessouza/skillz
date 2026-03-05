---
name: rs-angular-responsabilidade-modais
description: "Enforces modal responsibility separation in Angular applications using CDK Dialog or Angular Material. Use when user asks to 'create a modal', 'open a dialog', 'implement modal form', or 'add dialog component'. Applies rule: modals only collect and return data, parent components handle service calls. Make sure to use this skill whenever generating Angular modal/dialog code, even for simple dialogs. Not for non-Angular frameworks, toast notifications, or inline form components."
---

# Responsabilidade de Modais em Angular

> Modais sao componentes burros: recebem dados, coletam input do usuario, e devolvem valores ao fechar — nunca injetam services de dominio.

## Rules

1. **Modal nunca injeta service de dominio** — porque quando o modal chama services diretamente, o fluxo de dados fica impossivel de rastrear em projetos com muitos modais e services
2. **Componente pai gerencia o service** — o componente que abre o modal injeta o service e chama os metodos de CRUD apos receber os dados do modal, porque isso torna o fluxo de dados linear e previsivel
3. **Modal apenas repassa valores** — recebe dados via injecao (MAT_DIALOG_DATA ou CDK), coleta input do usuario, e devolve resultado no `afterClosed()`, porque isso facilita substituir o modal sem impactar o componente pai
4. **Modal recebe copia, nao referencia** — passe uma copia do objeto para o modal manipular internamente, porque alteracoes diretas na referencia quebram o fluxo unidirecional
5. **Resultado do modal e um contrato** — o valor retornado no close deve ser tipado e representar apenas o que mudou, porque o componente pai decide o que fazer com essa informacao

## How to write

### Modal component (burro)

```typescript
@Component({ /* ... */ })
export class TaskFormModalComponent {
  private dialogRef = inject(MatDialogRef<TaskFormModalComponent>);
  data = inject<TaskFormModalData>(MAT_DIALOG_DATA);

  // SEM injecao de TaskService aqui

  onSave(): void {
    this.dialogRef.close({
      name: this.form.value.name,
      description: this.form.value.description,
    });
  }

  onCancel(): void {
    this.dialogRef.close(undefined);
  }
}
```

### Componente pai (responsavel pelo service)

```typescript
@Component({ /* ... */ })
export class WelcomeSectionComponent {
  private dialog = inject(MatDialog);
  private taskService = inject(TaskService);

  openCreateTask(): void {
    const dialogRef = this.dialog.open(TaskFormModalComponent, {
      data: { name: '', description: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.createTask(result.name, result.description);
      }
    });
  }
}
```

## Example

**Before (modal com responsabilidade demais):**

```typescript
@Component({ /* ... */ })
export class TaskFormModalComponent {
  private taskService = inject(TaskService); // ERRADO
  private dialogRef = inject(MatDialogRef);

  onSave(): void {
    this.taskService.createTask(this.name, this.description); // ERRADO
    this.dialogRef.close();
  }
}
```

**After (responsabilidades separadas):**

```typescript
// Modal: apenas coleta e devolve
@Component({ /* ... */ })
export class TaskFormModalComponent {
  private dialogRef = inject(MatDialogRef);

  onSave(): void {
    this.dialogRef.close({ name: this.name, description: this.description });
  }
}

// Pai: gerencia o service
dialogRef.afterClosed().subscribe((result) => {
  if (result) {
    this.taskService.createTask(result.name, result.description);
  }
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Modal de criacao (form) | Modal devolve os campos preenchidos, pai chama service.create() |
| Modal de edicao | Modal recebe copia do objeto, devolve campos alterados, pai chama service.update() |
| Modal de comentarios | Modal recebe copia da tarefa, manipula internamente, devolve flag de alteracao, pai chama service.updateComments() |
| Modal de confirmacao (delete) | Modal devolve boolean, pai chama service.delete() se true |
| Projeto pequeno | Mesma regra — consistencia importa mais que conveniencia |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `inject(TaskService)` dentro do modal | `inject(TaskService)` no componente pai |
| `this.taskService.create()` no onSave do modal | `this.dialogRef.close(formData)` no modal |
| Passar referencia direta do objeto ao modal | Passar copia via `{ data: { ...task } }` |
| Modal que fecha sem retornar valor apos acao | Sempre retornar resultado tipado no close |
| Logica de negocio dentro do modal | Modal so coleta/valida input de UI |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
