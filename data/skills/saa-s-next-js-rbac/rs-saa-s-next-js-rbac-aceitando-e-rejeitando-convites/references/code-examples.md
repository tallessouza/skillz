# Code Examples: Aceitando e Rejeitando Convites

## Exemplo completo do componente de invites

```typescript
'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPendingInvites } from '@/http'
import { acceptInviteAction, rejectInviteAction } from './actions'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export function PendingInvites() {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)
    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)
    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          Invites ({data?.invites?.length ?? 0})
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {data?.invites.map((invite) => (
          <div key={invite.id}>
            <p>
              {invite.author?.name ?? 'Someone'} invited you to join{' '}
              {invite.organization.name}
            </p>
            <span>{invite.createdAt}</span>
            <Button onClick={() => handleAcceptInvite(invite.id)}>
              Accept
            </Button>
            <Button onClick={() => handleRejectInvite(invite.id)}>
              Reject
            </Button>
          </div>
        ))}

        {data?.invites.length === 0 && (
          <p className="text-sm text-muted-foreground">No invites found.</p>
        )}
      </PopoverContent>
    </Popover>
  )
}
```

## Exemplo completo das server actions

```typescript
// actions.ts
'use server'

import { acceptInvite, rejectInvite } from '@/http'
import { revalidateTag } from 'next/cache'

export async function acceptInviteAction(inviteId: string) {
  await acceptInvite(inviteId)
  revalidateTag('organizations')
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
}
```

## Exemplo da API call getPendingInvites

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

export async function acceptInvite(inviteId: string) {
  await api.post(`invites/${inviteId}/accept`)
}

export async function rejectInvite(inviteId: string) {
  await api.post(`invites/${inviteId}/reject`)
}
```

## Variacao: com loading state

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['pending-invites'],
  queryFn: getPendingInvites,
  enabled: isOpen,
})

// No JSX:
{isLoading && <Skeleton className="h-12 w-full" />}
```

## Variacao: com optimistic update

```typescript
async function handleAcceptInvite(inviteId: string) {
  // Remove otimisticamente da lista
  queryClient.setQueryData(['pending-invites'], (old: any) => ({
    invites: old.invites.filter((i: any) => i.id !== inviteId),
  }))

  await acceptInviteAction(inviteId)
  // Revalida para garantir consistencia
  queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
}
```