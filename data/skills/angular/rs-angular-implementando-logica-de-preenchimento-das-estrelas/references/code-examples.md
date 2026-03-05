# Code Examples: Logica de Preenchimento de Estrelas

## Exemplo completo do componente

### Signal e computed

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-movie-rating',
  templateUrl: './movie-rating.component.html',
})
export class MovieRatingComponent {
  // Signal que guarda a selecao atual (1-5 ou undefined)
  currentRating = signal<number | undefined>(undefined);

  // Computed que deriva o array booleano de preenchimento
  starsStatusField = computed(() => {
    const rating = this.currentRating() ?? 0;
    const boolArray = [0, 1, 2, 3, 4].map(index => index < rating);
    return boolArray;
  });

  // Metodo chamado ao clicar em uma estrela
  updateRating(newRating: number) {
    if (newRating === this.currentRating()) {
      // Toggle: mesma estrela clicada → zera
      this.currentRating.set(0);
    } else {
      // Nova selecao
      this.currentRating.set(newRating);
    }
  }
}
```

### Template com @for e class binding

```html
@for (field of starsStatusField(); track $index) {
  <svg
    (click)="updateRating($index + 1)"
    [class.filled]="field"
    [class.empty]="!field"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <!-- SVG path da estrela -->
  </svg>
}
```

## Variacao: Rating somente leitura

```typescript
// Para exibir rating sem interacao (ex: listagem de filmes)
@Component({
  selector: 'app-rating-display',
  template: `
    @for (field of starsStatusField(); track $index) {
      <svg [class.filled]="field" [class.empty]="!field">
        <!-- star path -->
      </svg>
    }
  `,
})
export class RatingDisplayComponent {
  rating = input.required<number>();

  starsStatusField = computed(() => {
    return [0, 1, 2, 3, 4].map(index => index < this.rating());
  });
}
```

## Variacao: Rating com half-stars

```typescript
// Extensao do pattern para meias estrelas
starsStatusField = computed(() => {
  const rating = this.currentRating() ?? 0;
  return [0, 1, 2, 3, 4].map(index => {
    if (index + 1 <= rating) return 'full';
    if (index + 0.5 <= rating) return 'half';
    return 'empty';
  });
});
```

## Trace do console.log mostrado na aula

```
// Clique na estrela 5:
// console.log: [true, true, true, true, true]

// Clique na estrela 5 novamente (toggle):
// console.log: [false, false, false, false, false]

// Clique na estrela 3:
// console.log: [true, true, true, false, false]

// Clique na estrela 1:
// console.log: [true, false, false, false, false]

// Clique na estrela 1 novamente (toggle):
// console.log: [false, false, false, false, false]
```

## Fluxo de dados completo

```
[Template]                    [Component]                    [Computed]
    |                              |                              |
    |-- click estrela 3 --------->|                              |
    |   ($index=2, envia 3)       |                              |
    |                              |-- currentRating.set(3) ---->|
    |                              |                              |
    |                              |                   recalcula: |
    |                              |          [0,1,2,3,4].map(   |
    |                              |            i => i < 3)      |
    |                              |          = [T,T,T,F,F]      |
    |                              |                              |
    |<-- re-render com -----------|<-- retorna [T,T,T,F,F] -----|
    |    classes atualizadas      |                              |
```