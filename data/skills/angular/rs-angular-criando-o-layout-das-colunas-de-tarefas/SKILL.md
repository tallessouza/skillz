---
name: rs-angular-layout-colunas-tarefas
description: "Applies Tailwind CSS column layout patterns when building Angular task board interfaces. Use when user asks to 'create a kanban board', 'build task columns', 'layout status columns', 'create a board with drag columns', or 'build a task management UI'. Enforces flexbox column organization, responsive horizontal scroll, scrollbar hiding utility, and proper component decomposition. Make sure to use this skill whenever creating multi-column status-based layouts in Angular with Tailwind. Not for backend logic, drag-and-drop functionality, or task CRUD operations."
---

# Layout de Colunas de Tarefas (Angular + Tailwind)

> Organizar colunas de status com flexbox, scroll horizontal responsivo e utility customizado para esconder scrollbar.

## Rules

1. **Separe colunas em componente proprio** — crie um componente `task-list-section` e importe no `main-content`, porque isolar a responsabilidade facilita manutencao
2. **Use flex + flex-1 para colunas lado a lado** — a div pai recebe `flex` e cada coluna recebe `flex-1`, porque garante distribuicao igual do espaco
3. **Defina largura minima nas colunas** — aplique `min-w-[240px]` em cada coluna, porque impede que fiquem comprimidas em telas pequenas
4. **Habilite scroll horizontal na div pai** — use `overflow-x-auto` na div container, porque permite navegacao em mobile sem quebrar layout
5. **Esconda scrollbar com utility Tailwind** — crie `scrollbar-hidden` via `@utility` no `styles.css`, porque mantem visual limpo sem perder funcionalidade de scroll
6. **Organize cada coluna com flex-col e gap** — aplique `flex flex-col gap-6` na coluna para separar header e area de tarefas, porque evita margins avulsas e mantem consistencia

## How to write

### Estrutura do container de colunas

```html
<!-- div pai: flex + scroll horizontal -->
<div class="flex overflow-x-auto scrollbar-hidden">
  <!-- cada coluna: flex-1 + largura minima -->
  <div class="flex-1 min-w-[240px] py-3 px-6 flex flex-col gap-6">
    <!-- header da coluna -->
    <!-- area de tarefas -->
  </div>
</div>
```

### Header da coluna com badge de contagem

```html
<div class="py-2 border-b border-[#d1d5db] flex items-center gap-1">
  <h1 class="font-bold">A fazer</h1>
  <span class="text-xl font-semibold text-white bg-black py-1 px-2 rounded-xl">
    1
  </span>
</div>
```

### Area de tarefas com espaçamento

```html
<div class="flex flex-col gap-4">
  <!-- cards de tarefa aqui -->
</div>
```

### Utility scrollbar-hidden (styles.css)

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

## Example

**Before (colunas empilhadas sem scroll):**
```html
<div>
  <div class="bg-gray-100 p-4">A fazer</div>
  <div class="bg-gray-100 p-4">Fazendo</div>
  <div class="bg-gray-100 p-4">Concluído</div>
</div>
```

**After (com this skill applied):**
```html
<div class="flex overflow-x-auto scrollbar-hidden">
  <div class="flex-1 min-w-[240px] py-3 px-6 flex flex-col gap-6">
    <div class="py-2 border-b border-[#d1d5db] flex items-center gap-1">
      <h1 class="font-bold">A fazer</h1>
      <span class="text-xl font-semibold text-white bg-black py-1 px-2 rounded-xl">1</span>
    </div>
    <div class="flex flex-col gap-4">
      <!-- tarefas -->
    </div>
  </div>
  <div class="flex-1 min-w-[240px] py-3 px-6 flex flex-col gap-6">
    <div class="py-2 border-b border-[#d1d5db] flex items-center gap-1">
      <h1 class="font-bold">Fazendo</h1>
      <span class="text-xl font-semibold text-white bg-[#FF850A] py-1 px-2 rounded-xl">0</span>
    </div>
    <div class="flex flex-col gap-4"></div>
  </div>
  <div class="flex-1 min-w-[240px] py-3 px-6 flex flex-col gap-6">
    <div class="py-2 border-b border-[#d1d5db] flex items-center gap-1">
      <h1 class="font-bold">Concluído</h1>
      <span class="text-xl font-semibold text-white bg-[#15BE78] py-1 px-2 rounded-xl">0</span>
    </div>
    <div class="flex flex-col gap-4"></div>
  </div>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tela mobile (< 390px) | Scroll horizontal com `overflow-x-auto` |
| Tela desktop | Colunas expandem com `flex-1`, sem scroll |
| Badge de contagem | `span` com `rounded-xl`, bg da cor do status |
| Cores por status | Preto (a fazer), `#FF850A` (fazendo), `#15BE78` (concluido) |
| Scrollbar visivel | Aplicar utility `scrollbar-hidden` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `display: inline-block` nas colunas | `flex` no pai + `flex-1` nas filhas |
| `width: 33%` fixo | `flex-1` + `min-w-[240px]` |
| `margin-right` entre colunas | `gap` no container flex |
| `overflow: hidden` no container | `overflow-x-auto` para permitir scroll |
| `::-webkit-scrollbar` inline no componente | `@utility scrollbar-hidden` no `styles.css` global |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
