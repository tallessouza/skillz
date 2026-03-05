---
name: rs-angular-erro-login-rxresource
description: "Enforces RxResource error handling patterns when writing Angular code with reactive resources and HTTP requests. Use when user asks to 'handle errors in rxResource', 'show error messages', 'catch HTTP errors in Angular', 'treat login errors', or 'use computed signals for errors'. Applies catchError-to-success-observable and computed-signal-with-cause patterns. Make sure to use this skill whenever implementing error handling with RxResource or reactive HTTP requests in Angular. Not for generic RxJS error handling outside RxResource context, nor for form validation errors."
---

# Tratamento de Erros no RxResource Angular

> Ao tratar erros de HTTP em RxResource, acesse a propriedade `cause` do signal `error` via `computed`, porque o RxResource ainda nao integra 100% com Observables de erro.

## Rules

1. **Nunca ignore o erro do RxResource no console** — o signal `.error()` retorna um objeto onde o erro real esta em `.cause`, porque o RxResource encapsula o erro original e loga warning quando nao e instancia de `Error`
2. **Use `computed` para derivar mensagens de erro** — crie um signal reativo que observa `resource.error()` e extrai a mensagem, porque isso evita logica no template e permite reutilizacao
3. **Externalize a logica de tratamento** — crie uma funcao utilitaria `setErrorMessage` em `shared/utils/`, porque o mesmo padrao se repete em todo RxResource da aplicacao
4. **Trate status 0 como erro de conexao** — quando `cause.status === 0`, retorne mensagem de conexao/servidor offline, porque isso cobre cenarios de rede indisponivel
5. **Duas abordagens validas: catchError OU computed+cause** — catchError converte observable de erro em sucesso; computed+cause mantem o observable falhado e trata no signal. Prefira computed+cause para manter a semantica do erro

## How to write

### Funcao utilitaria setErrorMessage

```typescript
// shared/utils/set-error-message.ts
import { HttpErrorResponse } from '@angular/common/http';

export const setErrorMessage = (error: Error | undefined): string => {
  const cause = error?.cause as HttpErrorResponse;

  if (!cause) return '';

  if (cause.status === 0) {
    return 'Sem conexão com a internet ou servidor offline';
  }

  if (cause.error?.message) {
    return cause.error.message as string;
  }

  return 'Ocorreu um erro inesperado ao tentar acessar.';
};
```

### Computed signal no componente

```typescript
// No componente que usa rxResource
loginResource = rxResource({
  request: () => this.loginParams(),
  loader: ({ request }) => this.authService.login(request),
});

loginError = computed(() => setErrorMessage(this.loginResource.error()));
```

### Template com if/else

```html
@if (loginError()) {
  <p>{{ loginError() }}</p>
} @else {
  <p>&nbsp;</p>
}
```

## Example

**Before (erro no console, sem mensagem ao usuario):**
```typescript
// RxResource sem tratamento — loga warning no console
// "Resource returned error that is not instanceof Error"
loginResource = rxResource({
  request: () => this.loginParams(),
  loader: ({ request }) => this.authService.login(request),
});

// Template tenta usar .error() diretamente — nao funciona como esperado
// {{ loginResource.error() }}
```

**After (com computed + setErrorMessage):**
```typescript
loginResource = rxResource({
  request: () => this.loginParams(),
  loader: ({ request }) => this.authService.login(request),
});

loginError = computed(() => setErrorMessage(this.loginResource.error()));

// Template mostra mensagem limpa: "E-mail ou senha inválidos"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| RxResource com HTTP que pode falhar | Crie computed + setErrorMessage |
| Precisa converter erro em sucesso | Use catchError + of() no pipe do observable |
| Mesma logica de erro em multiplos componentes | Externalize em shared/utils/ |
| Status 0 no HttpErrorResponse | Trate como erro de conexao |
| Propriedade `.error()` do resource | Acesse `.cause` para obter HttpErrorResponse real |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `{{ loginResource.error() }}` direto no template | `{{ loginError() }}` via computed |
| Signal manual com `.set()` para erro | `computed()` reativo ao `resource.error()` |
| Ignorar status 0 | Tratar como erro de conexao |
| Duplicar logica de tratamento em cada componente | Extrair para `setErrorMessage` utilitario |
| `catchError` sem retornar observable com `of()` | `catchError(() => { signal.set(msg); return of(null); })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
