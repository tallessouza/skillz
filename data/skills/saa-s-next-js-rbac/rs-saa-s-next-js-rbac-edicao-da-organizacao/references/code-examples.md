# Code Examples: Edicao de Organizacao

## 1. Interface do formulario dual-purpose

```typescript
// components/org/organization-form.tsx
import { OrganizationSchema } from './actions'

interface OrganizationFormProps {
  isUpdating?: boolean
  initialData?: OrganizationSchema
}

export function OrganizationForm({
  isUpdating = false,
  initialData,
}: OrganizationFormProps) {
  const formAction = isUpdating
    ? updateOrganizationAction
    : createOrganizationAction

  return (
    <form action={formAction}>
      <Input
        name="name"
        defaultValue={initialData?.name}
      />
      <Input
        name="domain"
        type="url"
        defaultValue={initialData?.domain}
      />
      <Checkbox
        name="shouldAttachUsersByDomain"
        defaultChecked={initialData?.shouldAttachUsersByDomain}
      />
      <Button type="submit">Save</Button>
    </form>
  )
}
```

## 2. Server Actions (create + update)

```typescript
// components/org/actions.ts
'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getCurrentOrg } from '@/auth'
import { createOrganization, updateOrganization } from '@/http'

const organizationSchema = z.object({
  name: z.string().min(4),
  domain: z.string().nullable(),
  shouldAttachUsersByDomain: z.boolean(),
})

// Exportar apenas a TIPAGEM, nunca o schema objeto
export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(data: FormData) {
  const parsed = organizationSchema.parse(Object.fromEntries(data))

  await createOrganization(parsed)

  revalidateTag('organizations')
}

export async function updateOrganizationAction(data: FormData) {
  const currentOrg = getCurrentOrg()!
  const parsed = organizationSchema.parse(Object.fromEntries(data))

  await updateOrganization({
    org: currentOrg,
    ...parsed,
  })

  revalidateTag('organizations')
}
```

## 3. HTTP client — endpoint de update

```typescript
// http/index.ts
interface UpdateOrganizationRequest {
  org: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

export async function updateOrganization({
  org,
  ...body
}: UpdateOrganizationRequest) {
  await api.put(`organizations/${org}`, {
    json: body,
  })
}
```

## 4. Fetch tagueado no Server Component

```typescript
// http/get-organizations.ts
export async function getOrganizations() {
  const response = await api
    .get('organizations', {
      next: {
        tags: ['organizations'],
      },
    })
    .json<{ organizations: Organization[] }>()

  return response
}
```

## 5. Fetch individual de organizacao

```typescript
// http/get-organization.ts
interface Organization {
  id: string
  name: string
  slug: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
  ownerId: string
}

export async function getOrganization(org: string) {
  const response = await api
    .get(`organizations/${org}`)
    .json<{ organization: Organization }>()

  return response
}
```

## 6. Pagina de settings passando initialData

```typescript
// app/(app)/org/[slug]/settings/page.tsx
import { getCurrentOrg } from '@/auth'
import { getOrganization } from '@/http'
import { OrganizationForm } from '@/components/org/organization-form'

export default async function SettingsPage() {
  const currentOrg = getCurrentOrg()!
  const { organization } = await getOrganization(currentOrg)

  return (
    <OrganizationForm
      isUpdating
      initialData={{
        name: organization.name,
        domain: organization.domain,
        shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain,
      }}
    />
  )
}
```

## 7. Organization Switcher com fetch tagueado

```typescript
// components/organization-switcher.tsx
export async function OrganizationSwitcher() {
  const { organizations } = await getOrganizations()
  // Quando revalidateTag('organizations') e chamado,
  // este componente re-renderiza com dados atualizados
  return (
    <Select>
      {organizations.map((org) => (
        <SelectItem key={org.id} value={org.slug}>
          {org.name}
        </SelectItem>
      ))}
    </Select>
  )
}
```