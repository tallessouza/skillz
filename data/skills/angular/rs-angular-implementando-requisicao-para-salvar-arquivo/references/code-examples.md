# Code Examples: Requisicoes MultipartFormData no Angular

## Exemplo do curso — Service completo

O service `MoviesService` ja tinha a URL base configurada e outros metodos. O instrutor adicionou o `createMovie` no final:

```typescript
@Injectable({ providedIn: 'root' })
export class MoviesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  // ... outros metodos (getMovies, getMovieById, etc.)

  createMovie(movieData: FormData): Observable<IMovieResponse> {
    return this.httpClient.post<IMovieResponse>(
      `${this.apiUrl}/movies`,
      movieData
    );
  }
}
```

### Pontos-chave:
- O parametro e `FormData` (tipo nativo do browser), nao uma interface custom
- O generic `<IMovieResponse>` tipa o Observable de retorno
- Nenhum header adicional e passado — Angular cuida do Content-Type

## Montagem do FormData (componente — proximo video, mas padrao universal)

```typescript
onSubmit(): void {
  const formData = new FormData();
  
  // Campos texto — todos viram string no FormData
  formData.append('title', this.title);
  formData.append('description', this.description);
  formData.append('releaseYear', this.releaseYear.toString());
  formData.append('genre', this.genre);
  
  // Campo binario — File vindo de um input[type="file"]
  if (this.selectedFile) {
    formData.append('image', this.selectedFile, this.selectedFile.name);
  }

  this.moviesService.createMovie(formData).subscribe({
    next: (movie) => {
      console.log('Filme criado:', movie);
      // redirecionar ou mostrar sucesso
    },
    error: (err) => {
      console.error('Erro ao criar filme:', err);
    }
  });
}
```

## Interface reutilizada

```typescript
export interface IMovieResponse {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  imageUrl: string;
  createdAt: string;
}
```

## Variacao — Upload com progress tracking

```typescript
import { HttpEventType } from '@angular/common/http';

createMovieWithProgress(movieData: FormData): Observable<HttpEvent<IMovieResponse>> {
  return this.httpClient.post<IMovieResponse>(
    `${this.apiUrl}/movies`,
    movieData,
    {
      reportProgress: true,
      observe: 'events'
    }
  );
}

// No componente:
this.moviesService.createMovieWithProgress(formData).subscribe((event) => {
  if (event.type === HttpEventType.UploadProgress && event.total) {
    const progress = Math.round(100 * event.loaded / event.total);
    console.log(`Upload: ${progress}%`);
  } else if (event.type === HttpEventType.Response) {
    console.log('Filme criado:', event.body);
  }
});
```

## Teste no Insomnia/Postman

O instrutor mostrou no Insomnia:
- Metodo: `POST`
- URL: `http://localhost:3000/movies`
- Body type: `Multipart Form`
- Campos texto: title, description, releaseYear, genre
- Campo file: image (selecionar arquivo binario)

O Content-Type `multipart/form-data` e adicionado automaticamente pelo cliente HTTP tambem.