# Code Examples: @let — Variáveis Locais em Templates Angular

## Setup do componente

### Gerando o componente

```bash
ng generate component let
```

Remova o arquivo `.spec.ts` (não necessário para o exemplo).

### Registrando no app

```html
<!-- app.component.html -->
<app-let></app-let>
```

```typescript
// app.component.ts
import { LetComponent } from './let/let.component';

@Component({
  imports: [LetComponent],
  // ...
})
export class AppComponent {}
```

### TypeScript do componente (let.component.ts)

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-let',
  templateUrl: './let.component.html',
  styleUrls: ['./let.component.scss']
})
export class LetComponent {
  pessoas = [
    {
      id: 1,
      nome: 'Felipe',
      idade: 28,
      endereco: {
        rua: 'Edital',
        numero: 123
      }
    },
    {
      id: 2,
      nome: 'Laura',
      idade: 25
      // sem endereço
    }
  ];

  removerPessoa() {
    this.pessoas.pop();
  }

  pegarQuantidadeDePessoas(): number {
    return this.pessoas.length;
  }
}
```

## Template completo (let.component.html)

```html
@let quantidadeItens = pegarQuantidadeDePessoas();

@if (quantidadeItens) {
  <h1>Existem itens! Quantos? {{ quantidadeItens }}</h1>
} @else {
  <h1>Sem itens</h1>
}

<button (click)="removerPessoa()">Remover pessoa</button>

@for (pessoa of pessoas; track pessoa.id) {
  <div>
    <p>{{ pessoa.nome }}, {{ pessoa.idade }}</p>

    @let enderecoPessoa = pessoa.endereco;

    @if (enderecoPessoa) {
      <p>{{ enderecoPessoa.rua }}, {{ enderecoPessoa.numero }}</p>
    }
  </div>
}
```

## Comparação: sem @let vs com @let

### Sem @let (repetitivo)

```html
@if (pessoas.length) {
  <h1>Existem itens! Quantos? {{ pessoas.length }}</h1>
} @else {
  <h1>Sem itens</h1>
}

<button (click)="removerPessoa()">Remover pessoa</button>

@for (pessoa of pessoas; track pessoa.id) {
  <div>
    <p>{{ pessoa.nome }}, {{ pessoa.idade }}</p>

    @if (pessoa.endereco) {
      <p>{{ pessoa.endereco.rua }}, {{ pessoa.endereco.numero }}</p>
    }
  </div>
}
```

### Com @let (organizado)

```html
@let quantidadeItens = pegarQuantidadeDePessoas();

@if (quantidadeItens) {
  <h1>Existem itens! Quantos? {{ quantidadeItens }}</h1>
} @else {
  <h1>Sem itens</h1>
}

<button (click)="removerPessoa()">Remover pessoa</button>

@for (pessoa of pessoas; track pessoa.id) {
  <div>
    <p>{{ pessoa.nome }}, {{ pessoa.idade }}</p>

    @let enderecoPessoa = pessoa.endereco;

    @if (enderecoPessoa) {
      <p>{{ enderecoPessoa.rua }}, {{ enderecoPessoa.numero }}</p>
    }
  </div>
}
```

## Erro comum: sem ponto e vírgula

```html
<!-- ERRO: falta ponto e vírgula -->
@let quantidadeItens = pegarQuantidadeDePessoas()

<!-- CORRETO -->
@let quantidadeItens = pegarQuantidadeDePessoas();
```

## Erro comum: reatribuição manual

```html
@let quantidadeItens = pegarQuantidadeDePessoas();

@if (quantidadeItens) {
  <!-- ERRO: não é possível reatribuir -->
  @let quantidadeItens = 1;
}
```

## Preview: @let com AsyncPipe

```html
@let user = users$ | async;

@if (user) {
  <span>{{ user.name }}</span>
  <img [src]="user.photo" />
  <ul>
    @for (snack of user.favoriteSnacks; track snack) {
      <li>{{ snack }}</li>
    }
  </ul>
}
```

Neste padrão, `users$` é um Observable no componente. O `async` pipe se inscreve automaticamente, e toda vez que um novo valor é emitido, o @let atualiza e o template reflete o novo estado.