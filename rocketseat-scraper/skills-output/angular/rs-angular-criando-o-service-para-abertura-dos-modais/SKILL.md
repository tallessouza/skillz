---
name: rs-angular-criando-service-abertura-modais
description: "Applies Angular CDK Dialog pattern for modal management via centralized service. Use when user asks to 'open a modal', 'create a dialog service', 'manage modals in Angular', 'use Angular CDK dialog', or 'centralize modal logic'. Enforces injectable service with shared config, DialogRef returns, and proper dependency injection. Make sure to use this skill whenever creating or refactoring modal/dialog systems in Angular applications. Not for React/Vue modals, CSS-only modals, or non-Angular dialog implementations."
---

# Angular CDK Dialog — Service Centralizado para Modais

> Centralize toda logica de abertura de modais em um unico service injetavel, usando Angular CDK Dialog.

## Rules

1. **Crie um service dedicado para modais** — `modal-controller.service.ts` com `@Injectable({ providedIn: 'root' })`, porque garante instancia unica e centraliza configuracao
2. **Injete o Dialog via `inject()`** — `private readonly _dialog = inject(Dialog)` do `@angular/cdk/dialog`, porque e o padrao moderno de injecao no Angular
3. **Um metodo por modal** — `openNewTaskModal()`, `openEditTaskModal()`, `openTaskCommentsModal()`, porque cada modal pode ter configuracoes e dados diferentes
4. **Extraia configuracoes compartilhadas** — crie uma propriedade `private readonly modalSizeOptions` e use spread nos metodos, porque evita duplicacao
5. **Retorne o DialogRef** — cada metodo deve retornar `this._dialog.open(...)`, porque permite ao consumidor se inscrever no observable `closed` e receber dados do modal
6. **Siga a nomenclatura Angular** — arquivo `nome.service.ts`, classe `NomeService`, porque e o padrao do framework e ferramentas dependem disso

## How to write

### Service completo

```typescript
import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TaskFormModalComponent } from '../components/task-form-modal/task-form-modal.component';
import { TaskCommentsModalComponent } from '../components/task-comments-modal/task-comments-modal.component';

@Injectable({ providedIn: 'root' })
export class ModalControllerService {
  private readonly _dialog = inject(Dialog);

  private readonly modalSizeOptions = {
    maxWidth: '620px',
    width: '95%',
  };

  openNewTaskModal() {
    return this._dialog.open(TaskFormModalComponent, {
      ...this.modalSizeOptions,
    });
  }

  openEditTaskModal() {
    return this._dialog.open(TaskFormModalComponent, {
      ...this.modalSizeOptions,
    });
  }

  openTaskCommentsModal() {
    return this._dialog.open(TaskCommentsModalComponent, {
      ...this.modalSizeOptions,
    });
  }
}
```

### Consumindo o service em um componente

```typescript
import { Component, inject } from '@angular/core';
import { ModalControllerService } from './services/modal-controller.service';

@Component({ ... })
export class AppComponent {
  private readonly _modalControllerService = inject(ModalControllerService);

  openModal() {
    this._modalControllerService.openNewTaskModal();
  }
}
```

## Example

**Before (modal aberto diretamente no componente, duplicado):**

```typescript
@Component({ ... })
export class TaskListComponent {
  private readonly _dialog = inject(Dialog);

  openCreate() {
    this._dialog.open(TaskFormModalComponent, { maxWidth: '620px', width: '95%' });
  }

  openEdit() {
    this._dialog.open(TaskFormModalComponent, { maxWidth: '620px', width: '95%' });
  }
}

// Outro componente repete a mesma logica...
@Component({ ... })
export class DashboardComponent {
  private readonly _dialog = inject(Dialog);

  openCreate() {
    this._dialog.open(TaskFormModalComponent, { maxWidth: '620px', width: '95%' });
  }
}
```

**After (service centralizado):**

```typescript
// Service unico
@Injectable({ providedIn: 'root' })
export class ModalControllerService {
  private readonly _dialog = inject(Dialog);
  private readonly modalSizeOptions = { maxWidth: '620px', width: '95%' };

  openNewTaskModal() {
    return this._dialog.open(TaskFormModalComponent, { ...this.modalSizeOptions });
  }
}

// Qualquer componente usa o service
@Component({ ... })
export class TaskListComponent {
  private readonly _modalController = inject(ModalControllerService);

  openCreate() { this._modalController.openNewTaskModal(); }
}

@Component({ ... })
export class DashboardComponent {
  private readonly _modalController = inject(ModalControllerService);

  openCreate() { this._modalController.openNewTaskModal(); }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mesmo modal aberto em 2+ componentes | Centralize em um service |
| Modal precisa de dados do chamador | Use a propriedade `data` no segundo parametro do `open()` |
| Precisa reagir ao fechamento do modal | Use `dialogRef.closed.subscribe(value => ...)` |
| Varios modais com mesmas dimensoes | Extraia config compartilhada com spread |
| Tela responsiva | Use `width: '95%'` + `maxWidth: '620px'` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Abrir dialog direto no componente repetidamente | Centralize em um `ModalControllerService` |
| Duplicar `{ maxWidth, width }` em cada `open()` | Extraia para `modalSizeOptions` e use spread |
| Ignorar o retorno do `open()` | Retorne o `DialogRef` para permitir `closed` subscription |
| Importar `Dialog` de path errado | Sempre de `@angular/cdk/dialog` |
| Usar `constructor(private dialog: Dialog)` | Use `inject(Dialog)` — padrao moderno |
| Nomear arquivo `modalService.ts` | Use `modal-controller.service.ts` — padrao Angular |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
