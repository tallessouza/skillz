---
name: rs-saas-nextjs-rbac-org-switcher
description: "Generates organization switcher dropdown components using shadcn/ui DropdownMenu with avatar, text truncation, and create-new action. Use when user asks to 'create a switcher', 'organization selector', 'workspace picker', 'tenant dropdown', 'account switcher', or any multi-entity selection dropdown. Applies patterns: ml-auto for icon alignment, line-clamp-1 for text overflow, avatar with fallback, grouped menu items with separator, asChild Link for navigation items. Make sure to use this skill whenever building entity selection dropdowns in Next.js with shadcn/ui. Not for simple select inputs, combobox search, or command palette components."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: frontend
  tags: [saas, nextjs, ui, tailwind, organization]
---

# Organization Switcher Component

> Construa dropdowns de selecao de entidade com avatar, truncamento de texto e agrupamento de acoes usando shadcn/ui DropdownMenu.

## Rules

1. **Use ml-auto no icone chevron** — `ml-auto` no icone de seta, nao `justify-between` no container, porque quando o item tem imagem + texto + icone, justify-between distribui os tres igualmente em vez de empurrar so o icone pra direita
2. **Trunce nomes longos com line-clamp-1** — aplique `line-clamp-1` em spans de texto variavel, porque nomes de organizacoes podem exceder o width fixo e quebrar o layout
3. **Agrupe itens com DropdownMenuGroup** — separe organizacoes listadas da acao "criar nova" com `DropdownMenuSeparator`, porque agrupa visualmente itens de natureza diferente (selecao vs navegacao)
4. **Use asChild + Link em itens de navegacao** — `DropdownMenuItem` com `asChild` e `Link` interno, porque preserva a semantica do menu enquanto navega via Next.js router
5. **Calcule alinhamento com offset** — `alignOffset` deve compensar a diferenca entre trigger width e content width para centralizar visualmente, porque o dropdown content mais largo que o trigger precisa de offset negativo igual a metade da diferenca
6. **Use focus-visible ao inves de focus** — `focus-visible:ring-2 focus-visible:ring-primary` com `outline-none`, porque foco visivel so aparece com teclado, nao com mouse

## How to write

### Estrutura do Switcher

```tsx
import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function OrganizationSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[164px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span className="text-muted-foreground">Select organization</span>
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {organizations.map((org) => (
            <DropdownMenuItem key={org.slug} asChild>
              <Link href={`/org/${org.slug}`}>
                <Avatar className="mr-2 size-4">
                  <AvatarImage src={org.avatarUrl} />
                  <AvatarFallback />
                </Avatar>
                <span className="line-clamp-1">{org.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Separador decorativo no Header

```tsx
import { Slash } from 'lucide-react'

// Entre logo e switcher no header
<Slash className="size-3 -rotate-[24deg] text-border" />
```

## Example

**Before (dropdown sem estrutura):**
```tsx
<select onChange={handleChange}>
  {orgs.map(o => <option key={o.id}>{o.name}</option>)}
  <option value="new">+ Create</option>
</select>
```

**After (com este skill aplicado):**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger className="flex w-[164px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
    <Avatar className="mr-2 size-4">
      <AvatarImage src={currentOrg.avatarUrl} />
      <AvatarFallback />
    </Avatar>
    <span className="line-clamp-1">{currentOrg.name}</span>
    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" alignOffset={-16} sideOffset={12} className="w-[200px]">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Organizations</DropdownMenuLabel>
      {orgs.map(org => (
        <DropdownMenuItem key={org.slug} asChild>
          <Link href={`/org/${org.slug}`}>
            <Avatar className="mr-2 size-4">
              <AvatarImage src={org.avatarUrl} />
              <AvatarFallback />
            </Avatar>
            <span className="line-clamp-1">{org.name}</span>
          </Link>
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
      <Link href="/create-organization">
        <PlusCircle className="mr-2 size-4" />
        Create new
      </Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Trigger mostra entidade selecionada | Avatar + nome com line-clamp-1 + ChevronsUpDown com ml-auto |
| Trigger sem selecao | Span com text-muted-foreground + "Select organization" |
| Item de menu navega pra outra rota | asChild + Link do next/link |
| Content mais largo que trigger | alignOffset = -(contentWidth - triggerWidth) / 2 |
| Separador visual entre elementos do header | Slash do lucide com rotate negativo e text-border |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<select>` para switcher de entidade | `DropdownMenu` com avatar e agrupamento |
| `justify-between` no trigger com 3 elementos | `ml-auto` no ultimo elemento (icone) |
| Texto sem truncamento em width fixo | `line-clamp-1` em spans de texto variavel |
| `<a href>` dentro de DropdownMenuItem | `asChild` + `<Link>` do Next.js |
| `focus:ring` no trigger | `focus-visible:ring` (so aparece com teclado) |
| Avatar sem AvatarFallback | Sempre incluir `<AvatarFallback />` mesmo vazio |

## Troubleshooting

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
