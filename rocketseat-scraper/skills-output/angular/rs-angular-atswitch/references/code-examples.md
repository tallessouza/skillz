# Code Examples: Angular @switch

## Exemplo completo da aula — UserRole Switch

### 1. Gerando o componente

```bash
ng generate component switch
```

Remove o arquivo `.spec.ts` se não precisar de testes imediatos.

### 2. Registrando no AppComponent

```typescript
// app.component.ts
import { SwitchComponent } from './switch/switch.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SwitchComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-switch />
```

### 3. Component TypeScript (switch.component.ts)

```typescript
import { Component } from '@angular/core';

type UserRole = 'admin' | 'editor' | 'viewer';

@Component({
  selector: 'app-switch',
  standalone: true,
  templateUrl: './switch.component.html',
})
export class SwitchComponent {
  userRole: UserRole = 'admin';

  setRole(role: UserRole) {
    this.userRole = role;
  }
}
```

### 4. Template com @switch (switch.component.html)

```html
@switch (userRole) {
  @case ('admin') {
    <p>Painel do Administrador</p>
  }
  @case ('editor') {
    <p>Painel do Editor</p>
  }
  @default {
    <p>Visualização padrão (viewer)</p>
  }
}

<button (click)="setRole('admin')">Admin</button>
<button (click)="setRole('editor')">Editor</button>
<button (click)="setRole('viewer')">Viewer</button>
```

## Forma legada com ngSwitch (para referência)

### Usando CommonModule

```typescript
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule], // traz NgSwitch, NgIf, NgFor, pipes, etc.
  templateUrl: './switch.component.html',
})
export class SwitchComponent { ... }
```

### Usando importações isoladas

```typescript
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './switch.component.html',
})
export class SwitchComponent { ... }
```

### Template legado

```html
<div [ngSwitch]="userRole">
  <p *ngSwitchCase="'admin'">Painel do Administrador</p>
  <p *ngSwitchCase="'editor'">Painel do Editor</p>
  <p *ngSwitchDefault>Visualização padrão</p>
</div>

<button (click)="setRole('admin')">Admin</button>
<button (click)="setRole('editor')">Editor</button>
<button (click)="setRole('viewer')">Viewer</button>
```

## Variações práticas

### @switch com status de pedido

```typescript
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

@Component({ ... })
export class OrderStatusComponent {
  status: OrderStatus = 'pending';
}
```

```html
@switch (status) {
  @case ('pending') {
    <span class="badge badge-warning">Aguardando</span>
  }
  @case ('processing') {
    <span class="badge badge-info">Processando</span>
  }
  @case ('shipped') {
    <span class="badge badge-primary">Enviado</span>
  }
  @case ('delivered') {
    <span class="badge badge-success">Entregue</span>
  }
  @default {
    <span class="badge badge-danger">Cancelado</span>
  }
}
```

### @switch com tipo de notificação

```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Component({ ... })
export class NotificationComponent {
  type: NotificationType = 'info';
  message = 'Operação realizada';
}
```

```html
@switch (type) {
  @case ('success') {
    <div class="alert alert-success">✓ {{ message }}</div>
  }
  @case ('error') {
    <div class="alert alert-danger">✗ {{ message }}</div>
  }
  @case ('warning') {
    <div class="alert alert-warning">⚠ {{ message }}</div>
  }
  @default {
    <div class="alert alert-info">ℹ {{ message }}</div>
  }
}
```