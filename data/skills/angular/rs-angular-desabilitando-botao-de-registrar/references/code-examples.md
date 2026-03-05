# Code Examples: Desabilitando Botao de Registrar

## Exemplo completo do template

```html
<!-- register.component.html -->
<form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
  <!-- campos do formulario -->
  <input formControlName="name" type="text" placeholder="Nome" />
  <input formControlName="email" type="email" placeholder="Email" />
  <input formControlName="password" type="password" placeholder="Senha" />
  <input formControlName="confirmPassword" type="password" placeholder="Confirmar senha" />

  <!-- botao com disabled reativo -->
  <button
    type="submit"
    [disabled]="registerResource.isLoading() || registerForm.invalid"
    class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700
           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
  >
    Criar
  </button>
</form>
```

## Variacao: botao de login (mesmo padrao)

```html
<button
  type="submit"
  [disabled]="loginResource.isLoading() || loginForm.invalid"
  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700
         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-800"
>
  Entrar
</button>
```

## Variacao: com texto dinamico durante loading

```html
<button
  type="submit"
  [disabled]="registerResource.isLoading() || registerForm.invalid"
  class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700
         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
>
  @if (registerResource.isLoading()) {
    Criando...
  } @else {
    Criar
  }
</button>
```

## Variacao: sem Resource (apenas formulario reativo)

```html
<!-- Quando nao ha Resource, apenas valide o form -->
<button
  type="submit"
  [disabled]="contactForm.invalid"
  class="bg-green-600 text-white px-4 py-2 rounded
         disabled:opacity-50 disabled:cursor-not-allowed"
>
  Enviar
</button>
```

## Classes Tailwind detalhadas

```
disabled:opacity-50          → Quando disabled, opacidade 50%
disabled:cursor-not-allowed  → Quando disabled, cursor "proibido"
disabled:hover:bg-purple-800 → Quando disabled E hover, cor de fundo neutra
```

Essas classes usam o modificador `disabled:` do Tailwind que aplica estilos condicionalmente baseado no atributo HTML `disabled` do elemento.