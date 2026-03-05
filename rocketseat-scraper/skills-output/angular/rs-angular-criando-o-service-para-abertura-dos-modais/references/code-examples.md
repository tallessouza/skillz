# Code Examples: Service Centralizado para Modais com Angular CDK

## Estrutura de arquivos

```
src/app/
├── services/
│   └── modal-controller.service.ts    # Service centralizado
├── components/
│   ├── task-form-modal/
│   │   └── task-form-modal.component.ts
│   └── task-comments-modal/
│       └── task-comments-modal.component.ts
└── app.component.ts                    # Componente consumidor
```

## Service completo (como criado na aula)

```typescript
// src/app/services/modal-controller.service.ts
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

## Componente consumidor (teste feito na aula)

```typescript
// src/app/app.component.ts (versao de teste, removida depois)
import { Component, inject } from '@angular/core';
import { ModalControllerService } from './services/modal-controller.service';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="openModal()">Abrir modal</button>
  `,
})
export class AppComponent {
  private readonly _modalControllerService = inject(ModalControllerService);

  openModal() {
    this._modalControllerService.openNewTaskModal();
  }
}
```

## Usando o DialogRef retornado (preview do uso futuro)

```typescript
// Exemplo de como consumir o retorno do service
openAndHandleResult() {
  const dialogRef = this._modalControllerService.openNewTaskModal();

  dialogRef.closed.subscribe((result) => {
    if (result) {
      console.log('Modal fechou com valor:', result);
      // Atualizar lista de tarefas, por exemplo
    }
  });
}
```

## Opcoes disponiveis no segundo parametro do open()

```typescript
// Todas as propriedades aceitas pelo Dialog.open()
this._dialog.open(MyComponent, {
  width: '95%',           // Largura do modal
  maxWidth: '620px',      // Largura maxima
  height: '400px',        // Altura fixa
  maxHeight: '90vh',      // Altura maxima
  data: { taskId: 123 },  // Dados enviados para o modal
  // ... outras opcoes do CDK
});
```

## Prerequisito: package.json

```json
{
  "dependencies": {
    "@angular/cdk": "^19.x.x"
  }
}
```

O `@angular/cdk` deve estar instalado e na mesma versao major do seu projeto Angular.

## Variacao: adicionando configuracoes especificas por modal

```typescript
openEditTaskModal(taskId: string) {
  return this._dialog.open(TaskFormModalComponent, {
    ...this.modalSizeOptions,
    data: { taskId, mode: 'edit' },  // config especifica
  });
}

openNewTaskModal() {
  return this._dialog.open(TaskFormModalComponent, {
    ...this.modalSizeOptions,
    data: { mode: 'create' },
  });
}
```