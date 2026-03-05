# Code Examples: Ciclo de Vida — NgOnInit

## Exemplo 1: NgOnInit basico com console.log

Primeira demonstracao do instructor — implementacao minima:

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  ngOnInit(): void {
    console.log('Meu componente navbar inicializou');
  }
}
```

Resultado: ao abrir a pagina, F12 > Console mostra "Meu componente navbar inicializou".

## Exemplo 2: Isolando logica em funcao

O instructor refatora para mostrar boas praticas:

```typescript
export class NavbarComponent implements OnInit {
  ngOnInit(): void {
    this.mensagem(); // IMPORTANTE: usar this.
  }

  mensagem(): void {
    console.log('Meu componente navbar inicializou dentro de uma função');
  }
}
```

## Exemplo 3: Controlando inicializacao com @if

No app.component.ts:
```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'minha-app';
  exibeNavbar: boolean = false; // false = navbar NAO inicializa
}
```

No app.component.html:
```html
<h1>Hello World</h1>

@if (exibeNavbar) {
  <app-navbar />
}
```

Resultado com `false`: navbar nao aparece E o console.log NAO executa (componente nunca foi criado).

Resultado com `true`: navbar aparece E o console.log executa.

## Exemplo 4: Escondendo com [hidden]

```html
<app-navbar [hidden]="!exibeNavbar" />
```

Com `exibeNavbar = false`:
- Navbar NAO aparece visualmente
- Mas o console.log EXECUTA — o componente foi criado e inicializado
- Apenas esta escondido via CSS (display: none)

Com `exibeNavbar = true`:
- Navbar aparece normalmente

## Exemplo 5: Usando *ngIf (pre-Angular 17)

```typescript
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  exibeNavbar: boolean = false;
}
```

```html
<app-navbar *ngIf="exibeNavbar" />
```

Comportamento identico ao `@if` — componente so e criado se a condicao for true. A diferenca e que `*ngIf` requer `CommonModule` importado.

## Variacao: ngOnInit para chamada de API (caso de uso real)

```typescript
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService.getAll().subscribe(users => {
      this.users = users;
    });
  }
}
```