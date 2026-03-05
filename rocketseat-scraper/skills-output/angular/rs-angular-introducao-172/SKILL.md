---
name: rs-angular-introducao-172
description: "Applies Angular Signals patterns when building login screens or authentication components. Use when user asks to 'create a login page', 'build auth form in Angular', 'use Angular signals', 'implement signal forms', or 'use rxResource for HTTP'. Covers signal, computed, Signal Forms with validators, and rxResource for HTTP requests. Make sure to use this skill whenever building Angular components that combine forms, validation, and API calls. Not for React, Vue, or non-Angular frameworks."
---

# Angular Signals — Login Screen com Signals, Forms e rxResource

> Ao construir componentes Angular com formularios e requisicoes, utilize Signals como base reativa: signal para estado, computed para derivacoes, Signal Forms para campos com validacao, e rxResource para HTTP.

## Conceitos-chave

Angular Signals sao a base reativa moderna do Angular. Em um componente de login, quatro tipos de signal trabalham juntos:

1. **Signal padrao** — armazena e atualiza dados reativamente na tela
2. **Signal Forms** — campos de formulario com validadores integrados (Required, Email)
3. **Computed** — signal derivado que executa logica baseada em outros signals
4. **rxResource** — executa requisicoes HTTP reativamente (substitui subscribe manual)

## Decision Framework

| Necessidade | Signal a usar |
|-------------|---------------|
| Armazenar estado simples (usuario, token) | `signal()` |
| Campo de formulario com validacao | Signal Forms com validators |
| Valor derivado de outros signals | `computed()` |
| Requisicao HTTP reativa | `rxResource()` |

## Como aplicar

### Signal padrao para estado

```typescript
// Armazenar dados do usuario logado
const currentUser = signal<User | null>(null);

// Atualizar apos login
currentUser.set(response.user);
```

### Signal Forms com validadores

```typescript
// Criar campos com validacao integrada
const email = new FormSignal('', [Validators.required, Validators.email]);
const password = new FormSignal('', [Validators.required]);
```

### Computed para logica derivada

```typescript
// Habilitar botao apenas quando form valido
const isFormValid = computed(() => email.valid() && password.valid());
```

### rxResource para requisicao de login

```typescript
// Requisicao HTTP reativa
const loginResource = rxResource({
  request: () => ({ email: email.value(), password: password.value() }),
  loader: ({ request }) => authService.login(request)
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa mostrar dado na tela e atualizar | Use `signal()` |
| Campo de formulario precisa validacao | Use Signal Forms + validators |
| Um valor depende de outros signals | Use `computed()` |
| Precisa fazer chamada HTTP | Use `rxResource()` |
| Validacao customizada (formato email) | Crie validator customizado no Signal Forms |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `subscribe()` manual para HTTP em componentes | `rxResource()` reativo |
| Variavel mutavel para estado do form | `signal()` para estado reativo |
| `ngOnChanges` para derivar valores | `computed()` para derivacoes |
| Validacao manual em `if/else` | Validators declarativos no Signal Forms |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
