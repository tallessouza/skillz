# Code Examples: Identificacao de Componentes Angular a partir do Figma

## Nota

Esta aula e conceitual (analise de Figma), sem codigo no transcript. Os exemplos abaixo ilustram como a identificacao de componentes se traduz em codigo Angular.

## Estrutura de Componentes Identificados

### Navbar (componente compartilhado)

```bash
ng generate component components/navbar
```

```typescript
// navbar.component.ts
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {}
```

```html
<!-- navbar.component.html -->
<nav>
  <img src="assets/logo.svg" alt="Logo" />
  <ul>
    <li><a routerLink="/certificates">Certificados</a></li>
    <li><a routerLink="/generate">Gerar Certificado</a></li>
  </ul>
</nav>
```

### Item da Lista de Certificados (componente reutilizavel)

```bash
ng generate component components/certificate-item
```

```typescript
// certificate-item.component.ts
@Component({
  selector: 'app-certificate-item',
  templateUrl: './certificate-item.component.html',
  styleUrls: ['./certificate-item.component.css']
})
export class CertificateItemComponent {
  @Input() studentName: string = '';
  @Input() activities: string[] = [];
  @Input() date: string = '';
}
```

```html
<!-- certificate-item.component.html -->
<div class="certificate-item">
  <span>{{ studentName }}</span>
  <span>{{ activities.length }} atividades</span>
  <span>{{ date }}</span>
</div>
```

### Uso na Pagina de Lista

```html
<!-- certificate-list.component.html -->
<app-navbar></app-navbar>

<!-- Estado vazio -->
<div *ngIf="certificates.length === 0">
  <p>Nenhum certificado gerado</p>
</div>

<!-- Estado com itens -->
<div *ngIf="certificates.length > 0">
  <app-certificate-item
    *ngFor="let cert of certificates"
    [studentName]="cert.studentName"
    [activities]="cert.activities"
    [date]="cert.date"
  ></app-certificate-item>
</div>
```

### Formulario com Estados (inline na pagina)

```html
<!-- generate.component.html -->
<app-navbar></app-navbar>

<form>
  <label>Nome do aluno</label>
  <input [(ngModel)]="studentName" />

  <label>Atividade</label>
  <input [(ngModel)]="activityTitle" />

  <button
    [disabled]="!activityTitle"
    (click)="addActivity()">
    Adicionar
  </button>

  <ul>
    <li *ngFor="let activity of activities">{{ activity }}</li>
  </ul>

  <button
    [disabled]="!studentName || activities.length === 0"
    (click)="generateCertificate()">
    Gerar Certificado
  </button>
</form>
```

### Regra de Habilitacao dos Botoes

```typescript
// generate.component.ts
// Botao "Adicionar": habilitado quando activityTitle nao esta vazio
// Botao "Gerar Certificado": habilitado quando studentName preenchido E activities.length > 0

addActivity() {
  if (this.activityTitle.trim()) {
    this.activities.push(this.activityTitle);
    this.activityTitle = '';
  }
}
```