# Code Examples: Comunicacao entre Componentes Angular

## Exemplo completo: @Input basico

```typescript
// card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <h2>{{ titulo }}</h2>
      <p>{{ descricao }}</p>
    </div>
  `
})
export class CardComponent {
  @Input() titulo: string = '';
  @Input() descricao: string = '';
}
```

```html
<!-- app.component.html (pai) -->
<app-card
  [titulo]="'Meu Card'"
  [descricao]="'Descricao do card'">
</app-card>

<!-- Com variavel do componente pai -->
<app-card
  [titulo]="tituloDoCard"
  [descricao]="descricaoDoCard">
</app-card>
```

## Exemplo completo: @Output com EventEmitter

```typescript
// item-lista.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Item {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-item-lista',
  template: `
    <ul>
      <li *ngFor="let item of items" (click)="selecionar(item)">
        {{ item.nome }}
      </li>
    </ul>
  `
})
export class ItemListaComponent {
  @Input() items: Item[] = [];
  @Output() itemClicado = new EventEmitter<Item>();

  selecionar(item: Item) {
    this.itemClicado.emit(item);
  }
}
```

```typescript
// app.component.ts (pai)
@Component({
  selector: 'app-root',
  template: `
    <app-item-lista
      [items]="meusItems"
      (itemClicado)="onItemClicado($event)">
    </app-item-lista>
    <p *ngIf="itemSelecionado">Selecionado: {{ itemSelecionado.nome }}</p>
  `
})
export class AppComponent {
  meusItems: Item[] = [
    { id: 1, nome: 'Angular' },
    { id: 2, nome: 'React' },
    { id: 3, nome: 'Vue' }
  ];

  itemSelecionado: Item | null = null;

  onItemClicado(item: Item) {
    this.itemSelecionado = item;
  }
}
```

## Exemplo completo: ngOnChanges

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-contador',
  template: `<p>Contador: {{ contador }}</p>`
})
export class ContadorComponent implements OnChanges {
  @Input() contador: number = 0;
  @Input() label: string = '';

  ngOnChanges(changes: SimpleChanges) {
    // Verificar mudanca especifica
    if (changes['contador']) {
      const change = changes['contador'];
      console.log('Primeira mudanca?', change.firstChange);
      console.log('Valor anterior:', change.previousValue);
      console.log('Valor atual:', change.currentValue);

      if (!change.firstChange && change.currentValue > change.previousValue) {
        console.log('Contador incrementou!');
      }
    }

    // Pode verificar multiplos inputs
    if (changes['label']) {
      console.log('Label mudou para:', changes['label'].currentValue);
    }
  }
}
```

## Exemplo: Constructor vs ngOnInit

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-perfil',
  template: `<p>{{ nomeCompleto }}</p>`
})
export class PerfilComponent implements OnInit {
  @Input() usuarioId: string = '';
  nomeCompleto: string = '';

  // CORRETO: constructor apenas para DI
  constructor(private usuarioService: UsuarioService) {
    // Neste ponto, this.usuarioId === '' (valor default, NAO o valor do pai)
    console.log('Constructor - usuarioId:', this.usuarioId); // ''
  }

  // CORRETO: ngOnInit para logica que depende de inputs
  ngOnInit() {
    // Neste ponto, this.usuarioId JA tem o valor passado pelo pai
    console.log('ngOnInit - usuarioId:', this.usuarioId); // '123' (valor real)
    this.carregarPerfil();
  }

  private carregarPerfil() {
    this.usuarioService.buscarPorId(this.usuarioId).subscribe(usuario => {
      this.nomeCompleto = usuario.nome;
    });
  }
}
```

## Exemplo: Comunicacao bidirecional completa

```typescript
// filtro.component.ts (filho)
@Component({
  selector: 'app-filtro',
  template: `
    <input [value]="termoBusca" (input)="onBusca($event)">
    <select (change)="onCategoria($event)">
      <option *ngFor="let cat of categorias" [value]="cat">{{ cat }}</option>
    </select>
  `
})
export class FiltroComponent {
  @Input() termoBusca: string = '';
  @Input() categorias: string[] = [];
  @Output() buscaAlterada = new EventEmitter<string>();
  @Output() categoriaAlterada = new EventEmitter<string>();

  onBusca(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.buscaAlterada.emit(valor);
  }

  onCategoria(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.categoriaAlterada.emit(valor);
  }
}

// produtos.component.ts (pai)
@Component({
  selector: 'app-produtos',
  template: `
    <app-filtro
      [termoBusca]="filtroAtual"
      [categorias]="categoriasDisponiveis"
      (buscaAlterada)="onBuscaAlterada($event)"
      (categoriaAlterada)="onCategoriaAlterada($event)">
    </app-filtro>
    <app-lista-produtos [produtos]="produtosFiltrados"></app-lista-produtos>
  `
})
export class ProdutosComponent implements OnInit {
  filtroAtual = '';
  categoriasDisponiveis = ['Todos', 'Eletronicos', 'Roupas'];
  produtosFiltrados: Produto[] = [];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  onBuscaAlterada(termo: string) {
    this.filtroAtual = termo;
    this.filtrar();
  }

  onCategoriaAlterada(categoria: string) {
    this.filtrar(categoria);
  }

  private filtrar(categoria?: string) { /* ... */ }
  private carregarProdutos() { /* ... */ }
}
```