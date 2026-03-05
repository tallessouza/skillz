# Code Examples: Tratamento de Erros no RxResource Angular

## Exemplo completo: Abordagem catchError

```typescript
// login-form.component.ts — Abordagem 1 (catchError)
import { Component, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ /* ... */ })
export class LoginFormComponent {
  loginParams = signal<LoginRequest | undefined>(undefined);
  loginErrorMessage = signal('');

  loginResource = rxResource({
    request: () => this.loginParams(),
    loader: ({ request }) =>
      this.authService.login(request).pipe(
        catchError((error: HttpErrorResponse) => {
          this.loginErrorMessage.set(error.error.message);
          return of(null); // Converte para observable de sucesso
        })
      ),
  });
}
```

## Exemplo completo: Abordagem computed + cause (recomendada)

```typescript
// login-form.component.ts — Abordagem 2 (computed + cause)
import { Component, computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { setErrorMessage } from '../../shared/utils/set-error-message';

@Component({ /* ... */ })
export class LoginFormComponent {
  loginParams = signal<LoginRequest | undefined>(undefined);

  loginResource = rxResource({
    request: () => this.loginParams(),
    loader: ({ request }) => this.authService.login(request),
  });

  loginError = computed(() => setErrorMessage(this.loginResource.error()));
}
```

## Funcao utilitaria completa

```typescript
// shared/utils/set-error-message.ts
import { HttpErrorResponse } from '@angular/common/http';

export const setErrorMessage = (error: Error | undefined): string => {
  const cause = error?.cause as HttpErrorResponse;

  // Sem erro
  if (!cause) return '';

  // Erro de conexao (status 0 = sem rede ou servidor offline)
  if (cause.status === 0) {
    return 'Sem conexão com a internet ou servidor offline';
  }

  // Mensagem retornada pelo backend (ex: "E-mail ou senha inválidos")
  if (cause.error?.message) {
    return cause.error.message as string;
  }

  // Fallback generico
  return 'Ocorreu um erro inesperado ao tentar acessar.';
};
```

## Template completo

```html
<!-- login-form.component.html -->
<form (ngSubmit)="onSubmit()">
  <!-- campos do formulario -->

  <button type="submit">Entrar</button>

  @if (loginError()) {
    <p class="error-message">{{ loginError() }}</p>
  } @else {
    <p>&nbsp;</p>  <!-- Workaround para evitar layout shift -->
  }
</form>
```

## Reutilizacao em outros componentes

```typescript
// Qualquer componente que use rxResource com HTTP
@Component({ /* ... */ })
export class MovieListComponent {
  searchParams = signal<string>('');

  moviesResource = rxResource({
    request: () => this.searchParams(),
    loader: ({ request }) => this.movieService.search(request),
  });

  // Mesma funcao utilitaria, mesma logica
  moviesError = computed(() => setErrorMessage(this.moviesResource.error()));
}
```

## Debugando o error signal

```typescript
// Para inspecionar o conteudo do error signal
loginError = computed(() => {
  // Loga o objeto completo para entender a estrutura
  console.log(this.loginResource.error());
  // Resultado: Error { cause: HttpErrorResponse { status: 401, error: { message: "..." } } }

  console.log(this.loginResource.error()?.cause);
  // Resultado: HttpErrorResponse { status: 401, url: "...", error: { message: "E-mail ou senha inválidos" } }

  return setErrorMessage(this.loginResource.error());
});
```

## Testando cenarios de erro

```typescript
// Cenario 1: Credenciais invalidas (status 401)
// cause.status = 401, cause.error.message = "E-mail ou senha inválidos"
// Resultado: "E-mail ou senha inválidos"

// Cenario 2: Sem internet (status 0)
// cause.status = 0
// Resultado: "Sem conexão com a internet ou servidor offline"

// Cenario 3: Erro generico do servidor (status 500, sem message)
// cause.status = 500, cause.error.message = undefined
// Resultado: "Ocorreu um erro inesperado ao tentar acessar."

// Cenario 4: Sem erro
// error = undefined, cause = undefined
// Resultado: ""
```