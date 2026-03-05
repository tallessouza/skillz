# Code Examples: Regras de Dependencia

## Exemplo 1: Dashboard consumindo User List (caso do instrutor)

O instrutor usa este cenario para ilustrar a regra de dependencia entre Features.

### Cenario: Dashboard mostra lista de usuarios

```typescript
// ❌ PROBLEMA: feature depende de outra feature
// feature/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { UserListComponent } from '../users/user-list/user-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserListComponent],
  template: `
    <h1>Dashboard</h1>
    <app-user-list />  <!-- Se remover, dashboard quebra? -->
  `,
})
export class DashboardComponent {}
```

### Teste mental: remova o user-list

Se voce remover `<app-user-list />` do template e o import, o dashboard ainda funciona? Se sim, a dependencia e aceitavel (tolerada). Se nao, refatore.

### Solucao ideal: mover para Shared ou usar internamente

```typescript
// ✅ CORRETO: Dashboard usa componente proprio ou da Shared
// feature/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { DataTableComponent } from '@shared/components/data-table/data-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DataTableComponent],
  template: `
    <h1>Dashboard</h1>
    <app-data-table [data]="users" [columns]="columns" />
  `,
})
export class DashboardComponent {
  users = [];
  columns = ['name', 'email'];
}
```

## Exemplo 2: Shared consumindo Core

```typescript
// ✅ PERMITIDO: Shared depende de Core
// shared/components/header/header.component.ts
import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      <span>{{ userName }}</span>
    </header>
  `,
})
export class HeaderComponent {
  userName = '';
  constructor(private auth: AuthService) {
    this.userName = this.auth.getCurrentUser().name;
  }
}
```

## Exemplo 3: Shared consumindo Feature (VIOLACAO)

```typescript
// ❌ PROIBIDO: Shared depende de Feature
// shared/components/modal/modal.component.ts
import { DashboardComponent } from '@feature/dashboard/dashboard.component';

@Component({
  selector: 'app-modal',
  imports: [DashboardComponent], // ERRADO!
  template: `<app-dashboard />`, // Modal agora depende da feature dashboard
})
export class ModalComponent {}
```

## Exemplo 4: Core isolado

```typescript
// ✅ CORRETO: Core nao depende de ninguem
// core/services/http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }

  post<T>(url: string, body: unknown) {
    return this.http.post<T>(url, body);
  }
}
```

```typescript
// ❌ PROIBIDO: Core dependendo de Shared
// core/services/notification.service.ts
import { ToastComponent } from '@shared/components/toast/toast.component';
// ERRADO! Core nao pode importar Shared
```

## Exemplo 5: Estrutura de pastas respeitando as regras

```
src/
├── app/
│   ├── core/                    # Depende de NINGUEM
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── http.service.ts
│   │   │   └── storage.service.ts
│   │   ├── guards/
│   │   └── interceptors/
│   │
│   ├── shared/                  # Depende apenas de Core
│   │   ├── components/
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── modal/
│   │   │   └── data-table/
│   │   ├── pipes/
│   │   └── directives/
│   │
│   └── features/                # Depende de Core e Shared
│       ├── dashboard/
│       │   ├── components/      # Componentes internos da feature
│       │   ├── services/        # Services internos da feature
│       │   └── dashboard.component.ts
│       ├── users/
│       │   ├── components/
│       │   ├── services/
│       │   └── users.component.ts
│       └── products/
│           ├── components/
│           ├── services/
│           └── products.component.ts
```