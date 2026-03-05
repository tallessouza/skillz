---
name: rs-angular-mensagem-sucesso-registro
description: "Applies Angular reactive success message patterns using computed signals and rxResource. Use when user asks to 'show success message', 'create feedback after form submit', 'use computed signal', 'handle rxResource status', or 'reactive UI feedback in Angular'. Enforces computed over imperative tap for reactive state derivation. Make sure to use this skill whenever implementing post-action feedback in Angular with signals. Not for error handling, form validation, or non-Angular frameworks."
---

# Mensagem de Sucesso com Computed Signals

> Derive mensagens de feedback a partir do estado reativo do resource, nunca populando signals manualmente no tap.

## Rules

1. **Use computed para derivar mensagens de status** — `computed()` recalcula automaticamente quando qualquer signal interno muda, porque isso mantém o fluxo unidirecional e reativo
2. **Prefira `resource.hasValue()` sobre tap callbacks** — `rxResource` já rastreia sucesso/erro internamente, porque duplicar esse tracking no `tap` é redundante e imperativo
3. **Referencie signals no template para ativar tracking** — Angular so executa computed/signal quando referenciado no template (interpolacao, property binding), porque sem referencia o signal nao e rastreado
4. **Retorne undefined quando nao ha mensagem** — computed deve retornar `string | undefined`, porque isso permite controle condicional limpo no template com `@if`

## How to write

### Computed derivado do resource

```typescript
registerResource = rxResource({
  request: () => this.registerTrigger(),
  loader: ({ request }) => this.authService.register(request)
});

registerError = computed(() => {
  const error = this.registerResource.error();
  return error ? extractErrorMessage(error) : undefined;
});

successMessage = computed(() => {
  const successRegistration = this.registerResource.hasValue();
  return successRegistration ? 'Usuário cadastrado com sucesso' : undefined;
});
```

### Template com @if/@else encadeado

```html
@if (registerError()) {
  <p class="text-red-400">{{ registerError() }}</p>
} @else if (successMessage()) {
  <p class="text-green-400">{{ successMessage() }}</p>
} @else {
  <p></p>
}
```

## Example

**Before (imperativo com tap):**
```typescript
successMsg = signal('');

register$ = this.authService.register(data).pipe(
  tap(() => this.successMsg.set('Usuário cadastrado com sucesso'))
);
```

**After (reativo com computed):**
```typescript
successMessage = computed(() => {
  return this.registerResource.hasValue()
    ? 'Usuário cadastrado com sucesso'
    : undefined;
});
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa mostrar feedback pos-acao | Derive com `computed()` a partir do `resource.hasValue()` |
| Signal nao esta reagindo | Verifique se esta referenciado no template |
| Multiplos estados (erro, sucesso, vazio) | Use `@if / @else if / @else` encadeado |
| rxResource retorna erro | Use `resource.error()` em outro computed |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `tap(() => signal.set('sucesso'))` | `computed(() => resource.hasValue() ? 'sucesso' : undefined)` |
| Signal nao referenciado no template | Sempre interpolar ou bind no template para ativar tracking |
| `if/else` separados para erro e sucesso | `@if/@else if/@else` encadeado no mesmo bloco |
| String vazia como estado inicial | `undefined` para ausencia de mensagem |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
