---
name: rs-angular-drag-and-drop-colunas-status
description: "Applies Angular CDK Drag and Drop configuration for Kanban-style task columns when writing Angular components with sortable lists. Use when user asks to 'add drag and drop', 'implement kanban board', 'move items between columns', 'configure cdkDropList', or 'reorder tasks'. Ensures correct directive setup, template variables, connected lists, and dynamic rendering with @for. Make sure to use this skill whenever implementing drag and drop between multiple lists in Angular. Not for single-list reordering, React DnD, or non-Angular drag and drop libraries."
---

# Drag and Drop entre Colunas com Angular CDK

> Configure cdkDropList e cdkDrag em colunas conectadas, com template variables unicos, listas tipadas e renderizacao dinamica via @for.

## Rules

1. **Importe apenas o necessario** — `CdkDropList` e `CdkDrag` de `@angular/cdk/drag-drop`, porque copiar exemplos inteiros da documentacao traz codigo desnecessario
2. **Crie template variables distintas por coluna** — use nomes como `toDoListCdkDropList`, `doingListCdkDropList`, `doneListCdkDropList`, porque nomes genericos conflitam com propriedades da classe
3. **Conecte cada coluna com TODAS as outras** — `[cdkDropListConnectedTo]` recebe array das template variables das outras colunas, porque conexao incompleta impede movimentacao
4. **Use `@for` com `track item.id`** — renderize itens dinamicamente usando identificador unico, porque o Angular precisa rastrear mudancas na lista eficientemente
5. **Coloque `cdkDrag` no componente filho** — a diretiva vai no elemento que sera arrastado (ex: `<app-task-card cdkDrag>`), porque sem ela o item nao e draggable
6. **Tipe o evento drop corretamente** — `CdkDragDrop<ITask[]>` nao `CdkDragDrop<string[]>`, porque tipagem errada causa erro silencioso

## How to write

### Configuracao do componente (TS)

```typescript
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  imports: [CdkDropList, CdkDrag],
})
export class TaskListSectionComponent {
  toDoTasks: ITask[] = [];
  doingTasks: ITask[] = [];
  doneTasks: ITask[] = [];

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
```

### Configuracao do template (HTML) — uma coluna

```html
<div
  class="column"
  cdkDropList
  #toDoListCdkDropList="cdkDropList"
  [cdkDropListData]="toDoTasks"
  [cdkDropListConnectedTo]="[doingListCdkDropList, doneListCdkDropList]"
  (cdkDropListDropped)="drop($event)"
>
  @for (toDoTask of toDoTasks; track toDoTask.id) {
    <app-task-card cdkDrag />
  }
</div>
```

### Conexoes entre 3 colunas

```html
<!-- A Fazer: conecta com Fazendo e Concluido -->
[cdkDropListConnectedTo]="[doingListCdkDropList, doneListCdkDropList]"

<!-- Fazendo: conecta com A Fazer e Concluido -->
[cdkDropListConnectedTo]="[toDoListCdkDropList, doneListCdkDropList]"

<!-- Concluido: conecta com A Fazer e Fazendo -->
[cdkDropListConnectedTo]="[toDoListCdkDropList, doingListCdkDropList]"
```

## Example

**Before (cards estaticos, sem drag and drop):**
```html
<div class="column">
  <app-task-card />
  <app-task-card />
  <app-task-card />
</div>
```

**After (drag and drop dinamico entre colunas):**
```html
<div
  class="column"
  cdkDropList
  #toDoListCdkDropList="cdkDropList"
  [cdkDropListData]="toDoTasks"
  [cdkDropListConnectedTo]="[doingListCdkDropList, doneListCdkDropList]"
  (cdkDropListDropped)="drop($event)"
>
  @for (toDoTask of toDoTasks; track toDoTask.id) {
    <app-task-card cdkDrag />
  }
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Template variable pode conflitar com propriedade da classe | Adicione sufixo descritivo: `CdkDropList` |
| Coluna nao aceita drop de outra | Verifique se `cdkDropListConnectedTo` inclui a template variable da coluna de origem |
| Itens nao arrastam | Verifique se `cdkDrag` esta no elemento filho, nao na coluna |
| Alteracoes nao persistem apos reload | A logica `drop()` so atualiza escopo local — atualize a fonte de verdade (service/API) |
| Listas duplicadas no componente | Refatore com `async pipe` direto no template para evitar propriedades intermediarias |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `#toDoList="cdkDropList"` (conflita com propriedade) | `#toDoListCdkDropList="cdkDropList"` |
| `CdkDragDrop<string[]>` para objetos | `CdkDragDrop<ITask[]>` com interface correta |
| Copiar exemplo inteiro da docs do Angular Material | Importar apenas `CdkDropList` e `CdkDrag` |
| Cards estaticos chumbados no template | `@for` com `track item.id` |
| Conectar coluna apenas com a vizinha | Conectar com TODAS as colunas que aceitem drop |
| `cdkDrag` na div da coluna | `cdkDrag` no componente card filho |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
