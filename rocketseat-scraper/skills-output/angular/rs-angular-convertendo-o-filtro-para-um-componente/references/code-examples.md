# Code Examples: Extraindo Componentes em Angular

## Comando CLI usado na aula

```bash
# Dentro da pasta features/movies/components/
ng generate component movies-filter --skip-tests=true
```

Esse comando gera:
```
movies-filter/
  movies-filter.component.ts
  movies-filter.component.html
  movies-filter.component.css
```

## Estrutura antes da extracao

### explore-movies.component.html (antes)
```html
<!-- Linhas 1-32: header e conteudo -->
<div class="container">
  <h1>Explorar Filmes</h1>

  <!-- Linhas 33-90: bloco de filtro (57 linhas) -->
  <div class="md:col-span-2 w-full">
    <!-- Selects, inputs, opcoes de filtro -->
    <select>
      <option>Genero</option>
      <option>Acao</option>
      <option>Comedia</option>
    </select>
    <input type="text" placeholder="Buscar..." />
    <div class="filter-options">
      <!-- Mais opcoes de filtro... -->
    </div>
  </div>

  <!-- Linhas 91+: grid de filmes -->
  <div class="movies-grid">
    <!-- Cards de filmes -->
  </div>
</div>
```

## Estrutura depois da extracao

### movies-filter.component.html
```html
<!-- Todo o bloco de filtro movido para ca -->
<div class="md:col-span-2 w-full">
  <select>
    <option>Genero</option>
    <option>Acao</option>
    <option>Comedia</option>
  </select>
  <input type="text" placeholder="Buscar..." />
  <div class="filter-options">
    <!-- Opcoes de filtro -->
  </div>
</div>
```

### movies-filter.component.ts
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-movies-filter',
  standalone: true,
  imports: [],
  templateUrl: './movies-filter.component.html',
  styleUrl: './movies-filter.component.css'
})
export class MoviesFilterComponent {
  // Logica sera adicionada no proximo video
}
```

### explore-movies.component.html (depois)
```html
<div class="container">
  <h1>Explorar Filmes</h1>

  <!-- Linha 33: componente substitui 57 linhas -->
  <app-movies-filter />

  <div class="movies-grid">
    <!-- Cards de filmes -->
  </div>
</div>
```

### explore-movies.component.ts (atualizado)
```typescript
import { Component } from '@angular/core';
import { MoviesFilterComponent } from '../components/movies-filter/movies-filter.component';

@Component({
  selector: 'app-explore-movies',
  standalone: true,
  imports: [MoviesFilterComponent],
  templateUrl: './explore-movies.component.html',
  styleUrl: './explore-movies.component.css'
})
export class ExploreMoviesComponent {
  // Logica de explorar filmes (sem filtro)
}
```

## Estrutura de pastas final

```
features/
  movies/
    components/
      movies-filter/
        movies-filter.component.ts
        movies-filter.component.html
        movies-filter.component.css
    pages/
      explore-movies/
        explore-movies.component.ts
        explore-movies.component.html
        explore-movies.component.css
```

## Verificacao no DOM (DevTools)

Ao inspecionar o elemento no browser, a estrutura do DOM mostra:
```html
<div class="container">
  <h1>Explorar Filmes</h1>
  <app-movies-filter>
    <div class="md:col-span-2 w-full">
      <!-- Conteudo do filtro renderizado aqui -->
    </div>
  </app-movies-filter>
  <div class="movies-grid">...</div>
</div>
```

O elemento `<app-movies-filter>` aparece como wrapper no DOM, confirmando que o componente foi registrado e renderizado corretamente.