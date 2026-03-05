# Code Examples: Estrutura de Pastas Angular

## Estrutura completa do GoTask refatorado

```
src/app/
├── core/
│   ├── services/
│   │   ├── task.service.ts
│   │   └── modal.service.ts
│   └── components/
│       └── layout/
│           ├── header/
│           │   ├── header.component.ts
│           │   ├── header.component.html
│           │   └── header.component.css
│           └── welcome-section/
│               ├── welcome-section.component.ts
│               ├── welcome-section.component.html
│               └── welcome-section.component.css
├── shared/
│   ├── components/
│   ├── pipes/
│   └── directives/
├── domain/
│   └── task/
│       ├── task.model.ts
│       └── task-form-controls.model.ts
└── features/
    └── task/
        ├── task-board/
        │   ├── task-board.component.ts
        │   ├── task-board.component.html
        │   └── task-board.component.css
        ├── task-card/
        │   ├── task-card.component.ts
        │   ├── task-card.component.html
        │   └── task-card.component.css
        ├── task-create/
        │   ├── task-create.component.ts
        │   ├── task-create.component.html
        │   └── task-create.component.css
        ├── task-edit/
        │   ├── task-edit.component.ts
        │   ├── task-edit.component.html
        │   └── task-edit.component.css
        └── task-comments/
            ├── task-comments.component.ts
            ├── task-comments.component.html
            └── task-comments.component.css
```

## Domain layer — interfaces puras

```typescript
// domain/task/task.model.ts
export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}
```

```typescript
// domain/task/task-form-controls.model.ts
export interface ITaskFormControls {
  title: string;
  description: string;
  status: TaskStatus;
}
```

## Core layer — services singleton

```typescript
// core/services/task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITask } from '../../domain/task/task.model';
// ↑ Core importa de Domain (permitido)
// ↑ Core NUNCA importa de Features (proibido)

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<ITask[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  // Fonte unica de verdade — singleton
  // Estado salvo em Observable + LocalStorage
}
```

```typescript
// core/services/modal.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  // Gerencia abertura de modais de edicao, criacao, comentarios
  // Singleton — uma instancia para toda a aplicacao
}
```

## Feature layer — componentes de dominio

```typescript
// features/task/task-board/task-board.component.ts
import { Component } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
// ↑ Feature importa de Core (permitido)
import { ITask } from '../../../domain/task/task.model';
// ↑ Feature importa de Domain (permitido)

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html'
})
export class TaskBoardComponent {
  constructor(private taskService: TaskService) {}
}
```

## Exemplo de dependencia circular (o que evitar)

```typescript
// ERRADO — Core importando de Feature
// core/services/task.service.ts
import { ITask } from '../../features/task/task.model'; // CIRCULAR!

// CORRETO — Core importando de Domain
// core/services/task.service.ts
import { ITask } from '../../domain/task/task.model'; // OK!
```

## Escalando domain com multiplas features

```typescript
// domain/user/user.model.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

// domain/comment/comment.model.ts
export interface IComment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}
```

## Checklist para decidir onde colocar cada artefato

```
Pergunta 1: E uma interface/enum/type puro?
  SIM → domain/{feature}/

Pergunta 2: E um service com providedIn: root?
  SIM → Gerencia estado global? 
    SIM → core/services/
    NAO → Avalie se realmente precisa ser root

Pergunta 3: E um componente?
  → Usado em 2+ features? → shared/components/
  → Usado apenas no layout principal (1x)? → core/components/layout/
  → Usado apenas dentro de uma feature? → features/{feature}/
```