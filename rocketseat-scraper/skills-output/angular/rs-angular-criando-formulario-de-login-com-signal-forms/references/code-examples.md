# Code Examples: Angular Signal Forms Login

## Exemplo completo do componente

### login-form.component.ts

```typescript
import { Component, signal } from '@angular/core';
import { form, required, email, minLength, field } from '@angular/forms/signals';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  imports: [field],
})
export class LoginFormComponent {
  // 1. Model signal — define estrutura e valores iniciais
  loginModel = signal({
    email: '',
    password: '',
  });

  // 2. Form com validacoes
  loginForm = form(this.loginModel, (fieldPath) => {
    // Validacoes do email
    required(fieldPath.email, { message: 'O e-mail é obrigatório' });
    email(fieldPath.email, { message: 'O e-mail está inválido' });

    // Validacoes do password
    required(fieldPath.password, { message: 'A senha é obrigatória' });
    minLength(fieldPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres' });
  });

  // Metodo para testar o formulario
  testForm() {
    console.log('Valor final:', this.loginForm().value());
    console.log('Válido:', this.loginForm.valid());
    console.log('Erros no email:', this.loginForm.email.errors());
    console.log('Erros no password:', this.loginForm.password.errors());
  }
}
```

### login-form.component.html

```html
<form>
  <input type="email" [field]="loginForm.email" placeholder="E-mail" />
  <input type="password" [field]="loginForm.password" placeholder="Senha" />
  <button type="button" (click)="testForm()">Entrar</button>
</form>
```

## Cenarios de teste demonstrados pelo instrutor

### Cenario 1: Campos preenchidos corretamente

Input: `felipe@teste.com` / `12345678` (8 caracteres)

```
Valor final: { email: 'felipe@teste.com', password: '12345678' }
Válido: true
Erros no email: []
Erros no password: []
```

### Cenario 2: Password com menos de 8 caracteres

Input: `felipe@teste.com` / `1234567` (7 caracteres)

```
Valor final: { email: 'felipe@teste.com', password: '1234567' }
Válido: false
Erros no email: []
Erros no password: [{ kind: 'min-length-validation-error', message: 'A senha deve ter no mínimo 8 caracteres' }]
```

### Cenario 3: Email invalido

Input: `felipeteste` (sem @)

```
Erros no email: [{ kind: 'email', message: 'O e-mail está inválido' }]
```

### Cenario 4: Campos vazios

```
Erros no email: [{ kind: 'required-validation-error', message: 'O e-mail é obrigatório' }]
Erros no password: [{ kind: 'required-validation-error', message: 'A senha é obrigatória' }]
```

## Validators disponiveis (built-in)

```typescript
import { required, email, minLength } from '@angular/forms/signals';

// required — campo nao pode ser vazio
required(fieldPath.campo, { message: 'Texto de erro' });

// email — deve estar no padrao de email
email(fieldPath.campo, { message: 'Texto de erro' });

// minLength — minimo de caracteres
minLength(fieldPath.campo, 8, { message: 'Texto de erro' });
// Nota: o numero vem como segundo parametro, message como terceiro
```

## Padrao de acesso a dados do formulario

```typescript
// Valor completo (invoque form E value — ambos signals)
this.loginForm().value()

// Validade do formulario
this.loginForm.valid()  // boolean signal

// Campo individual (sem invocar para acessar)
this.loginForm.email         // acessa o campo
this.loginForm.email.errors() // invoca errors (signal)

// Importes necessarios
// @angular/forms/signals: form, required, email, minLength, field
```