# Code Examples: Action de Criacao de Projeto

## 1. HTTP Client Wrapper (createProject)

Copiado e adaptado do `createOrganization`:

```typescript
// http/create-project.ts
import { api } from './api-client'

interface CreateProjectRequest {
  org: string
  name: string
  description: string
}

export async function createProject({ org, name, description }: CreateProjectRequest) {
  // Rota: organizations/{org}/projects
  // Org vai na URL, nao no body
  const result = await api
    .post(`organizations/${org}/projects`, {
      json: {
        name,
        description,
      },
    })
    .json()

  return result
}
```

### Comparacao com createOrganization (o original que foi copiado)

```typescript
// http/create-organization.ts (ORIGINAL)
export async function createOrganization({ name, description }: CreateOrgRequest) {
  const result = await api
    .post('organizations', {
      json: { name, description },
    })
    .json()

  return result
}
```

**Diferencas:**
- `createProject` recebe `org` como parametro adicional
- Rota muda de `organizations` para `organizations/${org}/projects`
- Body permanece igual (name + description)

## 2. Server Action completa

```typescript
'use server'

import { createProject } from '@/http/create-project'
import { getCurrentOrg } from '@/auth'

export async function createProjectAction(data: FormData) {
  const name = data.get('name') as string
  const description = data.get('description') as string

  // getCurrentOrg() acessa cookies — possivel porque Server Actions rodam no servidor
  // O ! (non-null assertion) indica que sabemos que org existe neste contexto
  const org = getCurrentOrg()!

  await createProject({
    org,
    name,
    description,
  })

  // Apos criar com sucesso, pode redirecionar ou mostrar toast
}
```

## 3. Exemplo de form que chama o action

```typescript
// app/(app)/org/[slug]/create-project/page.tsx
'use client'

import { createProjectAction } from './action'

export default function CreateProjectPage() {
  async function handleSubmit(data: FormData) {
    const result = await createProjectAction(data)
    // handle success/error
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Nome do projeto" required />
      <textarea name="description" placeholder="Descricao" />
      <button type="submit">Criar projeto</button>
    </form>
  )
}
```

## 4. Padrao getCurrentOrg (referencia)

```typescript
// auth/index.ts
import { cookies } from 'next/headers'

export function getCurrentOrg() {
  return cookies().get('org')?.value ?? null
}
```

**Nota:** Retorna `string | null`. O `null` acontece quando nao ha cookie `org` setado. Nas paginas dentro de `/org/[slug]/`, o middleware ja garante que esse cookie existe.

## 5. Variacao: criando outros recursos org-scoped

O mesmo padrao se aplica a qualquer CRUD dentro de uma org:

```typescript
// http/create-member.ts — mesmo padrao
export async function createMember({ org, email, role }: CreateMemberRequest) {
  return api.post(`organizations/${org}/members`, {
    json: { email, role },
  }).json()
}

// http/create-billing.ts — mesmo padrao
export async function createBilling({ org, plan }: CreateBillingRequest) {
  return api.post(`organizations/${org}/billing`, {
    json: { plan },
  }).json()
}
```