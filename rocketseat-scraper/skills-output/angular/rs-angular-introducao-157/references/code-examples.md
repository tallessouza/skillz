# Code Examples: LocalStorage para Persistencia de Estado em Angular

## Exemplo 1: Service basico de storage

```typescript
import { Injectable } from '@angular/core';

interface Task {
  id: string;
  title: string;
  comments: string[];
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaskStorageService {
  private readonly STORAGE_KEY = 'goTask_tasks';

  loadTasks(): Task[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  clearTasks(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
```

## Exemplo 2: Componente consumindo o service

```typescript
import { Component, OnInit } from '@angular/core';
import { TaskStorageService } from './task-storage.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskStorage: TaskStorageService) {}

  ngOnInit(): void {
    this.tasks = this.taskStorage.loadTasks();
  }

  addTask(title: string): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      comments: [],
      completed: false,
    };
    this.tasks.push(newTask);
    this.taskStorage.saveTasks(this.tasks);
  }

  removeTask(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.taskStorage.saveTasks(this.tasks);
  }

  addComment(taskId: string, comment: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.comments.push(comment);
      this.taskStorage.saveTasks(this.tasks);
    }
  }

  toggleComplete(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.taskStorage.saveTasks(this.tasks);
    }
  }
}
```

## Exemplo 3: Versao generica reutilizavel

```typescript
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  get<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
```

## Exemplo 4: Teste unitario do service

```typescript
describe('TaskStorageService', () => {
  let service: TaskStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskStorageService);
  });

  it('should return empty array when no tasks stored', () => {
    expect(service.loadTasks()).toEqual([]);
  });

  it('should save and load tasks', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Test', comments: [], completed: false },
    ];
    service.saveTasks(tasks);
    expect(service.loadTasks()).toEqual(tasks);
  });

  it('should handle corrupted data gracefully', () => {
    localStorage.setItem('goTask_tasks', 'invalid json');
    expect(service.loadTasks()).toEqual([]);
  });
});
```