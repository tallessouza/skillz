# Code Examples: Configurando Rotas de Login e Registro

## Exemplo completo do app.routes.ts

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { AuthenticationScreenComponent } from './components/authentication-screen/authentication-screen.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterUserFormComponent } from './components/register-user-form/register-user-form.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthenticationScreenComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginFormComponent },
      { path: 'register', component: RegisterUserFormComponent },
    ],
  },
];
```

### Anatomia de cada parte:

**Rota pai:**
```typescript
{
  path: 'auth',                          // URL: /auth
  component: AuthenticationScreenComponent, // Container visual
  children: [...]                        // Rotas aninhadas
}
```

**Redirect de path vazio:**
```typescript
{ path: '', redirectTo: 'login', pathMatch: 'full' }
// /auth → /auth/login automaticamente
// pathMatch: 'full' e OBRIGATORIO aqui
```

**Rotas filhas:**
```typescript
{ path: 'login', component: LoginFormComponent }
// /auth/login → carrega LoginForm dentro do RouterOutlet do AuthenticationScreen

{ path: 'register', component: RegisterUserFormComponent }
// /auth/register → carrega RegisterUserForm dentro do RouterOutlet do AuthenticationScreen
```

## app.component.ts — Antes e Depois

### Antes (componentes chumbados):
```typescript
import { Component } from '@angular/core';
import { AuthenticationScreenComponent } from './components/authentication-screen/authentication-screen.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterUserFormComponent } from './components/register-user-form/register-user-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AuthenticationScreenComponent,
    LoginFormComponent,
    RegisterUserFormComponent,
  ],
  template: `
    <app-authentication-screen />
    <app-login-form />
    <app-register-user-form />
  `,
})
export class AppComponent {}
```

### Depois (com RouterOutlet):
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
```

## authentication-screen.component — Antes e Depois

### Antes:
```html
<!-- tinha LoginForm e RegisterUserForm importados e usados diretamente -->
<div class="auth-container">
  <app-login-form />
  <app-register-user-form />
</div>
```

### Depois:
```typescript
// authentication-screen.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authentication-screen',
  standalone: true,
  imports: [RouterOutlet], // so precisa do RouterOutlet agora
  templateUrl: './authentication-screen.component.html',
})
export class AuthenticationScreenComponent {}
```

```html
<!-- authentication-screen.component.html -->
<div class="auth-container">
  <!-- layout compartilhado permanece -->
  <div class="auth-content">
    <router-outlet />
    <!-- Angular carrega LoginForm ou RegisterUserForm aqui -->
  </div>
</div>
```

## Variacao: Adicionando mais rotas filhas

Se precisar adicionar uma rota de "esqueci a senha":

```typescript
children: [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterUserFormComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
]
```

A estrutura se mantem identica — o RouterOutlet no AuthenticationScreen carrega qualquer filho configurado.

## Commit de referencia

[fe4c43f](https://github.com/rocketseat-education/angular-gerenciador-filmes/commit/fe4c43f77540c73d2cbe7abc75a79e865c3890f5)