# Code Examples: FormData com RxResource no Angular

## Exemplo completo do componente

```typescript
import { Component, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { MoviesApiService } from '../../services/movies-api.service';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
})
export class CreateMovieComponent {
  private readonly _moviesApi = inject(MoviesApiService);

  // Propriedades do formulário (vindas de inputs/selects do template)
  title = '';
  description = '';
  year: number | undefined;
  category = '';
  selectedFile: File | undefined;

  // Signal que controla o disparo da requisição
  movieFormData = signal<FormData | undefined>(undefined);

  // RxResource reativo — só executa quando movieFormData muda de undefined
  createMovieResource = rxResource({
    params: () => this.movieFormData(),
    stream: ({ params }) => this._moviesApi.createMovie(params),
  });

  save() {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('anoLancamento', this.year?.toString() ?? '');
    formData.append('category', this.category);
    formData.append('image', this.selectedFile ?? '');

    this.movieFormData.set(formData);
  }
}
```

## Service correspondente

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MoviesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/movies';

  createMovie(formData: FormData) {
    // Não definir Content-Type — Angular gera automaticamente com boundary
    return this.http.post(this.baseUrl, formData);
  }
}
```

## Variação: com feedback de sucesso

```typescript
save() {
  const formData = new FormData();
  formData.append('title', this.title);
  formData.append('description', this.description);
  formData.append('anoLancamento', this.year?.toString() ?? '');
  formData.append('category', this.category);
  formData.append('image', this.selectedFile ?? '');

  this.movieFormData.set(formData);

  // Verificar status do resource para feedback
  effect(() => {
    if (this.createMovieResource.hasValue()) {
      // Redirecionar ou mostrar toast de sucesso
    }
  });
}
```

## Variação: múltiplos arquivos

```typescript
// Se o backend aceitar múltiplos arquivos
const formData = new FormData();
formData.append('title', this.title);

// Múltiplas imagens
this.selectedFiles.forEach((file, index) => {
  formData.append('images', file); // mesmo nome, múltiplos appends
});
```

## Padrão de signal undefined como gate

```typescript
// Padrão reutilizável: signal undefined = não executa
// Qualquer resource de escrita (POST/PUT/DELETE) pode usar

// POST
createResource = rxResource({
  params: () => this.createPayload(),
  stream: ({ params }) => this.api.create(params),
});

// PUT
updateResource = rxResource({
  params: () => this.updatePayload(),
  stream: ({ params }) => this.api.update(params),
});

// DELETE
deleteResource = rxResource({
  params: () => this.deleteId(),
  stream: ({ params }) => this.api.delete(params),
});
```

## Verificando no DevTools

O instrutor demonstra a verificação:

1. **Network tab** — Ao carregar o componente, nenhuma chamada POST aparece
2. **Clicar em Salvar** — POST aparece com status 201
3. **Request Headers** — `Content-Type: multipart/form-data; boundary=...` (automático)
4. **Payload** — FormData com todos os campos populados
5. **Response** — Objeto do filme criado com ID gerado pelo backend