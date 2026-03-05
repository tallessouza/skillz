# Code Examples: Permissoes nas Abas

## Exemplo completo do componente de Tabs

Este e o padrao completo demonstrado na aula, adaptado para clareza:

```typescript
// src/app/(app)/org/[slug]/tabs.tsx
import { ability } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TabsProps {
  currentOrg: string
}

export async function Tabs({ currentOrg }: TabsProps) {
  const permissions = await ability()

  const canUpdateOrganization = permissions.can('update', 'Organization')
  const canGetMembers = permissions.can('get', 'User')
  const canGetProjects = permissions.can('get', 'Project')
  const canGetBilling = permissions.can('get', 'Billing')

  return (
    <div className="border-b py-4">
      <nav className="flex items-center gap-2">
        {canGetProjects && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/org/${currentOrg}`}>Projects</Link>
          </Button>
        )}

        {canGetMembers && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/org/${currentOrg}/members`}>Members</Link>
          </Button>
        )}

        {(canUpdateOrganization || canGetBilling) && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/org/${currentOrg}/settings`}>
              Settings & Billing
            </Link>
          </Button>
        )}
      </nav>
    </div>
  )
}
```

## Variacao: controle interno da pagina de Settings

Apos mostrar a aba, dentro da pagina de Settings o controle e separado:

```typescript
// src/app/(app)/org/[slug]/settings/page.tsx
import { ability } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default async function SettingsPage({
  params,
}: {
  params: { slug: string }
}) {
  const permissions = await ability()

  const canUpdateOrganization = permissions.can('update', 'Organization')
  const canGetBilling = permissions.can('get', 'Billing')

  // Redirect se nao tem nenhuma das duas permissoes
  if (!canUpdateOrganization && !canGetBilling) {
    redirect(`/org/${params.slug}`)
  }

  return (
    <div>
      {canUpdateOrganization && (
        <section>
          <h2>Organization Settings</h2>
          {/* Formulario de configuracao */}
        </section>
      )}

      {canGetBilling && (
        <section>
          <h2>Billing</h2>
          {/* Dados de faturamento */}
        </section>
      )}
    </div>
  )
}
```

## Resultado por role

### Member
```
[Projects] [Members]
// Settings & Billing NAO aparece
```

### Admin / Owner
```
[Projects] [Members] [Settings & Billing]
// Todas as abas visiveis
```

## Padrao reutilizavel: hook de permissoes (client-side alternativo)

Embora a aula use Server Components, o mesmo padrao pode ser aplicado client-side:

```typescript
// Se precisar client-side (nao e o padrao da aula)
'use client'

import { useAbility } from '@/hooks/use-ability'

export function Tabs({ currentOrg }: { currentOrg: string }) {
  const { can } = useAbility()

  const canGetProjects = can('get', 'Project')
  const canGetMembers = can('get', 'User')
  // ... mesmo padrao de condicionais
}
```