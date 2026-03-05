---
name: rs-angular-revisando-funcionalidades-gotask
description: "Enforces Angular project organization patterns including single source of truth, component reuse, and data flow architecture. Use when user asks to 'build an Angular app', 'organize components', 'manage state in Angular', 'create a task board', or 'persist data with localStorage'. Applies rules: single source of truth for state, component responsibility separation, modal reuse for similar operations, isolated FormControl for single inputs. Make sure to use this skill whenever building Angular applications with CRUD operations and drag-and-drop features. Not for backend APIs, database design, or non-Angular frameworks."
---

# Organizacao de Projeto Angular — Padroes GoTask

> Separe responsabilidades, centralize estado numa fonte de verdade, e reutilize componentes para operacoes similares.

## Rules

1. **Fonte de verdade unica** — centralize todos os dados num unico local (service/signal/store), porque qualquer parte da aplicacao que precise do estado mais atualizado acessa esse ponto confiavel
2. **Separe responsabilidades por componente** — cada componente faz uma coisa bem feita, porque projeto com responsabilidades claras recebe novas funcionalidades sem dificuldade
3. **Reutilize componentes para operacoes similares** — criacao e edicao usam o mesmo modal, porque reduz a quantidade de componentes e mantém consistencia
4. **FormControl isolado para inputs unicos** — nao encapsule num FormGroup quando ha apenas um input, porque simplifica validacao e binding
5. **Reflita estado na UI via fonte de verdade** — qualquer criacao, edicao ou delecao atualiza a fonte de verdade primeiro, e a UI reage, porque garante consistencia
6. **Persista no localStorage sincronizado com a fonte de verdade** — quando a fonte de verdade muda, localStorage muda junto, porque a aplicacao reinicia no estado correto

## How to write

### Fonte de verdade centralizada

```typescript
// Service como fonte de verdade
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks = signal<Task[]>(this.loadFromLocalStorage());

  readonly tasksByStatus = computed(() => ({
    todo: this.tasks().filter(t => t.status === 'todo'),
    doing: this.tasks().filter(t => t.status === 'doing'),
    done: this.tasks().filter(t => t.status === 'done'),
  }));

  addTask(task: Task) {
    this.tasks.update(tasks => [...tasks, task]);
    this.syncLocalStorage();
  }
}
```

### Modal reutilizado para criar e editar

```typescript
// Um unico componente para ambas operacoes
openTaskDialog(mode: 'create' | 'edit', task?: Task) {
  this.dialog.open(TaskDialogComponent, {
    data: { mode, task }
  });
}
```

### FormControl isolado

```typescript
// Para um unico input (ex: comentario), sem FormGroup
commentControl = new FormControl('', Validators.required);

// Bind no template
<button [disabled]="commentControl.invalid"
        [class.disabled]="commentControl.invalid">
  Adicionar
</button>
```

## Example

**Before (estado espalhado, componentes duplicados):**
```typescript
// Componente de criar tarefa
@Component({ selector: 'app-create-task' })
export class CreateTaskComponent { /* ... */ }

// Componente de editar tarefa (90% identico)
@Component({ selector: 'app-edit-task' })
export class EditTaskComponent { /* ... */ }

// Estado gerenciado em cada componente
tasks: Task[] = [];
```

**After (fonte de verdade, componente reutilizado):**
```typescript
// Um unico modal parametrizado
@Component({ selector: 'app-task-dialog' })
export class TaskDialogComponent {
  data = inject<{ mode: 'create' | 'edit'; task?: Task }>(MAT_DIALOG_DATA);
}

// Estado centralizado no service
taskService = inject(TaskService);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dois modais com formularios quase identicos | Reutilize um componente com parametro de modo |
| Input unico fora de formulario complexo | FormControl isolado, sem FormGroup |
| Multiplos componentes precisam do mesmo dado | Centralize num service como fonte de verdade |
| Dados precisam sobreviver ao reload | Sincronize localStorage com a fonte de verdade |
| Status de tarefa muda (drag-and-drop) | Atualize a fonte de verdade, UI reage automaticamente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Estado duplicado em cada componente | Fonte de verdade unica no service |
| Componente de criar + componente de editar identicos | Um componente parametrizado com modo |
| FormGroup para um unico input | FormControl isolado |
| Atualizar UI diretamente sem atualizar estado | Atualize fonte de verdade, UI reage |
| Ler localStorage em multiplos pontos | Service inicializa do localStorage e centraliza acesso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
