# Code Examples: Services e Injecao de Dependencia no Angular

## 1. Criacao do projeto

```bash
npx @angular/cli@19.2.0 new services-e-gerenciamento-de-estado --style=css --ssr=false
cd services-e-gerenciamento-de-estado
ng serve
```

## 2. Geracao do componente

```bash
# Dentro de src/app/components/exemplo-1/
ng generate component products
```

Remover o arquivo `products.component.spec.ts` (nao necessario para o exemplo).

## 3. Service completo

```typescript
// src/app/components/exemplo-1/services/products.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  products: any[] = [
    { id: 1, name: 'Mouse', price: 100 },
    { id: 2, name: 'Monitor', price: 1000 },
  ];

  addProduct(id: number, name: string, price: number) {
    this.products.push({ id, name, price });
  }

  removeProduct(id: number) {
    this.products = this.products.filter(product => product.id !== id);
  }
}
```

### Detalhe: shorthand de propriedades no push

O instrutor mostra que quando o nome do parametro e igual ao nome da propriedade do objeto, voce pode usar shorthand:

```typescript
// Ao inves de:
this.products.push({ id: id, name: name, price: price });

// Use:
this.products.push({ id, name, price });
```

## 4. Componente completo (TypeScript)

```typescript
// src/app/components/exemplo-1/products/products.component.ts
import { Component, inject } from '@angular/core';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  readonly _productsService = inject(ProductsService);

  createProduct() {
    this._productsService.addProduct(3, 'Microfone', 300);
  }

  removeProduct() {
    this._productsService.removeProduct(1);
  }

  // ERRADO: exemplo de mutacao direta (comentado na aula)
  // modifyList() {
  //   this._productsService.products = []; // Nao faca isso!
  // }
}
```

## 5. Template completo (HTML)

```html
<!-- src/app/components/exemplo-1/products/products.component.html -->
@for (product of _productsService.products; track product.id) {
  <div>
    <p>{{ product.id }} - {{ product.name }} - {{ product.price }}</p>
  </div>
}

<button (click)="createProduct()">Criar produto</button>
<button (click)="removeProduct()">Remover produto</button>
```

## 6. Estilo basico

```css
/* products.component.css */
:host {
  padding: 15px;
  display: block;
}
```

## 7. AppComponent importando o componente

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { ProductsComponent } from './components/exemplo-1/products/products.component';

@Component({
  selector: 'app-root',
  imports: [ProductsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-products />
```

## 8. Demonstracao do problema de mutacao

```typescript
// ERRADO — componente modificando diretamente a lista do service
modifyList() {
  this._productsService.products = []; // Aloca lista vazia
  // Resultado: TODOS os componentes que consomem esse service perdem a lista
  // A referencia de memoria foi alterada diretamente pelo componente
}
```

O instrutor mostra que ao clicar no botao "Modificar Lista", todos os itens somem porque a referencia de memoria foi substituida. Isso prova que a lista nao esta protegida contra mutacao externa.

### Como deveria ser (metodo no service)

```typescript
// No service — forma correta
clearProducts() {
  this.products = [];
}

// No componente — chama o metodo, nao modifica diretamente
modifyList() {
  this._productsService.clearProducts();
}
```