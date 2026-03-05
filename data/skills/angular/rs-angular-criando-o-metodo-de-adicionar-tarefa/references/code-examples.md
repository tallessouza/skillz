# Code Examples: Criando Metodo de Adicionar Tarefa

## 1. TaskService completo — metodo addTask

```typescript
// task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITask, ITaskFormControls } from '../interfaces/task.interface';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { generateUniqueIdWithTimestamp } from '../utils/generate-id';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private todoTasks$ = new BehaviorSubject<ITask[]>([]);

  // Observable publico para subscribers
  get todoTasks() {
    return this.todoTasks$.asObservable();
  }

  addTask(taskInfos: ITaskFormControls): void {
    // 1. Criar objeto completo da tarefa
    const newTask: ITask = {
      ...taskInfos, // name e description vem do form
      status: TaskStatusEnum.TODO,
      id: generateUniqueIdWithTimestamp(),
      comments: [],
    };

    // 2. Ler lista atual sem substituir
    const currentList = this.todoTasks$.value;

    // 3. Emitir nova lista com item adicionado
    this.todoTasks$.next([...currentList, newTask]);
  }
}
```

## 2. WelcomeSectionComponent — chamando addTask apos dialog fechar

```typescript
// welcome-section.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { ITaskFormControls } from '../../interfaces/task.interface';

@Component({
  selector: 'app-welcome-section',
  templateUrl: './welcome-section.component.html',
})
export class WelcomeSectionComponent {
  private readonly _taskService = inject(TaskService);
  private readonly _dialog = inject(MatDialog);

  openCreateTaskDialog(): void {
    const dialogRef = this._dialog.open(TaskDialogComponent);

    dialogRef.afterClosed().subscribe((taskForm: ITaskFormControls | undefined) => {
      // Validar se o usuario nao cancelou o dialog
      if (taskForm) {
        this._taskService.addTask(taskForm);
      }
    });
  }
}
```

## 3. TaskListSectionComponent — inscricao no BehaviorSubject

```typescript
// task-list-section.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-list-section',
  templateUrl: './task-list-section.component.html',
})
export class TaskListSectionComponent implements OnInit {
  private readonly _taskService = inject(TaskService);

  ngOnInit(): void {
    // Inscricao manual (sera substituida por async pipe depois)
    this._taskService.todoTasks$
      .subscribe((todoList: ITask[]) => {
        console.log('Lista de to-dos:', todoList);
        // Primeira emissao: [] (valor inicial do BehaviorSubject)
        // Emissoes seguintes: lista com novos itens adicionados
      });
  }
}
```

## 4. Demonstracao do comportamento do BehaviorSubject

```typescript
// Quando o BehaviorSubject e criado:
private todoTasks$ = new BehaviorSubject<ITask[]>([]);
// Valor interno: []

// Quando alguem faz subscribe:
this.todoTasks$.subscribe(list => console.log(list));
// Imprime imediatamente: [] (valor inicial)

// Quando addTask e chamado pela primeira vez:
this.todoTasks$.next([...[], newTask1]);
// Valor interno: [newTask1]
// Subscribe recebe: [newTask1]

// Quando addTask e chamado pela segunda vez:
this.todoTasks$.next([...[newTask1], newTask2]);
// Valor interno: [newTask1, newTask2]
// Subscribe recebe: [newTask1, newTask2]
// Nenhum item foi perdido!
```

## 5. Variacao: padrao generico para qualquer lista reativa

```typescript
// Padrao reutilizavel para adicionar item a qualquer BehaviorSubject de array
addItemToSubject<T>(subject: BehaviorSubject<T[]>, newItem: T): void {
  const currentList = subject.value;
  subject.next([...currentList, newItem]);
}
```