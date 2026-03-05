---
name: rs-angular-formcontrol-isolado-comentario
description: "Applies isolated FormControl pattern when building single-input forms in Angular. Use when user asks to 'create a comment input', 'add a single form field', 'validate one input', 'enable disable button based on input', or 'reactive form with one field'. Enforces isolated FormControl instead of FormGroup for single inputs, dynamic class binding with template literals, and disabled button binding. Make sure to use this skill whenever creating Angular reactive forms with a single input. Not for multi-field forms, FormGroup creation, or template-driven forms."
---

# FormControl Isolado em Angular

> Quando existe apenas um unico input, use FormControl isolado ao inves de FormGroup — mas nunca use isolado para multiplos inputs juntos.

## Rules

1. **Use FormControl isolado apenas para input unico** — `new FormControl()` direto na classe, sem FormGroup, porque FormGroup adiciona complexidade desnecessaria para um campo so
2. **Sempre importe ReactiveFormsModule** — adicione nos `imports` do componente, porque sem ele a diretiva `[formControl]` nao funciona e o erro e silencioso
3. **Linke com diretiva `[formControl]`** — no input use `[formControl]="commentControl"`, nao use `formControlName` que e exclusivo de FormGroup
4. **Desabilite botao via property binding** — `[disabled]="commentControl.invalid"`, porque impede clique quando campo esta vazio/invalido
5. **Classes dinamicas com template literals** — use interpolacao com backticks e `${}` para alternar classes visuais baseado no estado do FormControl
6. **Remova mensagens de erro redundantes** — se o botao desabilitado ja indica obrigatoriedade, nao adicione paragrafo "campo obrigatorio"

## How to write

### FormControl isolado na classe

```typescript
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  // ...
})
export class TaskCommentsModalComponent {
  commentControl = new FormControl('', [Validators.required]);

  onAddComment() {
    console.log('Comentario:', this.commentControl.value);
  }
}
```

### Linkando no template com diretiva

```html
<input [formControl]="commentControl" placeholder="Adicionar comentário..." />
```

### Botao com disabled + classes dinamicas

```html
<button
  [disabled]="commentControl.invalid"
  (click)="onAddComment()"
  [class]="'py-3 px-4 rounded-xl text-sm font-semibold text-white cursor-pointer '
    + (commentControl.invalid
      ? 'bg-[#D7D8D8]'
      : 'bg-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all')">
  Adicionar
</button>
```

## Example

**Before (FormGroup desnecessario para input unico):**
```typescript
form = new FormGroup({
  comment: new FormControl('', [Validators.required])
});
```
```html
<form [formGroup]="form">
  <input formControlName="comment" />
  <p *ngIf="form.get('comment')?.invalid">Campo obrigatório</p>
  <button [disabled]="form.invalid">Adicionar</button>
</form>
```

**After (FormControl isolado):**
```typescript
commentControl = new FormControl('', [Validators.required]);
```
```html
<input [formControl]="commentControl" />
<button
  [disabled]="commentControl.invalid"
  (click)="onAddComment()"
  class="py-3 px-4 rounded-xl text-sm font-semibold text-white cursor-pointer"
  [class.bg-gray-300]="commentControl.invalid"
  [class.bg-blue-500]="commentControl.valid">
  Adicionar
</button>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Um unico input sem relacao com outros campos | FormControl isolado |
| Dois ou mais inputs relacionados (ex: formulario) | FormGroup com FormControls internos |
| Botao depende de validade do campo | `[disabled]="control.invalid"` |
| Visual do botao muda com estado | Classes dinamicas via interpolacao ou `[class.x]` |
| Mensagem "campo obrigatorio" + botao desabilitado | Remova a mensagem, botao ja comunica |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `new FormGroup({ comment: new FormControl() })` para input unico | `commentControl = new FormControl('', [Validators.required])` |
| `formControlName="comment"` sem FormGroup | `[formControl]="commentControl"` |
| Esquecer `ReactiveFormsModule` nos imports | Sempre importar no array de imports do componente |
| Classes estaticas quando estado muda visual | Template literals com `${}` ou `[class.x]` bindings |
| Manter `<p>Campo obrigatorio</p>` quando botao ja desabilita | Remover paragrafo redundante |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
