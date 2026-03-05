# Code Examples: Desabilitando Botao com Template Driven Forms

## Exemplo completo da aula

### Antes: div com inputs e signals

```html
<div>
  <input type="text" [(ngModel)]="title" />
  <input type="number" [(ngModel)]="year" />
  <input type="text" [(ngModel)]="category" />
  <textarea [(ngModel)]="description"></textarea>

  <button (click)="save()">Salvar</button>
</div>
```

Neste ponto, nao ha validacao. O botao esta sempre habilitado.

### Depois: form com ngForm e validacao

```html
<form #movieForm="ngForm">
  <input type="text" name="title" [(ngModel)]="title" required />
  <input type="number" name="year" [(ngModel)]="year" required />
  <input type="text" name="category" [(ngModel)]="category" required />
  <textarea name="description" [(ngModel)]="description" required></textarea>

  <button
    (click)="save()"
    [disabled]="movieForm.invalid || !selectedFile()"
    class="bg-purple-800 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
  >
    Salvar
  </button>
</form>
```

### Passo a passo das mudancas

1. **`<div>` → `<form>`**: transforma container em formulario
2. **`#movieForm="ngForm"`**: cria referencia de template com estado do form
3. **`name="title"` em cada input**: registra campo no formulario (obrigatorio)
4. **`required` em cada input**: marca como obrigatorio
5. **`[disabled]="movieForm.invalid || !selectedFile()"`**: desabilita botao
6. **Classes `disabled:*`**: estiliza estado desabilitado

### Component (signals permanecem iguais)

```typescript
@Component({ ... })
export class MovieFormComponent {
  title = signal('');
  year = signal<number | null>(null);
  category = signal('');
  description = signal('');
  selectedFile = signal<File | null>(null);

  save() {
    // logica de salvar
  }
}
```

## Variacao: mais campos

Se o formulario tivesse 10 campos, a vantagem fica clara:

```html
<!-- SEM ngForm: 10 condicoes no disabled -->
<button [disabled]="!title() || !year() || !category() || !description() || !director() || !rating() || !duration() || !language() || !country() || !selectedFile()">

<!-- COM ngForm: 2 condicoes no disabled -->
<button [disabled]="movieForm.invalid || !selectedFile()">
```

## Variacao: validacao condicional

```html
<!-- Campo obrigatorio apenas se outro campo tem valor -->
<input
  name="sequel"
  [(ngModel)]="sequel"
  [required]="category() === 'franchise'"
/>
```