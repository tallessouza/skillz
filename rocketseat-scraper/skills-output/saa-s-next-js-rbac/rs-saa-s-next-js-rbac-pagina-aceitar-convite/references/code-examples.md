# Code Examples: Pagina Aceitar Convite

## Estrutura de arquivos

```
src/app/
├── (app)/           ← layout com autenticacao
│   ├── layout.tsx   ← verifica isAuthenticated
│   └── ...
├── invite/          ← FORA do (app), sem validacao de auth
│   └── [id]/
│       └── page.tsx
└── auth/
    └── sign-in/
```

## Funcao de API: getInvite

```typescript
// src/http/get-invite.ts
import { api } from './api-client'

export async function getInvite(inviteId: string) {
  const result = await api.get(`invite/${inviteId}`).json<{
    invite: {
      id: string
      email: string
      role: string
      createdAt: string
      organization: {
        name: string
      }
      author: {
        id: string
        name: string | null
        avatarUrl: string | null
      }
    }
  }>()

  return result
}
```

## Pagina completa do invite

```tsx
// src/app/invite/[id]/page.tsx
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { getInvite } from '@/http/get-invite'

dayjs.extend(relativeTime)

export default async function InvitePage({
  params,
}: {
  params: { id: string }
}) {
  const inviteId = params.id
  const { invite } = await getInvite(inviteId)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite.author.avatarUrl && (
              <AvatarImage src={invite.author.avatarUrl} />
            )}
            <AvatarFallback />
          </Avatar>

          <p className="text-balance text-center leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              {invite.author.name ?? 'Someone'}
            </span>{' '}
            invited you to join{' '}
            <span className="font-medium text-foreground">
              {invite.organization.name}
            </span>
            .{' '}
            <span className="text-xs">
              {dayjs(invite.createdAt).fromNow()}
            </span>
          </p>
        </div>

        <Separator />

        {/* Proxima aula: tratar 3 estados de autenticacao */}
        {/* 1. Nao autenticado → link para sign-in */}
        {/* 2. Autenticado + mesmo email → botao aceitar */}
        {/* 3. Autenticado + email diferente → aviso para trocar conta */}
      </div>
    </div>
  )
}
```

## Comparacao: rota dentro vs fora do layout

**Dentro de `(app)/` (ERRADO para invite):**
```
src/app/(app)/invite/[id]/page.tsx
→ Herda layout.tsx que verifica auth
→ Redireciona usuario nao autenticado para /sign-in
→ Usuario que recebeu email nao consegue acessar
```

**Fora de `(app)/` (CORRETO):**
```
src/app/invite/[id]/page.tsx
→ Nao herda layout com auth
→ Qualquer usuario acessa via link do email
→ Logica de auth tratada dentro da propria pagina
```

## Pattern: destaque de nomes em texto descritivo

```tsx
{/* Texto base com cor suave */}
<p className="text-muted-foreground">
  {/* Nomes com destaque */}
  <span className="font-medium text-foreground">
    {nome}
  </span>
  {' '}texto normal{' '}
  <span className="font-medium text-foreground">
    {outroNome}
  </span>
</p>
```