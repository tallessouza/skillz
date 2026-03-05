---
name: rs-angular-two-way-data-binding
description: "Applies Angular two-way data binding patterns with signals and ngModel when writing Angular forms or capturing form input. Use when user asks to 'create a form', 'capture input values', 'bind form fields', 'two-way binding', 'ngModel with signals', or 'image preview upload'. Enforces signal-based state for form fields, FormsModule import, banana-in-a-box syntax, and memory-safe object URL handling. Make sure to use this skill whenever building Angular reactive forms with signals. Not for React forms, template-driven validation, or backend file upload logic."
---

# Two-Way Data Binding com Signals e ngModel

> Utilize signals para armazenar estado de formulario e ngModel para two-way binding automatico entre template e componente.

## Rules

1. **Crie um signal por campo do formulario** — `title = signal('')`, `year = signal<number | undefined>(undefined)`, porque cada campo precisa de estado reativo independente
2. **Use `undefined` para campos numericos opcionais** — nunca inicialize com `0`, porque `0` aparece no input e confunde o usuario
3. **Importe FormsModule para usar ngModel** — sem ele a diretiva `ngModel` nao e reconhecida, porque `ngModel` vive dentro de `FormsModule`
4. **Passe referencia do signal no ngModel, nao invoque** — `[(ngModel)]="title"` nao `[(ngModel)]="title()"`, porque o Angular faz `.set()` internamente
5. **Separe image preview (URL) de image binary (File)** — um signal para a URL de preview, outro para o File binario, porque o `<img src>` so aceita URL, nao binario
6. **Revogue object URLs anteriores antes de criar novos** — `URL.revokeObjectURL()` evita vazamento de memoria quando usuario troca a imagem

## How to write

### Signals para campos de formulario

```typescript
// Cada campo do formulario tem seu signal
title = signal('');
year = signal<number | undefined>(undefined);
category = signal('');
description = signal('');

// Signals separados para imagem
imagePreview = signal<string | undefined>(undefined);
selectedFile = signal<File | undefined>(undefined);
```

### Template com ngModel (banana-in-a-box)

```html
<!-- [(ngModel)] faz two-way binding automatico com o signal -->
<input [(ngModel)]="title" placeholder="Titulo do filme" />
<input [(ngModel)]="year" type="number" placeholder="Ano" />
<input [(ngModel)]="category" placeholder="Categoria" />
<textarea [(ngModel)]="description" placeholder="Descricao"></textarea>

<!-- Preview da imagem usando signal de URL -->
<img [src]="imagePreview()" *ngIf="imagePreview()" />
```

### Logica de selecao de imagem com memory cleanup

```typescript
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    const file = input.files[0];
    this.selectedFile.set(file);

    // Libera URL anterior da memoria
    if (this.imagePreview()) {
      URL.revokeObjectURL(this.imagePreview()!);
    }

    // Cria nova URL apontando para o binario na memoria
    const objectURL = URL.createObjectURL(file);
    this.imagePreview.set(objectURL);
  }
}
```

## Example

**Before (sem signals, estado confuso):**
```typescript
export class CreateMovieComponent {
  title: string = '';
  year: number = 0; // 0 aparece no input
  imageUrl: any; // mistura preview e binario

  onSave() {
    console.log(this.title, this.imageUrl);
  }
}
```

**After (com signals e separacao clara):**
```typescript
export class CreateMovieComponent {
  title = signal('');
  year = signal<number | undefined>(undefined);
  category = signal('');
  description = signal('');
  imagePreview = signal<string | undefined>(undefined);
  selectedFile = signal<File | undefined>(undefined);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);
      if (this.imagePreview()) {
        URL.revokeObjectURL(this.imagePreview()!);
      }
      this.imagePreview.set(URL.createObjectURL(file));
    }
  }

  onSave(): void {
    console.log('title', this.title());
    console.log('year', this.year());
    console.log('category', this.category());
    console.log('description', this.description());
    console.log('imagePreview', this.imagePreview());
    console.log('selectedFile', this.selectedFile());
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo numerico que pode ser vazio | `signal<number \| undefined>(undefined)` |
| Campo texto obrigatorio | `signal('')` |
| Precisa mostrar imagem no template | Use `URL.createObjectURL()` e guarde no signal de preview |
| Precisa enviar imagem para API | Use o signal de `selectedFile` com o binario `File` |
| Usuario pode trocar imagem | Sempre `revokeObjectURL` antes de criar novo |
| Formulario simples sem validacao complexa | `FormsModule` + `ngModel` e suficiente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `year = signal(0)` | `year = signal<number \| undefined>(undefined)` |
| `[(ngModel)]="title()"` (invocando) | `[(ngModel)]="title"` (referencia) |
| Um unico signal para URL e File | Dois signals: `imagePreview` e `selectedFile` |
| `createObjectURL` sem cleanup | `revokeObjectURL` antes de criar novo |
| Importar `ReactiveFormsModule` para ngModel | Importar `FormsModule` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
