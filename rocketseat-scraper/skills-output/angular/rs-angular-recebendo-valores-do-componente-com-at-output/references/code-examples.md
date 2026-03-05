# Code Examples: @Output e EventEmitter

## Exemplo completo da aula

### Componente filho (pessoa.component.ts)

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.component.html',
})
export class PessoaComponent {
  @Input() pessoa: { id: number; nome: string } = { id: 0, nome: '' };

  @Output() removerPessoaEmit = new EventEmitter<number>();

  removerPessoa(pessoaId: number): void {
    this.removerPessoaEmit.emit(pessoaId);
  }
}
```

### Template do filho (pessoa.component.html)

```html
<p>{{ pessoa.nome }}</p>
<button (click)="removerPessoa(pessoa.id)">Remover</button>
<br />
```

### Componente pai (input.component.ts)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
export class InputComponent {
  pessoas = [
    { id: 1, nome: 'Felipe' },
    { id: 2, nome: 'Laura' },
  ];

  removerPessoaEspecifica(pessoaId: number): void {
    this.pessoas = this.pessoas.filter(pessoa => pessoa.id !== pessoaId);
  }
}
```

### Template do pai (input.component.html)

```html
<app-pessoa
  *ngFor="let pessoa of pessoas"
  [pessoa]="pessoa"
  (removerPessoaEmit)="removerPessoaEspecifica($event)"
></app-pessoa>
```

## Variacao: Output sem valor (emit vazio)

```typescript
// Componente filho
@Output() refreshEmit = new EventEmitter<void>();

onRefresh(): void {
  this.refreshEmit.emit(); // sem valor
}
```

```html
<!-- Template do pai — sem $event necessario -->
<app-filho (refreshEmit)="recarregarDados()"></app-filho>
```

## Variacao: Output com objeto complexo

```typescript
// Emitindo um objeto inteiro
@Output() editarPessoaEmit = new EventEmitter<{ id: number; nome: string }>();

editarPessoa(): void {
  this.editarPessoaEmit.emit({ id: this.pessoa.id, nome: this.pessoa.nome });
}
```

```html
<!-- Pai recebe o objeto completo via $event -->
<app-pessoa (editarPessoaEmit)="abrirEdicao($event)"></app-pessoa>
```

```typescript
// No pai
abrirEdicao(pessoa: { id: number; nome: string }): void {
  console.log(`Editando ${pessoa.nome} com ID ${pessoa.id}`);
}
```

## Variacao: Multiplos Outputs no mesmo componente

```typescript
@Component({ selector: 'app-pessoa' })
export class PessoaComponent {
  @Input() pessoa: { id: number; nome: string } = { id: 0, nome: '' };

  @Output() removerEmit = new EventEmitter<number>();
  @Output() editarEmit = new EventEmitter<number>();
  @Output() selecionarEmit = new EventEmitter<{ id: number; nome: string }>();

  remover(): void {
    this.removerEmit.emit(this.pessoa.id);
  }

  editar(): void {
    this.editarEmit.emit(this.pessoa.id);
  }

  selecionar(): void {
    this.selecionarEmit.emit(this.pessoa);
  }
}
```

```html
<app-pessoa
  *ngFor="let pessoa of pessoas"
  [pessoa]="pessoa"
  (removerEmit)="removerPessoa($event)"
  (editarEmit)="editarPessoa($event)"
  (selecionarEmit)="selecionarPessoa($event)"
></app-pessoa>
```