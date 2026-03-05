---
name: rs-angular-removendo-comentarios-da-tarefa
description: "Applies Angular component organization patterns and array manipulation for removing items from lists. Use when user asks to 'remove item from list', 'delete comment', 'filter array in Angular', 'organize component methods', or 'make template text dynamic'. Enforces method ordering conventions (properties, decorators, injections, public methods, private methods) and immutable array updates via filter. Make sure to use this skill whenever implementing delete/remove logic in Angular components or organizing component class members. Not for backend API deletion, database operations, or RxJS stream manipulation."
---

# Removendo Itens de Lista e Organizacao de Componentes Angular

> Ao remover itens de uma lista em Angular, use filter para criar uma nova referencia do array, garantindo que o change detection funcione corretamente.

## Rules

1. **Use filter para remocao, nunca splice** — `this.items = this.items.filter(i => i.id !== targetId)` nao `this.items.splice(index, 1)`, porque filter cria uma nova referencia do array e o Angular detecta a mudanca automaticamente
2. **Sinalize mudancas para o componente pai** — apos modificar dados locais, atualize uma flag como `taskCommentsChanged = true` para que o componente pai saiba sincronizar com a fonte de verdade ao fechar o modal
3. **Organize membros da classe em ordem** — propriedades, decorators (@Input, @ViewChild, @Output), injecoes de dependencia, metodos publicos, metodos privados, porque facilita a leitura e manutencao
4. **Use interpolacao para textos dinamicos** — `{{ _task.name }}` nao texto hardcoded, porque componentes reutilizaveis precisam exibir dados reais
5. **Passe o ID do item no evento de clique** — `(click)="onRemoveComment(comment.id)"` nao o objeto inteiro, porque o metodo so precisa do identificador para filtrar

## How to write

### Remocao de item via filter

```typescript
onRemoveComment(commentId: string): void {
  this._task.comments = this._task.comments.filter(
    comment => comment.id !== commentId
  );
  this.taskCommentsChanged = true;
}
```

### Template com evento de clique para remocao

```html
<p (click)="onRemoveComment(comment.id)">Apagar</p>
```

### Interpolacao para textos dinamicos no template

```html
<h1>{{ _task.name }}</h1>
<p>{{ _task.description }}</p>
```

## Example

**Before (texto hardcoded e sem logica de remocao):**

```typescript
// Template
<h1>Minha nova tarefa</h1>
<p>Descricao fixa</p>
<p>Apagar</p>

// Classe sem organizacao
export class TaskModalComponent {
  onAddComment() { /* ... */ }
  @Input() task!: Task;
  private dialog = inject(MatDialog);
  @Output() closed = new EventEmitter();
  someProperty = false;
}
```

**After (com this skill applied):**

```typescript
// Template
<h1>{{ _task.name }}</h1>
<p>{{ _task.description }}</p>
<p (click)="onRemoveComment(comment.id)">Apagar</p>

// Classe organizada
export class TaskModalComponent {
  // Propriedades
  taskCommentsChanged = false;

  // Decorators
  @Input() set task(value: Task) { this._task = value; }
  @ViewChild('commentInput') commentInput!: ElementRef;
  @Output() closed = new EventEmitter();

  // Injecoes
  private dialog = inject(MatDialog);

  // Metodos publicos
  onAddComment() { /* ... */ }

  onRemoveComment(commentId: string): void {
    this._task.comments = this._task.comments.filter(
      comment => comment.id !== commentId
    );
    this.taskCommentsChanged = true;
  }

  // Metodos privados
  private _task!: Task;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Remover item de array em componente Angular | Use filter, atribua nova referencia |
| Dados modificados em modal/filho | Sinalize com flag, sincronize ao fechar |
| Texto estatico no template | Substitua por interpolacao com dados do modelo |
| Classe com membros desorganizados | Reordene: props → decorators → DI → public → private |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `this.comments.splice(i, 1)` | `this.comments = this.comments.filter(c => c.id !== id)` |
| `<h1>Minha nova tarefa</h1>` | `<h1>{{ _task.name }}</h1>` |
| `(click)="onRemove(comment)"` passando objeto inteiro | `(click)="onRemove(comment.id)"` passando so o ID |
| Metodos misturados com propriedades na classe | Agrupar por tipo: props, decorators, DI, publicos, privados |
| Modificar dados sem sinalizar o pai | Setar `this.taskCommentsChanged = true` apos mudanca |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
