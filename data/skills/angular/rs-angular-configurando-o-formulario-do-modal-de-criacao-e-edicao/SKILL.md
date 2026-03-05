---
name: rs-angular-formulario-modal-reativo
description: "Applies Angular Reactive Forms patterns when building modal forms with dynamic validation. Use when user asks to 'create a modal form', 'add form validation', 'reactive forms Angular', 'dynamic button styles based on form state', or 'pass data to Angular dialog'. Enforces FormGroup/FormControl setup, formControlName binding, dynamic CSS classes via template interpolation, and disabled button tied to form validity. Make sure to use this skill whenever creating Angular forms with validation or modals that receive/edit data. Not for template-driven forms, non-Angular frameworks, or pure CSS styling tasks."
---

# Formulário Reativo em Modal Angular

> Formulários reativos vivem na classe do componente, recebem dados via injeção, e controlam o estado visual dos botões pela validade do FormGroup.

## Rules

1. **Importe ReactiveFormsModule no componente standalone** — sem ele, diretivas como `formControlName` e `[formGroup]` não funcionam silenciosamente
2. **Crie uma interface para os form controls** — `ITaskFormControls { name: string; description: string }` reutiliza a tipagem entre service, modal data e formulário, porque duplicar tipagens inline quebra consistência
3. **Inicialize FormControls com dados injetados** — `new FormControl(this.data.formValues.name)` garante que edição vem preenchida e criação vem vazia, porque o mesmo modal serve ambos os modos
4. **Use `[formGroup]` no `<form>` e `formControlName` nos inputs** — nunca `ngModel` em reactive forms, porque misturar abordagens causa comportamento imprevisível
5. **Desabilite botão com `[disabled]="taskForm.invalid"`** — e aplique classes CSS dinâmicas via interpolação com backticks no atributo `[class]`, porque `disabled` sozinho não muda o estilo visual
6. **Botão de submit deve ser `type="submit"`** — dispara `(ngSubmit)` automaticamente no form, sem necessidade de `(click)` handler separado

## How to write

### Interface de tipagem reutilizável

```typescript
// interfaces/task-form-controls.interface.ts
export interface ITaskFormControls {
  name: string;
  description: string;
}
```

### Service centralizado passando formValues

```typescript
// No ModalControllerService
openEditTaskModal(formValues: ITaskFormControls) {
  this.dialog.open(TaskFormModalComponent, {
    data: { mode: 'edit', formValues }  // shorthand property
  });
}

openNewTaskModal() {
  this.dialog.open(TaskFormModalComponent, {
    data: { mode: 'create', formValues: { name: '', description: '' } }
  });
}
```

### FormGroup com validações

```typescript
// No componente do modal
taskForm = new FormGroup({
  name: new FormControl(this.data.formValues.name, [
    Validators.required,
    Validators.minLength(10)
  ]),
  description: new FormControl(this.data.formValues.description, [
    Validators.required,
    Validators.minLength(10)
  ])
});
```

### Template com classes dinâmicas no botão

```html
<form [formGroup]="taskForm" (ngSubmit)="onFormSubmit()">
  <input formControlName="name" />
  <input formControlName="description" />

  <button
    type="submit"
    [disabled]="taskForm.invalid"
    [class]="`py-3 px-4 rounded-xl text-white text-sm font-semibold cursor-pointer ${
      taskForm.invalid
        ? 'bg-[#D7D8D8]'
        : 'bg-blue-500 shadow-lg transform transition duration-200'
    }`"
  >
    {{ data.mode === 'edit' ? 'Salvar alterações' : 'Criar tarefa' }}
  </button>
</form>
```

## Example

**Before (sem reactive forms, botão estático):**
```typescript
// Componente sem formulário estruturado
@Component({ template: `
  <form>
    <input [(ngModel)]="name" />
    <input [(ngModel)]="description" />
    <button (click)="save()">Salvar</button>
  </form>
`})
export class TaskModalComponent {
  name = '';
  description = '';
}
```

**After (reactive forms com validação e botão dinâmico):**
```typescript
@Component({
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onFormSubmit()">
      <input formControlName="name" />
      <input formControlName="description" />
      <button type="submit" [disabled]="taskForm.invalid"
        [class]="\`py-3 px-4 rounded-xl text-white text-sm font-semibold
        \${taskForm.invalid ? 'bg-[#D7D8D8]' : 'bg-blue-500 shadow-lg'}\`">
        Salvar
      </button>
    </form>
  `
})
export class TaskFormModalComponent {
  private data = inject(DIALOG_DATA);

  taskForm = new FormGroup({
    name: new FormControl(this.data.formValues.name, [
      Validators.required, Validators.minLength(10)
    ]),
    description: new FormControl(this.data.formValues.description, [
      Validators.required, Validators.minLength(10)
    ])
  });

  onFormSubmit() {
    if (this.taskForm.valid) {
      // process this.taskForm.value
    }
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Modal serve criação E edição | Um único componente, dados diferenciados via `formValues` (vazio vs preenchido) |
| Tipagem de campos do form usada em 2+ locais | Extraia para interface em `interfaces/` |
| Botão precisa mudar estilo com validação | `[class]` com template literal + ternário, não `[ngClass]` com objeto |
| Propriedade usa `this.data` antes de inicializar | Declare `data` antes do `FormGroup` na classe |
| Shorthand property no objeto | `{ formValues }` em vez de `{ formValues: formValues }` |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `[(ngModel)]` dentro de reactive form | `formControlName="field"` |
| `type="button"` no submit do form | `type="submit"` para disparar `(ngSubmit)` |
| Tipagem inline repetida `{ name: string; description: string }` | Interface `ITaskFormControls` reutilizável |
| `[ngClass]="{'bg-gray': taskForm.invalid}"` | `[class]` com template literal e ternário |
| `new FormControl('')` ignorando dados injetados | `new FormControl(this.data.formValues.name)` |
| Criar modal separado para edição e criação | Um modal, dois modos via dados injetados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
