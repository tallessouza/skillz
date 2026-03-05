# Code Examples: Pagina de Configuracoes da Org

## Estrutura de pastas

```
app/
  org/
    [slug]/
      settings/
        page.tsx          # Pagina de configuracoes
    organization-form.tsx  # Form reutilizado (movido de create-organization)
```

## Pagina completa de settings

```typescript
import { ability } from '@/auth/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OrganizationForm } from '../organization-form'
import { ShutdownOrganizationButton } from './shutdown-organization-button'

export default async function Settings() {
  const permissions = await ability()

  return (
    <div className="space-y-4">
      {permissions?.can('update', 'Organization') && (
        <Card>
          <CardHeader>
            <CardTitle>Organization settings</CardTitle>
            <CardDescription>
              Update your organization details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationForm />
          </CardContent>
        </Card>
      )}

      {permissions?.can('get', 'Billing') && (
        <div>Billing</div>
      )}

      {permissions?.can('delete', 'Organization') && (
        <Card>
          <CardHeader>
            <CardTitle>Shutdown organization</CardTitle>
            <CardDescription>
              This will delete all organization data including all projects.
              You cannot undo this action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShutdownOrganizationButton />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

## Componente do botao de shutdown

```typescript
import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

import { getCurrentOrg } from '@/auth/auth'
import { shutdownOrganization } from '@/http/shutdown-organization'
import { Button } from '@/components/ui/button'

async function shutdownOrganizationAction() {
  'use server'

  const currentOrg = getCurrentOrg()
  await shutdownOrganization({ org: currentOrg! })

  redirect('/')
}

export function ShutdownOrganizationButton() {
  return (
    <form action={shutdownOrganizationAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="mr-2 size-4" />
        Shutdown organization
      </Button>
    </form>
  )
}
```

## Funcao HTTP de shutdown

```typescript
import { api } from './api-client'

interface ShutdownOrganizationRequest {
  org: string
}

export async function shutdownOrganization({
  org,
}: ShutdownOrganizationRequest) {
  await api.delete(`organizations/${org}`)
}
```

## Instalacao do componente Card (shadcn/ui)

```bash
# Executar dentro de apps/web (nao na raiz do monorepo!)
pnpm dlx shadcn add card
```

O instrutor comete o erro de rodar na raiz e corrige: componentes shadcn devem ser adicionados dentro do app correto em monorepos.

## Padrao de movimentacao de componente

Quando um form e necessario em dois lugares:

```
# Antes (acoplado a create)
app/create-organization/organization-form.tsx

# Depois (compartilhado)
app/org/organization-form.tsx
```

Atualizar imports em todos os consumidores apos mover.