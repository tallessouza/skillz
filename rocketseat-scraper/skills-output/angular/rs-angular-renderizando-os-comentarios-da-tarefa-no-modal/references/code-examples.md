# Code Examples: Renderizando Comentários no Modal

## 1. Evento de clique no template do TaskCard

```html
<!-- task-card.component.html -->
<p (click)="openTaskCommentsModal()" class="text-sm text-gray-500 cursor-pointer">
  {{ task.comments.length }} comentários
</p>
```

## 2. Método para abrir o modal no TaskCard

```typescript
// task-card.component.ts
openTaskCommentsModal() {
  // Dados chumbados para teste (temporário)
  this.task.comments = [
    { id: '123', description: 'Meu comentário 1' },
    { id: '456', description: 'Meu comentário 2' }
  ];

  this.modalControllerService.openTaskCommentsModal(this.task);
}
```

## 3. Método no ModalControllerService

```typescript
// modal-controller.service.ts
openTaskCommentsModal(task: ITask) {
  this.dialog.open(TaskCommentsModalComponent, {
    disableClose: true,
    data: task
  });
}
```

## 4. Injeção de dados no componente do modal

```typescript
// task-comments-modal.component.ts
import { inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';

export class TaskCommentsModalComponent {
  readonly _task = inject<ITask>(DIALOG_DATA);
}
```

## 5. Template completo do modal com @for e classes dinâmicas

```html
<!-- task-comments-modal.component.html -->
<div class="modal-content">
  <h2>Comentários</h2>

  @for (comment of _task.comments; track comment.id; let last = $last) {
    <!-- Início do comentário -->
    <div [class]="`py-4 ${!last ? 'border-b border-gray-200' : ''}`">
      <span class="text-xs text-gray-400">Comentado há 10 minutos atrás</span>
      <p [class]="`text-sm ${!last ? 'mb-3' : ''}`">
        {{ comment.description }}
      </p>
    </div>
    <!-- Fim do comentário -->
  }
</div>
```

## 6. Variáveis contextuais disponíveis no @for

```html
<!-- Todas as variáveis contextuais que podem ser usadas -->
@for (item of items; track item.id;
  let idx = $index;
  let first = $first;
  let last = $last;
  let even = $even;
  let odd = $odd;
  let count = $count) {

  <!-- idx: número do índice (0-based) -->
  <!-- first: true se é o primeiro -->
  <!-- last: true se é o último -->
  <!-- even: true se índice par -->
  <!-- odd: true se índice ímpar -->
  <!-- count: total de itens -->
}
```

## 7. Padrão de instância clonada (contexto do structuredClone)

```typescript
// No componente pai que gerencia a lista de tarefas
// A tarefa já chega clonada via structuredClone no TaskCard
@Input() task!: ITask; // Esta é uma cópia, não a referência original

// Ao abrir o modal, essa cópia é passada
// Alterações no modal afetam apenas esta cópia
// A fonte de verdade só é atualizada após confirmação explícita
```