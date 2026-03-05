# Code Examples: Formularios de Registro com Signal Forms

## Exemplo completo do componente

### register-user-form.component.ts

```typescript
import { Component, signal } from '@angular/core';
import { form, field, required, email, minLength } from '@angular/forms/signals';

@Component({
  selector: 'app-register-user-form',
  templateUrl: './register-user-form.component.html',
  imports: [field],
})
export class RegisterUserFormComponent {
  registerModel = signal({
    name: '',
    email: '',
    password: '',
  });

  registerForm = form(this.registerModel, (fieldPath) => {
    // Validacao do nome
    required(fieldPath.name, { message: 'O nome é obrigatório' });

    // Validacoes do email (duas validacoes no mesmo campo)
    required(fieldPath.email, { message: 'O e-mail é obrigatório' });
    email(fieldPath.email, { message: 'O e-mail está inválido' });

    // Validacoes da senha
    required(fieldPath.password, { message: 'A senha é obrigatória' });
    minLength(fieldPath.password, 8, {
      message: 'A senha deve ter no mínimo 8 caracteres',
    });
  });
}
```

### register-user-form.component.html

```html
<form>
  <div class="field">
    <label for="name">Nome</label>
    <input type="text" id="name" [field]="registerForm.name" />
  </div>

  <div class="field">
    <label for="email">E-mail</label>
    <input type="email" id="email" [field]="registerForm.email" />
  </div>

  <div class="field">
    <label for="password">Senha</label>
    <input type="password" id="password" [field]="registerForm.password" />
  </div>

  <button type="submit">Registrar</button>
</form>
```

## Variacao: formulario com mais campos

```typescript
registerModel = signal({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
});

registerForm = form(this.registerModel, (fieldPath) => {
  required(fieldPath.name, { message: 'O nome é obrigatório' });
  minLength(fieldPath.name, 2, { message: 'O nome deve ter no mínimo 2 caracteres' });

  required(fieldPath.email, { message: 'O e-mail é obrigatório' });
  email(fieldPath.email, { message: 'O e-mail está inválido' });

  required(fieldPath.password, { message: 'A senha é obrigatória' });
  minLength(fieldPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres' });

  required(fieldPath.confirmPassword, { message: 'Confirme sua senha' });

  required(fieldPath.phone, { message: 'O telefone é obrigatório' });
});
```

## Comparacao: validacao numerica vs string

```typescript
// Para campos NUMERICOS (idade, quantidade, preco)
import { min, max } from '@angular/forms/signals';

productModel = signal({
  quantity: 0,
  price: 0,
});

productForm = form(this.productModel, (fieldPath) => {
  min(fieldPath.quantity, 1, { message: 'Quantidade mínima é 1' });
  max(fieldPath.quantity, 100, { message: 'Quantidade máxima é 100' });
  min(fieldPath.price, 0, { message: 'Preço não pode ser negativo' });
});

// Para campos de STRING (nome, senha, descricao)
import { minLength, maxLength } from '@angular/forms/signals';

userModel = signal({
  name: '',
  password: '',
  bio: '',
});

userForm = form(this.userModel, (fieldPath) => {
  minLength(fieldPath.name, 2, { message: 'Nome muito curto' });
  maxLength(fieldPath.name, 100, { message: 'Nome muito longo' });
  minLength(fieldPath.password, 8, { message: 'Senha deve ter 8+ caracteres' });
  maxLength(fieldPath.bio, 500, { message: 'Bio deve ter no máximo 500 caracteres' });
});
```

## Commit de referencia

[Commit da aula](https://github.com/skillz-education/angular-gerenciador-filmes/commit/e74e742f787d7eb7ea8f01fdf2d1a8dd1e69c128)