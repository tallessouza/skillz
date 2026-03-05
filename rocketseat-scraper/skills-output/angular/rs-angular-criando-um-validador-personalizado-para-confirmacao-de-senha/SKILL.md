---
name: rs-angular-validador-personalizado-senha
description: "Enforces Angular Signal Forms custom cross-field validation patterns when building form validators. Use when user asks to 'validate password confirmation', 'create custom validator', 'cross-field validation', 'compare two form fields', or 'Signal Forms validation'. Applies validate() function patterns, field path access, validator extraction to separate files. Make sure to use this skill whenever creating Angular reactive form validators with Signal Forms. Not for template-driven forms, simple single-field validators, or non-Angular validation."
---

# Validador Personalizado para Cross-Field Validation (Angular Signal Forms)

> Ao criar validacoes que comparam multiplos campos em Signal Forms, extraia o validador em arquivo separado e use validate() com value/valueOf para acessar campos via FieldPath.

## Rules

1. **Use validate() de @angular/forms/signals** — nunca acesse o model diretamente dentro do validador, porque FieldPath garante type-safety e desacoplamento
2. **Acesse campos via FieldPath, nunca pelo model** — dentro do validate(), use `fieldPath.campo` para referenciar campos, porque acesso direto ao model quebra encapsulamento
3. **value e um Signal — invoque-o** — `value()` retorna o valor atual, porque value sem parenteses retorna o Signal, nao o valor
4. **valueOf() acessa outros campos** — use valueOf(fieldPath.outroCampo) para pegar valor de campo diferente do validado, porque e a API oficial de cross-field access
5. **Retorne null quando valido** — se a validacao passa, retorne null para nao alocar erro, porque qualquer objeto retornado sera tratado como erro
6. **Extraia validadores em arquivo separado** — crie pasta `validators/` na feature e exporte funcoes reutilizaveis, porque formularios grandes ficam ilegíveis com validacao inline

## How to write

### Validador customizado extraido

```typescript
// features/authentication/validators/confirm-password.ts
import { validate } from '@angular/forms/signals';

export function confirmPassword(
  confirmPasswordField: FieldPath,
  passwordField: FieldPath
) {
  validate(confirmPasswordField, ({ value, valueOf }) => {
    const confirmPassword = value();
    const password = valueOf(passwordField);

    if (confirmPassword !== password) {
      return {
        kind: 'confirmPassword',
        message: 'As senhas devem ser iguais.',
      };
    }

    return null;
  });
}
```

### Chamando o validador no formulario

```typescript
// No componente do formulario, apos definir os campos
confirmPassword(fieldPath.confirmPassword, fieldPath.password);
```

### Exibindo erros no template

```html
@let name = registerForm.name;

<div>
  <input [field]="fieldPath.confirmPassword" placeholder="Confirmar senha" type="password" />
</div>
@if (confirmPassword.touched() && confirmPassword.invalid()) {
  <p class="error">{{ confirmPassword.errors()[0].message }}</p>
}
```

## Example

**Before (validacao inline, verboso):**
```typescript
// Tudo dentro do componente — dificil de reutilizar
validate(fieldPath.confirmPassword, ({ value, valueOf }) => {
  const confirmPassword = value();
  const password = valueOf(fieldPath.password);
  if (confirmPassword !== password) {
    return { kind: 'confirmPassword', message: 'As senhas devem ser iguais.' };
  }
  return null;
});
```

**After (extraido em arquivo proprio):**
```typescript
// validators/confirm-password.ts exporta a funcao
// No componente: uma unica linha
confirmPassword(fieldPath.confirmPassword, fieldPath.password);
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Validacao compara 2+ campos | Use validate() com valueOf() — cross-field validation |
| Validacao usada em 1 formulario apenas | Ainda extraia em arquivo separado para legibilidade |
| Erro customizado | Retorne objeto com kind (nome do erro) e message (texto pro usuario) |
| Campo valido | Retorne null |
| Acessar campo dentro de validate() | Use FieldPath, nunca o model diretamente |
| Template mostra erros | Use @let para criar variaveis locais dos signals, acesse .touched(), .invalid(), .errors()[0].message |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `registerModel.password` dentro do validate | `valueOf(fieldPath.password)` |
| `value` sem invocar (sem parenteses) | `value()` — e um Signal |
| Retornar `false` quando valido | Retornar `null` |
| Deixar validacao inline no formulario grande | Extrair para `validators/confirm-password.ts` |
| `import { validate } from '@angular/forms'` | `import { validate } from '@angular/forms/signals'` |
| Repetir `registerForm.campo.touched()` no template | Usar `@let campo = registerForm.campo` e depois `campo.touched()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
