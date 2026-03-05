# Code Examples: Layout de Modal de Comentarios

## Exemplo completo do template HTML

Este e o codigo completo desenvolvido na aula, representando o `task-comments-modal.component.html`:

```html
<div class="rounded-xl overflow-y-scroll bg-white max-h-[500px] scrollbar-hidden">
  <!-- SECAO 1: Header -->
  <div class="p-4 flex gap-1">
    <img src="images/icon-task-star.svg" />
    <h1 class="font-semibold text-lg">Comentar tarefa</h1>
    <img src="images/icon-close.svg" class="ml-auto cursor-pointer" />
  </div>

  <!-- SECAO 2: Detalhes da tarefa -->
  <div class="p-4 border-t border-[#D1D5DB]">
    <h1 class="font-semibold text-lg mb-4">Minha nova tarefa</h1>
    <p class="font-semibold text-sm mb-2">Descrição</p>
    <p class="font-normal text-base text-[#374151]">
      Essa é a minha tarefa para criar um projeto Angular.
    </p>
  </div>

  <!-- SECAO 3: Area de comentarios -->
  <div class="p-4">
    <div class="bg-[#F3F4F6] p-5 rounded-xl flex flex-col gap-5">
      <!-- Titulo da secao -->
      <div>
        <p class="font-bold text-sm">Comentários</p>
      </div>

      <!-- Input + Botao -->
      <div class="flex items-start gap-2">
        <div class="flex flex-col w-full">
          <input
            type="text"
            placeholder="Adicione um comentário"
            class="rounded-lg border border-[#D1D5DB] p-3 bg-white flex-1 text-sm font-light"
          />
          <p class="font-semibold text-sm text-red-500">O campo é obrigatório.</p>
        </div>
        <button
          class="bg-blue-500 text-white rounded-lg px-4 py-3 font-semibold text-sm cursor-pointer"
        >
          Adicionar
        </button>
      </div>

      <!-- Terceira div: lista de comentarios (proximo video) -->
    </div>
  </div>
</div>
```

## Import no app.component.ts

```typescript
// app.component.ts - importacao temporaria do modal
import { TaskCommentsModalComponent } from './task-comments-modal/task-comments-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // ... outros componentes
    TaskCommentsModalComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

## Uso no app.component.html

```html
<!-- app.component.html - uso temporario ate configurar Angular CDK -->
<app-comments-task-comments-modal></app-comments-task-comments-modal>
```

## Padrao de botao reutilizado

O botao "Adicionar" foi copiado do `taskform-modal.component.html`, apenas alterando o texto:

```html
<!-- Original no taskform-modal (criar tarefa) -->
<button type="submit" class="bg-blue-500 text-white rounded-lg px-4 py-3 font-semibold text-sm cursor-pointer">
  Criar tarefa
</button>

<!-- Adaptado no comments modal (adicionar comentario) -->
<button class="bg-blue-500 text-white rounded-lg px-4 py-3 font-semibold text-sm cursor-pointer">
  Adicionar
</button>
```

Note que o `type="submit"` foi removido porque este botao nao faz parte de um formulario tradicional.

## Classe CSS customizada: scrollbar-hidden

Classe criada anteriormente no projeto para esconder a scrollbar:

```css
/* styles.css ou similar */
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

## Variacao: secao de conteudo com dados dinamicos

```html
<!-- Versao futura com dados dinamicos -->
<div class="p-4 border-t border-[#D1D5DB]">
  <h1 class="font-semibold text-lg mb-4">{{ task.title }}</h1>
  <p class="font-semibold text-sm mb-2">Descrição</p>
  <p class="font-normal text-base text-[#374151]">{{ task.description }}</p>
</div>
```