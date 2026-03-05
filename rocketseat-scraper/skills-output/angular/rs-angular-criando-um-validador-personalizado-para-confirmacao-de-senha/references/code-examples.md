# Code Examples: Validador Personalizado para Confirmacao de Senha

## 1. Adicionando campo ao model

```typescript
// No model do formulario, adicionar o campo confirmPassword
confirmPassword: string;
```

## 2. Validacao inline (antes de extrair)

```typescript
// Dentro do componente, no final do formulario
validate(fieldPath.confirmPassword, ({ value, valueOf }) => {
  const confirmPassword = value();
  const password = valueOf(fieldPath.password);

  if (confirmPassword !== password) {
    return {
      kind: 'confirmPassword',
      message: 'As senhas devem ser iguais.',
    };
  }

  return null;
});
```

## 3. Validador extraido em arquivo separado

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

## 4. Chamando o validador no componente

```typescript
// Importar e chamar com os field paths
import { confirmPassword } from '../validators/confirm-password';

// Dentro do componente, apos definicao do formulario
confirmPassword(fieldPath.confirmPassword, fieldPath.password);
```

## 5. Variaveis locais no template com @let

```html
@let name = registerForm.name;
@let email = registerForm.email;
@let password = registerForm.password;
@let confirmPassword = registerForm.confirmPassword;
```

## 6. Exibindo erros de cada campo

```html
<!-- Nome -->
<div>
  <input [field]="fieldPath.name" placeholder="Nome" />
</div>
@if (name.touched() && name.invalid()) {
  <p class="error">{{ name.errors()[0].message }}</p>
}

<!-- Email -->
<div>
  <input [field]="fieldPath.email" placeholder="Email" type="email" />
</div>
@if (email.touched() && email.invalid()) {
  <p class="error">{{ email.errors()[0].message }}</p>
}

<!-- Password -->
<div>
  <input [field]="fieldPath.password" placeholder="Senha" type="password" />
</div>
@if (password.touched() && password.invalid()) {
  <p class="error">{{ password.errors()[0].message }}</p>
}

<!-- Confirm Password -->
<div>
  <input [field]="fieldPath.confirmPassword" placeholder="Confirmar senha" type="password" />
</div>
@if (confirmPassword.touched() && confirmPassword.invalid()) {
  <p class="error">{{ confirmPassword.errors()[0].message }}</p>
}
```

## 7. Estrutura de pastas resultante

```
features/
  authentication/
    validators/
      confirm-password.ts    # Validador extraido
    components/
      register/
        register.component.ts
        register.component.html
```

## 8. Objeto de erro retornado pelo validador

```typescript
// Quando invalido:
{
  kind: 'confirmPassword',    // Identificador unico do tipo de erro
  message: 'As senhas devem ser iguais.'  // Texto exibido ao usuario
}

// Quando valido:
null
```