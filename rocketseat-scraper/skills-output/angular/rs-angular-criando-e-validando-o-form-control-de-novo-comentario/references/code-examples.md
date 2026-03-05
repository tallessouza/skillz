# Code Examples: FormControl Isolado em Angular

## Exemplo completo da aula — Componente

```typescript
import { Component } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
})
export class TaskCommentsModalComponent {
  commentControl = new FormControl('', [Validators.required]);

  onAddComment() {
    console.log('Comentário:', this.commentControl.value);
  }
}
```

## Exemplo completo da aula — Template

```html
<div>
  <div>
    <input
      [formControl]="commentControl"
      placeholder="Adicionar comentário..."
    />
  </div>

  <button
    [disabled]="commentControl.invalid"
    (click)="onAddComment()"
    class="{{ `py-3 px-4 rounded-xl text-sm font-semibold text-white cursor-pointer ${
      commentControl.invalid
        ? 'bg-[#D7D8D8]'
        : 'bg-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all'
    }` }}">
    Adicionar
  </button>
</div>
```

## Variacao: usando [class.x] ao inves de template literals

```html
<button
  [disabled]="commentControl.invalid"
  (click)="onAddComment()"
  class="py-3 px-4 rounded-xl text-sm font-semibold text-white cursor-pointer"
  [class.bg-gray-300]="commentControl.invalid"
  [class.bg-blue-500]="commentControl.valid"
  [class.shadow-lg]="commentControl.valid"
  [class.hover:shadow-xl]="commentControl.valid">
  Adicionar
</button>
```

## Variacao: usando ngClass

```html
<button
  [disabled]="commentControl.invalid"
  (click)="onAddComment()"
  class="py-3 px-4 rounded-xl text-sm font-semibold text-white cursor-pointer"
  [ngClass]="{
    'bg-[#D7D8D8]': commentControl.invalid,
    'bg-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all': commentControl.valid
  }">
  Adicionar
</button>
```

## Explorando propriedades do FormControl

```typescript
onAddComment() {
  console.log('value:', this.commentControl.value);
  console.log('valid:', this.commentControl.valid);
  console.log('invalid:', this.commentControl.invalid);
  console.log('dirty:', this.commentControl.dirty);
  console.log('pristine:', this.commentControl.pristine);
  console.log('touched:', this.commentControl.touched);

  // Logar o objeto completo para explorar
  console.log('FormControl completo:', this.commentControl);
}
```

## Comparacao: FormControl isolado vs FormGroup

### Isolado (um input)

```typescript
// Classe
commentControl = new FormControl('', [Validators.required]);

// Template
<input [formControl]="commentControl" />
<button [disabled]="commentControl.invalid">Enviar</button>
```

### FormGroup (multiplos inputs)

```typescript
// Classe
form = new FormGroup({
  title: new FormControl('', [Validators.required]),
  description: new FormControl('', [Validators.required]),
});

// Template
<form [formGroup]="form">
  <input formControlName="title" />
  <input formControlName="description" />
  <button [disabled]="form.invalid">Criar</button>
</form>
```

## Resetando o FormControl apos submit

```typescript
onAddComment() {
  if (this.commentControl.valid) {
    const comment = this.commentControl.value;
    // ... processar comentario
    this.commentControl.reset(); // volta para '' e estado pristine
  }
}
```