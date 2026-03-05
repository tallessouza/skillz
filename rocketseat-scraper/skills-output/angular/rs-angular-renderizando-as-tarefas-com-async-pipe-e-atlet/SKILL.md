---
name: rs-angular-async-pipe-let
description: "Enforces AsyncPipe and @let usage in Angular templates for observable consumption. Use when user asks to 'subscribe to observable', 'consume service data', 'render list from service', 'use async pipe', or 'create Angular component with observables'. Applies rules: no manual subscribe when template-only consumption, use @let for template variables, AsyncPipe over manual subscription management. Make sure to use this skill whenever generating Angular components that consume observables from services. Not for RxJS operator chains, complex data transformations inside components, or non-Angular frameworks."
---

# AsyncPipe e @let no Angular

> Consuma observables diretamente no template com AsyncPipe e @let — elimine subscriptions manuais quando nao ha manipulacao de dados no componente.

## Rules

1. **Use AsyncPipe quando o componente apenas renderiza dados do service** — nao crie propriedades locais nem subscribe manual, porque AsyncPipe se desinscreve automaticamente e elimina memory leaks
2. **Use @let para criar variaveis de template baseadas em expressoes** — `@let items = (service.items$ | async) ?? []`, porque permite consumir observables com fallback sem poluir a classe
3. **Sempre adicione fallback com `?? []`** — `(observable | async) ?? []`, porque o async pipe pode emitir undefined antes do primeiro valor
4. **Torne o service public quando acessado no template** — remova `private` da injecao de dependencia, porque propriedades private nao sao acessiveis no template
5. **Importe AsyncPipe nos imports do componente** — `import { AsyncPipe } from '@angular/common'`, porque standalone components precisam de imports explicitos
6. **Remova ngOnInit e listas locais ao migrar para AsyncPipe** — codigo morto gera confusao e subscribe manual sem unsubscribe causa memory leaks

## How to write

### Consumo direto no template com @let

```typescript
// No template: crie variaveis com @let + AsyncPipe
@let toDoTasks = (taskService.toDoTasks | async) ?? [];
@let doingTasks = (taskService.doingTasks | async) ?? [];
@let doneTasks = (taskService.doneTasks | async) ?? [];

// Use normalmente no @for
@for (task of toDoTasks; track task.id) {
  <app-task-card [task]="task" />
}
```

### Classe do componente (limpa)

```typescript
@Component({
  selector: 'app-task-board',
  imports: [AsyncPipe, /* outros imports */],
  templateUrl: './task-board.component.html',
})
export class TaskBoardComponent {
  // public para acesso no template
  taskService = inject(TaskService);

  // Sem listas locais, sem ngOnInit, sem subscribe manual
}
```

## Example

**Before (subscribe manual desnecessario):**
```typescript
export class TaskBoardComponent implements OnInit {
  private taskService = inject(TaskService);
  toDoTasks: Task[] = [];
  doingTasks: Task[] = [];

  ngOnInit() {
    this.taskService.toDoTasks.subscribe(tasks => {
      this.toDoTasks = tasks;
    });
    this.taskService.doingTasks.subscribe(tasks => {
      this.doingTasks = tasks;
    });
    // Esqueceu unsubscribe = memory leak
  }
}
```

**After (AsyncPipe + @let):**
```typescript
// Classe: limpa, sem subscribe
export class TaskBoardComponent {
  taskService = inject(TaskService);
}
```
```html
<!-- Template: consumo direto -->
@let toDoTasks = (taskService.toDoTasks | async) ?? [];
@let doingTasks = (taskService.doingTasks | async) ?? [];

@for (task of toDoTasks; track task.id) {
  <app-task-card [task]="task" />
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Componente apenas renderiza dados do service | AsyncPipe + @let no template |
| Componente manipula/transforma a lista antes de renderizar | Subscribe manual com unsubscribe no ngOnDestroy |
| Precisa reagir a mudancas para executar side effects | Subscribe manual ou efeito com `effect()` |
| Observable pode emitir undefined | Sempre usar `?? []` ou `?? valorDefault` |
| Service injetado precisa ser acessado no template | Usar `public` ou remover `private` da injecao |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `private taskService = inject(...)` + acesso no template | `taskService = inject(...)` (public por padrao) |
| `.subscribe(tasks => this.list = tasks)` sem unsubscribe | `(service.obs$ \| async) ?? []` no template |
| `ngOnInit` apenas para subscribe de renderizacao | `@let` + AsyncPipe direto no template |
| Propriedades locais duplicando a fonte de verdade | Consumo direto do observable do service |
| `@let items = service.items$ \| async` sem fallback | `@let items = (service.items$ \| async) ?? []` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
