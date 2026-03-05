---
name: rs-angular-empty-state-message
description: "Applies empty state message patterns in Angular components when user asks to 'show empty state', 'display no items message', 'handle empty list', or 'conditional message when no data'. Uses @let for computed boolean and @if for conditional rendering. Make sure to use this skill whenever implementing empty/no-data states in Angular templates. Not for loading states, error messages, or skeleton screens."
---

# Empty State Message em Angular

> Mostre mensagens de estado vazio apenas quando TODAS as listas relevantes estiverem vazias, usando @let para computar e @if para renderizar.

## Rules

1. **Valide TODAS as listas** — verifique `.length === 0` para cada lista, porque uma unica lista com itens significa que ha conteudo para o usuario
2. **Use @let para a logica computada** — `@let noItems = list1.length === 0 && list2.length === 0`, porque mantem o template declarativo e a logica legivel
3. **Use @if para renderizacao condicional** — `@if (noItems) { <div>...</div> }`, porque Angular control flow blocks sao o padrao moderno
4. **Posicione a mensagem no final do container** — apos todas as secoes de lista, porque e onde o usuario olha quando nao ha conteudo
5. **A mensagem deve desaparecer automaticamente** — quando qualquer item for adicionado, a reatividade do @let cuida disso sem logica extra

## How to write

### Computed boolean com @let

```typescript
// No template, antes do @if
@let noTasksCreated = todoTasks.length === 0
  && inProgressTasks.length === 0
  && doneTasks.length === 0;
```

### Renderizacao condicional com @if

```html
@if (noTasksCreated) {
  <div class="empty-state">
    <p>Nenhuma tarefa disponível no momento.</p>
  </div>
}
```

## Example

**Before (mensagem sempre visivel, chumbada):**

```html
<div class="task-list-section">
  <!-- listas de tarefas -->
  <div class="empty-state">
    <p>Nenhuma tarefa disponível no momento.</p>
  </div>
</div>
```

**After (condicional baseada nas listas):**

```html
<div class="task-list-section">
  <!-- listas de tarefas -->

  @let noTasksCreated = todoTasks.length === 0
    && inProgressTasks.length === 0
    && doneTasks.length === 0;

  @if (noTasksCreated) {
    <div class="empty-state">
      <p>Nenhuma tarefa disponível no momento.</p>
    </div>
  }
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Uma unica lista | `@if (items.length === 0)` direto, sem @let |
| Multiplas listas (2+) | Use @let com && para combinar todas as condicoes |
| Listas agrupadas por status | Valide TODAS — todo, in progress, done |
| Lista com filtro ativo | Diferencie "sem itens" de "nenhum resultado para o filtro" |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `todoTasks.length === 0` (esquecendo outras listas) | `todoTasks.length === 0 && inProgressTasks.length === 0 && doneTasks.length === 0` |
| `.lenght` ou `.legnth` (typos comuns) | `.length` — g-t-h, nao g-h-t |
| Mensagem fixa sem condicional | `@if` com validacao das listas |
| `*ngIf` com multiplas listas inline | `@let` para computar + `@if` para renderizar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
