---
name: rs-saas-nextjs-rbac-accept-reject-invites
description: "Applies the pattern for accepting and rejecting invites in a Next.js SaaS app with RBAC. Use when user asks to 'implement invite flow', 'accept or reject invites', 'pending invites UI', 'client-side fetching with React Query', or 'server actions for invite management'. Covers conditional fetching with useQuery enabled flag, server actions with revalidateTag, and queryClient.invalidateQueries for cache sync. Make sure to use this skill whenever building invite or notification acceptance flows in Next.js. Not for creating invite sending, organization CRUD, or authentication flows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: membros-convites
  tags: [saas, nextjs, invites, members, server-actions]
---

# Aceitando e Rejeitando Convites

> Buscar convites pendentes client-side com React Query, processar aceitacao/rejeicao via server actions, e sincronizar cache apos a acao.

## Prerequisites

- API route `getPendingInvites` retornando invites do usuario (nao da organizacao)
- TanStack React Query configurado no projeto
- Server actions habilitadas no Next.js

## Steps

### Step 1: Criar a API call para pending invites

```typescript
// http.ts
export async function getPendingInvites() {
  const result = await api.get('pending-invites').json<{
    invites: {
      id: string
      role: string
      createdAt: string
      author: { id: string; name: string | null } | null
      organization: { name: string }
    }[]
  }>()
  return result
}
```

### Step 2: Fetch client-side com useQuery condicional

```typescript
'use client'

const [isOpen, setIsOpen] = useState(false)

const { data, refetch } = useQuery({
  queryKey: ['pending-invites'],
  queryFn: getPendingInvites,
  enabled: isOpen, // so busca quando popover abre
})
```

Passar `enabled: isOpen` evita requisicoes desnecessarias — so faz fetch quando o usuario abre o popover.

### Step 3: Criar server actions com 'use server'

```typescript
// actions.ts
'use server'

import { acceptInvite, rejectInvite } from '@/http'
import { revalidateTag } from 'next/cache'

export async function acceptInviteAction(inviteId: string) {
  await acceptInvite(inviteId)
  revalidateTag('organizations') // atualiza lista de orgs
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
}
```

### Step 4: Invalidar cache apos acao

```typescript
const queryClient = useQueryClient()

async function handleAcceptInvite(inviteId: string) {
  await acceptInviteAction(inviteId)
  queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
}

async function handleRejectInvite(inviteId: string) {
  await rejectInviteAction(inviteId)
  queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
}
```

### Step 5: Renderizar lista e estado vazio

```tsx
{data?.invites.map((invite) => (
  <div key={invite.id}>
    <span>{invite.author?.name ?? 'Someone'} invited you to join {invite.organization.name}</span>
    <Button onClick={() => handleAcceptInvite(invite.id)}>Accept</Button>
    <Button onClick={() => handleRejectInvite(invite.id)}>Reject</Button>
  </div>
))}

{data?.invites.length === 0 && (
  <p className="text-sm text-muted-foreground">No invites found.</p>
)}
```

## Error handling

- Se esquecer `'use server'` no arquivo de actions: erro `Static Generation Store is missing in revalidateTag` — sempre declarar a diretiva
- Badge de contagem usar `data?.invites?.length ?? 0` porque data pode ser undefined antes do fetch

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados so necessarios sob interacao do usuario | `useQuery` com `enabled` condicional |
| Acao muda dados do servidor E do cliente | Server action + `invalidateQueries` |
| Acao muda dados visiveis em outras partes da UI | `revalidateTag` na server action |
| Diferenciar revoke vs reject | Revoke = dono cancela o invite; Reject = convidado recusa |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Buscar invites no server component se o usuario pode nao ver | `useQuery` com `enabled` condicional |
| Chamar server action sem `'use server'` no arquivo | Sempre declarar `'use server'` no topo |
| Esquecer de invalidar o cache apos aceitar/rejeitar | `queryClient.invalidateQueries` apos cada acao |
| Usar `revoke` quando o convidado recusa | Usar `reject` — revoke e para o dono do invite |

## Troubleshooting

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
