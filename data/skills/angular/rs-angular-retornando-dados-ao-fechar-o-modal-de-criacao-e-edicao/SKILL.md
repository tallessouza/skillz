---
name: rs-angular-retornando-dados-fechar-modal
description: "Enforces Angular Material Dialog data return patterns when closing modals. Use when user asks to 'close modal with data', 'return values from dialog', 'pass form data on modal close', 'configure dialog close behavior', or 'disable outside click close'. Applies DialogRef injection, typed close returns, and disableClose config. Make sure to use this skill whenever implementing Angular Material dialog close logic or form submission inside modals. Not for opening dialogs, dialog styling, or non-Angular modal libraries."
---

# Retornando Dados ao Fechar Modal Angular Material

> Ao fechar um modal, use `DialogRef.close()` com dados tipados para propagar valores do formulario ao componente pai.

## Rules

1. **Injete DialogRef via `inject()`** — `readonly _dialogRef = inject(DialogRef)`, porque e o unico servico que controla o fechamento do modal de dentro do proprio componente
2. **Importe DialogRef do CDK** — `import { DialogRef } from '@angular/cdk/dialog'`, porque importar do lugar errado causa erros silenciosos
3. **Crie um metodo unico `closeModal` com parametro opcional** — aceite `undefined` como default para fechar sem dados, porque centraliza a logica de fechamento em um unico ponto
4. **Tipe o retorno generico do `open()`** — `this.dialog.open<ITaskFormControls>(...)`, porque garante type-safety no componente pai ao capturar o resultado
5. **Use `disableClose: true`** — na configuracao do dialog, porque evita fechamento acidental ao clicar fora do modal
6. **Teste todas as formas de fechamento** — botao X, cancelar, confirmar e clique fora, porque cada caminho pode produzir bugs diferentes em producao

## How to write

### Injecao do DialogRef

```typescript
import { DialogRef } from '@angular/cdk/dialog';

readonly _dialogRef = inject(DialogRef);
```

### Metodo closeModal com parametro opcional

```typescript
closeModal(formValues: ITaskFormControls | undefined = undefined): void {
  this._dialogRef.close(formValues);
}
```

### Submissao do formulario fechando o modal com dados

```typescript
onFormSubmit(): void {
  this.closeModal(this.taskForm.value as ITaskFormControls);
}
```

### Tipagem generica no open()

```typescript
openCreateModal(): void {
  this.dialog.open<ITaskFormControls>(TaskFormModalComponent, {
    disableClose: true,
    data: { title: 'Criar tarefa' }
  });
}
```

### Template com dois caminhos de fechamento

```html
<!-- Fechar sem dados (X e Cancelar) -->
<img src="close-icon.svg" (click)="closeModal()" />
<button (click)="closeModal()">Cancelar</button>

<!-- Fechar com dados (Submit) -->
<form [formGroup]="taskForm" (ngSubmit)="onFormSubmit()">
  <button type="submit">Criar tarefa</button>
</form>
```

## Example

**Before (sem retorno de dados):**
```typescript
// Modal fecha mas nao envia nada ao pai
close(): void {
  this._dialogRef.close();
}
```

**After (com retorno tipado):**
```typescript
closeModal(formValues: ITaskFormControls | undefined = undefined): void {
  this._dialogRef.close(formValues);
}

onFormSubmit(): void {
  this.closeModal(this.taskForm.value as ITaskFormControls);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao X ou Cancelar | Chame `closeModal()` sem parametros — retorna `undefined` |
| Botao de confirmacao/submit | Chame `closeModal(this.taskForm.value)` — retorna o objeto tipado |
| Modal com formulario | Sempre use `disableClose: true` para evitar perda de dados |
| Tipagem do retorno | Use generico no `open<T>()` com a interface dos form controls |
| `taskForm.value` | Ja retorna objeto com propriedades iguais aos nomes dos FormControls |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `this._dialogRef.close()` no submit (sem dados) | `this._dialogRef.close(this.taskForm.value)` |
| Dois metodos separados `closeWithData` e `closeWithout` | Um unico `closeModal(formValues = undefined)` |
| `import { DialogRef } from '@angular/material/dialog'` | `import { DialogRef } from '@angular/cdk/dialog'` |
| Modal sem `disableClose` quando tem formulario | `disableClose: true` na config |
| Capturar valores manualmente input por input | `this.taskForm.value` que ja retorna o objeto completo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
