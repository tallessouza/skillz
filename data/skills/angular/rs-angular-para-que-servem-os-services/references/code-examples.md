# Code Examples: Angular Services

## Cenario 1: Estado compartilhado entre componentes

### Problema — Cascata de Input/Output

```typescript
// container.component.ts — gerenciando estado (ERRADO)
@Component({
  selector: 'app-container',
  template: `
    <app-product-list
      [products]="products"
      (removeProduct)="onRemove($event)">
    </app-product-list>

    <app-product-editor
      [products]="products"
      (updateProduct)="onUpdate($event)">
    </app-product-editor>

    <app-product-confirmation
      [products]="products"
      (confirmSelection)="onConfirm($event)">
    </app-product-confirmation>
  `
})
export class ContainerComponent {
  products: Product[] = [];

  onRemove(productId: string) {
    this.products = this.products.filter(p => p.id !== productId);
  }

  onUpdate(event: { id: string; changes: Partial<Product> }) {
    this.products = this.products.map(p =>
      p.id === event.id ? { ...p, ...event.changes } : p
    );
  }

  onConfirm(selectedProducts: Product[]) {
    // Agora precisa fazer HTTP tambem? Componente virando monstro
    this.http.post('/api/orders', { products: selectedProducts }).subscribe();
  }
}
```

### Pior ainda — Componente neto precisa dos dados

```typescript
// product-list.component.ts — recebe e repassa (CASCATA)
@Component({
  selector: 'app-product-list',
  template: `
    <app-product-item
      *ngFor="let product of products"
      [product]="product"
      (remove)="removeProduct.emit($event)">
    </app-product-item>
  `
})
export class ProductListComponent {
  @Input() products: Product[] = [];
  @Output() removeProduct = new EventEmitter<string>();
  // Componente intermediario so repassando dados — acoplamento desnecessario
}
```

### Solucao — Service como fonte unica

```typescript
// products.service.ts
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products: Product[] = [];
  private products$ = new BehaviorSubject<Product[]>([]);

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  addProduct(product: Product): void {
    this.products = [...this.products, product];
    this.products$.next([...this.products]);
  }

  removeProduct(productId: string): void {
    this.products = this.products.filter(p => p.id !== productId);
    this.products$.next([...this.products]);
  }

  updateProduct(productId: string, changes: Partial<Product>): void {
    this.products = this.products.map(p =>
      p.id === productId ? { ...p, ...changes } : p
    );
    this.products$.next([...this.products]);
  }
}
```

```typescript
// Qualquer componente consome diretamente — sem cascata
@Component({
  selector: 'app-product-list',
  template: `
    <div *ngFor="let product of products$ | async">
      {{ product.name }}
      <button (click)="remove(product.id)">Remover</button>
    </div>
  `
})
export class ProductListComponent {
  private productsService = inject(ProductsService);
  products$ = this.productsService.getProducts();

  remove(productId: string): void {
    this.productsService.removeProduct(productId);
  }
}
```

## Cenario 2: Chamadas HTTP via Service

### Errado — HTTP no componente

```typescript
@Component({ /* ... */ })
export class ProductPageComponent {
  private http = inject(HttpClient);
  products: Product[] = [];

  ngOnInit() {
    // Componente fazendo chamada HTTP diretamente
    this.http.get<Product[]>('/api/products').subscribe(data => {
      this.products = data;
    });
  }

  deleteProduct(id: string) {
    // Componente misturando display + HTTP + estado
    this.http.delete(`/api/products/${id}`).subscribe(() => {
      this.products = this.products.filter(p => p.id !== id);
    });
  }
}
```

### Correto — Service como intermediador

```typescript
// products-http.service.ts
@Injectable({ providedIn: 'root' })
export class ProductsHttpService {
  private httpClient = inject(HttpClient);

  fetchProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>('/api/products');
  }

  deleteProduct(productId: string): Observable<void> {
    return this.httpClient.delete<void>(`/api/products/${productId}`);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.httpClient.post<Product>('/api/products', product);
  }

  updateProduct(productId: string, changes: Partial<Product>): Observable<Product> {
    return this.httpClient.put<Product>(`/api/products/${productId}`, changes);
  }
}
```

```typescript
// Componente limpo — so apresentacao
@Component({
  selector: 'app-product-page',
  template: `
    <div *ngFor="let product of products">
      {{ product.name }} - {{ product.price }}
      <button (click)="onDelete(product.id)">Remover</button>
    </div>
  `
})
export class ProductPageComponent {
  private productsHttp = inject(ProductsHttpService);
  private productsState = inject(ProductsService);
  products: Product[] = [];

  ngOnInit() {
    this.productsHttp.fetchProducts().subscribe(products => {
      this.products = products;
    });
  }

  onDelete(productId: string): void {
    this.productsHttp.deleteProduct(productId).subscribe(() => {
      this.productsState.removeProduct(productId);
    });
  }
}
```

## Cenario 3: Service de contexto especifico (caso real)

```typescript
// file-capture-context.service.ts — Service exclusivo de um componente
@Injectable() // SEM providedIn: 'root' — instancia por componente
export class FileCaptureContextService {
  private files: CapturedFile[] = [];
  private files$ = new BehaviorSubject<CapturedFile[]>([]);

  getFiles(): Observable<CapturedFile[]> {
    return this.files$.asObservable();
  }

  addFile(file: CapturedFile): void {
    this.files = [...this.files, file];
    this.files$.next([...this.files]);
  }

  removeFile(fileId: string): void {
    this.files = this.files.filter(f => f.id !== fileId);
    this.files$.next([...this.files]);
  }

  getFileById(fileId: string): CapturedFile | undefined {
    return this.files.find(f => f.id === fileId);
  }
}
```

```typescript
// file-capture.component.ts
@Component({
  selector: 'app-file-capture',
  providers: [FileCaptureContextService], // Instancia local
  template: `
    <input type="file" (change)="onFileSelected($event)" />
    <div *ngFor="let file of files$ | async">
      {{ file.name }}
      <button (click)="onRemove(file.id)">Remover</button>
      <button (click)="onPreview(file.id)">Visualizar</button>
    </div>
  `
})
export class FileCaptureComponent {
  private contextService = inject(FileCaptureContextService);
  files$ = this.contextService.getFiles();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      this.contextService.addFile({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        blob: file,
      });
    }
  }

  onRemove(fileId: string): void {
    this.contextService.removeFile(fileId);
  }

  onPreview(fileId: string): void {
    const file = this.contextService.getFileById(fileId);
    // Logica de preview...
  }
}
```

## Cenario 4: Dados sobrevivendo a mudanca de rota

```typescript
// Com Service — funciona entre rotas
// rota-x.component.ts
@Component({ /* ... */ })
export class RotaXComponent {
  private productsService = inject(ProductsService);

  selectProduct(product: Product) {
    this.productsService.addProduct(product);
    this.router.navigate(['/rota-y']); // Navega para outra rota
  }
}

// rota-y.component.ts — mesmo Service, mesma instancia, mesmos dados
@Component({ /* ... */ })
export class RotaYComponent {
  private productsService = inject(ProductsService);
  products$ = this.productsService.getProducts();
  // Produtos selecionados na rota X estao disponiveis aqui
}
```