# Code Examples: Mensagem de Sucesso com Computed Signals

## Exemplo completo do componente

### Signal computed para mensagem de sucesso

```typescript
// Dentro do componente de registro
export class RegisterComponent {
  // Resource que gerencia a requisicao de registro
  registerResource = rxResource({
    request: () => this.registerTrigger(),
    loader: ({ request }) => this.authService.register(request)
  });

  // Computed para mensagem de erro (ja existia)
  registerError = computed(() => {
    const error = this.registerResource.error();
    return error ? extractErrorMessage(error) : undefined;
  });

  // Computed para mensagem de sucesso
  successMessage = computed(() => {
    const successRegistration = this.registerResource.hasValue();
    return successRegistration === true
      ? 'Usuário cadastrado com sucesso'
      : undefined;
  });
}
```

### Template com feedback condicional

```html
@if (registerError()) {
  <p class="text-red-400">{{ registerError() }}</p>
} @else if (successMessage()) {
  <p class="text-green-400">{{ successMessage() }}</p>
} @else {
  <p></p>
}
```

## Abordagem alternativa com tap (valida, mas menos reativa)

```typescript
// Funciona, mas e imperativa
successMsg = signal<string>('');

onRegister() {
  this.authService.register(data).pipe(
    tap(() => this.successMsg.set('Usuário cadastrado com sucesso'))
  ).subscribe();
}
```

## Debugging: verificando hasValue

```typescript
// Para debug — lembre de referenciar no template!
successMessage = computed(() => {
  console.log(this.registerResource.hasValue()); // so loga se referenciado no template
  const successRegistration = this.registerResource.hasValue();
  return successRegistration ? 'Usuário cadastrado com sucesso' : undefined;
});

// No template (temporario, para ativar tracking):
// {{ registerResource.hasValue() }}
```

## Propriedades do rxResource

```typescript
// rxResource expoe automaticamente:
this.registerResource.hasValue()  // boolean signal — true se observable retornou sucesso
this.registerResource.value()     // o valor retornado pelo observable
this.registerResource.error()     // o erro, caso o observable tenha falhado
this.registerResource.isLoading() // boolean signal — true durante a requisicao
```