# Code Examples: Modal com Interceptacao de Rotas

## Estrutura completa de pastas

```
app/
├── layout.tsx
├── @sheet/
│   ├── default.tsx                         # Retorna null (slot vazio por padrao)
│   ├── (.)create-organization/
│   │   └── page.tsx                        # Intercepta /create-organization
│   └── (.)org/
│       └── [slug]/
│           └── create-project/
│               └── page.tsx                # Intercepta /org/:slug/create-project
├── create-organization/
│   └── page.tsx                            # Pagina real de criar org
└── org/
    └── [slug]/
        ├── page.tsx                        # Pagina da org
        └── create-project/
            └── page.tsx                    # Pagina real de criar projeto
```

## Layout renderizando o slot

```typescript
// app/layout.tsx
export default function Layout({
  children,
  sheet,
}: {
  children: React.ReactNode
  sheet: React.ReactNode
}) {
  return (
    <>
      {children}
      {sheet}
    </>
  )
}
```

## Pagina interceptada do create-project

```typescript
// app/@sheet/(.)org/[slug]/create-project/page.tsx
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { ProjectForm } from '@/app/org/[slug]/create-project/project-form'

export default function CreateProject() {
  return (
    <InterceptedSheetContent>
      <h2>Create project</h2>
      <ProjectForm />
    </InterceptedSheetContent>
  )
}
```

## ProjectForm com invalidacao de query

```typescript
// project-form.tsx
'use client'

import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useFormState } from '@/hooks/use-form-state'
import { createProjectAction } from './actions'

export function ProjectForm() {
  const { slug: org } = useParams<{ slug: string }>()
  const queryClient = useQueryClient()

  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createProjectAction, () => {
      // onSuccess callback
      queryClient.invalidateQueries({
        queryKey: [org, 'projects'],
      })
    })

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulario */}
      <button type="submit" disabled={isPending}>
        Save
      </button>
      {success && <p>Project created successfully</p>}
    </form>
  )
}
```

## ProjectSwitcher com useQuery (a query que sera invalidada)

```typescript
// components/project-switcher.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export function ProjectSwitcher() {
  const { slug: org } = useParams<{ slug: string }>()

  const { data } = useQuery({
    queryKey: [org, 'projects'],
    queryFn: () => getProjects(org),
  })

  return (
    <div>
      {data?.projects.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
      {/* Link para /org/${org}/create-project */}
    </div>
  )
}
```

## Comparacao: com e sem dot prefix

### SEM dot (rota paralela — ERRADO para modal)
```
@sheet/
  org/
    [slug]/
      create-project/
        page.tsx
```
Resultado: Next renderiza a pagina de create-project E o sheet simultaneamente.

### COM dot (rota interceptada — CORRETO para modal)
```
@sheet/
  (.)org/
    [slug]/
      create-project/
        page.tsx
```
Resultado: Next mantem a pagina atual e mostra apenas o sheet por cima.

## Script para limpar cache quando interceptacao falha

```bash
# Quando a rota interceptada nao funciona
rm -rf .next
pnpm run dev
# Ctrl+Shift+F5 no navegador para limpar cache local
```