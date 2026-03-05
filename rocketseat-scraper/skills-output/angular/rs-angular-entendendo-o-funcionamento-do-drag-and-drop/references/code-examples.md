# Code Examples: Angular Material CDK Drag and Drop

## Exemplo basico da documentacao — Transferring items between lists

### HTML do exemplo

```html
<div class="example-container">
  <h2>To do</h2>
  <div
    cdkDropList
    #todoList="cdkDropList"
    [cdkDropListData]="todo"
    [cdkDropListConnectedTo]="[doneList]"
    class="example-list"
    (cdkDropListDropped)="drop($event)"
  >
    @for (item of todo; track item) {
      <div class="example-box" cdkDrag>{{ item }}</div>
    }
  </div>
</div>

<div class="example-container">
  <h2>Done</h2>
  <div
    cdkDropList
    #doneList="cdkDropList"
    [cdkDropListData]="done"
    [cdkDropListConnectedTo]="[todoList]"
    class="example-list"
    (cdkDropListDropped)="drop($event)"
  >
    @for (item of done; track item) {
      <div class="example-box" cdkDrag>{{ item }}</div>
    }
  </div>
</div>
```

### TypeScript do exemplo

```typescript
import { Component } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-example',
  imports: [CdkDropList, CdkDrag],
  templateUrl: './example.html',
  styleUrl: './example.css',
})
export class ExampleComponent {
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
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

## Adaptacao para projeto GoTask — usando fonte de verdade

### Template com async pipe

```html
<div class="task-column">
  <h2>A Fazer</h2>
  <div
    cdkDropList
    #todoList="cdkDropList"
    [cdkDropListData]="todoTasks$ | async"
    [cdkDropListConnectedTo]="[doingList, doneList]"
    (cdkDropListDropped)="drop($event)"
  >
    @for (task of todoTasks$ | async; track task.id) {
      <app-task-card cdkDrag [task]="task" />
    }
  </div>
</div>

<div class="task-column">
  <h2>Fazendo</h2>
  <div
    cdkDropList
    #doingList="cdkDropList"
    [cdkDropListData]="doingTasks$ | async"
    [cdkDropListConnectedTo]="[todoList, doneList]"
    (cdkDropListDropped)="drop($event)"
  >
    @for (task of doingTasks$ | async; track task.id) {
      <app-task-card cdkDrag [task]="task" />
    }
  </div>
</div>

<div class="task-column">
  <h2>Concluido</h2>
  <div
    cdkDropList
    #doneList="cdkDropList"
    [cdkDropListData]="doneTasks$ | async"
    [cdkDropListConnectedTo]="[todoList, doingList]"
    (cdkDropListDropped)="drop($event)"
  >
    @for (task of doneTasks$ | async; track task.id) {
      <app-task-card cdkDrag [task]="task" />
    }
  </div>
</div>
```

### Debug com JsonPipe

```html
<!-- Adicione temporariamente para inspecionar dados -->
<p>To Do: {{ todoTasks$ | async | json }}</p>
<p>Doing: {{ doingTasks$ | async | json }}</p>
<p>Done: {{ doneTasks$ | async | json }}</p>
```

### Componente completo

```typescript
import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-list-section',
  imports: [CdkDropList, CdkDrag, AsyncPipe, TaskCardComponent],
  templateUrl: './task-list-section.component.html',
})
export class TaskListSectionComponent {
  // Referencia direta aos observables — sem propriedades locais extras
  todoTasks$ = this.taskService.todoTasks$;
  doingTasks$ = this.taskService.doingTasks$;
  doneTasks$ = this.taskService.doneTasks$;

  constructor(private taskService: TaskService) {}

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Atualizar fonte de verdade no service
    this.taskService.updateLists(
      event.previousContainer.data,
      event.container.data
    );
  }
}
```

## Checklist de implementacao

```
[ ] Importar CdkDropList e CdkDrag no componente
[ ] Importar moveItemInArray e transferArrayItem
[ ] Adicionar cdkDropList nas divs container
[ ] Criar template variables (#todoList, #doingList, #doneList)
[ ] Configurar cdkDropListData com observable | async
[ ] Configurar cdkDropListConnectedTo com array de template variables
[ ] Adicionar (cdkDropListDropped)="drop($event)" em cada container
[ ] Adicionar cdkDrag no elemento iterado (componente ou div)
[ ] Implementar metodo drop() que atualiza fonte de verdade
[ ] Verificar que cada observable aponta para o BehaviorSubject correto
```