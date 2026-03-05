# Code Examples: Services e Gerenciamento de Estado no Angular

## 1. Criando um Service basico

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' }) // Singleton — instancia unica na aplicacao inteira
export class ProductService {
  private products: Product[] = [];

  getProducts(): Product[] {
    return [...this.products]; // Retorna copia, nao referencia
  }

  addProduct(product: Product): void {
    this.products = [...this.products, product];
  }
}
```

## 2. Injecao de dependencia no componente

```typescript
// Forma moderna (Angular 14+)
@Component({
  selector: 'app-product-list',
  template: `
    <ul>
      @for (product of products; track product.id) {
        <li>{{ product.name }}</li>
      }
    </ul>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  products: Product[] = [];

  ngOnInit(): void {
    this.products = this.productService.getProducts();
  }
}
```

## 3. Service com BehaviorSubject (Pub/Sub para estado)

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // PRIVADO — nenhum componente acessa diretamente
  private productsSubject = new BehaviorSubject<Product[]>([]);

  // PUBLICO como Observable readonly — componentes so leem
  readonly products$ = this.productsSubject.asObservable();

  addProduct(product: Product): void {
    const currentProducts = this.productsSubject.getValue();
    this.productsSubject.next([...currentProducts, product]);
  }

  removeProduct(productId: string): void {
    const filtered = this.productsSubject.getValue()
      .filter(p => p.id !== productId);
    this.productsSubject.next(filtered);
  }
}
```

## 4. Componente consumindo Observable com async pipe

```typescript
@Component({
  selector: 'app-product-list',
  template: `
    <ul>
      @for (product of products$ | async; track product.id) {
        <li>{{ product.name }}</li>
      }
    </ul>
  `
})
export class ProductListComponent {
  // async pipe faz subscribe E unsubscribe automaticamente
  products$ = inject(ProductService).products$;
}
```

## 5. Subject vs BehaviorSubject — diferenca pratica

```typescript
import { Subject, BehaviorSubject } from 'rxjs';

// --- SUBJECT ---
const subject = new Subject<string>();

subject.next('valor-1'); // Emitido ANTES de alguem se inscrever — PERDIDO

subject.subscribe(value => console.log('Subject:', value));
subject.next('valor-2'); // "Subject: valor-2" ✓

// --- BEHAVIOR SUBJECT ---
const behaviorSubject = new BehaviorSubject<string>('valor-inicial');

behaviorSubject.next('valor-1'); // Emitido antes, mas BehaviorSubject guarda

behaviorSubject.subscribe(value => console.log('BS:', value));
// Imediatamente imprime: "BS: valor-1" (ultimo valor guardado)

behaviorSubject.next('valor-2'); // "BS: valor-2"
```

## 6. Operadores RxJS basicos no pipe

```typescript
import { tap, map, filter } from 'rxjs/operators';

// tap — efeito colateral (logging, debug) sem alterar o valor
this.productService.products$.pipe(
  tap(products => console.log('Produtos recebidos:', products.length))
).subscribe(products => this.renderProducts(products));

// map — transforma o valor emitido
this.productService.products$.pipe(
  map(products => products.length) // Product[] → number
).subscribe(count => this.totalProducts = count);

// filter — so deixa passar emissoes que atendem a condicao
this.productService.products$.pipe(
  filter(products => products.length > 0) // Ignora lista vazia
).subscribe(products => this.renderProducts(products));

// Combinando operadores
this.productService.products$.pipe(
  tap(products => console.log('Raw:', products)),
  filter(products => products.length > 0),
  map(products => products.filter(p => p.isActive))
).subscribe(activeProducts => this.activeProducts = activeProducts);
```

## 7. Padrao completo: Service + Component + Template

```typescript
// product.service.ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  readonly products$ = this.productsSubject.asObservable();

  // Derivado: total de produtos como Observable
  readonly productCount$ = this.products$.pipe(
    map(products => products.length)
  );

  loadProducts(): void {
    // Simula fetch — em app real viria de HttpClient
    const products = [
      { id: '1', name: 'Notebook', price: 2500, isActive: true },
      { id: '2', name: 'Mouse', price: 80, isActive: true },
    ];
    this.productsSubject.next(products);
  }

  addProduct(product: Product): void {
    const current = this.productsSubject.getValue();
    this.productsSubject.next([...current, product]);
  }
}

// product-list.component.ts
@Component({
  selector: 'app-product-list',
  template: `
    <h2>Produtos ({{ productCount$ | async }})</h2>
    <ul>
      @for (product of products$ | async; track product.id) {
        <li>{{ product.name }} - R$ {{ product.price }}</li>
      }
    </ul>
    <button (click)="addSample()">Adicionar produto</button>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  
  products$ = this.productService.products$;
  productCount$ = this.productService.productCount$;

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  addSample(): void {
    this.productService.addProduct({
      id: crypto.randomUUID(),
      name: 'Teclado',
      price: 350,
      isActive: true
    });
  }
}
```