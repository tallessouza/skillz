# Code Examples: Layout de Mensagem de Estado Vazio

## Exemplo completo da aula

### HTML do componente task-list-section

```html
<!-- task-list-section.component.html -->

<!-- ... conteudo existente da lista de tarefas ... -->

<!-- Empty state: adicionado no final do template, fora de qualquer div filha -->
<div class="bg-[#FAFAFA] rounded-sm py-3 px-5 border-l-4 border-black">
  <p class="font-semibold text-lg text-[#9CA3AF]">
    Nenhuma tarefa disponível no momento.
  </p>
</div>
```

### Classes Tailwind utilizadas e seus valores

```css
/* Mapeamento das classes para CSS puro */

/* Na div container */
bg-[#FAFAFA]    → background-color: #FAFAFA;
rounded-sm      → border-radius: 4px;         /* 0.125rem */
py-3            → padding-top: 0.75rem; padding-bottom: 0.75rem;
px-5            → padding-left: 1.25rem; padding-right: 1.25rem;
border-l-4      → border-left-width: 4px; border-left-style: solid;
border-black    → border-left-color: #000000;

/* No paragrafo */
font-semibold   → font-weight: 600;
text-lg         → font-size: 1.125rem; /* 18px */ line-height: 1.75rem;
text-[#9CA3AF]  → color: #9CA3AF;
```

## Variacoes para outros contextos

### Empty state para lista de comentarios

```html
<div class="bg-[#FAFAFA] rounded-sm py-3 px-5 border-l-4 border-black">
  <p class="font-semibold text-lg text-[#9CA3AF]">
    Nenhum comentário adicionado ainda.
  </p>
</div>
```

### Empty state com condicional Angular (versao futura)

```html
@if (tasks.length === 0) {
  <div class="bg-[#FAFAFA] rounded-sm py-3 px-5 border-l-4 border-black">
    <p class="font-semibold text-lg text-[#9CA3AF]">
      Nenhuma tarefa disponível no momento.
    </p>
  </div>
}
```

### Versao com *ngIf (sintaxe legacy)

```html
<div
  *ngIf="tasks.length === 0"
  class="bg-[#FAFAFA] rounded-sm py-3 px-5 border-l-4 border-black"
>
  <p class="font-semibold text-lg text-[#9CA3AF]">
    Nenhuma tarefa disponível no momento.
  </p>
</div>
```

## Commit de referencia

[Commit 91797802](https://github.com/rocketseat-education/Projeto-GoTask/commit/91797802e86f27b2ff9d5cf04a34329ad67a18d6)