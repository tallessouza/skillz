---
name: rs-tailwind-widget-espaco-usado
description: "Applies Tailwind CSS layout patterns for sidebar widgets, progress bars, and spacing strategies. Use when user asks to 'build a sidebar', 'create a progress bar', 'push content to bottom', 'fix mt-auto not working', or 'use fractional widths in Tailwind'. Covers space-y vs flex+gap conflict, text-size/line-height shorthand, and fractional width utilities. Make sure to use this skill whenever building sidebar layouts or progress indicators with Tailwind. Not for JavaScript logic, state management, or backend code."
---

# Widget de Sidebar com Tailwind — Layout e Spacing

> Ao construir widgets em sidebars com Tailwind, escolha gap sobre space-y quando mt-auto precisa funcionar, e use atalhos de tamanho/line-height para manter o codigo enxuto.

## Rules

1. **Use flex+gap ao inves de space-y quando precisar de mt-auto** — `space-y` injeta margin-top/bottom nos filhos diretos, quebrando `mt-auto`, porque ambos competem pela mesma propriedade margin
2. **Use o atalho text-size/line-height** — `text-sm/5` ao inves de `text-sm leading-5`, porque font-size e line-height sempre andam juntas e o atalho reduz classes
3. **Use larguras fracionais ao inves de valores arbitrarios** — `w-4/5` ao inves de `w-[80%]`, porque o Tailwind ja oferece fracoes como 1/2, 1/3, 2/3, 1/4, 3/4, 4/5
4. **Extraia widgets em componentes separados** — quando uma secao da sidebar cresce alem de ~20 linhas, mova para `UsedSpaceWidget.tsx`, porque evita poluir o componente pai
5. **Sempre coloque type="button" em botoes fora de formularios** — porque sem isso, botoes dentro de um form disparam submit acidentalmente
6. **Barra de progresso = duas divs aninhadas** — div externa com bg claro e altura fixa, div interna com bg escuro e largura proporcional, ambas com `rounded-full`

## How to write

### mt-auto com flex+gap (substituindo space-y)

```tsx
// CORRETO: gap nao interfere com mt-auto
<aside className="flex flex-col gap-6">
  <nav>{/* navegacao principal */}</nav>
  <div className="mt-auto">
    {/* conteudo empurrado para baixo */}
  </div>
</aside>
```

### Atalho text-size/line-height

```tsx
// O valor apos a barra define o line-height
<span className="text-sm/5 font-medium text-violet-700">
  Used space
</span>
// text-sm = 14px, /5 = 5*4 = 20px line-height
```

### Barra de progresso

```tsx
<div className="h-2 rounded-full bg-violet-100">
  <div className="h-2 w-4/5 rounded-full bg-violet-600" />
</div>
```

### Larguras fracionais

```tsx
// Fracoes disponiveis: w-1/2, w-1/3, w-2/3, w-1/4, w-3/4, w-4/5...
<div className="w-4/5" />   // 80%
<div className="w-1/2" />   // 50%
<div className="w-[73%]" /> // valor arbitrario quando fracao nao existe
```

## Example

**Before (space-y quebrando mt-auto):**
```tsx
<aside className="space-y-6">
  <nav>{/* links */}</nav>
  <div className="mt-auto"> {/* NAO FUNCIONA — space-y sobrescreve */}
    <UsedSpaceWidget />
  </div>
</aside>
```

**After (flex+gap resolvendo):**
```tsx
<aside className="flex flex-col gap-6">
  <nav>{/* links */}</nav>
  <div className="mt-auto flex flex-col gap-6">
    <nav className="space-y-0.5">
      <NavItem icon={LifeBuoy}>Support</NavItem>
      <NavItem icon={Cog}>Settings</NavItem>
    </nav>
    <UsedSpaceWidget />
  </div>
</aside>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa empurrar conteudo para baixo | `flex flex-col` no pai + `mt-auto` no filho |
| Espacamento entre filhos sem afetar margin | `gap-N` ao inves de `space-y-N` |
| Definir font-size + line-height juntos | `text-sm/5` (atalho com barra) |
| Largura percentual (10%, 20%, 25%, 33%, 50%, 75%, 80%) | Use fracao: `w-1/5`, `w-4/5` etc |
| Largura percentual sem fracao disponivel | Valor arbitrario: `w-[73%]` |
| Widget cresceu muito dentro da sidebar | Extraia para componente proprio |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `space-y-6` + `mt-auto` no mesmo container | `flex flex-col gap-6` + `mt-auto` |
| `text-sm leading-5` (duas classes) | `text-sm/5` (atalho) |
| `w-[80%]` quando fracao existe | `w-4/5` |
| `w-[50%]` | `w-1/2` |
| `<button>` sem type em contexto misto | `<button type="button">` |
| Barra de progresso com border/outline | Duas divs aninhadas com rounded-full |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
