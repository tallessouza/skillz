---
name: rs-angular-two-way-data-binding
description: "Applies Angular two-way data binding with ngModel when writing template-driven forms or input synchronization. Use when user asks to 'bind input', 'sync form field', 'use ngModel', 'two-way binding', or 'template driven form' in Angular. Ensures FormsModule import and banana-in-a-box syntax [(ngModel)]. Make sure to use this skill whenever creating Angular form inputs that need class-property synchronization. Not for reactive forms, signals, or non-Angular frameworks."
---

# Two-Way Data Binding no Angular

> Sincronize propriedades da classe do componente com elementos do template usando `[(ngModel)]`, eliminando a necessidade de property binding + event binding manuais.

## Rules

1. **Sempre importe FormsModule** — sem ele, Angular lanca erro `Can't bind to 'ngModel' since it isn't a known property of 'input'`, porque ngModel vem do modulo de formularios
2. **Use sintaxe banana-in-a-box `[( )]`** — colchetes + parenteses representa a mescla de input (property bind) e output (event bind), porque e a convencao Angular para two-way binding
3. **Referencie uma propriedade da classe** — `[(ngModel)]="propriedade"` vincula diretamente a uma propriedade do componente, porque o Angular sincroniza automaticamente nos dois sentidos
4. **Prefira ngModel para Template Driven Forms** — two-way binding com ngModel e o padrao para formularios template-driven, porque reactive forms usam `formControlName` em vez disso
5. **Inclua name ou id no input** — elementos de formulario com ngModel devem ter atributo `name`, porque o Angular usa isso para registrar o controle internamente

## How to write

### Setup basico com ngModel

```typescript
// component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './my-form.component.html',
})
export class MyFormComponent {
  texto = 'texto inicial';

  logarTexto() {
    console.log('Texto:', this.texto);
  }
}
```

```html
<!-- component.html -->
<input id="meu-input" name="meu-input" [(ngModel)]="texto" />
<p>Texto atual: {{ texto }}</p>
<button (click)="logarTexto()">Logar texto</button>
```

### Interpolacao sincronizada

```html
<!-- O valor exibido atualiza automaticamente quando o input muda -->
<input [(ngModel)]="nome" name="nome" />
<p>Bem-vindo, {{ nome }}!</p>
```

## Example

**Before (property binding + event binding manual):**

```typescript
// Precisa de metodo manual para captar o valor
export class PropertyBindingComponent {
  texto = '';

  atualizarTexto(event: Event) {
    const input = event.target as HTMLInputElement;
    this.texto = input.value;
  }
}
```

```html
<input [value]="texto" (input)="atualizarTexto($event)" />
<p>{{ texto }}</p>
```

**After (two-way data binding com ngModel):**

```typescript
export class TwoWayComponent {
  texto = '';
}
```

```html
<input [(ngModel)]="texto" name="texto" />
<p>{{ texto }}</p>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input simples sincronizado com propriedade | `[(ngModel)]="prop"` com FormsModule |
| Formulario complexo com validacao | Avaliar Reactive Forms em vez de ngModel |
| Apenas exibir valor no input (sem retorno) | Property binding `[value]="prop"` basta |
| Apenas captar evento do input | Event binding `(input)="handler($event)"` basta |
| Erro `Can't bind to ngModel` | Verificar se FormsModule esta nos imports |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `[(ngModel)]="texto"` sem FormsModule nos imports | Adicionar `imports: [FormsModule]` no componente |
| `[value]="texto" (input)="update($event)"` para sync bidirecional | `[(ngModel)]="texto"` |
| `[(ngModel)]="texto"` sem atributo `name` no input | Incluir `name="texto"` no elemento |
| Importar FormsModule no app.module quando componente e standalone | Importar FormsModule direto no array `imports` do componente standalone |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
