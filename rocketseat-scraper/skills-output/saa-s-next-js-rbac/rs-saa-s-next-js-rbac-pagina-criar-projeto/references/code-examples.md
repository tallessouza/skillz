# Code Examples: Pagina Criar Projeto

## Exemplo completo: Fluxo de copia e adaptacao

### 1. Arquivo original (create-organization/page.tsx)

```tsx
import { OrganizationForm } from './organization-form'

export default function CreateOrganization() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create organization</h1>
      <OrganizationForm />
    </div>
  )
}
```

### 2. Arquivo adaptado (create-project/page.tsx)

```tsx
import { ProjectForm } from './project-form'

export default function CreateProject() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create project</h1>
      <ProjectForm />
    </div>
  )
}
```

Mudancas: `OrganizationForm` → `ProjectForm`, `Create organization` → `Create project`.

---

### 3. Schema original (organization)

```tsx
const organizationSchema = z
  .object({
    name: z.string().min(4, { message: 'Please include at least 4 characters.' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            return domainRegex.test(value)
          }
          return true
        },
        { message: 'Please enter a valid domain.' },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Domain is required when auto-join is enabled.',
      path: ['domain'],
    },
  )
```

### 4. Schema adaptado (project)

```tsx
const projectSchema = z.object({
  name: z.string().min(4, { message: 'Please include at least 4 characters.' }),
  description: z.string(),
})
```

Removidos: `domain` com regex refine, `shouldAttachUsersByDomain` com union/transform, `.refine()` de nivel superior. Adicionado: `description` como string simples.

---

### 5. Formulario adaptado com Textarea

```tsx
'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useFormState } from 'react-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { createProjectAction } from './actions'

export function ProjectForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createProjectAction, {
      success: false,
      message: null,
      errors: null,
    })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Project name</Label>
        <Input name="name" id="name" />
        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" id="description" />
        {errors?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.description[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save project'
        )}
      </Button>
    </form>
  )
}
```

---

### 6. Instalacao do componente Textarea

```bash
npx shadcn@latest add textarea
```

Este comando adiciona o componente `Textarea` em `components/ui/textarea.tsx`. Deve ser executado antes de importar no formulario.

---

### 7. Action stub completa

```tsx
'use server'

import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(4, { message: 'Please include at least 4 characters.' }),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, description } = result.data

  // TODO: implement HTTP call
  // const { slug } = getCurrentOrg()
  // await api.post(`organizations/${slug}/projects`, {
  //   json: { name, description },
  // })

  return { success: true, message: null, errors: null }
}
```