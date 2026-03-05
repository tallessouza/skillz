---
name: rs-angular-rxresource-login
description: "Applies RxResource pattern for managing HTTP requests with Angular Signals when writing authentication flows or reactive data fetching. Use when user asks to 'create login', 'fetch data with signals', 'replace subscribe with signals', 'use rxResource', or 'manage HTTP requests reactively in Angular'. Ensures proper signal-driven request triggering with undefined initialization to prevent premature execution. Make sure to use this skill whenever implementing HTTP requests with Angular Signals or migrating from RxJS subscribe patterns. Not for non-HTTP signal usage, state management without API calls, or React/Vue projects."
---

# RxResource para Requisicoes HTTP com Signals

> Substitua inscricoes manuais em Observables por RxResource, delegando ao Angular o controle de subscribe/unsubscribe automaticamente.

## Rules

1. **Use RxResource do `@angular/core/rxjs-interop`** — nao crie wrappers manuais de subscribe/unsubscribe, porque o Angular gerencia o ciclo de vida automaticamente
2. **Inicialize o signal de params com `undefined`** — porque quando params retorna undefined, o RxResource NAO executa o observable, evitando requisicoes prematuras
3. **Crie signals semanticos para params** — `loginParams` nao `triggerSignal`, porque o valor do signal deve fazer sentido para a requisicao HTTP que ele dispara
4. **Use destructuring no parametro stream** — `({ params })` nao `(obj)` para evitar `params.params.email`
5. **Mantenha side-effects no pipe/tap** — redirecionamentos e efeitos colaterais vao no `tap()` do observable retornado pelo stream
6. **Remova DestroyRef ao migrar** — RxResource gerencia desincricao automaticamente, DestroyRef manual vira codigo morto

## How to write

### RxResource basico com params

```typescript
import { signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

// Signal semantico — valor faz sentido para a requisicao
loginParams = signal<ILoginParams | undefined>(undefined);

// RxResource — dispara quando loginParams muda (e nao e undefined)
loginResource = rxResource({
  params: () => this.loginParams(),
  stream: ({ params }) => {
    return this.userApi.login(params.email, params.password).pipe(
      tap(() => this.router.navigate(['/explore']))
    );
  },
});
```

### Disparando a requisicao

```typescript
login() {
  this.loginParams.set({
    email: this.loginForm.value.email,
    password: this.loginForm.value.password,
  });
}
```

### Interface de params em arquivo separado

```typescript
// features/authentication/models/login-params.ts
export interface ILoginParams {
  email: string;
  password: string;
}
```

## Example

**Before (subscribe manual com DestroyRef):**
```typescript
export class LoginComponent {
  private destroyRef = inject(DestroyRef);

  login() {
    this.userApi.login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/explore']);
      });
  }
}
```

**After (RxResource com Signals):**
```typescript
export class LoginComponent {
  loginParams = signal<ILoginParams | undefined>(undefined);

  loginResource = rxResource({
    params: () => this.loginParams(),
    stream: ({ params }) =>
      this.userApi.login(params.email, params.password).pipe(
        tap(() => this.router.navigate(['/explore']))
      ),
  });

  login() {
    this.loginParams.set({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Requisicao HTTP disparada por acao do usuario | Signal de params com undefined inicial |
| Requisicao HTTP ao carregar componente | Signal com valor inicial definido (nao undefined) |
| Side-effect apos sucesso (redirect, toast) | `tap()` no pipe do observable retornado no stream |
| Valor do signal nao tem relacao semantica com a request | PARE — repense o design do signal |
| Migrando de subscribe manual | Remova DestroyRef, takeUntilDestroyed, e o subscribe |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `signal(true)` so pra disparar request | `signal<IParams \| undefined>(undefined)` com valor semantico |
| `stream: (obj) => ... obj.params.params.email` | `stream: ({ params }) => ... params.email` (destructuring) |
| Manter DestroyRef junto com RxResource | Remover DestroyRef — RxResource gerencia sozinho |
| Criar signal generico `requestTrigger` | Criar signal nomeado pelo dominio: `loginParams`, `searchQuery` |
| `subscribe()` manual em HTTP quando RxResource e possivel | RxResource com params + stream |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
