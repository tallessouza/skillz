# Code Examples: Login com RxJS e Signals no Angular

## 1. Componente completo de login

### Template (login-form.component.html)
```html
<!-- Formulario de login -->
<form [formGroup]="loginForm">
  <input formControlName="email" type="email" placeholder="E-mail" />
  <input formControlName="password" type="password" placeholder="Senha" />

  <button (click)="login()">Entrar</button>

  @if (loginErrorMessage()) {
    <p class="error-message">{{ loginErrorMessage() }}</p>
  }
</form>
```

### Component (login-form.component.ts)
```typescript
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { UserApi } from '../../services/user-api.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private readonly _userApi = inject(UserApi);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  loginErrorMessage = signal<string>('');

  // loginForm definido com FormGroup (aulas anteriores)

  login() {
    const { email, password } = this.loginForm.value;

    this._userApi.login(email, password)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._router.navigate(['/explore']);
        },
        error: (error: HttpErrorResponse) => {
          console.log('Erro:', error);
          this.loginErrorMessage.set(error.error.message);
        }
      });
  }
}
```

## 2. Signal basico — criar, setar, ler

```typescript
// Criar com valor inicial
loginErrorMessage = signal<string>('');

// Setar valor
this.loginErrorMessage.set('e-mail ou senha inválidos');

// Ler no template (SEMPRE com parenteses)
// {{ loginErrorMessage() }}

// Ler no TypeScript
const msg = this.loginErrorMessage();
```

## 3. takeUntilDestroyed — setup completo

```typescript
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MeuComponent {
  // 1. Injetar DestroyRef
  private readonly _destroyRef = inject(DestroyRef);

  fazerRequisicao() {
    this.meuService.getData()
      // 2. Adicionar no pipe antes do subscribe
      .pipe(takeUntilDestroyed(this._destroyRef))
      // 3. Subscribe normalmente
      .subscribe({
        next: (data) => { /* sucesso */ },
        error: (err) => { /* erro */ }
      });
  }
  // Nao precisa de ngOnDestroy — tudo automatico
}
```

## 4. Destructuring do form value

```typescript
// O loginForm.value retorna um objeto na estrutura do model:
// { email: 'usuario@teste.com', password: '12345678' }

// Destructuring para extrair as constantes
const { email, password } = this.loginForm.value;

// Equivalente a:
const email = this.loginForm.value.email;
const password = this.loginForm.value.password;
```

## 5. Comparacao: sem vs com gerenciamento de subscription

### SEM gerenciamento (memory leak potencial)
```typescript
login() {
  this._userApi.login(email, password)
    .subscribe({
      next: () => this._router.navigate(['/explore']),
      error: (err) => this.loginErrorMessage.set(err.error.message)
    });
  // Se o componente morrer antes da response, subscription fica viva
}
```

### COM gerenciamento classico (verboso)
```typescript
private loginSubscription?: Subscription;

login() {
  this.loginSubscription = this._userApi.login(email, password)
    .subscribe({
      next: () => this._router.navigate(['/explore']),
      error: (err) => this.loginErrorMessage.set(err.error.message)
    });
}

ngOnDestroy() {
  this.loginSubscription?.unsubscribe();
}
```

### COM takeUntilDestroyed (recomendado)
```typescript
private readonly _destroyRef = inject(DestroyRef);

login() {
  this._userApi.login(email, password)
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: () => this._router.navigate(['/explore']),
      error: (err) => this.loginErrorMessage.set(err.error.message)
    });
}
// Nada mais necessario — automatico
```

## 6. @if com Signal no template (Angular 17+)

```html
<!-- Signal como condicao do @if -->
@if (loginErrorMessage()) {
  <p class="text-red-500 text-sm mt-2">
    {{ loginErrorMessage() }}
  </p>
}

<!-- O Angular so rastreia o Signal quando referenciado no template -->
<!-- Quando .set() e chamado, APENAS este trecho e re-renderizado -->
```