---
name: rs-full-stack-customizando-scroll
description: "Enforces custom scrollbar styling with Tailwind CSS utility classes and WebKit CSS properties when building scrollable containers, dashboards, or card lists. Use when user asks to 'customize scrollbar', 'add scroll to container', 'style scrollbar', 'overflow scroll', or 'dashboard card list'. Applies max-height with overflow-y-scroll, WebKit scrollbar-width, thumb and track styling. Make sure to use this skill whenever implementing scrollable areas in any UI. Not for infinite scroll logic, virtual lists, or JavaScript scroll event handling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-tailwind
  tags: [css, scrollbar, tailwind, webkit, overflow, customization]
---

# Customizando Scroll

> Containers com scroll devem ter altura máxima definida, overflow vertical condicional, e scrollbar customizada via WebKit CSS para manter consistência visual.

## Rules

1. **Defina altura máxima no container** — use classe ou valor arbitrário como `max-h-[420px]`, porque sem limite de altura o scroll nunca ativa
2. **Use overflow-y-auto, não overflow-y-scroll** — `overflow-y-auto` só mostra a scrollbar quando o conteúdo excede o container, evitando barra fantasma
3. **Customize scrollbar no CSS global** — use `@layer base` ou diretamente no `index.css` com pseudo-elementos WebKit, porque scrollbar styling não tem classes Tailwind nativas
4. **Separe scrollbar, thumb e track** — `::-webkit-scrollbar` controla o todo (largura), `::-webkit-scrollbar-thumb` é o indicador arrastável, `::-webkit-scrollbar-track` é o fundo da barra
5. **Track transparente por padrão** — deixe `background-color: transparent` na track para visual limpo, porque o fundo padrão do browser é cinza e quebra o design
6. **Largura slim na scrollbar** — use `width: 0.4rem` ou similar para scrollbars discretas que não competem visualmente com o conteúdo

## How to write

### Container scrollável com Tailwind

```tsx
<div className="mt-6 flex flex-col gap-4 max-h-[420px] overflow-y-auto">
  {items.map(item => (
    <Card key={item.id} data={item} />
  ))}
</div>
```

### Customização global da scrollbar (index.css)

```css
/* Scrollbar como um todo — define largura */
::-webkit-scrollbar {
  width: 0.4rem;
}

/* Thumb — o indicador arrastável */
::-webkit-scrollbar-thumb {
  background: #e4e9;
}

/* Track — o fundo atrás da thumb */
::-webkit-scrollbar-track {
  background-color: transparent;
}
```

## Example

**Before (scroll padrão do browser):**
```tsx
<div className="mt-6 flex flex-col gap-4">
  {refunds.map(refund => (
    <RefundItem key={refund.id} data={refund} />
  ))}
</div>
```

**After (com scroll customizado):**
```tsx
// Container com altura máxima e overflow condicional
<div className="mt-6 flex flex-col gap-4 max-h-[420px] overflow-y-auto">
  {refunds.map(refund => (
    <RefundItem key={refund.id} data={refund} />
  ))}
</div>
```

```css
/* index.css — scrollbar customizada */
::-webkit-scrollbar {
  width: 0.4rem;
}

::-webkit-scrollbar-thumb {
  background: #e4e9;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Lista de cards em dashboard | `max-h-[valor]` + `overflow-y-auto` + scrollbar custom |
| Poucos itens no container | Scrollbar desaparece naturalmente com `overflow-y-auto` |
| Sidebar com menu longo | Mesmo padrão: max-height + overflow-y-auto |
| Precisa scrollbar horizontal | Use `overflow-x-auto` + `max-w-[valor]` no eixo correto |
| Browser não-WebKit (Firefox) | Adicione `scrollbar-width: thin` e `scrollbar-color` como fallback |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `overflow-y-scroll` (barra sempre visível) | `overflow-y-auto` (barra só quando necessário) |
| `overflow: scroll` (ambos eixos) | `overflow-y-auto` (apenas vertical) |
| Scrollbar styling inline no componente | Scrollbar styling no CSS global (`index.css`) |
| Sem `max-h` com overflow | `max-h-[420px]` + `overflow-y-auto` juntos |
| `::-webkit-scrollbar-track { background: white }` | `::-webkit-scrollbar-track { background-color: transparent }` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Scrollbar nao aparece mesmo com conteudo excedente | Falta `max-h` no container | Defina altura maxima: `max-h-[420px]` junto com `overflow-y-auto` |
| Scrollbar sempre visivel mesmo com poucos itens | Usando `overflow-y-scroll` ao inves de `auto` | Troque para `overflow-y-auto` — mostra barra so quando necessario |
| Scrollbar customizada nao funciona no Firefox | Firefox nao suporta pseudo-elementos WebKit | Adicione fallback: `scrollbar-width: thin; scrollbar-color: #e4e9 transparent` |
| Track com fundo cinza padrao do browser | Falta estilizacao no `::-webkit-scrollbar-track` | Adicione `background-color: transparent` na track |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre pseudo-elementos WebKit, diferença entre scrollbar/thumb/track, e compatibilidade cross-browser
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações de cores, larguras e fallbacks Firefox