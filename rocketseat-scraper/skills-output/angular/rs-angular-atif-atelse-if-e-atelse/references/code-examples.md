# Code Examples: @if, @else-if e @else no Angular

## Setup do projeto usado na aula

```bash
npx @angular/cli@19.2.0 new componentes-dinamicos --style=css --ssr=false
```

Geracao do componente:

```bash
ng generate component if
```

## Template completo do exemplo (if.component.html)

```html
<h2>@if Example</h2>

@if (userRole === 'admin') {
  <p>Administrador: acesso total ao sistema</p>
} @else if (userRole === 'editor') {
  <p>Editor: pode editar conteudo</p>
} @else {
  <p>Visualizador: somente leitura</p>
}

<button (click)="setUserRole('admin')">Administrador</button>
<button (click)="setUserRole('editor')">Editor</button>
<button (click)="setUserRole('viewer')">Visualizador</button>
```

## Componente TypeScript (if.component.ts)

```typescript
import { Component } from '@angular/core';

type UserRole = 'admin' | 'editor' | 'viewer';

@Component({
  selector: 'app-if',
  standalone: true,
  templateUrl: './if.component.html',
  styleUrl: './if.component.css'
})
export class IfComponent {
  userRole: UserRole = 'viewer';

  setUserRole(role: UserRole) {
    this.userRole = role;
  }
}
```

## Referencia no app.component.html

```html
<app-if />
```

## Referencia no app.component.ts

```typescript
import { Component } from '@angular/core';
import { IfComponent } from './components/if/if.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IfComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

## Captura de valor com `as`

```html
@if (userRole === 'admin'; as result) {
  <p>Administrador: {{ result }}</p>
  <!-- result sera `true` pois a expressao retornou verdadeiro -->
}
```

## Forma legada com *ngIf (para referencia)

```html
<!-- Requer import de CommonModule ou NgIf -->
<div *ngIf="userRole === 'admin'; else editorBlock">
  <p>Administrador</p>
</div>

<ng-template #editorBlock>
  <div *ngIf="userRole === 'editor'; else viewerBlock">
    <p>Editor</p>
  </div>
</ng-template>

<ng-template #viewerBlock>
  <p>Visualizador</p>
</ng-template>
```

```typescript
// Import necessario para *ngIf:
import { CommonModule } from '@angular/common';
// ou
import { NgIf } from '@angular/common';

@Component({
  // ...
  imports: [CommonModule] // ou [NgIf]
})
```

## Variacoes praticas

### Verificar se array tem itens

```html
@if (users.length > 0) {
  <ul>
    <!-- listar users -->
  </ul>
} @else {
  <p>Nenhum usuario encontrado</p>
}
```

### Verificar propriedade de objeto

```html
@if (user?.isActive) {
  <span class="badge-active">Ativo</span>
} @else {
  <span class="badge-inactive">Inativo</span>
}
```

### Condicao composta

```html
@if (user.role === 'admin' && user.isVerified) {
  <button (click)="deleteAll()">Deletar Tudo</button>
}
```