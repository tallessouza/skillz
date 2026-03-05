# Code Examples: Validacao de Erros em Formularios Angular

## Exemplo completo do template de login

Este e o template final da aula, com validacao para email e senha:

```html
<!-- Email form field signal -->
@let email = loginForm.email;
<!-- Password form field signal -->
@let password = loginForm.password;

<!-- Campo de email -->
<div>
  <input
    type="email"
    formControlName="email"
    placeholder="E-mail"
  />
</div>
@if (email().touched && email().invalid) {
  <p class="text-sm font-bold text-red-400">
    {{ email().errors[0].message }}
  </p>
}

<!-- Campo de senha -->
<div>
  <input
    type="password"
    formControlName="password"
    placeholder="Senha"
  />
</div>
@if (password().touched && password().invalid) {
  <p class="text-sm font-bold text-red-400">
    {{ password().errors[0].message }}
  </p>
}
```

## Comportamento esperado

### Campo de email:
1. Usuario clica no campo e sai sem digitar → "O e-mail é obrigatório"
2. Usuario comeca a digitar texto invalido → "O e-mail está inválido"
3. Usuario digita email valido (ex: `user@email.com`) → mensagem desaparece

### Campo de senha:
1. Usuario clica no campo e sai sem digitar → "A senha é obrigatória"
2. Usuario digita menos de 8 caracteres → "A senha deve ter no mínimo 8 caracteres"
3. Usuario digita 8+ caracteres → mensagem desaparece

## Estrutura do erro retornado pelo Signal Forms

```typescript
// Quando o campo email esta vazio e foi tocado:
email().errors
// Retorna:
[
  {
    field: 'email',
    kind: 'required',
    message: 'O e-mail é obrigatório'
  }
]

// Quando o campo email tem valor invalido:
email().errors
// Retorna:
[
  {
    field: 'email',
    kind: 'pattern',
    message: 'O e-mail está inválido'
  }
]
```

## Padrao para adicionar validacao a qualquer campo

```html
<!-- 1. Crie @let no topo do template -->
@let meuCampo = meuForm.nomeDoCampo;

<!-- 2. Apos o input, adicione o bloco de erro -->
@if (meuCampo().touched && meuCampo().invalid) {
  <p class="text-sm font-bold text-red-400">
    {{ meuCampo().errors[0].message }}
  </p>
}
```

## Commit de referencia

[da3ccb7](https://github.com/rocketseat-education/angular-gerenciador-filmes/commit/da3ccb7cb2931cef6227d9425f66e6fc8d3cd135)