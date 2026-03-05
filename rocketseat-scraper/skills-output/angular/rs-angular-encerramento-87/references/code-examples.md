# Code Examples: Fundamentos do Angular

## Anatomia de um Componente

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `<h1>{{ title }}</h1>`,
  styles: [`h1 { color: blue; }`]
})
export class ExampleComponent {
  title = 'Meu Componente';
}
```

## Comunicacao Pai → Filho (@Input)

```typescript
// filho.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filho',
  standalone: true,
  template: `<p>{{ mensagem }}</p>`
})
export class FilhoComponent {
  @Input() mensagem = '';
}

// pai.component.ts — no template:
// <app-filho [mensagem]="'Ola do pai!'" />
```

## Comunicacao Filho → Pai (@Output)

```typescript
// filho.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filho',
  standalone: true,
  template: `<button (click)="notificar()">Clique</button>`
})
export class FilhoComponent {
  @Output() clicou = new EventEmitter<string>();

  notificar() {
    this.clicou.emit('Filho clicado!');
  }
}

// pai.component.ts — no template:
// <app-filho (clicou)="onClicou($event)" />
```

## Fluxo de Dados no Template

```html
<!-- @for — iteracao -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

<!-- @if — condicional -->
@if (isLoggedIn) {
  <p>Bem-vindo!</p>
} @else {
  <p>Faca login</p>
}

<!-- @switch — multiplos casos -->
@switch (status) {
  @case ('ativo') { <span class="green">Ativo</span> }
  @case ('inativo') { <span class="red">Inativo</span> }
  @default { <span>Desconhecido</span> }
}

<!-- @let — variavel local -->
@let fullName = user.firstName + ' ' + user.lastName;
<p>{{ fullName }}</p>
```

## Service para Estado Compartilhado

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  addTask(task: Task) {
    const current = this.tasksSubject.getValue();
    this.tasksSubject.next([...current, task]);
  }

  removeTask(id: string) {
    const current = this.tasksSubject.getValue();
    this.tasksSubject.next(current.filter(t => t.id !== id));
  }
}
```

## Consumindo Service no Componente

```typescript
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @for (task of taskService.tasks$ | async; track task.id) {
      <div>{{ task.name }}</div>
    }
  `
})
export class TaskListComponent {
  taskService = inject(TaskService);
}
```

## Assets — Referenciando Imagens

```html
<!-- No template do componente -->
<img src="assets/images/logo.png" alt="Logo" />
```

```css
/* No estilo do componente */
.hero {
  background-image: url('/assets/images/hero-bg.jpg');
}
```