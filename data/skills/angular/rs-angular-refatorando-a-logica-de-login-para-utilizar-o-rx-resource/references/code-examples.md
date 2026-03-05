# Code Examples: RxResource para Login com Signals

## Exemplo completo: antes da refatoracao (RxJS puro)

```typescript
// login.component.ts — ANTES
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UserApiService } from '../../services/user-api.service';

export class LoginComponent {
  private userApi = inject(UserApiService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  loginForm = /* FormGroup setup */;

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.userApi.login(email, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/explore']);
      });
  }
}
```

## Exemplo completo: apos refatoracao (RxResource)

```typescript
// features/authentication/models/login-params.ts
export interface ILoginParams {
  email: string;
  password: string;
}
```

```typescript
// login.component.ts — DEPOIS
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { UserApiService } from '../../services/user-api.service';
import { ILoginParams } from '../models/login-params';

export class LoginComponent {
  private userApi = inject(UserApiService);
  private router = inject(Router);

  loginForm = /* FormGroup setup */;

  // Signal semantico — undefined impede execucao automatica
  loginParams = signal<ILoginParams | undefined>(undefined);

  // RxResource — reage a mudancas no loginParams
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

## Demonstracao: o que acontece com valor inicial diferente de undefined

```typescript
// ERRADO — requisicao dispara automaticamente ao carregar o componente
loginParams = signal<ILoginParams>({
  email: 'texto',
  password: 'texto',
});

// CERTO — undefined impede execucao ate o usuario clicar em login
loginParams = signal<ILoginParams | undefined>(undefined);
```

## O objeto completo recebido no stream (para debug)

```typescript
loginResource = rxResource({
  params: () => this.loginParams(),
  stream: (streamObj) => {
    // streamObj contem:
    // - params: valor do signal (ILoginParams)
    // - status: estado da execucao do signal
    // - outras metadatas do RxResource
    console.log(streamObj);

    // Destructuring para pegar so o que interessa:
    const { params } = streamObj;
    return this.userApi.login(params.email, params.password);
  },
});
```

## Variacao: RxResource para busca de dados (nao login)

```typescript
// Exemplo aplicando o mesmo padrao para outra feature
searchQuery = signal<string | undefined>(undefined);

moviesResource = rxResource({
  params: () => this.searchQuery(),
  stream: ({ params }) =>
    this.moviesApi.search(params).pipe(
      map(response => response.results)
    ),
});

// Disparar busca
onSearch(query: string) {
  this.searchQuery.set(query);
}
```

## Estrutura de pastas resultante

```
features/
  authentication/
    models/
      login-params.ts      # ILoginParams interface
    components/
      login/
        login.component.ts  # Componente com RxResource
    services/
      user-api.service.ts   # HttpClient observable
```