# Code Examples: Mensagens de Erro com Computed Signals

## Exemplo completo do component

```typescript
import { Component, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { setErrorMessage } from '../../shared/utils/set-error-message';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  // Signal do formulario (simplificado)
  formData = signal({
    name: '',
    email: '',
    password: ''
  });

  // Resource que dispara a requisicao quando formData muda
  registerResource = rxResource({
    request: () => this.formData(),
    loader: ({ request }) =>
      this.http.post('/api/register', request)
  });

  // Computed signal que deriva a mensagem de erro
  registerError = computed(() =>
    setErrorMessage(this.registerResource.error())
  );

  constructor(private http: HttpClient) {}
}
```

## Template completo

```html
<form (ngSubmit)="onSubmit()">
  <input type="text" [(ngModel)]="formData().name" placeholder="Nome" />
  <input type="email" [(ngModel)]="formData().email" placeholder="Email" />
  <input type="password" [(ngModel)]="formData().password" placeholder="Senha" />

  <button type="submit">Criar</button>

  @if (registerError()) {
    <p class="error">{{ registerError() }}</p>
  } @else {
    <p></p>
  }
</form>
```

## Utilitario setErrorMessage

```typescript
import { HttpErrorResponse } from '@angular/common/http';

export function setErrorMessage(error: unknown): string {
  if (!error) return '';

  const httpError = (error as any)?.cause as HttpErrorResponse;

  if (!httpError?.status) {
    return 'Sem conexão com a internet ou servidor offline.';
  }

  if (httpError.error?.message) {
    return httpError.error.message;
  }

  return 'Erro inesperado. Tente novamente.';
}
```

## Comparacao: abordagem com catchError vs computed

### Abordagem com catchError (evitar)

```typescript
// Dentro do observable passado ao rxResource
this.http.post('/api/register', data).pipe(
  catchError(err => {
    // Problema: causa erro de console com rxResource
    // "instancia nao e do tipo Error"
    this.errorSignal.set(err.error?.message || 'Erro');
    return of(null); // retorna observable de sucesso
  })
);
```

### Abordagem com computed (recomendada)

```typescript
// Nenhum pipe/catchError necessario
registerResource = rxResource({
  request: () => this.formData(),
  loader: ({ request }) =>
    this.http.post('/api/register', request)
    // SEM pipe, SEM catchError
});

// Computed reage ao .error() automaticamente
registerError = computed(() =>
  setErrorMessage(this.registerResource.error())
);
```

## Reutilizacao em login (mesmo padrao)

```typescript
// login.component.ts — mesmo pattern
loginResource = rxResource({
  request: () => this.loginData(),
  loader: ({ request }) =>
    this.http.post('/api/login', request)
});

loginError = computed(() =>
  setErrorMessage(this.loginResource.error())
);
```

## Estrutura da resposta de erro do backend

```
// Network tab — Response quando campos vazios:
{
  "message": "Todos os campos são obrigatórios"
}

// Status: 400 Bad Request
// O setErrorMessage acessa: httpError.error.message
```