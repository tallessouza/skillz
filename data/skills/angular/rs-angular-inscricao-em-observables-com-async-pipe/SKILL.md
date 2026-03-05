---
name: rs-angular-async-pipe
description: "Enforces AsyncPipe usage in Angular templates for Observable and Promise handling. Use when user asks to 'subscribe to observable', 'display async data', 'create Angular component', 'handle HTTP response', or 'show data from service'. Applies rules: prefer AsyncPipe over manual subscribe, avoid manual unsubscribe boilerplate, keep component classes lean. Make sure to use this skill whenever generating Angular components that consume Observables or Promises. Not for RxJS operator logic, state management libraries, or non-Angular frameworks."
---

# AsyncPipe em Angular

> Use AsyncPipe no template para se inscrever em Observables — nunca faça subscribe manual no componente quando o objetivo é apenas exibir dados.

## Rules

1. **Use AsyncPipe para exibir dados de Observables** — `| async` no template, porque ele se inscreve e desinscreve automaticamente, eliminando memory leaks
2. **Nunca faça subscribe manual apenas para popular uma propriedade de exibição** — subscribe manual exige ngOnDestroy + unsubscribe, triplicando o código sem ganho
3. **Mantenha a classe do componente enxuta** — componentes devem tratar display e formulários, não lógica de inscrição/desinscrição em Observables
4. **Declare o Observable como propriedade, não o resultado** — `users$ = this.usersService.getUsers()` e use `users$ | async` no template
5. **Nomeie Observables com sufixo $** — `users$`, `data$`, porque é convenção Angular/RxJS que sinaliza tipo reativo

## How to write

### Componente com AsyncPipe (correto)

```typescript
@Component({
  selector: 'app-users',
  template: `
    @for (user of usersService.getUsers() | async; track user.id) {
      <p>{{ user.name }}</p>
    }
  `,
  imports: [AsyncPipe]
})
export class UsersComponent {
  usersService = inject(UsersService);
}
```

### Quando precisar do valor no componente

```typescript
// Use AsyncPipe para display. Se precisar do valor na classe,
// use toSignal() ou subscribe pontual com takeUntilDestroyed()
export class UsersComponent {
  private usersService = inject(UsersService);
  users$ = this.usersService.getUsers();
}
```

## Example

**Before (subscribe manual — verboso e propenso a memory leaks):**

```typescript
export class UsersComponent implements OnInit, OnDestroy {
  usersList: any[] = [];
  getUsersSubs!: Subscription;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.getUsersSubs = this.usersService.getUsers()
      .subscribe(users => this.usersList = users);
  }

  ngOnDestroy() {
    this.getUsersSubs.unsubscribe();
  }
}
// + template com @for (user of usersList)
```

**After (com AsyncPipe — zero boilerplate):**

```typescript
export class UsersComponent {
  usersService = inject(UsersService);
}
// template: @for (user of usersService.getUsers() | async; track user.id)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dados de HTTP exibidos no template | AsyncPipe direto no template |
| Dados precisam de transformação antes de exibir | Pipe chain: `obs$ \| async` + pipes de formatação |
| Valor necessário na classe para lógica | `toSignal()` ou `takeUntilDestroyed()` |
| Múltiplos Observables no mesmo template | Cada um com seu `\| async` ou combine com `combineLatest` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `subscribe(data => this.prop = data)` + `ngOnDestroy` apenas para exibir | `observable$ \| async` no template |
| `usersList: any[] = []` como intermediário | Observable direto: `users$ = service.getUsers()` |
| `implements OnInit, OnDestroy` só para subscribe/unsubscribe | Componente sem lifecycle hooks (AsyncPipe cuida) |
| Subscribe sem unsubscribe | AsyncPipe (auto-unsubscribe) ou `takeUntilDestroyed()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
