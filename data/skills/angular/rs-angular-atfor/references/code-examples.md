# Code Examples: Angular @for

## Exemplo completo do componente

### Interface e componente (for.component.ts)

```typescript
import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';

interface IProduct {
  id: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-for',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './for.component.html',
})
export class ForComponent {
  products: IProduct[] = [
    { id: '1', name: 'Produto A', price: 10.5 },
    { id: '2', name: 'Produto B', price: 20.0 },
    { id: '3', name: 'Produto C', price: 35.99 },
  ];

  updateList() {
    // Nova referencia de memoria — mas mesmos valores
    this.products = [
      { id: '1', name: 'Produto A', price: 10.5 },
      { id: '2', name: 'Produto B', price: 20.0 },
      { id: '3', name: 'Produto C', price: 35.99 },
    ];
  }

  removeProduct(id: string) {
    this.products = this.products.filter(product => product.id !== id);
  }
}
```

### Template com @for (for.component.html)

```html
<button (click)="updateList()">Atualizar lista</button>

<h2>Produtos</h2>

@for (product of products; track product.id) {
  <div>
    <h3>{{ product.name }}</h3>
    <p>{{ product.price | number: '1.2-2' }}</p>
    <button (click)="removeProduct(product.id)">Remover produto</button>
  </div>
} @empty {
  <p>Nenhum produto encontrado.</p>
}
```

### Referenciando no AppComponent

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { ForComponent } from './components/for/for.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ForComponent],
  template: '<app-for />',
})
export class AppComponent {}
```

## Versao legada com *ngFor

```typescript
// for.component.ts (imports adicionais)
import { Component } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-for',
  standalone: true,
  imports: [DecimalPipe, NgFor, NgIf],
  templateUrl: './for.component.html',
})
export class ForComponent {
  // ... mesma classe
}
```

```html
<!-- for.component.html (versao antiga) -->
<button (click)="updateList()">Atualizar lista</button>

<h2>Produtos</h2>

<div *ngFor="let product of products">
  <h3>{{ product.name }}</h3>
  <p>{{ product.price | number: '1.2-2' }}</p>
  <button (click)="removeProduct(product.id)">Remover produto</button>
</div>

<p *ngIf="products.length === 0">Nenhum produto encontrado.</p>
```

## Gerando componente via CLI

```bash
ng generate component components/for
```

## Usando DecimalPipe (pipe number)

O pipe `number` requer importacao do `DecimalPipe`:

```typescript
imports: [DecimalPipe]
```

```html
<!-- Formato: minIntDigits.minFracDigits-maxFracDigits -->
{{ product.price | number: '1.2-2' }}
<!-- 10.5 => 10.50 -->
<!-- 35.99 => 35.99 -->
```

## Criando itens com UUID no front

```typescript
addProduct(name: string, price: number) {
  const newProduct: IProduct = {
    id: crypto.randomUUID(), // UUID nativo do JavaScript
    name,
    price,
  };
  this.products = [...this.products, newProduct];
}
```