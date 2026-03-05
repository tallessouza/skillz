# Code Examples: @Input no Angular

## Exemplo completo do instrutor

### Estrutura de pastas

```
src/app/components/
├── input/
│   ├── components/
│   │   └── pessoa/
│   │       ├── pessoa.component.ts
│   │       └── pessoa.component.html
│   ├── input.component.ts
│   └── input.component.html
```

### Interface (idealmente em arquivo separado)

```typescript
// interfaces/pessoa.interface.ts
export interface IPessoa {
  id: number;
  nome: string;
  idade: number;
  endereco?: {
    rua: string;
    numero: string;
  };
}
```

### Componente pai (input.component.ts)

```typescript
import { Component } from '@angular/core';
import { PessoaComponent } from './components/pessoa/pessoa.component';

// Interface aqui apenas para referencia - mover para arquivo separado
export interface IPessoa {
  id: number;
  nome: string;
  idade: number;
  endereco?: {
    rua: string;
    numero: string;
  };
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [PessoaComponent],
  templateUrl: './input.component.html',
})
export class InputComponent {
  pessoas: IPessoa[] = [
    {
      id: 1,
      nome: 'Felipe',
      idade: 25,
      endereco: {
        rua: 'Rua das Flores',
        numero: '123',
      },
    },
    {
      id: 2,
      nome: 'Laura',
      idade: 30,
    },
  ];

  removerPessoa(id: number) {
    this.pessoas = this.pessoas.filter((pessoa) => pessoa.id !== id);
  }

  getQuantidadePessoas(): number {
    return this.pessoas.length;
  }
}
```

### Template do pai (input.component.html)

```html
<h1>Lista de Pessoas</h1>

@let quantidadeDeItens = getQuantidadePessoas();

@if (quantidadeDeItens > 0) {
  <p>Total: {{ quantidadeDeItens }}</p>
} @else {
  <p>Sem nenhum item</p>
}

@for (pessoa of pessoas; track pessoa.id) {
  <app-pessoa [pessoa]="pessoa" />
}
```

### Componente filho (pessoa.component.ts)

```typescript
import { Component, Input } from '@angular/core';
import { IPessoa } from '../../input.component'; // idealmente de interfaces/

@Component({
  selector: 'app-pessoa',
  standalone: true,
  templateUrl: './pessoa.component.html',
})
export class PessoaComponent {
  @Input({ required: true }) pessoa!: IPessoa;
}
```

### Template do filho (pessoa.component.html)

```html
<div>
  <p>{{ pessoa.nome }} - {{ pessoa.idade }}</p>
  @if (pessoa.endereco) {
    <p>{{ pessoa.endereco.rua }}, {{ pessoa.endereco.numero }}</p>
  }
</div>
```

## Variacao: usando alias

```typescript
// No componente filho
@Input({ alias: 'dadosPessoa' }) pessoa!: IPessoa;
```

```html
<!-- No componente pai - usa o alias -->
<app-pessoa [dadosPessoa]="pessoa" />
```

## Variacao: input sem required

```typescript
// Input opcional com valor padrao
@Input() titulo: string = 'Sem titulo';
```

## Variacao: multiplos inputs

```typescript
@Component({
  selector: 'app-pessoa-card',
  standalone: true,
  templateUrl: './pessoa-card.component.html',
})
export class PessoaCardComponent {
  @Input({ required: true }) pessoa!: IPessoa;
  @Input() mostrarEndereco: boolean = true;
  @Input() permitirRemocao: boolean = false;
}
```

```html
<app-pessoa-card
  [pessoa]="pessoa"
  [mostrarEndereco]="true"
  [permitirRemocao]="true"
/>
```

## Gerando componentes via CLI

```bash
# Gerar componente na pasta components
ng generate component components/input

# Gerar sub-componente dentro de input
ng generate component components/input/components/pessoa
```