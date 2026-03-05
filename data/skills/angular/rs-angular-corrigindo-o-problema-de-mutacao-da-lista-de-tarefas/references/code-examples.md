# Code Examples: Imutabilidade em Streams RxJS

## Exemplo completo do service com pipe em todos os observables

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';
import { ITask } from '../interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private todoTasks = new BehaviorSubject<ITask[]>([]);
  private doingTasks = new BehaviorSubject<ITask[]>([]);
  private doneTasks = new BehaviorSubject<ITask[]>([]);

  // CORRETO: cada getter expõe um clone via pipe
  get todoTasks$(): Observable<ITask[]> {
    return this.todoTasks.asObservable().pipe(
      map(tasks => structuredClone(tasks))
    );
  }

  get doingTasks$(): Observable<ITask[]> {
    return this.doingTasks.asObservable().pipe(
      map(tasks => structuredClone(tasks))
    );
  }

  get doneTasks$(): Observable<ITask[]> {
    return this.doneTasks.asObservable().pipe(
      map(tasks => structuredClone(tasks))
    );
  }

  // Métodos controlados — única forma de mutar a fonte de verdade
  addTask(task: ITask): void {
    const currentTasks = this.todoTasks.getValue();
    this.todoTasks.next([...currentTasks, task]);
  }
}
```

## Componente consumindo o observable (seguro)

```typescript
export class TaskListSectionComponent implements OnInit {
  tasks: ITask[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // tasks recebido aqui já é um clone — mutações não afetam o service
    this.taskService.todoTasks$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }
}
```

## Comparação: shallow clone vs deep clone

```typescript
// Objeto complexo (tarefa com comentários)
const task: ITask = {
  id: '1',
  title: 'Minha tarefa',
  comments: [{ id: 'c1', text: 'Comentário' }]
};

// SHALLOW CLONE — comments ainda é referência original
const shallow = { ...task };
shallow.comments.push({ id: 'c2', text: 'Novo' });
console.log(task.comments.length); // 2 — MUTOU o original!

// DEEP CLONE — tudo é independente
const deep = structuredClone(task);
deep.comments.push({ id: 'c2', text: 'Novo' });
console.log(task.comments.length); // 1 — original intacto
```

## Alternativa para browsers antigos (sem structuredClone)

```typescript
// Usando JSON.parse/JSON.stringify
get todoTasks$(): Observable<ITask[]> {
  return this.todoTasks.asObservable().pipe(
    map(tasks => JSON.parse(JSON.stringify(tasks)))
  );
}

// Usando lodash cloneDeep
import { cloneDeep } from 'lodash';

get todoTasks$(): Observable<ITask[]> {
  return this.todoTasks.asObservable().pipe(
    map(tasks => cloneDeep(tasks))
  );
}
```

## Erro demonstrado: referência errada ao copiar pipe

```typescript
// BUG: doingTasks$ aponta para todoTasks por engano
get doingTasks$(): Observable<ITask[]> {
  return this.todoTasks.asObservable().pipe(  // ERRADO! deveria ser this.doingTasks
    map(tasks => structuredClone(tasks))
  );
}

// CORRETO:
get doingTasks$(): Observable<ITask[]> {
  return this.doingTasks.asObservable().pipe(
    map(tasks => structuredClone(tasks))
  );
}
```