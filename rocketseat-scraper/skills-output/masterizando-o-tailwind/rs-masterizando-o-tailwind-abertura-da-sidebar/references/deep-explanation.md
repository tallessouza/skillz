# Deep Explanation: Abertura da Sidebar com Radix Collapsible

## Por que Collapsible ao invés de useState?

O instrutor (Diego, Rocketseat) explica que usar um estado React puro (`useState`) para controlar se a sidebar está aberta ou não "não é tão interessante" porque o estado não é **acessível**. O Radix UI Collapsible fornece:

- `aria-expanded` automaticamente no trigger
- Navegação por teclado
- Data attributes (`data-state="open"` / `data-state="closed"`) que podem ser usados diretamente no Tailwind

## O truque do forceMount + data-state

Este é o insight central da aula. O problema: no desktop, o conteúdo da sidebar deve estar **sempre visível**, mas no mobile deve ser colapsável. Sem `forceMount`, quando o Collapsible está fechado, o conteúdo é removido do DOM.

A solução em duas partes:

1. **`forceMount`** — garante que o conteúdo está sempre no DOM, independente do estado
2. **`data-[state=closed]:hidden lg:data-[state=closed]:flex`** — no mobile, quando fechado, esconde (hidden). No desktop (`lg:`), mesmo quando fechado, mostra (flex)

Isso significa que o Radix marca o componente como "closed", mas o CSS do Tailwind sobrescreve o comportamento visual no desktop.

## Sidebar fixa e o problema do grid

O instrutor descobre durante a aula que uma sidebar `fixed` sai do flow do CSS Grid. A solução:

- A sidebar usa `fixed left-0 top-0 h-screen`
- O `<main>` usa `col-start-2` para forçar que ocupe a segunda coluna do grid
- Isso funciona porque o grid define duas colunas (`grid-cols-app`), mas a sidebar fixa não participa do grid layout

## O pattern asChild do Radix

`asChild` é um pattern do Radix que permite usar seu próprio componente como elemento renderizado, em vez do wrapper padrão. Ao passar `asChild` no `Collapsible.Trigger`, o Radix transfere todas as props (onClick, aria-expanded, etc.) para o componente filho direto — no caso, o `<Button variant="ghost">`.

## Ajustes de responsividade no layout

O instrutor reorganiza os paddings para mobile vs desktop:
- Mobile: `px-4 pb-12 pt-24` (mais padding top por causa da sidebar fixa no topo)
- Desktop (`lg:`): `px-8` (padding lateral maior, sidebar está ao lado)

## Data attributes condicionais no Root

O Root também recebe data-state condicionais para controlar `h-screen`:
- `data-[state=open]:h-screen` — quando aberto no mobile, ocupa tela toda
- `lg:data-[state=closed]:h-screen` — no desktop, mesmo "fechado", ocupa tela toda

Sem isso, a sidebar no mobile ocuparia toda a tela mesmo quando fechada, empurrando o conteúdo.

## Client component obrigatório

Como o Collapsible usa interatividade (estado, event handlers), o componente Sidebar precisa ser marcado com `'use client'` no Next.js App Router.