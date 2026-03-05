---
name: rs-angular-introducao-171
description: "Applies Angular routing, interceptors, and guards architecture when building authenticated Angular apps. Use when user asks to 'create Angular routes', 'add auth guard', 'implement interceptor', 'protect routes', or 'setup Angular authentication flow'. Ensures correct separation of routing, token management via interceptors, and route protection via guards. Make sure to use this skill whenever scaffolding Angular app authentication infrastructure. Not for React, Next.js, or non-Angular frameworks."
---

# Arquitetura de Autenticacao Angular: Rotas, Interceptors e Guards

> Toda aplicacao Angular autenticada precisa de tres pilares: rotas bem definidas, interceptor de token e guards de protecao.

## Conceito central

Uma aplicacao Angular com autenticacao exige tres camadas de infraestrutura configuradas antes de qualquer trabalho visual:

1. **Rotas** — mapeiam URLs para componentes (login, registro, area autenticada)
2. **Interceptor de token** — injeta automaticamente o token JWT nas requisicoes HTTP que precisam de autenticacao
3. **Guards** — protegem rotas, garantindo que apenas usuarios autenticados acessem areas restritas

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Nova rota publica (login, registro) | Rota sem guard, acessivel a todos |
| Nova rota autenticada (explorar filmes, dashboard) | Rota protegida com AuthGuard |
| Requisicao HTTP para API protegida | Interceptor adiciona token automaticamente |
| Usuario nao autenticado tenta acessar rota protegida | Guard redireciona para login |
| Usuario autenticado tenta acessar login/registro | Guard redireciona para area autenticada |

## Arquitetura dos tres pilares

### 1. Rotas

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'filmes',
    component: ExplorarFilmesComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'filmes', pathMatch: 'full' }
];
```

### 2. Interceptor de token

```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

### 3. Guards

```typescript
// auth.guard.ts — protege rotas autenticadas
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) return true;
  return router.createUrlTree(['/login']);
};

// guest.guard.ts — protege login/registro (usuario ja logado nao acessa)
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) return true;
  return router.createUrlTree(['/filmes']);
};
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota precisa de usuario logado | Adicione `canActivate: [authGuard]` |
| Rota e publica (login, registro) | Adicione `canActivate: [guestGuard]` para evitar acesso redundante |
| Requisicao HTTP para API com Bearer token | Nao adicione header manualmente — o interceptor faz isso |
| Token expirou | Interceptor ou guard deve redirecionar para login |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Adicionar token manualmente em cada requisicao HTTP | Usar interceptor centralizado |
| Verificar autenticacao dentro de cada componente | Usar guard na definicao da rota |
| Deixar rotas autenticadas sem guard | Sempre proteger com `canActivate` |
| Criar guard como classe quando usa Angular 14+ | Usar functional guards (`CanActivateFn`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
