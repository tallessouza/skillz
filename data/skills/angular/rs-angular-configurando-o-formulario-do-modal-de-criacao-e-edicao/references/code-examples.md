# Code Examples: Formulário Reativo em Modal Angular

## 1. Interface reutilizável

```typescript
// interfaces/task-form-controls.interface.ts
export interface ITaskFormControls {
  name: string;
  description: string;
}
```

## 2. Interface do modal data atualizada

```typescript
// interfaces/task-form-modal-data.interface.ts
import { ITaskFormControls } from './task-form-controls.interface';

export interface ITaskFormModalData {
  mode: 'create' | 'edit';
  formValues: ITaskFormControls;
}
```

## 3. ModalControllerService com formValues

```typescript
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';

@Injectable({ providedIn: 'root' })
export class ModalControllerService {
  private dialog = inject(Dialog);

  openEditTaskModal(formValues: ITaskFormControls) {
    this.dialog.open(TaskFormModalComponent, {
      data: {
        mode: 'edit',
        formValues   // shorthand: mesmo que formValues: formValues
      }
    });
  }

  openNewTaskModal() {
    this.dialog.open(TaskFormModalComponent, {
      data: {
        mode: 'create',
        formValues: { name: '', description: '' }
      }
    });
  }
}
```

## 4. TaskCard chamando o modal de edição

```typescript
// task-card.component.ts
openEditTaskModal() {
  this.modalController.openEditTaskModal({
    name: 'nome tarefa',        // depois será dinâmico com dados reais
    description: 'descrição tarefa'
  });
}
```

## 5. Componente do modal com Reactive Forms completo

```typescript
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ITaskFormModalData } from '../../interfaces/task-form-modal-data.interface';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
})
export class TaskFormModalComponent {
  // IMPORTANTE: _data deve ser declarado ANTES de taskForm
  // porque taskForm usa this._data na inicialização
  private _data: ITaskFormModalData = inject(DIALOG_DATA);

  taskForm = new FormGroup({
    name: new FormControl(this._data.formValues.name, [
      Validators.required,
      Validators.minLength(10)
    ]),
    description: new FormControl(this._data.formValues.description, [
      Validators.required,
      Validators.minLength(10)
    ])
  });

  onFormSubmit() {
    if (this.taskForm.valid) {
      const values = this.taskForm.value;
      // processar values.name e values.description
    }
  }
}
```

## 6. Template completo do modal

```html
<form [formGroup]="taskForm" (ngSubmit)="onFormSubmit()">
  <!-- Campo nome -->
  <input
    formControlName="name"
    placeholder="Nome da tarefa"
  />

  <!-- Campo descrição -->
  <input
    formControlName="description"
    placeholder="Descrição da tarefa"
  />

  <!-- Botão com classes dinâmicas e disabled -->
  <button
    type="submit"
    [disabled]="taskForm.invalid"
    [class]="`py-3 px-4 rounded-xl text-white text-sm font-semibold cursor-pointer ${
      taskForm.invalid
        ? 'bg-[#D7D8D8]'
        : 'bg-blue-500 shadow-lg transform transition duration-200'
    }`"
  >
    {{ _data.mode === 'edit' ? 'Salvar alterações' : 'Criar tarefa' }}
  </button>
</form>
```

## 7. Propriedades úteis do FormGroup (mencionadas pelo instrutor)

```typescript
// Verificações de estado disponíveis
taskForm.invalid    // true se qualquer control falha validação
taskForm.valid      // true se todos os controls passam
taskForm.disabled   // true se o form está desabilitado
taskForm.enabled    // true se o form está habilitado
taskForm.value      // { name: '...', description: '...' }

// Em controls individuais
taskForm.get('name')?.hasError('required')     // campo vazio
taskForm.get('name')?.hasError('minlength')    // menos que 10 chars
```

## 8. Variação: se precisar usar `type="button"` em vez de `submit`

```html
<!-- Alternativa com (click) em vez de (ngSubmit) -->
<form [formGroup]="taskForm">
  <input formControlName="name" />
  <input formControlName="description" />

  <!-- type="button" não dispara ngSubmit, precisa de (click) -->
  <button
    type="button"
    [disabled]="taskForm.invalid"
    (click)="onFormSubmit()"
  >
    Salvar
  </button>
</form>
```