# Code Examples: Layout de Lista de Comentarios

## Estrutura completa do bloco de comentarios

```html
<!-- Secao de comentarios dentro do modal -->
<div class="flex flex-col gap-5 overflow-scroll max-h-44 scrollbar-hidden">

  <!-- Comentario 1 -->
  <div class="flex flex-col gap-3 border-b border-[#D1D5DB]">
    <div>
      <p class="font-light text-sm text-[#374151]">Ja finalizei!</p>
    </div>
    <div class="flex gap-4 mb-3">
      <p class="font-normal text-xs text-[#9CA3AF]">Comentado a 10 min atras</p>
      <p class="font-semibold text-xs underline underline-offset-2 cursor-pointer">Apagar</p>
    </div>
  </div>

  <!-- Comentario 2 -->
  <div class="flex flex-col gap-3 border-b border-[#D1D5DB]">
    <div>
      <p class="font-light text-sm text-[#374151]">Ja finalizei!</p>
    </div>
    <div class="flex gap-4 mb-3">
      <p class="font-normal text-xs text-[#9CA3AF]">Comentado a 10 min atras</p>
      <p class="font-semibold text-xs underline underline-offset-2 cursor-pointer">Apagar</p>
    </div>
  </div>

  <!-- Ultimo comentario (SEM border-b) -->
  <div class="flex flex-col gap-3">
    <div>
      <p class="font-light text-sm text-[#374151]">Ja finalizei!</p>
    </div>
    <div class="flex gap-4 mb-3">
      <p class="font-normal text-xs text-[#9CA3AF]">Comentado a 10 min atras</p>
      <p class="font-semibold text-xs underline underline-offset-2 cursor-pointer">Apagar</p>
    </div>
  </div>

</div>
```

## Versao dinamica com *ngFor (preparacao para proxima aula)

```html
<div class="flex flex-col gap-5 overflow-scroll max-h-44 scrollbar-hidden">
  <div
    *ngFor="let comment of comments; last as isLast"
    class="flex flex-col gap-3"
    [class.border-b]="!isLast"
    [class.border-[#D1D5DB]]="!isLast"
  >
    <div>
      <p class="font-light text-sm text-[#374151]">{{ comment.text }}</p>
    </div>
    <div class="flex gap-4 mb-3">
      <p class="font-normal text-xs text-[#9CA3AF]">
        Comentado a {{ comment.timeAgo }}
      </p>
      <p class="font-semibold text-xs underline underline-offset-2 cursor-pointer">
        Apagar
      </p>
    </div>
  </div>
</div>
```

## Cores customizadas usadas

| Variavel | Hex | Uso |
|----------|-----|-----|
| Borda entre comentarios | `#D1D5DB` | `border-[#D1D5DB]` — cinza claro |
| Texto do comentario | `#374151` | `text-[#374151]` — cinza escuro |
| Texto de metadata | `#9CA3AF` | `text-[#9CA3AF]` — cinza medio |

## Utility customizada referenciada

```css
/* Em styles.css ou globals.css */
@layer utilities {
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```