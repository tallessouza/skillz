---
name: rs-angular-rota-login-registro
description: "Applies Angular child routing patterns when configuring authentication routes with login and register screens. Use when user asks to 'create auth routes', 'configure login routing', 'setup register route', 'add child routes in Angular', or 'create authentication flow'. Enforces parent-child route structure with RouterOutlet, redirects, and pathMatch. Make sure to use this skill whenever setting up Angular routing for auth screens or nested route structures. Not for API authentication logic, guards, or interceptors."
---

# Configurando Rotas de Login e Registro no Angular

> Rotas de autenticacao usam estrutura pai-filho: um componente container com RouterOutlet carrega login ou registro dinamicamente via children.

## Rules

1. **Defina rotas em `app.routes.ts`** — todas as rotas ficam no array `routes`, porque centralizar facilita manutencao e lazy loading futuro
2. **Use children para rotas aninhadas** — login e register sao filhos do componente container (AuthenticationScreen), porque compartilham layout
3. **Redirecione path vazio para login** — `{ path: '', redirectTo: 'login', pathMatch: 'full' }` dentro do children, porque evita rota sem conteudo
4. **RouterOutlet em cada nivel** — app.component carrega rotas principais, componente pai carrega rotas filhas, porque cada nivel precisa do seu ponto de insercao
5. **Importe RouterOutlet do `@angular/router`** — nunca aceite auto-import de local incorreto, porque o Angular pode importar de pacotes errados
6. **Remova componentes chumbados ao usar rotas** — nao misture componentes estaticos com carregamento dinamico, porque causa duplicacao e confusao

## How to write

### Estrutura de rotas com children

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

### RouterOutlet no componente principal

```typescript
// app.component.ts
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

### RouterOutlet no componente pai (container)

```typescript
// authentication-screen.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authentication-screen',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './authentication-screen.component.html',
})
export class AuthenticationScreenComponent {}
```

```html
<!-- authentication-screen.component.html -->
<div class="auth-container">
  <!-- layout compartilhado: logo, imagem lateral, etc -->
  <router-outlet />
  <!-- aqui carrega LoginForm ou RegisterUserForm -->
</div>
```

## Example

**Before (componentes chumbados no template):**
```html
<!-- app.component.html -->
<app-authentication-screen />
<app-login-form />
<app-register-user-form />
```

**After (carregamento dinamico via rotas):**
```html
<!-- app.component.html -->
<router-outlet />

<!-- authentication-screen.component.html -->
<div class="auth-container">
  <router-outlet />
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componentes compartilham layout (header, sidebar) | Use rota pai com children |
| Path vazio dentro de children | Sempre redirectTo com pathMatch: 'full' |
| Auto-import do RouterOutlet | Verifique se vem de `@angular/router` |
| Componente ja esta no template estaticamente | Remova antes de usar via rota |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Componentes chumbados + RouterOutlet no mesmo template | Apenas RouterOutlet, carregue via rotas |
| `pathMatch: 'prefix'` em redirect de path vazio | `pathMatch: 'full'` para evitar redirect infinito |
| Import de RouterOutlet de pacote errado | `import { RouterOutlet } from '@angular/router'` |
| Rotas filhas sem RouterOutlet no componente pai | Adicione `<router-outlet />` no template do pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
