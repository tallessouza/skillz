# Code Examples: ngOnChanges

## Exemplo 1: Implementacao basica com interface

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

interface Pessoa {
  nome: string;
  idade: number;
}

@Component({
  selector: 'app-pessoa',
  template: `<p>{{ pessoa?.nome }} - {{ pessoa?.idade }}</p>`
})
export class PessoaComponent implements OnChanges {
  @Input() pessoa!: Pessoa;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes);
  }
}
```

**Output no console (primeira renderizacao):**
```
ngOnChanges {
  pessoa: {
    currentValue: { nome: 'Felipe', idade: 25 },
    previousValue: undefined,
    firstChange: true
  }
}
```

## Exemplo 2: Acessando currentValue com verificacao

```typescript
ngOnChanges(changes: SimpleChanges): void {
  if (changes['pessoa'] && changes['pessoa'].currentValue) {
    console.log('currentValue:', changes['pessoa'].currentValue);
    // Executar logica com o valor atualizado
    this.executarLogica(changes['pessoa'].currentValue);
  }
}

private executarLogica(pessoa: Pessoa): void {
  // Sua logica aqui
}
```

## Exemplo 3: Mutacao direta vs nova referencia (componente pai)

### ERRADO — mutacao direta, ngOnChanges NAO dispara

```typescript
// app.component.ts (pai)
@Component({
  template: `
    <app-pessoa [pessoa]="pessoas[0]"></app-pessoa>
    <button (click)="mudarNome()">Mudar Nome</button>
  `
})
export class AppComponent {
  pessoas: Pessoa[] = [
    { nome: 'Felipe', idade: 25 }
  ];

  mudarNome(): void {
    // ERRADO: muta o objeto existente, mesma referencia
    this.pessoas[0].nome = 'atualizado';
    // O nome muda no template (binding funciona),
    // mas ngOnChanges do PessoaComponent NAO e chamado
  }
}
```

### CORRETO — nova referencia, ngOnChanges dispara

```typescript
mudarNome(): void {
  // CORRETO: cria novo objeto com spread
  this.pessoas[0] = { ...this.pessoas[0], nome: 'atualizado' };
  // ngOnChanges do PessoaComponent E chamado
}
```

**Output no console apos clicar:**
```
ngOnChanges {
  pessoa: {
    currentValue: { nome: 'atualizado', idade: 25 },
    previousValue: { nome: 'Felipe', idade: 25 },
    firstChange: false
  }
}
```

## Exemplo 4: Componente com multiplos inputs

```typescript
@Component({
  selector: 'app-pessoa',
  template: `<p>{{ pessoa?.nome }} - {{ ativo }}</p>`
})
export class PessoaComponent implements OnChanges {
  @Input() pessoa!: Pessoa;
  @Input() ativo: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    // Verificar qual input mudou
    if (changes['pessoa']?.currentValue) {
      console.log('Pessoa mudou:', changes['pessoa'].currentValue);
    }

    if (changes['ativo']) {
      console.log('Ativo mudou:', changes['ativo'].currentValue);
      // Para boolean, mudanca de valor ja dispara (primitivo)
    }
  }
}
```

## Exemplo 5: Usando firstChange para logica de inicializacao

```typescript
ngOnChanges(changes: SimpleChanges): void {
  if (changes['pessoa']) {
    if (changes['pessoa'].firstChange) {
      // Primeira vez que recebeu valor — inicializar algo
      this.inicializarComponente(changes['pessoa'].currentValue);
    } else {
      // Atualizacao subsequente
      this.atualizarComponente(
        changes['pessoa'].previousValue,
        changes['pessoa'].currentValue
      );
    }
  }
}
```

## Exemplo 6: Atualizando arrays (mesma logica de referencia)

```typescript
// ERRADO — push muta o array existente
this.itens.push(novoItem);

// CORRETO — cria novo array
this.itens = [...this.itens, novoItem];

// CORRETO — remover item criando novo array
this.itens = this.itens.filter(item => item.id !== idParaRemover);
```