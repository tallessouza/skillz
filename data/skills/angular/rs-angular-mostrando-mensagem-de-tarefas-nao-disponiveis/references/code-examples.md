# Code Examples: Empty State Message em Angular

## Exemplo completo do componente task-list-section

### Template com @let e @if

```html
<div class="task-list-section">
  <!-- Secao Todo -->
  <div class="task-column">
    <h3>A fazer</h3>
    @for (task of todoTasks; track task.id) {
      <app-task-card [task]="task" />
    }
  </div>

  <!-- Secao In Progress -->
  <div class="task-column">
    <h3>Em andamento</h3>
    @for (task of inProgressTasks; track task.id) {
      <app-task-card [task]="task" />
    }
  </div>

  <!-- Secao Done -->
  <div class="task-column">
    <h3>Concluídas</h3>
    @for (task of doneTasks; track task.id) {
      <app-task-card [task]="task" />
    }
  </div>

  <!-- Empty state -->
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

## Evolucao do codigo (bug ao vivo)

### Versao 1 — Bug: faltou `=== 0` nas outras listas

```typescript
// ERRADO — so a primeira lista esta validada corretamente
@let noTasksCreated = todoTasks.length === 0
  && inProgressTasks.length
  && doneTasks.length;
```

Neste caso, `inProgressTasks.length` sem `=== 0` retorna o numero de itens (truthy se > 0), invertendo a logica.

### Versao 2 — Corrigida

```typescript
// CORRETO — todas as listas validadas com === 0
@let noTasksCreated = todoTasks.length === 0
  && inProgressTasks.length === 0
  && doneTasks.length === 0;
```

## Variacao: lista unica

```html
<!-- Quando ha apenas uma lista, nao precisa de @let -->
@if (tasks.length === 0) {
  <div class="empty-state">
    <p>Nenhum item encontrado.</p>
  </div>
}
```

## Variacao: empty state com acao

```html
@if (noTasksCreated) {
  <div class="empty-state">
    <p>Nenhuma tarefa disponível no momento.</p>
    <button (click)="openCreateTaskDialog()">Criar primeira tarefa</button>
  </div>
}
```