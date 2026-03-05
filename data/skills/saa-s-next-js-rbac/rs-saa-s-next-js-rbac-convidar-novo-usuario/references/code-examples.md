# Code Examples: Convidar Novo Usuario

## Exemplo completo do CreateInviteForm

```tsx
'use client'

import { AlertTriangle } from 'lucide-react'
import { UserPlus } from 'lucide-react'
import { RequestFormReset } from 'react-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormState } from '@/hooks/use-form-state'

import { createInviteAction } from './actions'

export function CreateInviteForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createInviteAction)

  return (
    <form onSubmit={handleSubmit}>
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Invite failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="john@example.com"
          />
        </div>

        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" disabled={isPending}>
          <UserPlus className="mr-2 size-4" />
          Invite user
        </Button>
      </div>
    </form>
  )
}
```

## Schema de validacao (invite-schema.ts)

```typescript
import { z } from 'zod'
import { roleSchema } from '@saas/auth'

export const inviteSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  role: roleSchema,
})
```

## Server Action (actions.ts)

```typescript
'use server'

import { revalidateTag } from 'next/cache'

import { getCurrentOrg } from '@/auth/auth'
import { createInvite } from '@/http/create-invite'
import { HTTPError } from 'ky'

import { inviteSchema } from './invite-schema'

export async function createInviteAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten()
    return { success: false, message: null, errors: errors.fieldErrors }
  }

  const { email, role } = result.data
  const currentOrg = getCurrentOrg()

  try {
    await createInvite({
      org: currentOrg!,
      email,
      role,
    })

    revalidateTag(`${currentOrg}/invites`)
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    console.error(err)
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully created the invite.',
    errors: null,
  }
}
```

## Camada HTTP (create-invite.ts)

```typescript
import { api } from './api-client'

interface CreateInviteRequest {
  org: string
  email: string
  role: string
}

type CreateInviteResponse = void

export async function createInvite({
  org,
  email,
  role,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  await api.post(`organizations/${org}/invites`, {
    json: {
      email,
      role,
    },
  })
}
```

## Integracao na pagina de invites

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateInviteForm } from './create-invite-form'

export default function InvitesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite member</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateInviteForm />
      </CardContent>
    </Card>
  )
}
```

## Bug do dominio — antes e depois

```typescript
// BUG: pegava o segundo caractere do email como dominio
const domain = email[1] // 'i' para "diego@acme.com"

// CORRETO: split pelo @ para extrair o dominio
const [, domain] = email.split('@') // 'acme.com' para "diego@acme.com"
```

## Padrão de revalidateTag consistente

```typescript
// Na funcao getInvites (definindo a tag):
const response = await api.get(`organizations/${org}/invites`, {
  next: {
    tags: [`${org}/invites`],
  },
})

// Na action createInviteAction (invalidando a tag):
revalidateTag(`${currentOrg}/invites`)
```