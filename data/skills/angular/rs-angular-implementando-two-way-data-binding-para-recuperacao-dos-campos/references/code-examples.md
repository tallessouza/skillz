# Code Examples: Two-Way Data Binding com Signals e ngModel

## Exemplo completo do componente TypeScript

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-movie',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-movie.component.html',
})
export class CreateMovieComponent {
  // Signals para campos do formulario
  title = signal('');
  year = signal<number | undefined>(undefined);
  category = signal('');
  description = signal('');

  // Signals para imagem
  imagePreview = signal<string | undefined>(undefined);
  selectedFile = signal<File | undefined>(undefined);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Guarda o binario do arquivo
      this.selectedFile.set(file);

      // Libera URL anterior da memoria do navegador
      if (this.imagePreview()) {
        URL.revokeObjectURL(this.imagePreview()!);
      }

      // Cria URL temporaria para preview e armazena
      const objectURL = URL.createObjectURL(file);
      this.imagePreview.set(objectURL);
    }
  }

  onSave(): void {
    console.log('title', this.title());
    console.log('year', this.year());
    console.log('category', this.category());
    console.log('description', this.description());
    console.log('imagePreview', this.imagePreview());
    console.log('selectedFile', this.selectedFile());
  }
}
```

## Exemplo do template HTML

```html
<!-- Campos de texto com two-way binding via ngModel -->
<input [(ngModel)]="title" placeholder="Titulo do filme" />
<input [(ngModel)]="year" type="number" placeholder="Ano de lancamento" />
<input [(ngModel)]="category" placeholder="Categoria" />
<textarea [(ngModel)]="description" placeholder="Descricao do filme"></textarea>

<!-- Input de arquivo hidden, ativado por botao estilizado -->
<input type="file" hidden #fileInput (change)="onFileSelected($event)" />
<button (click)="fileInput.click()">Selecionar imagem</button>

<!-- Preview da imagem selecionada -->
@if (imagePreview()) {
  <img [src]="imagePreview()" alt="Preview do filme" />
}

<!-- Botao de salvar -->
<button (click)="onSave()">Salvar</button>
```

## Como funciona o fluxo de dados

```
1. Usuario digita "Breaking Bad" no input de titulo
2. ngModel detecta mudanca → chama title.set("Breaking Bad")
3. Signal title agora contem "Breaking Bad"
4. Qualquer template que usa title() e re-renderizado

5. Usuario clica "Selecionar imagem" → fileInput.click() abre Explorer
6. Usuario seleciona imagem → evento (change) dispara onFileSelected
7. onFileSelected pega event.target.files[0] → File object
8. selectedFile.set(file) → guarda binario
9. URL.createObjectURL(file) → cria "blob:http://..." URL
10. imagePreview.set(objectURL) → template atualiza <img src>
```

## Variacao: formulario com mais campos

```typescript
// O mesmo padrao se aplica para qualquer quantidade de campos
rating = signal<number | undefined>(undefined);
director = signal('');
duration = signal<number | undefined>(undefined); // em minutos
releaseDate = signal('');
tags = signal('');
```

```html
<input [(ngModel)]="rating" type="number" placeholder="Nota (1-10)" />
<input [(ngModel)]="director" placeholder="Diretor" />
<input [(ngModel)]="duration" type="number" placeholder="Duracao (min)" />
<input [(ngModel)]="releaseDate" type="date" />
<input [(ngModel)]="tags" placeholder="Tags separadas por virgula" />
```

## Variacao: cleanup no destroy do componente

```typescript
import { Component, signal, OnDestroy } from '@angular/core';

export class CreateMovieComponent implements OnDestroy {
  imagePreview = signal<string | undefined>(undefined);

  ngOnDestroy(): void {
    // Cleanup ao sair do componente tambem
    if (this.imagePreview()) {
      URL.revokeObjectURL(this.imagePreview()!);
    }
  }
}
```

## URL gerada pelo createObjectURL

Quando `URL.createObjectURL(file)` e chamado, o navegador gera algo como:
```
blob:http://localhost:4200/3a7b8c9d-1234-5678-abcd-ef0123456789
```

Essa URL:
- So funciona no navegador que a criou
- Aponta para o arquivo na memoria
- Pode ser usada em `<img src>`, `<video src>`, `<a href>`, etc.
- Deve ser revogada com `URL.revokeObjectURL()` quando nao for mais necessaria