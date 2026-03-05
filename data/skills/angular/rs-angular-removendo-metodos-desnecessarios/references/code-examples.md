# Code Examples: Removendo Metodos Desnecessarios

## Estado inicial do componente (antes da limpeza)

```typescript
// movie-details.component.ts — ANTES
export class MovieDetailsComponent {
  reviewsCount = signal(0);
  stars = signal([1, 2, 3, 4, 5]);
  isFavorite: WritableSignal<boolean> = signal(false);
  currentRating = signal(0);

  constructor(private reviewService: ReviewService) {
    // logica de inicializacao
  }

  isStarFilled(index: number): boolean {
    return index <= this.currentRating();
  }

  toggleFavorite() {
    this.isFavorite.update(v => !v);
  }

  setRating(event: Event) {
    // logica antiga de rating via evento
  }
}
```

## Passo 1: Remover propriedades nao utilizadas

```typescript
// Removidos: reviewsCount, stars, constructor, isStarFilled, setRating
// Mantidos: isFavorite, currentRating, toggleFavorite
```

## Passo 2: Ajustar tipagens

```typescript
// ANTES: tipagem explicita desnecessaria
isFavorite: WritableSignal<boolean> = signal(false);

// DEPOIS: TypeScript infere WritableSignal<boolean>
isFavorite = signal(false);
```

## Passo 3: Signal com undefined para evitar execucao prematura

```typescript
// ANTES: valor inicial concreto dispara dependentes
currentRating = signal(0);

// DEPOIS: undefined previne execucao prematura de computed dependentes
currentRating = signal<number | undefined>(undefined);
```

## Passo 4: Criar stub do novo metodo

```typescript
// Metodo stub — logica sera implementada no proximo video
updateRating(newRating: number) {
  // TODO: implementar avaliacao
}
```

## Passo 5: Atualizar template com valores seguros

```html
<!-- ANTES: referenciava propriedades removidas -->
<svg *ngFor="let star of stars()"
     [class.filled]="isStarFilled(star)"
     (click)="setRating($event)">
</svg>

<!-- DEPOIS: valores seguros temporarios -->
<svg *ngFor="let star of []"
     [class.filled]="false"
     (click)="updateRating(index)">
</svg>
```

## Estado final do componente (apos limpeza)

```typescript
// movie-details.component.ts — DEPOIS
export class MovieDetailsComponent {
  isFavorite = signal(false);
  currentRating = signal<number | undefined>(undefined);

  toggleFavorite() {
    this.isFavorite.update(v => !v);
  }

  updateRating(newRating: number) {
    // logica sera implementada posteriormente
  }
}
```

## Padrao geral: sequencia segura de remocao

```
1. Identifique propriedades/metodos a remover
2. Busque TODAS referencias no template (Ctrl+Shift+F)
3. Para cada referencia no template:
   a. Se e binding de dados: substitua por valor default ([], false, '')
   b. Se e binding de evento: substitua pelo novo metodo (stub)
   c. Se e interpolacao: substitua por string vazia ou remova elemento
4. Remova do TypeScript
5. Verifique compilacao (ng serve sem erros)
6. Commit atomico
```