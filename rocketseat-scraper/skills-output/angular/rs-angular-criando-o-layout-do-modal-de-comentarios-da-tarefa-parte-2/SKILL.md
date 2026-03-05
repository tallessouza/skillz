---
name: rs-angular-layout-modal-comentarios-p2
description: "Applies Tailwind CSS patterns for comment list layouts in Angular modals. Use when user asks to 'create a comments section', 'build a comment list', 'style a modal with scrollable content', or 'layout a list with conditional borders'. Enforces flexbox organization, scroll containers with max-height, hidden scrollbars, and dynamic border visibility for last items. Make sure to use this skill whenever building comment UIs or scrollable list layouts in Angular with Tailwind. Not for comment logic, services, API integration, or Angular CDK dialog setup."
---

# Layout de Lista de Comentarios em Modal Angular

> Organize listas de comentarios com flexbox, scroll controlado e bordas condicionais usando Tailwind CSS.

## Rules

1. **Container de lista usa flex-col com overflow scroll** — `flex flex-col gap-5 overflow-scroll max-h-44 scrollbar-hidden`, porque o scroll so aparece quando o conteudo excede a altura maxima definida
2. **Cada comentario usa border-b com cor customizada** — `border-b border-[#D1D5DB]`, porque separa visualmente os itens sem ocupar espaco extra
3. **Ultimo item remove a borda inferior** — remova `border-b` e `border-color` do ultimo elemento, porque borda no final da lista cria ruido visual (depois tornar dinamico com Angular)
4. **Texto do comentario usa font-light com cor escura** — `font-light text-sm text-[#374151]`, porque diferencia o conteudo do metadata
5. **Metadata (tempo, acoes) usa text-xs com cor clara** — `text-xs text-[#9CA3AF]` para timestamp, `text-xs font-semibold underline cursor-pointer` para acoes, porque hierarquia visual guia o olho do usuario
6. **Use a utility customizada scrollbar-hidden** — oculta a barra de scroll mantendo funcionalidade, porque melhora a estetica do modal

## How to write

### Container de comentarios com scroll

```html
<!-- Container da lista de comentarios -->
<div class="flex flex-col gap-5 overflow-scroll max-h-44 scrollbar-hidden">
  <!-- Cada comentario -->
  <div class="flex flex-col gap-3 border-b border-[#D1D5DB]">
    <!-- Texto -->
    <div>
      <p class="font-light text-sm text-[#374151]">Ja finalizei!</p>
    </div>
    <!-- Metadata + acoes -->
    <div class="flex gap-4 mb-3">
      <p class="font-normal text-xs text-[#9CA3AF]">Comentado a 10 min atras</p>
      <p class="font-semibold text-xs underline underline-offset-2 cursor-pointer">Apagar</p>
    </div>
  </div>
</div>
```

## Example

**Before (sem estrutura):**
```html
<div>
  <p>Ja finalizei!</p>
  <p>10 min atras</p>
  <button>Apagar</button>
</div>
```

**After (com skill aplicada):**
```html
<div class="flex flex-col gap-5 overflow-scroll max-h-44 scrollbar-hidden">
  <div class="flex flex-col gap-3 border-b border-[#D1D5DB]">
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista de comentarios pode crescer | Use `max-h-{valor}` + `overflow-scroll` + `scrollbar-hidden` |
| Itens separados por linha | Use `border-b` com cor customizada, remova do ultimo |
| Texto principal vs metadata | Principal: `text-sm text-[#374151]`, metadata: `text-xs text-[#9CA3AF]` |
| Acao clicavel inline (ex: Apagar) | `font-semibold underline underline-offset-2 cursor-pointer` |
| Borda condicional no ultimo item | Depois tornar dinamico com diretiva Angular (ex: `[class.border-b]`) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `overflow-y: auto` inline | `overflow-scroll` + `scrollbar-hidden` classes |
| `<hr>` entre comentarios | `border-b border-[#D1D5DB]` no proprio item |
| Altura fixa no container de lista | `max-h-44` para scroll aparecer so quando necessario |
| `<button>` para acao simples de texto | `<p>` com `cursor-pointer underline` |
| Borda no ultimo item da lista | Remover `border-b` do ultimo (dinamicamente depois) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
