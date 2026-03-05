# Code Examples: Estrutura de Projeto Angular (GoTask Pattern)

## Estrutura completa de pastas do GoTask

```
app/
├── components/
│   ├── welcome-section/
│   │   ├── welcome-section.component.ts
│   │   ├── welcome-section.component.html
│   │   ├── welcome-section.component.css
│   │   └── welcome-section.component.spec.ts
│   ├── task-list-section/
│   │   ├── task-list-section.component.ts
│   │   ├── task-list-section.component.html
│   │   ├── task-list-section.component.css
│   │   └── task-list-section.component.spec.ts
│   └── task-card/
│       ├── task-card.component.ts
│       ├── task-card.component.html
│       ├── task-card.component.css
│       └── task-card.component.spec.ts
├── enums/
│   └── task-status.enum.ts
├── interfaces/
│   ├── task-interface.ts
│   └── task-form-model-data.ts
├── services/
│   └── task.service.ts
├── types/
│   └── task-status.type.ts
└── utils/
    └── helper.ts
```

## Enum de status

```typescript
// enums/task-status.enum.ts
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
```

## Type derivado do enum

```typescript
// types/task-status.type.ts
import { TaskStatus } from '../enums/task-status.enum';

export type TaskStatusType = TaskStatus;
```

## Interface da tarefa

```typescript
// interfaces/task-interface.ts
export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
}
```

## Interface de formulario

```typescript
// interfaces/task-form-model-data.ts
export interface ITaskFormModelData {
  title: string;
  description: string;
}
```

## Componente com sintaxe Angular 19

```typescript
// components/task-card/task-card.component.ts
import { Component, input, inject } from '@angular/core';
import { ITask } from '../../interfaces/task-interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [/* Angular Material modules */],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  // Signal-based input (Angular 19+)
  task = input.required<ITask>();

  // Functional dependency injection
  private taskService = inject(TaskService);

  updateStatus() {
    this.taskService.updateTask(this.task());
  }
}
```

## Template com @if/@else e Tailwind

```html
<!-- components/task-card/task-card.component.html -->
<div class="flex flex-col gap-2 p-4 rounded-lg shadow-md">
  <h3 class="text-lg font-semibold">{{ task().title }}</h3>
  <p class="text-sm text-gray-600">{{ task().description }}</p>

  @if (task().status === 'DONE') {
    <span class="text-green-600 font-medium">Concluida</span>
  } @else {
    <span class="text-yellow-600 font-medium">Em andamento</span>
  }
</div>
```

## Service de gerenciamento de estado

```typescript
// services/task.service.ts
import { Injectable, signal } from '@angular/core';
import { ITask } from '../interfaces/task-interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = signal<ITask[]>([]);

  getTasks() {
    return this.tasks.asReadonly();
  }

  addTask(task: ITask) {
    this.tasks.update(current => [...current, task]);
  }

  updateTask(updatedTask: ITask) {
    this.tasks.update(current =>
      current.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  }
}
```

## Funcao utilitaria

```typescript
// utils/helper.ts
export function formatTaskDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}
```

## package.json — versao Angular

```json
{
  "dependencies": {
    "@angular/core": "^19.2.0",
    "@angular/material": "^19.2.0"
  }
}
```