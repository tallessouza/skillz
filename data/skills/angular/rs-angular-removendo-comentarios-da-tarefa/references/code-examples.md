# Code Examples: Removendo Comentarios da Tarefa

## Exemplo completo do template com interpolacao

```html
<!-- Antes: texto hardcoded -->
<h1>Minha nova tarefa</h1>
<p>Descricao da tarefa</p>

<!-- Depois: interpolacao dinamica -->
<h1>{{ _task.name }}</h1>
<p>{{ _task.description }}</p>
```

## Botao de apagar com evento de clique

```html
<!-- Dentro do loop de comentarios -->
<div *ngFor="let comment of _task.comments">
  <p>{{ comment.text }}</p>
  <p (click)="onRemoveComment(comment.id)">Apagar</p>
</div>
```

## Metodo onRemoveComment completo

```typescript
onRemoveComment(commentId: string): void {
  // Filtra todos os comentarios EXCETO o que queremos remover
  this._task.comments = this._task.comments.filter(
    comment => comment.id !== commentId
  );
  // Sinaliza que houve mudanca para sincronizar ao fechar
  this.taskCommentsChanged = true;
}
```

## Logica do filter explicada passo a passo

```typescript
// Array original: [{ id: '1', text: 'ok' }, { id: '2', text: 'finalizado' }]
// commentId recebido: '1'

this._task.comments = this._task.comments.filter(
  comment => comment.id !== commentId
  // comment { id: '1' } → '1' !== '1' → false → REMOVIDO
  // comment { id: '2' } → '2' !== '1' → true  → MANTIDO
);

// Array resultante: [{ id: '2', text: 'finalizado' }]
```

## Organizacao completa da classe do modal

```typescript
export class TaskCommentsModalComponent {
  // === Propriedades ===
  taskCommentsChanged = false;

  // === Decorators ===
  @Input() set task(value: Task) {
    this._task = structuredClone(value);
  }
  @ViewChild('commentInput') commentInput!: ElementRef;
  @Output() closed = new EventEmitter<boolean>();

  // === Injecoes ===
  // (nenhuma neste componente especifico)

  // === Metodos Publicos ===
  onAddComment(): void {
    const text = this.commentInput.nativeElement.value;
    if (!text.trim()) return;

    this._task.comments.push({
      id: crypto.randomUUID(),
      text: text.trim(),
    });
    this.commentInput.nativeElement.value = '';
    this.taskCommentsChanged = true;
  }

  onRemoveComment(commentId: string): void {
    this._task.comments = this._task.comments.filter(
      comment => comment.id !== commentId
    );
    this.taskCommentsChanged = true;
  }

  onClose(): void {
    this.closed.emit(this.taskCommentsChanged);
  }

  // === Metodos Privados ===
  private _task!: Task;
}
```

## Fluxo completo: remocao → sinalizacao → sincronizacao

```typescript
// 1. Usuario clica "Apagar" no template
// (click)="onRemoveComment(comment.id)"

// 2. Modal remove localmente
onRemoveComment(commentId: string): void {
  this._task.comments = this._task.comments.filter(
    c => c.id !== commentId
  );
  this.taskCommentsChanged = true;
}

// 3. Usuario fecha o modal
onClose(): void {
  this.closed.emit(this.taskCommentsChanged);
}

// 4. Componente pai recebe o evento e sincroniza
// No componente pai:
onModalClosed(hasChanges: boolean): void {
  if (hasChanges) {
    this.taskService.updateComments(this.task.id, this.task.comments);
  }
}
```