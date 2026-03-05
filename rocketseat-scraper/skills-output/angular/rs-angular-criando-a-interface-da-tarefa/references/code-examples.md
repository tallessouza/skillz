# Code Examples: Criando Interfaces e Tipagens em Angular

## Exemplo completo do instrutor

### 1. Enum de status

```typescript
// app/enums/task-status.enum.ts
export enum TaskStatusEnum {
  TODO = 'to-do',
  DOING = 'doing',
  DONE = 'done',
}
```

### 2. Type baseado no enum

```typescript
// app/types/task-status.ts
import { TaskStatusEnum } from '../enums/task-status.enum';

export type TaskStatus =
  | TaskStatusEnum.TODO
  | TaskStatusEnum.DOING
  | TaskStatusEnum.DONE;
```

### 3. Interface de comentario

```typescript
// app/interfaces/comment.interface.ts
export interface IComment {
  id: string;
  description: string;
}
```

### 4. Interface de tarefa (objeto central)

```typescript
// app/interfaces/task.interface.ts
import { IComment } from './comment.interface';
import { TaskStatus } from '../types/task-status';

export interface ITask {
  id: string;
  name: string;
  description: string;
  comments: IComment[];
  status: TaskStatus;
}
```

### 5. Uso no service com BehaviorSubject

```typescript
// app/services/task.service.ts
import { BehaviorSubject } from 'rxjs';
import { ITask } from '../interfaces/task.interface';

export class TaskService {
  private tasksSubject = new BehaviorSubject<ITask[]>([]);
  tasks$ = this.tasksSubject.asObservable();
}
```

## Estrutura final de arquivos

```
app/
├── enums/
│   └── task-status.enum.ts
├── interfaces/
│   ├── comment.interface.ts
│   └── task.interface.ts
├── types/
│   └── task-status.ts
└── services/
    └── task.service.ts
```

## Variacao: aplicando o mesmo padrao para outro dominio

```typescript
// enums/user-role.enum.ts
export enum UserRoleEnum {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

// types/user-role.ts
import { UserRoleEnum } from '../enums/user-role.enum';

export type UserRole =
  | UserRoleEnum.ADMIN
  | UserRoleEnum.EDITOR
  | UserRoleEnum.VIEWER;

// interfaces/user.interface.ts
import { UserRole } from '../types/user-role';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
```