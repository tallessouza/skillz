---
name: rs-saas-nextjs-rbac-pagina-criar-projeto
description: "Generates Next.js project creation pages by adapting existing organization creation patterns. Use when user asks to 'create a project page', 'add project form', 'create CRUD page from existing one', or 'duplicate page for different entity'. Applies pattern: copy existing page, replace entity names, simplify fields, stub actions. Make sure to use this skill whenever creating a new entity page that mirrors an existing one in a Next.js App Router SaaS. Not for API implementation, authentication pages, or dashboard layouts."
---

# Pagina: Criar Projeto (Reuso de Paginas por Entidade)

> Ao criar uma pagina para nova entidade, copie a pagina de entidade similar existente, substitua os termos, e simplifique os campos conforme o dominio.

## Rules

1. **Copie a pagina existente como base** — nunca crie do zero quando uma pagina similar existe, porque a consistencia visual e de UX e garantida pelo reuso
2. **Substitua todos os termos da entidade original** — use find-and-replace completo (organization → project), porque termos misturados causam bugs silenciosos
3. **Simplifique campos conforme o dominio** — remova campos que nao pertencem a nova entidade (ex: slug/domain de org nao existe em project), porque cada entidade tem seu proprio schema
4. **Crie o arquivo de actions mesmo sem implementacao** — deixe a action stub comentada, porque o formulario precisa da referencia para compilar e a validacao ja funciona
5. **Mantenha a validacao mesmo sem a action funcional** — o schema Zod valida independente da action HTTP, porque feedback imediato melhora UX
6. **Instale componentes UI conforme necessario** — se o novo formulario usa componentes ainda nao instalados (ex: textarea), instale antes de importar

## How to write

### Estrutura de arquivos para nova entidade

```
app/(app)/org/[slug]/create-project/
├── page.tsx          # Copiado de create-organization/page.tsx
├── project-form.tsx  # Copiado de organization-form.tsx
└── actions.ts        # Copiado de create-org/actions.ts (stub)
```

### Page (copiada e renomeada)

```tsx
import { ProjectForm } from './project-form'

export default function CreateProject() {
  return (
    <div>
      <h1>Create project</h1>
      <ProjectForm />
    </div>
  )
}
```

### Form simplificado (apenas nome e descricao)

```tsx
'use client'

import { useFormState } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createProjectAction } from './actions'

export function ProjectForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createProjectAction)

  return (
    <form action={handleSubmit}>
      <div>
        <label htmlFor="name">Project name</label>
        <Input name="name" id="name" />
        {errors?.name && <p>{errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <Textarea name="description" id="description" />
        {errors?.description && <p>{errors.description[0]}</p>}
      </div>

      <button type="submit" disabled={isPending}>
        Save project
      </button>
    </form>
  )
}
```

### Action stub com validacao

```tsx
'use server'

import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(4, { message: 'Minimum 4 characters.' }),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, description } = result.data

  // TODO: implement API call to create project
  // await api.post('organizations/${slug}/projects', { json: { name, description } })
}
```

## Example

**Before (organization form com campos extras):**
```tsx
const organizationSchema = z.object({
  name: z.string().min(4),
  domain: z.string().nullable().refine(/*...*/),
  shouldAttachUsersByDomain: z.boolean(),
})
```

**After (project form simplificado):**
```tsx
const projectSchema = z.object({
  name: z.string().min(4),
  description: z.string(),
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova entidade com formulario similar a existente | Copie a pagina existente, substitua termos |
| Entidade tem menos campos que a original | Remova campos e validacoes extras do schema |
| Action HTTP ainda nao existe | Crie action stub com validacao, comente a chamada HTTP |
| Formulario precisa de componente UI novo | Instale o componente (ex: `npx shadcn@latest add textarea`) antes |
| Pagina fica dentro de contexto de org | Coloque em `app/(app)/org/[slug]/create-{entity}/` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar pagina do zero quando similar existe | Copiar pagina existente e adaptar |
| Deixar termos da entidade original no codigo | Find-and-replace completo (organization → project) |
| Manter campos que nao pertencem a entidade | Remover campos e simplificar schema |
| Esperar API pronta para criar o formulario | Criar com action stub e validacao funcionando |
| Importar componente sem instalar o pacote | Instalar via CLI do shadcn antes de usar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
