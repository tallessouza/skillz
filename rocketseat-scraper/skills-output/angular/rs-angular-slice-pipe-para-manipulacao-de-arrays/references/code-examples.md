# Code Examples: SlicePipe para Manipulacao de Arrays

## Exemplo 1: Primeiros N itens (limitacao de resultados)

```typescript
// Componente
products = ['Celular', 'Laptop', 'Monitor', 'Mouse', 'Teclado'];
```

```html
<!-- Template: extrai indices 0, 1, 2 -->
@for (product of products | slice:0:3; track product) {
  <li>{{ product }}</li>
}
<!-- Resultado: Celular, Laptop, Monitor -->
```

**Explicacao:** `slice:0:3` comeca no indice 0 e vai ate o indice 3-1=2.

## Exemplo 2: A partir de um indice ate o final

```typescript
fruits = ['Banana', 'Maça', 'Uva', 'Morango', 'Abacaxi'];
```

```html
@for (fruit of fruits | slice:3; track fruit) {
  <span>{{ fruit }}</span>
}
<!-- Resultado: Morango, Abacaxi -->
```

**Explicacao:** `slice:3` comeca no indice 3 (Morango) e vai ate o final do array.

## Exemplo 3: Paginacao dinamica completa

```typescript
import { Component } from '@angular/core';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [SlicePipe],
  template: `
    <button (click)="changePage(1)" [disabled]="currentPage === 1">Página 1</button>
    <button (click)="changePage(2)" [disabled]="currentPage === 2">Página 2</button>
    <button (click)="changePage(3)" [disabled]="currentPage === 3">Página 3</button>

    <p>Start Index: {{ startIndex }} | End Index: {{ endIndex }}</p>

    <ul>
      @for (client of clients | slice:startIndex:endIndex; track client) {
        <li>{{ client }}</li>
      }
    </ul>
  `
})
export class PaginationComponent {
  clients = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gustavo', 'Helena', 'Ivan'];
  itemsPerPage = 3;
  currentPage = 2;

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return this.currentPage * this.itemsPerPage;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
```

### Walkthrough por pagina:

| Pagina | currentPage | startIndex | endIndex | Calculo start | Calculo end | Resultado |
|--------|-------------|------------|----------|---------------|-------------|-----------|
| 1 | 1 | 0 | 3 | (1-1)*3=0 | 1*3=3 | Ana, Bruno, Carlos |
| 2 | 2 | 3 | 6 | (2-1)*3=3 | 2*3=6 | Daniela, Eduardo, Fernanda |
| 3 | 3 | 6 | 9 | (3-1)*3=6 | 3*3=9 | Gustavo, Helena, Ivan |

## Exemplo 4: Ultimos N elementos (valor negativo)

```typescript
errorLogs = [
  'Erro de conexão',
  'Timeout na API',
  'Falha no banco',
  'Erro de validação',
  'Erro de autenticação'
];
```

```html
<!-- Extrai os 2 ultimos logs -->
@for (log of errorLogs | slice:-2; track log) {
  <p>{{ log }}</p>
}
<!-- Resultado: Erro de validação, Erro de autenticação -->
```

**Explicacao:** `-2` conta 2 posicoes a partir do final do array.

## Variacoes uteis

### Combinar com indice do loop

```html
@for (client of clients | slice:startIndex:endIndex; track client; let i = $index) {
  <li>{{ startIndex + i + 1 }}. {{ client }}</li>
}
<!-- Pagina 2: 4. Daniela, 5. Eduardo, 6. Fernanda -->
```

### Paginacao com quantidade de paginas dinamica

```typescript
get totalPages(): number {
  return Math.ceil(this.clients.length / this.itemsPerPage);
}

// No template, gerar botoes dinamicamente com outro @for
```