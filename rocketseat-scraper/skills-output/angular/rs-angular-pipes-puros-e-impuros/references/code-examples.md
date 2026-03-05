# Code Examples: Pipes Puros e Impuros

## Exemplo completo da aula

### O pipe UserStatus

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userStatus',
  standalone: true,
  // pure: true é o padrão
})
export class UserStatusPipe implements PipeTransform {
  transform(status: number): string {
    switch (status) {
      case 1:
        return 'Ativo';
      case 2:
        return 'Inativo';
      default:
        return 'Desconhecido';
    }
  }
}
```

### Componente com metodo (anti-pattern demonstrado)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-pipe',
  template: `
    @for (user of users; track user.id) {
      <div>
        <span>{{ user.name }}</span>
        <!-- ANTI-PATTERN: metodo reexecuta a cada Change Detection -->
        <span>Status: {{ getUserStatus(user.status) }}</span>
      </div>
    }
    <button (click)="teste()">Teste</button>
  `,
})
export class CustomPipeComponent {
  users = [
    { id: 1, name: 'João', status: 1 },
    { id: 2, name: 'Maria', status: 2 },
  ];

  // Chamado MULTIPLAS vezes por Change Detection
  getUserStatus(status: number): string {
    console.log('+getUserStatus'); // para demonstrar as chamadas
    switch (status) {
      case 1: return 'Ativo';
      case 2: return 'Inativo';
      default: return 'Desconhecido';
    }
  }

  teste() {
    // Apenas dispara Change Detection ao clicar
  }
}
```

### Componente correto (usando pipe)

```typescript
import { Component } from '@angular/core';
import { UserStatusPipe } from './user-status.pipe';

@Component({
  selector: 'app-custom-pipe',
  standalone: true,
  imports: [UserStatusPipe],
  template: `
    @for (user of users; track user.id) {
      <div>
        <span>{{ user.name }}</span>
        <!-- CORRETO: pipe puro, executa somente quando user.status muda -->
        <span>Status: {{ user.status | userStatus }}</span>
      </div>
    }
    <button (click)="teste()">Teste</button>
  `,
})
export class CustomPipeComponent {
  users = [
    { id: 1, name: 'João', status: 1 },
    { id: 2, name: 'Maria', status: 2 },
  ];

  teste() {
    // Clique dispara Change Detection, mas pipe NAO reexecuta
  }
}
```

### Pipe impuro (para referencia — evitar)

```typescript
@Pipe({
  name: 'userStatus',
  standalone: true,
  pure: false, // IMPURO: reexecuta a cada Change Detection
})
export class UserStatusPipe implements PipeTransform {
  transform(status: number): string {
    console.log('-userStatus pipe'); // vai logar multiplas vezes
    switch (status) {
      case 1: return 'Ativo';
      case 2: return 'Inativo';
      default: return 'Desconhecido';
    }
  }
}
```

## Comparacao visual de logs

### Com pipe puro + metodo no componente (render inicial):

```
- userStatus pipe    // pipe: 1a chamada (user 1)
- userStatus pipe    // pipe: 2a chamada (user 2)
+ getUserStatus      // metodo: chamada 1
+ getUserStatus      // metodo: chamada 2
+ getUserStatus      // metodo: chamada 3 (Change Detection extra)
+ getUserStatus      // metodo: chamada 4
+ getUserStatus      // metodo: chamada 5
+ getUserStatus      // metodo: chamada 6
```

### Apos clicar no botao "Teste":

```
// pipe puro: NENHUMA chamada (parametro nao mudou)
+ getUserStatus      // metodo: chamada 1
+ getUserStatus      // metodo: chamada 2
+ getUserStatus      // metodo: chamada 3
+ getUserStatus      // metodo: chamada 4
```

### Com pipe impuro apos clique:

```
- userStatus pipe    // pipe impuro: chamada 1
- userStatus pipe    // pipe impuro: chamada 2
- userStatus pipe    // pipe impuro: chamada 3
- userStatus pipe    // pipe impuro: chamada 4
```

## Variacoes do pattern em outros contextos

### Formatacao de preco (mesmo principio)

```typescript
// ERRADO: metodo no componente
{{ formatPrice(product.price) }}

// CORRETO: pipe
{{ product.price | currency:'BRL' }}  // built-in
// ou pipe customizado se logica especifica
{{ product.price | customPrice }}
```

### Filtragem de lista

```typescript
// ERRADO: metodo que filtra no template
{{ getActiveUsers(users) }}

// MELHOR: filtrar no componente e expor resultado
// component.ts
activeUsers = this.users.filter(u => u.isActive);

// template
@for (user of activeUsers; track user.id) { ... }
```