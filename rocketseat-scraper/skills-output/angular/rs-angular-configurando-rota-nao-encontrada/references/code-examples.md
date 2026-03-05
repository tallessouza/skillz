# Code Examples: Configurando Rota Nao Encontrada

## Exemplo da aula — Redirect para login

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'explore', component: ExploreComponent },
      // ... outras rotas autenticadas
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
```

Fluxo quando usuario digita `/teste`:
- `**` captura → redirect para `/login`
- Guard no `/login` detecta usuario autenticado → redirect para `/explore`
- Usuario chega em `/explore`

## Variacao: Pagina 404 customizada

```typescript
// not-found.component.ts
@Component({
  standalone: true,
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Pagina nao encontrada</p>
      <a routerLink="/explore">Voltar para o inicio</a>
    </div>
  `
})
export class NotFoundComponent {}

// app.routes.ts
export const routes: Routes = [
  // ... todas as rotas
  { path: '**', component: NotFoundComponent }
];
```

## Variacao: Wildcard dentro de modulo lazy-loaded

```typescript
// admin.routes.ts
export const adminRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

// app.routes.ts
export const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes) },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
```

Neste caso, `/admin/xyz` cai no wildcard do modulo admin (redirect para `/admin/dashboard`), enquanto `/xyz` cai no wildcard global (redirect para `/login`).