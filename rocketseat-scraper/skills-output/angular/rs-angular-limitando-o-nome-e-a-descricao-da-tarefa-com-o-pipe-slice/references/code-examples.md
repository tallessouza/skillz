# Code Examples: Truncar Texto com Slice Pipe

## Exemplo completo do componente TaskCard

### Template (task-card.component.html)

```html
<!-- Nome da tarefa com truncamento -->
<p [title]="task.name">
  {{ task.name.length < 13
    ? task.name
    : (task.name | slice:0:13) + '...' }}
</p>

<!-- Descricao da tarefa com truncamento -->
<p [title]="task.description">
  {{ task.description.length < 20
    ? task.description
    : (task.description | slice:0:20) + '...' }}
</p>
```

### Component (task-card.component.ts)

```typescript
import { Component, Input } from '@angular/core';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  @Input() task!: { name: string; description: string };
}
```

## Variacao: Limites diferentes por contexto

```html
<!-- Card compacto (lista lateral) -->
<p [title]="task.name">
  {{ task.name.length < 10
    ? task.name
    : (task.name | slice:0:10) + '...' }}
</p>

<!-- Card expandido (grid principal) -->
<p [title]="task.name">
  {{ task.name.length < 25
    ? task.name
    : (task.name | slice:0:25) + '...' }}
</p>
```

## Variacao: Custom Pipe (quando reutilizar em multiplos componentes)

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20, trail: string = '...'): string {
    if (!value) return '';
    return value.length < limit ? value : value.slice(0, limit) + trail;
  }
}
```

Uso no template:
```html
<p [title]="task.name">{{ task.name | truncate:13 }}</p>
<p [title]="task.description">{{ task.description | truncate:20 }}</p>
```

## Commit de referencia

[f9be68f](https://github.com/rocketseat-education/Projeto-GoTask/commit/f9be68f2e927b443642e17f3821abac5f730eb75)