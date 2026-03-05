# Code Examples: Tela de Detalhes de Filme

## Nota

Esta aula e introdutoria e nao contem codigo. Os exemplos abaixo sao padroes inferidos das funcionalidades descritas pelo instrutor, para servir como referencia ao implementar.

## Extrair ID da URL

```typescript
// Opcao 1: com input() e withComponentInputBinding()
export class MovieDetailComponent {
  id = input.required<string>();
}

// Opcao 2: com ActivatedRoute
export class MovieDetailComponent {
  private route = inject(ActivatedRoute);
  private movieId = this.route.snapshot.params['id'];
}
```

## Buscar filme com rxResource

```typescript
export class MovieDetailComponent {
  id = input.required<string>();

  movieResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) => this.movieService.getById(id),
  });

  movie = this.movieResource.value;
}
```

## Sistema de rating com estrelas

```typescript
export class MovieDetailComponent {
  selectedRating = signal(0);

  stars = computed(() =>
    Array.from({ length: 5 }, (_, i) => i + 1 <= this.selectedRating())
  );

  rate(value: number) {
    this.selectedRating.set(value);
    this.movieService.rateMovie(this.id(), value).subscribe();
  }
}
```

```html
<!-- Template de estrelas -->
@for (filled of stars(); track $index) {
  <span
    class="star"
    [class.filled]="filled"
    (click)="rate($index + 1)">
    ★
  </span>
}
```

## Toggle de favoritos

```typescript
export class MovieDetailComponent {
  isFavorite = signal(false);

  toggleFavorite() {
    const newState = !this.isFavorite();
    this.isFavorite.set(newState);

    if (newState) {
      this.favoriteService.add(this.id()).subscribe();
    } else {
      this.favoriteService.remove(this.id()).subscribe();
    }
  }
}
```

```html
<button (click)="toggleFavorite()">
  <span [class.filled]="isFavorite()">❤</span>
</button>
```

## Verificar se filme ja e favorito ao carregar

```typescript
export class MovieDetailComponent {
  isFavorite = signal(false);

  constructor() {
    effect(() => {
      const id = this.id();
      this.favoriteService.isFavorite(id).subscribe(result => {
        this.isFavorite.set(result);
      });
    });
  }
}
```