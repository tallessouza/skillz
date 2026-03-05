# Code Examples: Retornando Dados ao Fechar Modal

## Exemplo completo do componente do modal

### task-form-modal.component.ts

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

interface ITaskFormControls {
  name: string;
  description: string;
}

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
})
export class TaskFormModalComponent {
  private readonly _fb = inject(FormBuilder);
  readonly _dialogRef = inject(DialogRef);

  taskForm: FormGroup = this._fb.group({
    name: [''],
    description: [''],
  });

  closeModal(formValues: ITaskFormControls | undefined = undefined): void {
    this._dialogRef.close(formValues);
  }

  onFormSubmit(): void {
    this.closeModal(this.taskForm.value as ITaskFormControls);
  }
}
```

### task-form-modal.component.html

```html
<div class="modal-header">
  <h2>{{ data.title }}</h2>
  <img src="assets/icons/close.svg" (click)="closeModal()" alt="Fechar" />
</div>

<form [formGroup]="taskForm" (ngSubmit)="onFormSubmit()">
  <div class="form-field">
    <label>Nome</label>
    <input formControlName="name" />
  </div>

  <div class="form-field">
    <label>Descrição</label>
    <textarea formControlName="description"></textarea>
  </div>

  <div class="modal-actions">
    <button type="button" (click)="closeModal()">Cancelar</button>
    <button type="submit">Criar tarefa</button>
  </div>
</form>
```

## Exemplo do service que abre o modal (controller)

### modal-controller.service.ts

```typescript
import { Injectable, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TaskFormModalComponent } from './task-form-modal.component';

interface ITaskFormControls {
  name: string;
  description: string;
}

interface ITaskFormModalData {
  title: string;
  task?: { name: string; description: string };
}

@Injectable({ providedIn: 'root' })
export class ModalControllerService {
  private readonly _dialog = inject(Dialog);

  openCreateModal(): void {
    this._dialog.open<ITaskFormControls>(TaskFormModalComponent, {
      disableClose: true,
      data: {
        title: 'Criar tarefa',
      } as ITaskFormModalData,
    });
  }

  openEditModal(task: { name: string; description: string }): void {
    this._dialog.open<ITaskFormControls>(TaskFormModalComponent, {
      disableClose: true,
      data: {
        title: 'Editar tarefa',
        task,
      } as ITaskFormModalData,
    });
  }
}
```

## Fluxo de dados visualizado

```
[Usuario digita nos inputs]
        |
        v
[taskForm.value] = { name: 'Minha tarefa', description: 'Descricao' }
        |
        v
[onFormSubmit()] --> closeModal(taskForm.value)
        |
        v
[_dialogRef.close(formValues)] --> propaga para componente pai (proximo video)


[Usuario clica X ou Cancelar]
        |
        v
[closeModal()] --> parametro default = undefined
        |
        v
[_dialogRef.close(undefined)] --> componente pai recebe undefined
```

## Variacao: com validacao antes de fechar

```typescript
onFormSubmit(): void {
  if (this.taskForm.invalid) {
    this.taskForm.markAllAsTouched();
    return;
  }
  this.closeModal(this.taskForm.value as ITaskFormControls);
}
```