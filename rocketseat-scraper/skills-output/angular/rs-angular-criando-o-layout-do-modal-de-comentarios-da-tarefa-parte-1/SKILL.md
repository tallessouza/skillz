---
name: rs-angular-layout-modal-comentarios-p1
description: "Applies Angular modal layout patterns with Tailwind CSS when building comment modals or dialog components. Use when user asks to 'create a modal', 'build a comments section', 'layout a dialog', 'style a modal with Tailwind', or 'create a task detail view'. Enforces section-based layout division (header, content, comments), consistent spacing with Tailwind utility classes, and component reuse patterns. Make sure to use this skill whenever creating modal or dialog layouts in Angular projects with Tailwind. Not for modal logic, CDK overlay setup, or form validation behavior."
---

# Layout de Modal de Comentarios em Angular

> Divida modais em secoes visuais claras (header, conteudo, interacao), cada uma em sua propria div com responsabilidades bem definidas.

## Rules

1. **Divida o modal em 3 secoes distintas** — header, conteudo principal, area de interacao, porque facilita manutencao e corresponde ao design visual do Figma
2. **Reutilize estilos de componentes existentes** — copie classes de botoes e inputs de modais ja criados, porque garante consistencia visual sem retrabalho
3. **Use max-height com overflow scroll** — `max-h-[500px]` + `overflow-y-scroll` + `scrollbar-hidden`, porque impede que o modal cresca indefinidamente com conteudo dinamico
4. **Prefira margin-bottom a gap quando espacamentos diferem** — use `mb-4` e `mb-2` individuais ao inves de `gap` uniforme, porque cada elemento pode precisar de espacamento diferente
5. **Separe secoes com border-top** — use `border-t` + cor personalizada entre secoes, porque cria divisao visual clara sem elementos extras
6. **Importe componentes no app component temporariamente** — enquanto nao usar Angular CDK, coloque o modal direto no app component HTML e TS, porque permite desenvolvimento incremental

## How to write

### Estrutura principal do modal

```html
<div class="rounded-xl overflow-y-scroll bg-white max-h-[500px] scrollbar-hidden">
  <!-- Header -->
  <div class="p-4 flex gap-1">
    <img [src]="'images/icon-task-star.svg'" />
    <h1 class="font-semibold text-lg">Comentar tarefa</h1>
    <img src="images/icon-close.svg" class="ml-auto cursor-pointer" />
  </div>

  <!-- Conteudo da tarefa -->
  <div class="p-4 border-t border-[#D1D5DB]">
    <h1 class="font-semibold text-lg mb-4">{{ taskTitle }}</h1>
    <p class="font-semibold text-sm mb-2">Descrição</p>
    <p class="font-normal text-base text-[#374151]">{{ taskDescription }}</p>
  </div>

  <!-- Area de comentarios -->
  <div class="p-4">
    <div class="bg-[#F3F4F6] p-5 rounded-xl flex flex-col gap-5">
      <!-- Titulo, input e lista de comentarios -->
    </div>
  </div>
</div>
```

### Area de input com botao

```html
<div class="flex items-start gap-2">
  <div class="flex flex-col w-full">
    <input
      type="text"
      placeholder="Adicione um comentário"
      class="rounded-lg border border-[#D1D5DB] p-3 bg-white flex-1 text-sm font-light"
    />
    <p class="font-semibold text-sm text-red-500">O campo é obrigatório.</p>
  </div>
  <button class="bg-blue-500 text-white rounded-lg px-4 py-3 font-semibold text-sm">
    Adicionar
  </button>
</div>
```

## Example

**Before (modal sem estrutura):**
```html
<div>
  <h1>Comentarios</h1>
  <input type="text" />
  <button>Enviar</button>
  <div><!-- comentarios aqui --></div>
</div>
```

**After (com este skill aplicado):**
```html
<div class="rounded-xl overflow-y-scroll bg-white max-h-[500px] scrollbar-hidden">
  <div class="p-4 flex gap-1">
    <img src="images/icon-task-star.svg" />
    <h1 class="font-semibold text-lg">Comentar tarefa</h1>
    <img src="images/icon-close.svg" class="ml-auto cursor-pointer" />
  </div>
  <div class="p-4 border-t border-[#D1D5DB]">
    <h1 class="font-semibold text-lg mb-4">Minha nova tarefa</h1>
    <p class="font-semibold text-sm mb-2">Descrição</p>
    <p class="font-normal text-base text-[#374151]">Descricao da tarefa.</p>
  </div>
  <div class="p-4">
    <div class="bg-[#F3F4F6] p-5 rounded-xl flex flex-col gap-5">
      <div><p class="font-bold text-sm">Comentários</p></div>
      <div class="flex items-start gap-2">
        <div class="flex flex-col w-full">
          <input type="text" placeholder="Adicione um comentário"
            class="rounded-lg border border-[#D1D5DB] p-3 bg-white flex-1 text-sm font-light" />
        </div>
        <button class="bg-blue-500 text-white rounded-lg px-4 py-3 font-semibold text-sm">Adicionar</button>
      </div>
    </div>
  </div>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Espacamento igual entre todos os filhos | Use `gap` na div pai |
| Espacamentos diferentes entre filhos | Use `mb-*` individual em cada elemento |
| Botao identico a outro componente | Copie as classes do botao existente |
| Modal pode crescer com conteudo | Defina `max-h-[Xpx]` + overflow scroll |
| Icone deve ficar no canto direito | Use `ml-auto` no elemento |
| Input e botao lado a lado | Use `flex items-start gap-2` no container |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Modal sem altura maxima | `max-h-[500px] overflow-y-scroll` |
| Secoes sem separacao visual | `border-t border-[#D1D5DB]` entre secoes |
| Scrollbar visivel no modal | Adicione classe `scrollbar-hidden` |
| Input sem flex-1 ao lado de botao | `flex-1` no input para ocupar espaco disponivel |
| Cores hardcoded repetidas | Reutilize as mesmas cores personalizadas do projeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
