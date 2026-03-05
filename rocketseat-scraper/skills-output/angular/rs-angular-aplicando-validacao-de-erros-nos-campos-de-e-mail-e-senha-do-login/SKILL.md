---
name: rs-angular-validacao-erros-formulario
description: "Applies Angular reactive form error validation patterns when building login forms, signup forms, or any template-driven validation. Use when user asks to 'add form validation', 'show error messages', 'validate email field', 'create login form', or 'handle form errors in Angular'. Enforces signal-based form access, template variables with @let, and reactive error display. Make sure to use this skill whenever implementing form validation in Angular with Signal Forms. Not for backend validation, API error handling, or non-Angular frameworks."
---

# Validacao de Erros em Formularios Angular (Signal Forms)

> Exiba mensagens de erro reativas acessando o estado do formulario via signals e use @let para eliminar repeticao no template.

## Rules

1. **Acesse campos do formulario como signals no template** — invoque `loginForm.email()` com parenteses, porque Signal Forms exporta campos como signals e o template precisa ser reativo as mudancas
2. **Use @let para criar variaveis de template** — `@let email = loginForm.email;` evita repetir `loginForm.email` multiplas vezes, porque DRY no template melhora legibilidade
3. **Mostre erros somente apos touched AND invalid** — `@if (email().touched && email().invalid)` garante que o usuario so ve erros apos interagir com o campo
4. **Acesse a mensagem de erro pelo indice 0** — `email().errors[0].message` porque o array de erros contem objetos `{field, kind, message}` e so ha um erro ativo por vez
5. **Estilize erros com classes utilitarias** — `text-sm font-bold text-red-400` para mensagens de erro visiveis e consistentes

## How to write

### Variavel de template com @let

```html
<!-- Email form field signal -->
@let email = loginForm.email;

<!-- Password form field signal -->
@let password = loginForm.password;
```

### Bloco de erro reativo

```html
<div>
  <input ... />
</div>
@if (email().touched && email().invalid) {
  <p class="text-sm font-bold text-red-400">
    {{ email().errors[0].message }}
  </p>
}
```

## Example

**Before (repetitivo, sem validacao visual):**
```html
<input formControlName="email" />
<input formControlName="password" />
```

**After (com validacao reativa e @let):**
```html
<!-- Email form field signal -->
@let email = loginForm.email;
<!-- Password form field signal -->
@let password = loginForm.password;

<div>
  <input formControlName="email" />
</div>
@if (email().touched && email().invalid) {
  <p class="text-sm font-bold text-red-400">
    {{ email().errors[0].message }}
  </p>
}

<div>
  <input formControlName="password" />
</div>
@if (password().touched && password().invalid) {
  <p class="text-sm font-bold text-red-400">
    {{ password().errors[0].message }}
  </p>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo acessado mais de 1x no template | Crie `@let` para ele |
| Multiplos validators no campo | Sempre acesse `errors[0].message` — so um erro ativo por vez |
| Formatacao do Prettier quebra legibilidade | Adicione comentarios HTML entre blocos `@let` para manter separacao |
| Precisa checar estado do campo | Use `.touched`, `.invalid`, `.dirty` — todos disponiveis como signals |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `loginForm.email().touched` repetido 3x | `@let email = loginForm.email;` + `email().touched` |
| `*ngIf="form.get('email')?.errors?.required"` | `@if (email().touched && email().invalid)` com Signal Forms |
| Mostrar erro antes do usuario interagir | Condicionar com `.touched` primeiro |
| `errors?.['required']` checando tipo especifico | `errors[0].message` — a mensagem ja vem formatada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
