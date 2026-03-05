# Code Examples: Binding de Detalhes do Filme

## Exemplo completo do componente TypeScript

```typescript
import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent {
  readonly baseUrl = 'http://localhost:3000';

  // Resource HTTP (configurado em aula anterior)
  movieDetailsResource = httpResource<Movie>({
    // ... configuracao do resource
  });

  // LinkedSignal para permitir atualizacoes futuras (ex: rating)
  movieDetails = linkedSignal(() => {
    const errorOnResponse = !!this.movieDetailsResource.error();
    if (errorOnResponse) {
      return undefined;
    }
    return this.movieDetailsResource.value();
  });
}
```

## Template HTML completo (secao de detalhes)

```html
<!-- Imagem do filme -->
<img [src]="baseUrl + movieDetails()?.imagePath" alt="Movie poster" />

<!-- Titulo -->
<h1>{{ movieDetails()?.title }}</h1>

<!-- Favorito (logica implementada em aula posterior) -->
<!-- <button>...</button> -->

<!-- Categoria/Genero -->
<p>{{ movieDetails()?.genre }}</p>

<!-- Ano de lancamento -->
<p>{{ movieDetails()?.releaseYear }}</p>

<!-- Media de avaliacoes (secao adicionada nesta aula) -->
<p class="text-lg text-grey-400">
  Média de avaliações:
  <span class="text-white font-medium">
    {{ movieDetails()?.voteAverage | number:'1.0-1':'pt-BR' }}
  </span>
  <span class="text-sm text-grey-500">
    ({{ movieDetails()?.voteCount }} avaliações)
  </span>
</p>

<!-- Estrelas de rating (logica implementada em aula posterior) -->
<!-- SVGs das estrelas -->

<!-- Descricao do filme -->
<p>{{ movieDetails()?.description }}</p>
```

## Variacoes do DecimalPipe

```html
<!-- Uma casa decimal, locale BR: 3.333 → 3,3 -->
{{ value | number:'1.0-1':'pt-BR' }}

<!-- Duas casas decimais fixas: 3.3 → 3,30 -->
{{ value | number:'1.2-2':'pt-BR' }}

<!-- Sem casas decimais: 3.7 → 4 -->
{{ value | number:'1.0-0':'pt-BR' }}

<!-- Com separador de milhar: 1500 → 1.500 -->
{{ value | number:'1.0-0':'pt-BR' }}
```

## Property binding vs interpolacao — quando usar cada

```html
<!-- CORRETO: property binding para atributos que recebem expressoes -->
<img [src]="baseUrl + movieDetails()?.imagePath" />
<a [href]="'/movies/' + movieDetails()?.id">Ver</a>
<div [class.active]="isActive()">...</div>

<!-- CORRETO: interpolacao para conteudo de texto -->
<h1>{{ movieDetails()?.title }}</h1>
<p>{{ movieDetails()?.description }}</p>
<span>{{ movieDetails()?.voteCount }} avaliações</span>

<!-- ERRADO: interpolacao em atributo (funciona mas nao recomendado) -->
<img src="{{ baseUrl + movieDetails()?.imagePath }}" />
```

## Testando com diferentes filmes

O instrutor demonstra navegando entre Matrix e Interestelar, verificando que:
- Imagem atualiza corretamente
- Titulo muda
- Ano, genero e descricao refletem o filme selecionado
- Media e contagem de avaliacoes formatam corretamente

Isso valida que o `linkedSignal` reage corretamente a mudancas no resource quando o parametro de rota muda.