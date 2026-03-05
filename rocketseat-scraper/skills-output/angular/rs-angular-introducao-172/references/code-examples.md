# Code Examples: Angular Signals no Login

## Nota sobre os exemplos

A aula de introducao nao contem codigo — apenas descreve os conceitos que serao implementados nas aulas seguintes. Os exemplos abaixo sao construidos a partir da descricao do instrutor para ilustrar os padroes que serao ensinados.

## Exemplo completo: Login Component com Signals

```typescript
import { Component, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input
        type="email"
        [value]="email()"
        (input)="email.set($event.target.value)"
        placeholder="E-mail"
      />
      <span *ngIf="emailError()">{{ emailError() }}</span>

      <input
        type="password"
        [value]="password()"
        (input)="password.set($event.target.value)"
        placeholder="Senha"
      />

      <button [disabled]="!isFormValid()">
        {{ isLoading() ? 'Entrando...' : 'Login' }}
      </button>

      <p *ngIf="errorMessage()">{{ errorMessage() }}</p>
    </form>
  `
})
export class LoginComponent {
  // Signal padrao — estado simples
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  // Computed — derivado de outros signals
  isFormValid = computed(() => {
    const email = this.email();
    const password = this.password();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && password.length > 0;
  });

  emailError = computed(() => {
    const email = this.email();
    if (!email) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'E-mail invalido';
  });

  // rxResource — requisicao HTTP reativa
  loginResource = rxResource({
    request: () => ({
      email: this.email(),
      password: this.password()
    }),
    loader: ({ request }) => this.authService.login(request)
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading.set(true);
      this.loginResource.reload();
    }
  }
}
```

## Signal padrao — variacoes

```typescript
// Criar signal com valor inicial
const count = signal(0);

// Ler valor
console.log(count()); // 0

// Atualizar valor
count.set(1);

// Atualizar baseado no valor anterior
count.update(prev => prev + 1);
```

## Computed — variacoes

```typescript
const firstName = signal('João');
const lastName = signal('Silva');

// Computed recalcula automaticamente quando dependencias mudam
const fullName = computed(() => `${firstName()} ${lastName()}`);

console.log(fullName()); // "João Silva"
firstName.set('Maria');
console.log(fullName()); // "Maria Silva"
```

## Validators com Signal Forms

```typescript
// Required — campo obrigatorio
const username = signal('');
const usernameValid = computed(() => username().length > 0);

// Email — valida formato
const email = signal('');
const emailValid = computed(() => {
  const value = email();
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
});

// Composto — form inteiro valido
const isFormValid = computed(() => usernameValid() && emailValid());
```

## rxResource — chamada HTTP

```typescript
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

// Dentro do componente
loginResource = rxResource({
  request: () => ({
    email: this.email(),
    password: this.password()
  }),
  loader: ({ request }) =>
    this.http.post<AuthResponse>('/api/login', request)
});

// Acessar estado do resource
const data = this.loginResource.value();     // resultado
const loading = this.loginResource.isLoading(); // boolean
const error = this.loginResource.error();     // erro se houver
```