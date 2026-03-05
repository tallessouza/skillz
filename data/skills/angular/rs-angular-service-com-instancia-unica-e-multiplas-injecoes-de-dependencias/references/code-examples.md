# Code Examples: Service com Instância Única e Múltiplas Injeções

## Estrutura do projeto da aula

```
exemplo-1/
├── services/
│   └── products.service.ts
└── components/
    ├── products/
    │   ├── products.component.ts
    │   └── products.component.html
    ├── products-list/
    │   ├── products-list.component.ts
    │   └── products-list.component.html
    └── products-counter/
        ├── products-counter.component.ts
        └── products-counter.component.html
```

## Gerando componentes via CLI

```bash
ng generate component products-list
ng generate component products-counter
```

## ProductsService (service compartilhado)

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  products: string[] = [];

  addProduct(product: string) {
    this.products.push(product);
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
  }

  modifyList(newList: string[]) {
    this.products = newList;
  }
}
```

## ProductsComponent (container — ações de mutação)

```typescript
import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ProductsListComponent } from '../products-list/products-list.component';
import { ProductsCounterComponent } from '../products-counter/products-counter.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductsListComponent, ProductsCounterComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  private productsService = inject(ProductsService);

  createProduct() {
    this.productsService.addProduct('Novo Produto');
  }

  removeProduct() {
    this.productsService.removeProduct(0);
  }

  modifyList() {
    this.productsService.modifyList(['Produto A', 'Produto B']);
  }
}
```

```html
<!-- products.component.html -->
<app-products-list></app-products-list>
<app-products-counter></app-products-counter>

<button (click)="createProduct()">Criar Produto</button>
<button (click)="removeProduct()">Remover Produto</button>
<button (click)="modifyList()">Modificar Lista</button>
```

## ProductsListComponent (leitura — renderiza a lista)

```typescript
import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent {
  protected productsService = inject(ProductsService);
}
```

```html
<!-- products-list.component.html -->
@for (product of productsService.products; track $index) {
  <p>{{ product }}</p>
}
```

## ProductsCounterComponent (leitura — mostra contagem)

```typescript
import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-counter',
  standalone: true,
  templateUrl: './products-counter.component.html',
})
export class ProductsCounterComponent {
  protected productsService = inject(ProductsService);
}
```

```html
<!-- products-counter.component.html -->
<div>
  <p>Quantidade de produtos: {{ productsService.products.length }}</p>
</div>
```

## Demonstração do problema: referência compartilhada

```typescript
// Se um componente fizer isso:
this.productsService.products = [];
// TODOS os componentes que usam productsService.products serão afetados!

// Solução futura: retornar cópias
getProducts(): string[] {
  return [...this.products]; // Spread cria nova referência
}
```

## Import correto vs incorreto

```typescript
// CORRETO
import { inject } from '@angular/core';

// ERRADO — causa erro silencioso
import { inject } from '@angular/core/testing';
```