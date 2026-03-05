---
name: rs-tailwind-responsividade-abas
description: "Applies Radix ScrollArea for responsive horizontal tab navigation when building tab components with Tailwind CSS. Use when user asks to 'make tabs responsive', 'add horizontal scroll to tabs', 'fix tabs overflow on mobile', 'create scrollable tab list', or 'use radix scroll area'. Make sure to use this skill whenever implementing tab navigation that needs mobile responsiveness. Not for vertical scrolling, page-level scroll, or non-tab navigation components."
---

# Responsividade de Abas com Scroll Horizontal

> Quando abas excedem a largura disponivel no mobile, envolva-as com ScrollArea do Radix para criar scroll horizontal customizavel.

## Rules

1. **Use `@radix-ui/react-scroll-area` para scroll horizontal em abas** — porque o scroll nativo do CSS e dificil de estilizar consistentemente entre navegadores
2. **Sempre inclua ScrollArea.Scrollbar + ScrollArea.Thumb** — sem o Scrollbar abaixo do Viewport, o Radix nao cria o efeito de scroll
3. **Aplique `whitespace-nowrap` nos labels das abas** — porque sem isso o texto quebra em duas linhas no mobile em vez de scrollar
4. **Remova grid do mobile no layout pai** — grid com colunas fixas no mobile causa overflow; use `lg:grid lg:grid-cols-app`
5. **Controle a largura maxima do container** — `max-w-[100vw]` no main impede que abas cresçam alem da tela
6. **Use `type="scroll"` no ScrollArea.Root** — a scrollbar aparece apenas durante o movimento de scroll, visualmente mais limpo que `always` ou `hover`

## How to write

### Estrutura do ScrollArea envolvendo TabList

```tsx
import * as ScrollArea from '@radix-ui/react-scroll-area'

<ScrollArea.Root className="w-full" type="scroll">
  <ScrollArea.Viewport className="w-full overflow-x-scroll">
    <TabList>
      {/* TabTriggers aqui */}
    </TabList>
  </ScrollArea.Viewport>

  <ScrollArea.Scrollbar
    orientation="horizontal"
    className="flex h-0.5 translate-y-1.5 touch-none select-none flex-col bg-zinc-100"
  >
    <ScrollArea.Thumb className="relative flex-1 rounded-lg bg-zinc-300" />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
```

### Tab item com whitespace-nowrap

```tsx
<TabsTrigger value="my-details">
  <span className="whitespace-nowrap">My Details</span>
</TabsTrigger>
```

### Layout responsivo sem grid no mobile

```tsx
<main className="lg:grid lg:grid-cols-app max-w-[100vw]">
  {/* Sidebar + Content */}
</main>
```

## Example

**Before (abas quebrando no mobile):**
```tsx
<Tabs.List className="flex gap-4 border-b">
  <Tabs.Trigger>My Details</Tabs.Trigger>
  <Tabs.Trigger>Profile</Tabs.Trigger>
  <Tabs.Trigger>Password</Tabs.Trigger>
  <Tabs.Trigger>Team</Tabs.Trigger>
  <Tabs.Trigger>Billing</Tabs.Trigger>
</Tabs.List>
```

**After (scroll horizontal responsivo):**
```tsx
<ScrollArea.Root className="w-full" type="scroll">
  <ScrollArea.Viewport className="w-full overflow-x-scroll">
    <Tabs.List className="flex w-full gap-4 border-b">
      <Tabs.Trigger><span className="whitespace-nowrap">My Details</span></Tabs.Trigger>
      <Tabs.Trigger>Profile</Tabs.Trigger>
      <Tabs.Trigger>Password</Tabs.Trigger>
      <Tabs.Trigger>Team</Tabs.Trigger>
      <Tabs.Trigger>Billing</Tabs.Trigger>
    </Tabs.List>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="horizontal" className="flex h-0.5 translate-y-1.5 touch-none select-none flex-col bg-zinc-100">
    <ScrollArea.Thumb className="relative flex-1 rounded-lg bg-zinc-300" />
  </ScrollArea.Scrollbar>
</ScrollArea.Root>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mais de 3-4 abas no mobile | Usar ScrollArea horizontal |
| Texto da aba quebrando linha | Adicionar `whitespace-nowrap` no span |
| Scrollbar aparecendo sempre | Usar `type="scroll"` no Root |
| Scrollbar sobrepondo borda inferior | Usar `translate-y-1.5` para deslocar para baixo |
| Layout com grid quebrando no mobile | Prefixar grid com `lg:` |
| Desktop: scroll horizontal com mouse | Segurar Shift + scroll |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `overflow-x: auto` direto no TabList | ScrollArea.Root + Viewport envolvendo o TabList |
| ScrollArea sem Scrollbar/Thumb | Sempre incluir Scrollbar + Thumb (senao nao funciona) |
| `type="always"` no ScrollArea | `type="scroll"` (aparece so durante interacao) |
| Grid fixo sem breakpoint no layout | `lg:grid lg:grid-cols-app` |
| Tab label sem whitespace control | `<span className="whitespace-nowrap">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-responsividade-das-abas/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-responsividade-das-abas/references/code-examples.md)
