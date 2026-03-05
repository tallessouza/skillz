---
name: rs-angular-mensagens-sucesso-erro
description: "Enforces Angular signal-based success and error message patterns when building forms or resource-based operations. Use when user asks to 'show error message', 'add success feedback', 'handle form submission response', 'display API errors', or 'implement user feedback' in Angular. Applies computed signals for derived state, rxResource error handling, and conditional template rendering with @if/@else. Make sure to use this skill whenever implementing form submission feedback or API response messaging in Angular. Not for toast/snackbar libraries, global error interceptors, or non-Angular frameworks."
---

# Mensagens de Sucesso e Erro com Signals no Angular

> Use computed signals para derivar mensagens de feedback a partir do estado de recursos, nunca gerencie estado de mensagens manualmente.

## Rules

1. **Use computed para mensagens derivadas** — `errorMessage` e `successMessage` sao computed signals porque derivam de outro signal (o rxResource), porque computed garante reatividade automatica sem subscriptions manuais
2. **Extraia erro com utilitario reutilizavel** — use uma funcao `setErrorMessage` centralizada para extrair mensagens de erro HTTP, porque padroniza o tratamento em toda a aplicacao
3. **Verifique `hasValue()` para sucesso** — o rxResource expoe `hasValue` como signal que indica se a operacao retornou valor, porque e mais confiavel do que checar o valor diretamente
4. **Retorne undefined quando nao ha mensagem** — computed signals de mensagem retornam `string | undefined`, porque permite uso direto em `@if` no template
5. **Use @if/@else if/@else no template** — mostre erro OU sucesso OU nada, nunca ambos simultaneamente, porque sao estados mutuamente exclusivos
6. **Posicione feedback proximo ao botao de acao** — mensagens de sucesso/erro ficam logo apos o botao que disparou a acao, porque o usuario precisa de feedback visual imediato

## How to write

### Computed signal de erro

```typescript
errorMessage = computed(() =>
  setErrorMessage(this.createMovieResource.error())
);
```

### Computed signal de sucesso

```typescript
successMessage = computed(() => {
  const successCreation = this.createMovieResource.hasValue();
  return successCreation ? 'Filme criado com sucesso' : undefined;
});
```

### Template com @if/@else if

```html
<div class="flex justify-end">
  @if (errorMessage()) {
    <p class="text-red-500">{{ errorMessage() }}</p>
  } @else if (successMessage()) {
    <p class="text-green-500">{{ successMessage() }}</p>
  } @else {
    <p></p>
  }
</div>
```

## Example

**Before (gerenciamento manual de estado):**

```typescript
errorMsg = '';
successMsg = '';

onSubmit() {
  this.service.create(data).subscribe({
    next: () => { this.successMsg = 'Criado!'; this.errorMsg = ''; },
    error: (err) => { this.errorMsg = err.message; this.successMsg = ''; }
  });
}
```

**After (com computed signals e rxResource):**

```typescript
errorMessage = computed(() =>
  setErrorMessage(this.createMovieResource.error())
);

successMessage = computed(() => {
  const success = this.createMovieResource.hasValue();
  return success ? 'Filme criado com sucesso' : undefined;
});
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mensagem depende de outro signal | Use `computed` |
| Mensagem precisa ser alterada externamente | Use `linkedSignal` |
| Erro vem de HTTP response | Extraia com `setErrorMessage` utilitario |
| Sucesso e erro sao mutuamente exclusivos | Use `@if/@else if/@else` no template |
| Feedback precisa de posicionamento | Envolva em div com `flex justify-end` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `errorMsg: string = ''` (variavel manual) | `errorMessage = computed(...)` |
| `subscribe({ error: ... })` para setar mensagem | `computed(() => setErrorMessage(resource.error()))` |
| `*ngIf="errorMsg"` (diretiva legada) | `@if (errorMessage()) { ... }` |
| Checar `resource.value() !== null` para sucesso | `resource.hasValue()` |
| Mostrar erro e sucesso ao mesmo tempo | `@if/@else if` mutuamente exclusivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
