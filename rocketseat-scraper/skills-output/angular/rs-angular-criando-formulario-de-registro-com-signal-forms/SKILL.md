---
name: rs-angular-signal-forms-registro
description: "Applies Angular Signal Forms patterns when building registration or signup forms with validation. Use when user asks to 'create a registration form', 'add form validation in Angular', 'build a signup page', 'use Signal Forms', or 'validate email and password fields'. Enforces model-first approach, field-level validation with error messages, and template binding via field directive. Make sure to use this skill whenever creating Angular reactive forms with @angular/forms/signals. Not for template-driven forms, traditional Reactive Forms, or non-Angular frameworks."
---

# Formularios de Registro com Angular Signal Forms

> Crie formularios Signal Forms a partir de um modelo signal, aplique validacoes por campo com mensagens de erro, e conecte ao template via diretiva `field`.

## Rules

1. **Crie um modelo signal primeiro** — o formulario precisa de um `signal({...})` com todos os campos inicializados como string vazia, porque o Signal Forms deriva a estrutura do modelo
2. **Use a funcao `form()` com callback de validacao** — nunca defina validacoes fora do segundo parametro do `form()`, porque o callback recebe `fieldPath` tipado com autocomplete dos campos do modelo
3. **Cada validacao carrega sua propria mensagem** — sempre inclua `{ message: '...' }` em cada validador, porque mensagens genericas nao ajudam o usuario a corrigir o erro
4. **Conecte campos via diretiva `[field]`** — use `[field]="registerForm.name"` no input HTML, nunca o modelo diretamente, porque o formulario gerencia estado e validacao
5. **Diferencie `min`/`max` de `minLength`/`maxLength`** — `min`/`max` validam valores numericos, `minLength`/`maxLength` validam comprimento de strings, porque confundir causa validacao silenciosamente incorreta
6. **Importe tudo de `@angular/forms/signals`** — `form`, `field`, `required`, `email`, `minLength` vem todos do mesmo pacote

## How to write

### Modelo do formulario

```typescript
registerModel = signal({
  name: '',
  email: '',
  password: '',
});
```

### Formulario com validacoes

```typescript
import { form, field, required, email, minLength } from '@angular/forms/signals';

registerForm = form(this.registerModel, (fieldPath) => {
  required(fieldPath.name, { message: 'O nome é obrigatório' });

  required(fieldPath.email, { message: 'O e-mail é obrigatório' });
  email(fieldPath.email, { message: 'O e-mail está inválido' });

  required(fieldPath.password, { message: 'A senha é obrigatória' });
  minLength(fieldPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres' });
});
```

### Binding no template

```html
<input type="text" [field]="registerForm.name" placeholder="Nome" />
<input type="email" [field]="registerForm.email" placeholder="E-mail" />
<input type="password" [field]="registerForm.password" placeholder="Senha" />
```

## Example

**Before (sem Signal Forms, imperativo):**
```typescript
// Campos soltos, validacao manual
name = '';
email = '';
password = '';

validate() {
  if (!this.name) return 'Nome obrigatorio';
  if (!this.email.includes('@')) return 'Email invalido';
  if (this.password.length < 8) return 'Senha curta';
}
```

**After (com Signal Forms):**
```typescript
registerModel = signal({ name: '', email: '', password: '' });

registerForm = form(this.registerModel, (fieldPath) => {
  required(fieldPath.name, { message: 'O nome é obrigatório' });
  required(fieldPath.email, { message: 'O e-mail é obrigatório' });
  email(fieldPath.email, { message: 'O e-mail está inválido' });
  required(fieldPath.password, { message: 'A senha é obrigatória' });
  minLength(fieldPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres' });
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo de texto obrigatorio | `required(fieldPath.campo, { message: '...' })` |
| Campo de email | `required` + `email` (duas validacoes separadas) |
| Senha com minimo de caracteres | `required` + `minLength(fieldPath.password, N, { message })` |
| Campo numerico com limite | Use `min`/`max`, nunca `minLength`/`maxLength` |
| Conectar campo ao input | `[field]="form.campo"`, nunca `[field]="model().campo"` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `[field]="registerModel().name"` | `[field]="registerForm.name"` |
| `required(fieldPath.email)` (sem message) | `required(fieldPath.email, { message: 'O e-mail é obrigatório' })` |
| `minLength(fieldPath.password, 8)` para numeros | `min(fieldPath.age, 18, { message })` para numeros |
| Validacao manual com `if/else` | Validadores declarativos do Signal Forms |
| Import de `@angular/forms` (classico) | Import de `@angular/forms/signals` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
