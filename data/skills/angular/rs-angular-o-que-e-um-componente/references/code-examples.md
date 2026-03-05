# Code Examples: Componentizacao Angular

## Estrutura basica de um componente

```typescript
// component.ts — a classe com logica e estado
@Component({
  selector: 'app-comp1',
  templateUrl: './comp1.component.html',
  styleUrls: ['./comp1.component.css']
})
export class Comp1Component {
  // Estado do componente — propriedades
  teste = 'valor inicial';

  // Metodos — logica executada por eventos do template
  onButtonClick() {
    this.teste = 'novo valor';
    // poderia fazer chamada HTTP aqui
  }
}
```

```html
<!-- comp1.component.html — template com forma visual -->
<div class="container">
  <p>{{ teste }}</p>
  <button (click)="onButtonClick()">Clique aqui</button>
</div>
```

```css
/* comp1.component.css — estilos encapsulados */
.container {
  padding: 16px;
}

button {
  background-color: blue;
  color: white;
}
```

## Encapsulamento de estilos (nao conflitam)

```css
/* comp1.component.css */
.teste {
  color: red;
}

/* comp2.component.css — mesma classe, sem conflito */
.teste {
  color: blue;
}
```

Cada `.teste` so se aplica ao seu respectivo componente.

## Exemplo de componentizacao: tela de login simples

```typescript
// Tela simples — um unico componente basta
@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <img src="assets/logo.png" alt="Logo" />
      <form (ngSubmit)="onLogin()">
        <input type="email" [(ngModel)]="email" placeholder="E-mail" />
        <input type="password" [(ngModel)]="password" placeholder="Senha" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  onLogin() {
    // logica de autenticacao
  }
}
```

## Exemplo de componentizacao: home complexa com filhos

```typescript
// HomeComponent — componente pai que orquestra filhos
@Component({
  selector: 'app-home',
  template: `
    <app-header />
    <app-calendar />
    <app-card-summary [balance]="balance" />
    <app-transactions-list [transactions]="transactions" />
  `
})
export class HomeComponent {
  balance = 0;
  transactions: Transaction[] = [];
}
```

```typescript
// HeaderComponent — responsabilidade: navegacao e info do usuario
@Component({
  selector: 'app-header',
  template: `
    <header>
      <h1>Minhas Financas</h1>
      <span>{{ userName }}</span>
    </header>
  `
})
export class HeaderComponent {
  @Input() userName = '';
}
```

```typescript
// TransactionsListComponent — responsabilidade: loop sobre itens
@Component({
  selector: 'app-transactions-list',
  template: `
    <section class="transactions">
      <h2>Lancamentos</h2>
      @for (transaction of transactions; track transaction.id) {
        <app-transaction-item [transaction]="transaction" />
      }
    </section>
  `
})
export class TransactionsListComponent {
  @Input() transactions: Transaction[] = [];
}
```

```typescript
// TransactionItemComponent — responsabilidade: renderizar um unico item
@Component({
  selector: 'app-transaction-item',
  template: `
    <div class="transaction-item">
      <span class="description">{{ transaction.description }}</span>
      <span class="amount" [class.income]="transaction.amount > 0">
        {{ transaction.amount | currency:'BRL' }}
      </span>
    </div>
  `,
  styleUrls: ['./transaction-item.component.css']
})
export class TransactionItemComponent {
  @Input() transaction!: Transaction;
}
```

## Exemplo: registro com upload de imagem como componente filho

```typescript
// RegisterComponent — componente pai
@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <app-image-upload (imageSelected)="onImageSelected($event)" />
      <form (ngSubmit)="onRegister()">
        <input [(ngModel)]="name" placeholder="Nome" />
        <input [(ngModel)]="email" placeholder="E-mail" />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  profileImage: File | null = null;

  onImageSelected(file: File) {
    this.profileImage = file;
  }

  onRegister() {
    // logica de registro com imagem
  }
}
```

```typescript
// ImageUploadComponent — logica propria de captura e tratativa de imagem
@Component({
  selector: 'app-image-upload',
  template: `
    <div class="upload-area" (click)="fileInput.click()">
      <img *ngIf="previewUrl" [src]="previewUrl" />
      <span *ngIf="!previewUrl">Selecione uma imagem</span>
      <input #fileInput type="file" accept="image/*"
             (change)="onFileSelected($event)" hidden />
    </div>
  `,
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {
  @Output() imageSelected = new EventEmitter<File>();
  previewUrl: string | null = null;

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.previewUrl = URL.createObjectURL(file);
      this.imageSelected.emit(file);
    }
  }
}
```

## Comunicacao entre componentes (preview)

```typescript
// Pai → Filho: @Input()
// No pai:
<app-child [data]="parentData" />

// No filho:
@Input() data!: string;

// Filho → Pai: @Output()
// No filho:
@Output() action = new EventEmitter<string>();
this.action.emit('valor');

// No pai:
<app-child (action)="onAction($event)" />

// Componentes desconectados: via Service
@Injectable({ providedIn: 'root' })
export class SharedService {
  private dataSubject = new BehaviorSubject<string>('');
  data$ = this.dataSubject.asObservable();

  updateData(value: string) {
    this.dataSubject.next(value);
  }
}
```