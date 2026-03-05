---
name: rs-angular-mensagens-erro-registro
description: "Applies Angular error message handling pattern using computed signals and rxResource when building registration forms or any form with backend validation. Use when user asks to 'handle errors', 'show error messages', 'create registration form', 'implement form validation with backend', or 'use rxResource error handling'. Ensures proper signal cascade: rxResource.error → computed signal → template display via setErrorMessage utility. Make sure to use this skill whenever implementing error feedback in Angular reactive forms with rxResource. Not for template-driven forms, client-side-only validation, or non-Angular projects."
---

# Mensagens de Erro com Computed Signals e rxResource

> Exiba erros do backend em formularios Angular usando computed signals que reagem automaticamente ao signal de erro do rxResource.

## Rules

1. **Use computed signal para derivar mensagens de erro** — `computed(() => setErrorMessage(resource.error()))`, porque o computed recalcula automaticamente quando o signal de erro muda
2. **Centralize tratamento de erro em utilitario** — use uma funcao `setErrorMessage` em `shared/utils`, porque ela trata erro de conexao, erro do backend e erro inesperado de forma uniforme
3. **Nunca use catchError no pipe do observable para exibir erros** — prefira o signal `.error()` do rxResource, porque evita o bug de console onde a instancia nao e do tipo Error
4. **Mostre fallback vazio no template** — quando nao ha erro, renderize um paragrafo vazio para evitar saltos no layout
5. **Acesse `.cause` do erro do rxResource** — o erro encapsulado tem propriedade `cause` do tipo `HttpErrorResponse`, que contem `status` e `message`

## How to write

### Computed signal de erro

```typescript
// No component, derive a mensagem de erro do resource
registerError = computed(() =>
  setErrorMessage(this.registerResource.error())
);
```

### Template com condicional

```html
@if (registerError()) {
  <p class="error">{{ registerError() }}</p>
} @else {
  <p></p>
}
```

### Utilitario setErrorMessage (shared/utils)

```typescript
// Trata HttpErrorResponse encapsulado em cause
export function setErrorMessage(error: unknown): string {
  if (!error) return '';

  const httpError = (error as any)?.cause as HttpErrorResponse;

  if (!httpError?.status) {
    return 'Sem conexão com a internet ou servidor offline.';
  }

  if (httpError.error?.message) {
    return httpError.error.message;
  }

  return 'Erro inesperado. Tente novamente.';
}
```

## Example

**Before (catchError no pipe — problematico):**

```typescript
// Causa erro de console: instancia nao e do tipo Error
this.http.post('/register', data).pipe(
  catchError(err => {
    this.errorSignal.set(err.message);
    return of(null);
  })
);
```

**After (computed signal com setErrorMessage):**

```typescript
registerResource = rxResource({
  request: () => this.formData(),
  loader: ({ request }) =>
    this.http.post('/api/register', request)
});

registerError = computed(() =>
  setErrorMessage(this.registerResource.error())
);
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Qualquer rxResource com possibilidade de erro | Criar computed signal com setErrorMessage |
| Erro retornado pelo backend (ex: "Todos os campos são obrigatórios") | Acessar `cause.error.message` |
| Aplicacao offline ou servidor down | setErrorMessage retorna mensagem de conexao |
| Nenhum erro ocorreu | setErrorMessage retorna string vazia |
| Precisa re-disparar a validacao | Mudar o valor do formulario (signal de request) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `catchError` no pipe para exibir erros | `computed(() => setErrorMessage(resource.error()))` |
| `this.errorMsg = err.message` manualmente | Derivar via computed signal |
| Verificar `instanceof Error` no rxResource | Acessar `.cause` como `HttpErrorResponse` |
| Template sem fallback quando nao ha erro | `@else { <p></p> }` para manter layout estavel |
| Duplicar logica de tratamento de erro por tela | Reutilizar `setErrorMessage` da shared/utils |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
