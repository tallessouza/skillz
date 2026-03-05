# Code Examples: JsonPipe para Debug no Template Angular

## Exemplo 1: Objeto e Array (do curso)

```typescript
import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <h2>Sem JsonPipe:</h2>
    <p>{{ config }}</p>         <!-- [object Object] -->
    <p>{{ tags }}</p>           <!-- angular,typescript,pipes -->

    <h2>Com JsonPipe:</h2>
    <pre>{{ config | json }}</pre>
    <!-- { "theme": "dark", "language": "pt-BR" } -->

    <pre>{{ tags | json }}</pre>
    <!-- [ "angular", "typescript", "pipes" ] -->
  `
})
export class ExampleComponent {
  config = {
    theme: 'dark',
    language: 'pt-BR'
  };

  tags = ['angular', 'typescript', 'pipes'];
}
```

## Exemplo 2: Debug de dados de API

```typescript
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <!-- Temporario: remover apos debug -->
    <pre>{{ users | json }}</pre>

    @for (user of users; track user.id) {
      <p>{{ user.name }}</p>
    }
  `
})
export class UsersComponent {
  users: User[] = [];

  constructor(private userService: UserService) {
    this.userService.getAll().subscribe(data => {
      this.users = data;
    });
  }
}
```

## Exemplo 3: Debug de Input recebido em componente filho

```typescript
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <!-- Debug: ver o que o pai esta passando -->
    <pre>{{ item | json }}</pre>

    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
  `
})
export class CardComponent {
  @Input() item!: CardItem;
}
```

## Sintaxe resumida

```
{{ qualquerValor | json }}
```

- `qualquerValor` pode ser: objeto, array, string, number, boolean, null
- O pipe converte para string JSON via `JSON.stringify()`
- Import necessario: `import { JsonPipe } from '@angular/common'`