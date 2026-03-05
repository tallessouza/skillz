# Code Examples: Drag and Drop entre Colunas com Angular CDK

## Exemplo completo do componente TS

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { ITask } from '../../interfaces/itask';

@Component({
  selector: 'app-task-list-section',
  standalone: true,
  imports: [CdkDropList, CdkDrag, TaskCardComponent],
  templateUrl: './task-list-section.component.html',
  styleUrl: './task-list-section.component.scss'
})
export class TaskListSectionComponent implements OnInit {
  toDoTasks: ITask[] = [];
  doingTasks: ITask[] = [];
  doneTasks: ITask[] = [];

  private taskService = inject(TaskService);

  ngOnInit(): void {
    this.taskService.todoList$.subscribe((todoList) => {
      this.toDoTasks = [...todoList];
    });

    this.taskService.doingList$.subscribe((doingList) => {
      this.doingTasks = [...doingList];
    });

    this.taskService.doneList$.subscribe((doneList) => {
      this.doneTasks = [...doneList];
    });
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
```

## Exemplo completo do template HTML (3 colunas)

```html
<!-- Coluna: A Fazer -->
<div
  class="column"
  cdkDropList
  #toDoListCdkDropList="cdkDropList"
  [cdkDropListData]="toDoTasks"
  [cdkDropListConnectedTo]="[doingListCdkDropList, doneListCdkDropList]"
  (cdkDropListDropped)="drop($event)"
>
  <h1>A fazer</h1>
  <div class="task-list">
    @for (toDoTask of toDoTasks; track toDoTask.id) {
      <app-task-card cdkDrag />
    }
  </div>
</div>

<!-- Coluna: Fazendo -->
<div
  class="column"
  cdkDropList
  #doingListCdkDropList="cdkDropList"
  [cdkDropListData]="doingTasks"
  [cdkDropListConnectedTo]="[toDoListCdkDropList, doneListCdkDropList]"
  (cdkDropListDropped)="drop($event)"
>
  <h1>Fazendo</h1>
  <div class="task-list">
    @for (doingTask of doingTasks; track doingTask.id) {
      <app-task-card cdkDrag />
    }
  </div>
</div>

<!-- Coluna: Concluido -->
<div
  class="column"
  cdkDropList
  #doneListCdkDropList="cdkDropList"
  [cdkDropListData]="doneTasks"
  [cdkDropListConnectedTo]="[toDoListCdkDropList, doingListCdkDropList]"
  (cdkDropListDropped)="drop($event)"
>
  <h1>Concluído</h1>
  <div class="task-list">
    @for (doneTask of doneTasks; track doneTask.id) {
      <app-task-card cdkDrag />
    }
  </div>
</div>
```

## Funcao drop — detalhe de cada caso

```typescript
drop(event: CdkDragDrop<ITask[]>) {
  // Caso 1: Reordenacao dentro da mesma coluna
  if (event.previousContainer === event.container) {
    // Move o item de previousIndex para currentIndex no mesmo array
    moveItemInArray(
      event.container.data,      // array da coluna atual
      event.previousIndex,        // posicao original
      event.currentIndex          // nova posicao
    );
  }
  // Caso 2: Transferencia entre colunas diferentes
  else {
    // Remove do array de origem e insere no array de destino
    transferArrayItem(
      event.previousContainer.data,  // array da coluna de origem
      event.container.data,          // array da coluna de destino
      event.previousIndex,           // posicao na origem
      event.currentIndex             // posicao no destino
    );
  }
}
```

## Mapa de conexoes entre colunas

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   A Fazer    │◄───►│   Fazendo    │◄───►│  Concluido   │
│             │◄────────────────────────►│             │
└─────────────┘     └─────────────┘     └─────────────┘

A Fazer    connectedTo: [Fazendo, Concluido]
Fazendo    connectedTo: [A Fazer, Concluido]
Concluido  connectedTo: [A Fazer, Fazendo]
```

## Variacao: adicionando mais colunas (ex: "Em Revisao")

```typescript
// No componente, adicione:
reviewTasks: ITask[] = [];

// No template, adicione nova coluna e atualize TODOS os connectedTo:
// A Fazer    → [doing, review, done]
// Fazendo    → [todo, review, done]
// Em Revisao → [todo, doing, done]
// Concluido  → [todo, doing, review]
```

## Nota sobre refatoracao futura (async pipe)

O instrutor menciona que a abordagem com listas intermediarias sera refatorada. A versao com `async pipe` eliminaria as propriedades `toDoTasks`, `doingTasks`, `doneTasks` e os subscribes manuais:

```html
<!-- Versao futura com async pipe (mencionada pelo instrutor) -->
@for (task of (taskService.todoList$ | async) ?? []; track task.id) {
  <app-task-card cdkDrag />
}
```

Isso reduz o tamanho do componente e elimina a necessidade de gerenciar subscribes manualmente.