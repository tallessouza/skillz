---
name: rs-angular-drag-and-drop-cdk
description: "Applies Angular Material CDK drag and drop patterns when implementing sortable lists or transferring items between columns in Angular. Use when user asks to 'implement drag and drop', 'move items between lists', 'create kanban board', 'reorder list items', or 'transfer tasks between columns'. Enforces direct source-of-truth binding with async pipe instead of redundant local component properties. Make sure to use this skill whenever implementing any drag and drop functionality in Angular projects. Not for React DnD, native HTML5 drag and drop, or non-Angular frameworks."
---

# Angular Material CDK Drag and Drop

> Conecte o drag and drop diretamente a fonte de verdade via async pipe — nunca crie propriedades locais redundantes no componente.

## Rules

1. **Importe CdkDropList e CdkDrag** — sao obrigatorios do `@angular/cdk/drag-drop`, porque sem eles as diretivas nao ficam disponiveis no template
2. **Use template variables para conectar listas** — `#todoList="cdkDropList"` e passe no `cdkDropListConnectedTo` como array, porque e assim que o CDK sabe entre quais containers permitir transferencia
3. **Vincule cdkDropListData a fonte de verdade** — use o observable do service com async pipe direto no template, porque evita propriedades locais desnecessarias no componente
4. **Aplique cdkDrag no elemento iterado** — a diretiva vai no elemento dentro do `@for`/`*ngFor`, nao no container, porque e o item individual que deve ser arrastavel
5. **Use o output cdkDropListDropped** — configure o metodo `drop()` que atualiza a fonte de verdade via service, nao listas locais, porque a mudanca deve propagar para todo o app
6. **Nunca crie propriedades locais so para alocar valores** — acesse diretamente no template com async pipe, porque propriedades extras sujam o componente e adicionam complexidade desnecessaria

## How to write

### Template com drag and drop entre colunas

```html
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
```

### Componente com imports e metodo drop

```typescript
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  imports: [CdkDropList, CdkDrag, AsyncPipe],
})
export class TaskListComponent {
  todoTasks$ = this.taskService.todoTasks$;
  doingTasks$ = this.taskService.doingTasks$;
  doneTasks$ = this.taskService.doneTasks$;

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Atualizar fonte de verdade via service
    this.taskService.updateTaskLists(event.container.data);
  }
}
```

## Example

**Before (propriedades locais redundantes):**
```typescript
export class TaskListComponent implements OnInit {
  todoList: Task[] = [];
  doingList: Task[] = [];
  doneList: Task[] = [];

  ngOnInit() {
    this.taskService.todoTasks$.subscribe(tasks => this.todoList = tasks);
    this.taskService.doingTasks$.subscribe(tasks => this.doingList = tasks);
    // Memory leak: sem unsubscribe
  }
}
```

**After (async pipe direto na fonte de verdade):**
```typescript
export class TaskListComponent {
  todoTasks$ = this.taskService.todoTasks$;
  doingTasks$ = this.taskService.doingTasks$;
  doneTasks$ = this.taskService.doneTasks$;
  // Sem subscribe manual, async pipe gerencia lifecycle
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mover item dentro da mesma lista | `moveItemInArray()` |
| Mover item entre listas diferentes | `transferArrayItem()` |
| Precisa ver dados no template para debug | Use `{{ list \| json }}` com JsonPipe |
| Layout diferente dos exemplos do Material | Aplique apenas as diretivas, CSS e layout sao independentes |
| Multiplas colunas conectadas | Passe todas as template variables no array de `cdkDropListConnectedTo` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `subscribe()` manual para popular listas locais | `async` pipe direto no template |
| Propriedades locais duplicando dados do service | Referencia direta ao observable do service |
| Atualizar apenas a lista local no `drop()` | Atualizar a fonte de verdade via metodo do service |
| `cdkDrag` no container da lista | `cdkDrag` no elemento individual iterado |
| Esquecer `cdkDropListConnectedTo` | Sempre conectar as listas que devem trocar itens |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
