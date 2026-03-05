---
name: rs-angular-evitando-chamadas-duplicadas-login
description: "Enforces Signal equality check patterns to prevent duplicate HTTP calls in Angular applications. Use when user asks to 'fix duplicate requests', 'optimize Signal updates', 'prevent unnecessary API calls', 'implement login with Signals', or 'use RxResource'. Applies same-reference-in-memory pattern for Signal.set() to avoid redundant computed/RxResource triggers. Make sure to use this skill whenever writing Signal-based request logic in Angular. Not for RxJS-only patterns, non-Angular frameworks, or server-side deduplication."
---

# Evitando Chamadas Duplicadas com Signals

> Preserve a mesma referencia de memoria ao fazer Signal.set() para evitar disparos desnecessarios de computed, effects e RxResource.

## Rules

1. **Nunca crie um novo objeto no set() se os valores nao mudaram** — `signal.set(mesmaRef)` nao dispara atualizacao, `signal.set({...novo})` sempre dispara, porque Signals comparam por referencia de memoria
2. **Extraia a referencia antes de setar** — armazene o valor do formulario numa constante e passe essa constante ao set(), porque isso preserva a referencia quando os valores sao identicos
3. **Entenda a cadeia de dependencias** — Signal params → computed/RxResource → HTTP request. Se o params nao dispara, nada abaixo executa, porque Signals propagam atualizacoes em cascata
4. **Aplique em qualquer Signal que alimenta RxResource** — nao apenas login, qualquer formulario que dispara requisicao HTTP via Signal deve usar esse padrao

## How to write

### Padrao correto: preservar referencia

```typescript
onSubmit() {
  // Extrair referencia do formulario
  const credentials = this.loginForm.value as LoginParams;

  // Set com a MESMA referencia — Signal compara e nao dispara se igual
  this.loginParams.set(credentials);
}
```

### Signal + RxResource (contexto completo)

```typescript
// Signal que armazena os parametros
loginParams = signal<LoginParams | null>(null);

// RxResource depende do Signal — so dispara quando Signal muda
loginResource = rxResource({
  request: () => this.loginParams(),
  loader: ({ request }) => {
    if (!request) return of(null);
    return this.authService.login(request);
  }
});
```

## Example

**Before (chamada duplicada a cada clique):**
```typescript
onSubmit() {
  // Cria novo objeto SEMPRE — nova referencia de memoria
  this.loginParams.set({
    email: this.loginForm.value.email,
    password: this.loginForm.value.password
  });
  // Clicar 5x = 5 requisicoes HTTP identicas
}
```

**After (chamada apenas quando valores mudam):**
```typescript
onSubmit() {
  // Extrai referencia existente do formulario
  const credentials = this.loginForm.value as LoginParams;

  // Passa a mesma referencia — Signal ignora se valores iguais
  this.loginParams.set(credentials);
  // Clicar 5x com mesmos dados = 1 requisicao HTTP
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Formulario que dispara API via Signal | Extrair `.value` em constante antes do `.set()` |
| Signal com valor primitivo (string, number) | Ja funciona automaticamente — Signal compara por valor |
| Signal com objeto/array | Precisa preservar referencia — Signal compara por referencia |
| Botao de retry/reenviar | Mesmo padrao — so refaz se dados mudaram |
| Signal computed que depende de outro Signal | Beneficio em cascata — nao recalcula se pai nao mudou |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `signal.set({ email: form.email, password: form.password })` | `const creds = form.value; signal.set(creds)` |
| Criar spread `signal.set({...this.form.value})` | `signal.set(this.form.value)` |
| Debounce/throttle para evitar duplicatas em Signals | Preservar referencia de memoria (solucao nativa) |
| Flag booleana `isLoading` para bloquear cliques | Signal equality check resolve na raiz |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
