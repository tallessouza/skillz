# Code Examples: Corrigindo Mensagens de Lista Vazia

## Exemplo da aula: Componente de Favoritos

### Antes da correcao

```html
<!-- O empty state aparece imediatamente porque favoriteMovies() inicia como [] -->
@if (favoriteMovies().length === 0) {
  <div class="empty-state">
    😢 Nenhum filme encontrado
  </div>
}

@for (movie of favoriteMovies(); track movie.id) {
  <app-movie-card [movie]="movie" />
}
```

### Depois da correcao

```html
<!-- Agora so mostra quando loading terminou E lista esta vazia -->
@if (favoriteMovies().length === 0 && !favoriteResource.isLoading()) {
  <div class="empty-state">
    😢 Nenhum filme encontrado
  </div>
}

@for (movie of favoriteMovies(); track movie.id) {
  <app-movie-card [movie]="movie" />
}
```

## Exemplo da aula: Componente Explorar

```html
@if (movies().length === 0 && !moviesResource.isLoading()) {
  <div class="empty-state">
    😢 Nenhum filme encontrado
  </div>
}

@for (movie of movies(); track movie.id) {
  <app-movie-card [movie]="movie" />
}
```

## Variacao: Adicionando spinner opcional

Se no futuro quiser adicionar um indicador de carregamento:

```html
<!-- Spinner durante loading -->
@if (favoriteResource.isLoading()) {
  <div class="loading-spinner">
    <span class="spinner"></span>
    Carregando...
  </div>
}

<!-- Empty state so apos loading -->
@if (favoriteMovies().length === 0 && !favoriteResource.isLoading()) {
  <div class="empty-state">
    😢 Nenhum filme encontrado
  </div>
}

<!-- Lista de filmes -->
@for (movie of favoriteMovies(); track movie.id) {
  <app-movie-card [movie]="movie" />
}
```

## Como testar o comportamento

Para verificar se o fix funciona, use o DevTools:
1. Abra Network tab
2. Selecione "Slow 3G" no throttling
3. Navegue entre as paginas (Favoritos ↔ Explorar)
4. Confirme que "Nenhum filme encontrado" NAO aparece durante o loading
5. Confirme que aparece corretamente quando a lista e de fato vazia