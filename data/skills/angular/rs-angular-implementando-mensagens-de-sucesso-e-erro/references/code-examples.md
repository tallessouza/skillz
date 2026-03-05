# Code Examples: Mensagens de Sucesso e Erro

## Componente completo (CreateMovieComponent)

```typescript
import { Component, computed } from '@angular/core';
import { setErrorMessage } from '../../utils/set-error-message';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
})
export class CreateMovieComponent {
  // rxResource para criacao do filme (definido em outro lugar do componente)
  createMovieResource = rxResource({
    // ... configuracao do resource
  });

  // Signal de erro: derivado do error signal do resource
  errorMessage = computed(() =>
    setErrorMessage(this.createMovieResource.error())
  );

  // Signal de sucesso: derivado do hasValue signal do resource
  successMessage = computed(() => {
    const successCreation = this.createMovieResource.hasValue();
    return successCreation ? 'Filme criado com sucesso' : undefined;
  });
}
```

## Template completo

```html
<!-- Botao de salvar -->
<div>
  <button type="submit">Salvar</button>
</div>

<!-- Mensagens de feedback -->
<div class="flex justify-end">
  @if (errorMessage()) {
    <p class="text-red-500">{{ errorMessage() }}</p>
  } @else if (successMessage()) {
    <p class="text-green-500">{{ successMessage() }}</p>
  } @else {
    <p></p>
  }
</div>
```

## Utilitario setErrorMessage (referenciado)

```typescript
// utils/set-error-message.ts
import { HttpErrorResponse } from '@angular/common/http';

export function setErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Sem conexão com a internet ou servidor offline';
    }
    // Extrai mensagem do body da resposta
    return error.error?.message || 'Erro desconhecido';
  }

  return 'Erro desconhecido';
}
```

## Variacao: mensagem de sucesso customizada por contexto

```typescript
// Para diferentes operacoes, mude apenas a string
successMessage = computed(() => {
  const success = this.updateMovieResource.hasValue();
  return success ? 'Filme atualizado com sucesso' : undefined;
});
```

## Variacao: reutilizando o padrao de template

O instrutor mostra que o mesmo bloco `@if/@else if/@else` e copiado entre componentes (register form → create movie), trocando apenas os nomes dos signals. Isso sugere que o padrao e estavel o suficiente para ser um snippet reutilizavel.