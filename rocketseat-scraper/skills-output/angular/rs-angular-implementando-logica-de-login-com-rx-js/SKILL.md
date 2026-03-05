---
name: rs-angular-login-rxjs-signals
description: "Applies RxJS and Signals patterns when implementing Angular login flows or HTTP request handling. Use when user asks to 'implement login', 'handle HTTP errors', 'use RxJS with Signals', 'subscribe to observable', or 'show error messages in Angular'. Enforces proper subscription management with takeUntilDestroyed, Signal-based template updates, and correct Observable-Signal coexistence. Make sure to use this skill whenever writing Angular code that mixes RxJS observables with Signals. Not for React, Vue, or non-Angular frameworks."
---

# Login com RxJS e Signals no Angular

> Utilize RxJS para requisicoes HTTP e eventos complexos, Signals para exibir dados no template — os dois coexistem, nao se substituem totalmente.

## Rules

1. **RxJS para HTTP, Signals para template** — Observables gerenciam requisicoes e chains complexas, Signals gerenciam estado reativo no template, porque cada um tem seu ponto forte
2. **Sempre gerencie subscriptions** — Use `takeUntilDestroyed` com `DestroyRef` em todo `.subscribe()`, porque subscriptions nao gerenciadas causam memory leaks
3. **Use `.set()` para atualizar Signals** — Nunca reatribua o signal diretamente, use `signal.set(valor)`, porque e assim que o Angular rastreia mudancas
4. **Invoque Signals no template** — Sempre use `signal()` com parenteses no template, porque sem invocar o Angular nao faz tracking
5. **Separe next e error no subscribe** — Passe objeto com `next` e `error` callbacks, porque facilita tratamento de sucesso e erro separadamente
6. **Prefira refatorar para Signals puros quando possivel** — O padrao subscribe funciona mas Signals eliminam a necessidade de gerenciar subscriptions manualmente

## How to write

### Login com Subscribe classico + Signal para erro

```typescript
export class LoginFormComponent {
  private readonly _userApi = inject(UserApi);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  loginErrorMessage = signal<string>('');

  login() {
    const { email, password } = this.loginForm.value;

    this._userApi.login(email, password)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._router.navigate(['/explore']);
        },
        error: (error: HttpErrorResponse) => {
          this.loginErrorMessage.set(error.error.message);
        }
      });
  }
}
```

### Signal de erro no template

```html
<button (click)="login()">Entrar</button>

@if (loginErrorMessage()) {
  <p class="error-message">{{ loginErrorMessage() }}</p>
}
```

## Example

**Before (sem gerenciamento de subscription, sem Signal):**
```typescript
errorMsg = '';

login() {
  this._userApi.login(email, password).subscribe({
    next: () => this._router.navigate(['/explore']),
    error: (err) => { this.errorMsg = err.error.message; }
  });
}
```

**After (com takeUntilDestroyed + Signal):**
```typescript
private readonly _destroyRef = inject(DestroyRef);
loginErrorMessage = signal<string>('');

login() {
  const { email, password } = this.loginForm.value;

  this._userApi.login(email, password)
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: () => this._router.navigate(['/explore']),
      error: (error: HttpErrorResponse) => {
        this.loginErrorMessage.set(error.error.message);
      }
    });
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Requisicao HTTP simples | RxJS Observable + subscribe com takeUntilDestroyed |
| Mostrar dado no template | Signal — performatico, Angular rastreia automaticamente |
| Chain de requisicoes (HTTP → HTTP) | RxJS com operadores (switchMap, mergeMap) |
| Erro de requisicao para exibir na UI | Signal com `.set()` no callback de error |
| Projeto legado com Zone.js | Migre gradualmente para Signals no template |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `.subscribe()` sem takeUntilDestroyed | `.pipe(takeUntilDestroyed(this._destroyRef)).subscribe()` |
| `this.errorMsg = err.message` (propriedade simples) | `this.loginErrorMessage.set(err.error.message)` (Signal) |
| `{{ loginErrorMessage }}` sem invocar | `{{ loginErrorMessage() }}` com parenteses |
| `ngOnDestroy` + `unsubscribe` manual | `inject(DestroyRef)` + `takeUntilDestroyed` |
| Signal sem valor inicial | `signal<string>('')` com valor inicial explicito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
