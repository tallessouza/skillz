---
name: rs-angular-signal-forms-login
description: "Applies Angular Signal Forms patterns when creating forms with validation in Angular 19+. Use when user asks to 'create a form', 'add validation', 'build login page', 'implement signup', or any Angular form task. Enforces signal-based model creation, form() function usage from @angular/forms/signals, field directive binding, and built-in validators (required, email, minLength). Make sure to use this skill whenever generating Angular form code. Not for React forms, template-driven forms, or reactive forms with FormGroup/FormControl."
---

# Angular Signal Forms

> Crie formularios Angular usando Signal Forms: modelo signal primeiro, form() com validacoes, field directive para binding.

## Rules

1. **Crie um model signal antes do formulario** — `signal({email: '', password: ''})`, porque o model define a estrutura e valores iniciais dos campos
2. **Use form() de @angular/forms/signals** — nunca de @angular/forms, porque sao APIs diferentes e o autocomplete de campos depende do import correto
3. **Validacoes recebem fieldPath + objeto com message** — `required(fieldPath.email, { message: 'O e-mail é obrigatório' })`, porque o message fica disponivel no template via errors
4. **Conecte inputs com a diretiva field** — `[field]="loginForm.email"`, porque ela faz o two-way binding entre input e campo do formulario
5. **Acesse valores invocando signals** — `loginForm().value()` para valor, `loginForm.valid()` para validez, porque form e seus campos sao signals
6. **Campos individuais nao precisam de invocacao para acessar** — `loginForm.email` (sem parenteses), mas `.errors()` sim, porque o campo e acessado como propriedade mas seus metadados sao signals

## How to write

### Model + Form com validacoes

```typescript
import { signal } from '@angular/core';
import { form, required, email, minLength } from '@angular/forms/signals';

// 1. Model signal define estrutura
loginModel = signal({
  email: '',
  password: '',
});

// 2. Form com validacoes via callback
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, { message: 'O e-mail é obrigatório' });
  email(fieldPath.email, { message: 'O e-mail está inválido' });
  required(fieldPath.password, { message: 'A senha é obrigatória' });
  minLength(fieldPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres' });
});
```

### Template binding com field directive

```html
<!-- Importar field nos imports do componente (@angular/forms/signals) -->
<input type="email" [field]="loginForm.email" />
<input type="password" [field]="loginForm.password" />
```

### Acessando valores e erros

```typescript
// Valor completo do formulario
const formValue = this.loginForm().value();

// Formulario valido?
const isValid = this.loginForm.valid();

// Erros de um campo especifico
const emailErrors = this.loginForm.email.errors();
// => [] ou [{ kind: 'email', message: 'O e-mail está inválido' }]
```

## Example

**Before (sem Signal Forms — Reactive Forms antigo):**
```typescript
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(8)]),
});
```

**After (Signal Forms):**
```typescript
loginModel = signal({ email: '', password: '' });

loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, { message: 'O e-mail é obrigatório' });
  email(fieldPath.email, { message: 'O e-mail está inválido' });
  required(fieldPath.password, { message: 'A senha é obrigatória' });
  minLength(fieldPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres' });
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario simples (login, contato) | Signal Forms com model signal |
| Formulario dinamico (adicionar/remover campos) | Reactive Forms ainda e mais adequado |
| Formulario com 1-2 campos sem validacao | Template Driven Forms |
| Precisa do valor do formulario | `this.loginForm().value()` — invoque duas vezes |
| Precisa verificar campo individual | `this.loginForm.email.errors()` — sem invocar o campo, invoque errors |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `import { form } from '@angular/forms'` | `import { form } from '@angular/forms/signals'` |
| `loginForm.email()` para acessar campo | `loginForm.email` (propriedade direta) |
| `loginForm.value` sem invocar | `loginForm().value()` (ambos sao signals) |
| Validacao sem message | `required(fp.email, { message: 'Texto do erro' })` |
| `new FormGroup` para formularios simples | `form(signal({...}), callback)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
