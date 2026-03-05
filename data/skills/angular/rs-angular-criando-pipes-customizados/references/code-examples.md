# Code Examples: Criando Pipes Customizados

## 1. Service retornando Observable com of()

```typescript
// services/users.service.ts
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers() {
    return of([
      { name: 'Felipe', status: 1 },
      { name: 'Laura', status: 0 },
    ]);
  }
}
```

## 2. Pipe customizado completo

```typescript
// pipes/user-status.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'userStatus' })
export class UserStatusPipe implements PipeTransform {
  transform(status: number): string {
    const userStatusObj: { [key: number]: string } = {
      1: 'Ativo',
      0: 'Inativo',
    };
    return userStatusObj[status];
  }
}
```

## 3. Componente com inject() e sem subscription manual

```typescript
// components/custom-pipe/custom-pipe.component.ts
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../services/users.service';
import { UserStatusPipe } from '../../pipes/user-status.pipe';

@Component({
  selector: 'app-custom-pipe',
  standalone: true,
  imports: [AsyncPipe, UserStatusPipe],
  templateUrl: './custom-pipe.component.html',
})
export class CustomPipeComponent {
  userService = inject(UserService);
}
```

## 4. Template com @for + AsyncPipe + custom pipe

```html
<!-- components/custom-pipe/custom-pipe.component.html -->
<div>
  @for (user of userService.getUsers() | async; track user.name) {
    <div>
      <p>Nome: {{ user.name }}</p>
      <p>Status: {{ user.status | userStatus }}</p>
    </div>
  }
</div>
```

## 5. Usando no AppComponent

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { CustomPipeComponent } from './components/custom-pipe/custom-pipe.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomPipeComponent],
  template: '<app-custom-pipe />',
})
export class AppComponent {}
```

## 6. Gerando os artefatos via CLI

```bash
# Componente
ng generate component components/custom-pipe

# Service
ng generate service services/users

# Pipe
ng generate pipe pipes/user-status
```

## 7. Variacao: pipe com mais status

```typescript
transform(status: number): string {
  const userStatusObj: { [key: number]: string } = {
    0: 'Inativo',
    1: 'Ativo',
    2: 'Pendente',
    3: 'Bloqueado',
  };
  return userStatusObj[status] ?? 'Desconhecido';
}
```

## 8. Anti-pattern: recebendo objeto inteiro (NAO FACA)

```typescript
// ERRADO — mutacao por referencia
transform(user: any): any {
  user.status = user.status === 1 ? 'Ativo' : 'Inativo'; // muta o original!
  return user;
}

// CORRETO se precisar do objeto — clone primeiro
transform(user: { name: string; status: number }): { name: string; status: string } {
  const clone = { ...user };
  return { ...clone, status: clone.status === 1 ? 'Ativo' : 'Inativo' };
}

// MELHOR — passe so o primitivo
transform(status: number): string {
  return status === 1 ? 'Ativo' : 'Inativo';
}
```