# Code Examples: @ViewChild para Acesso a Elementos DOM

## Exemplo completo da aula — Componente de Comentarios

### Template (HTML)

```html
<div class="comments-section">
  <div class="comment" *ngFor="let comment of comments">
    {{ comment }}
  </div>

  <div class="add-comment">
    <input
      type="text"
      [(ngModel)]="commentText"
      #commentInput
      placeholder="Adicionar comentário..."
    />
    <button (click)="onAddComment()">Adicionar</button>
  </div>
</div>
```

### Componente (TypeScript)

```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
})
export class CommentsComponent {
  comments: string[] = [];
  commentText = '';

  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;

  onAddComment(): void {
    if (!this.commentText.trim()) return;

    // 1. Adiciona o comentario
    this.comments.push(this.commentText);

    // 2. Reseta o input
    this.commentText = '';

    // 3. Foca no input para o proximo comentario
    this.commentInputRef.nativeElement.focus();
  }
}
```

## Variacao: Foco ao abrir modal

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-modal-comment',
  template: `
    <div class="modal" *ngIf="isOpen">
      <input #modalInput type="text" />
      <button (click)="close()">Fechar</button>
    </div>
  `,
})
export class ModalCommentComponent {
  isOpen = false;

  // static: false porque esta dentro de *ngIf
  @ViewChild('modalInput') modalInputRef!: ElementRef<HTMLInputElement>;

  open(): void {
    this.isOpen = true;
    // Precisa de setTimeout porque o *ngIf ainda nao renderizou
    setTimeout(() => {
      this.modalInputRef.nativeElement.focus();
    });
  }

  close(): void {
    this.isOpen = false;
  }
}
```

## Variacao: ViewChildren para multiplos elementos

```typescript
import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-task-list',
  template: `
    <div *ngFor="let task of tasks; let i = index">
      <input #taskInput [value]="task.name" />
    </div>
    <button (click)="focusLast()">Focar ultimo</button>
  `,
})
export class TaskListComponent {
  tasks = [{ name: 'Task 1' }, { name: 'Task 2' }];

  @ViewChildren('taskInput') taskInputs!: QueryList<ElementRef<HTMLInputElement>>;

  focusLast(): void {
    const inputs = this.taskInputs.toArray();
    if (inputs.length > 0) {
      inputs[inputs.length - 1].nativeElement.focus();
    }
  }
}
```

## Variacao: Scroll ate elemento

```typescript
@ViewChild('targetSection') targetRef!: ElementRef<HTMLElement>;

scrollToTarget(): void {
  this.targetRef.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
```

## Variacao: Selecionar texto do input

```typescript
@ViewChild('searchInput') searchRef!: ElementRef<HTMLInputElement>;

selectAllText(): void {
  this.searchRef.nativeElement.select();
}
```