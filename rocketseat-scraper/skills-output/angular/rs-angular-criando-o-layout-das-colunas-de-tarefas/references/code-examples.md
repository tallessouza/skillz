# Code Examples: Layout de Colunas de Tarefas

## 1. Componente main-content (HTML)

Substituicao da div placeholder pelo componente real:

```html
<!-- main-content.component.html -->
<!-- ANTES: div placeholder -->
<div class="bg-blue-700 p-4">Colunas aqui</div>

<!-- DEPOIS: componente real -->
<app-tasklistsection></app-tasklistsection>
```

O componente e importado automaticamente no `main-content.component.ts` pelo Angular CLI.

## 2. Template completo do task-list-section

```html
<!-- task-list-section.component.html -->
<div class="flex overflow-x-auto scrollbar-hidden">

  <!-- Coluna: A fazer -->
  <div class="flex-1 min-w-[240px] py-3 px-6 flex flex-col gap-6">
    <div class="py-2 border-b border-[#d1d5db] flex items-center gap-1">
      <h1 class="font-bold">A fazer</h1>
      <span class="text-xl font-semibold text-white bg-black py-1 px-2 rounded-xl">
        1
      </span>
    </div>
    <div class="flex flex-col gap-4">
      <!-- tarefa -->
      <div class="bg-blue-300 p-3">Tarefa 1</div>
      <div class="bg-blue-300 p-3">Tarefa 2</div>
      <div class="bg-blue-300 p-3">Tarefa 3</div>
    </div>
  </div>

  <!-- Coluna: Fazendo -->
  <div class="flex-1 min-w-[240px] py-3 px-6 flex flex-col gap-6">
    <div class="py-2 border-b border-[#d1d5db] flex items-center gap-1">
      <h1 class="font-bold">Fazendo</h1>
      <span class="text-xl font-semibold text-white bg-[#FF850A] py-1 px-2 rounded-xl">
        0
      </span>
    </div>
    <div class="flex flex-col gap-4">
      <!-- tarefas futuras -->
    </div>
  </div>

  <!-- Coluna: Concluído -->
  <div class="flex-1 min-w-[240px] py-3 px-6 flex flex-col gap-6">
    <div class="py-2 border-b border-[#d1d5db] flex items-center gap-1">
      <h1 class="font-bold">Concluído</h1>
      <span class="text-xl font-semibold text-white bg-[#15BE78] py-1 px-2 rounded-xl">
        0
      </span>
    </div>
    <div class="flex flex-col gap-4">
      <!-- tarefas concluidas -->
    </div>
  </div>

</div>
```

## 3. Utility scrollbar-hidden no styles.css global

```css
/* styles.css */
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

Uso: adicionar a classe `scrollbar-hidden` em qualquer elemento com scroll.

## 4. Evolucao passo a passo

### Passo 1: Divs empilhadas (sem flex)
```html
<div>
  <div class="bg-amber-300 p-3">Coluna 1</div>
  <div class="bg-amber-500 p-3">Coluna 2</div>
  <div class="bg-amber-700 p-3">Coluna 3</div>
</div>
```
Resultado: colunas uma embaixo da outra.

### Passo 2: Adicionando flex no pai
```html
<div class="flex">
  <div class="bg-amber-300 p-3">Coluna 1</div>
  ...
</div>
```
Resultado: colunas lado a lado, mas comprimidas.

### Passo 3: flex-1 nas filhas
```html
<div class="flex">
  <div class="flex-1 bg-amber-300 p-3">Coluna 1</div>
  ...
</div>
```
Resultado: colunas distribuidas igualmente.

### Passo 4: min-w + overflow-x-auto
```html
<div class="flex overflow-x-auto">
  <div class="flex-1 min-w-[240px] py-3 px-6">Coluna 1</div>
  ...
</div>
```
Resultado: scroll horizontal em telas pequenas.

### Passo 5: scrollbar-hidden
```html
<div class="flex overflow-x-auto scrollbar-hidden">
```
Resultado: scroll funcional sem barra visivel.

## 5. Mapeamento Tailwind → valores CSS

| Classe Tailwind | Valor CSS |
|----------------|-----------|
| `py-2` | `padding-top: 8px; padding-bottom: 8px` |
| `py-3` | `padding-top: 12px; padding-bottom: 12px` |
| `px-6` | `padding-left: 24px; padding-right: 24px` |
| `px-2` | `padding-left: 8px; padding-right: 8px` |
| `py-1` | `padding-top: 4px; padding-bottom: 4px` |
| `gap-1` | `gap: 4px` |
| `gap-4` | `gap: 16px` |
| `gap-6` | `gap: 24px` |
| `mb-6` | `margin-bottom: 24px` |
| `p-3` | `padding: 12px` |
| `min-w-[240px]` | `min-width: 240px` |
| `text-xl` | `font-size: 12px` (nota: na aula o instrutor menciona 12px) |
| `rounded-xl` | `border-radius: 12px` |
| `font-semibold` | `font-weight: 600` |