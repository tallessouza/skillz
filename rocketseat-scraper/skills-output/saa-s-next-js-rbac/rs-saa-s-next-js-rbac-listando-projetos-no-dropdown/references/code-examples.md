# Code Examples: Listando Projetos no Dropdown

## 1. Instalacao do Skeleton (shadcn/ui)

```bash
npx shadcn-ui@latest add skeleton
```

## 2. Estrutura completa do Project Switcher

```tsx
'use client'

import { ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

// Hook que busca projetos da org atual
import { useProjects } from '@/hooks/use-projects'

export function ProjectSwitcher() {
  const { slug: orgSlug, project: projectSlug } = useParams<{
    slug: string
    project: string
  }>()

  const { data, isLoading } = useProjects(orgSlug)

  // Derivar projeto ativo dos params + dados carregados
  const currentProject =
    data && projectSlug
      ? data.projects.find((p) => p.slug === projectSlug)
      : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {isLoading ? (
          <>
            <Skeleton className="size-4 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </>
        ) : (
          <>
            {currentProject ? (
              <>
                <Avatar className="size-4 shrink-0">
                  <AvatarFallback />
                </Avatar>
                <span className="truncate text-left">
                  {currentProject.name}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">Select project</span>
            )}
          </>
        )}

        {isLoading ? (
          <Loader2 className="ml-auto size-4 shrink-0 animate-spin" />
        ) : (
          <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={12}>
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {data &&
          data.projects.map((project) => (
            <DropdownMenuItem key={project.id} asChild>
              <Link href={`/org/${orgSlug}/project/${project.slug}`}>
                <Avatar className="mr-2 size-4">
                  <AvatarFallback />
                </Avatar>
                <span>{project.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/org/${orgSlug}/create-project`}>
            <PlusCircle className="mr-2 size-4" />
            <span>Create new</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## 3. Estrutura de pastas para rotas dinamicas

```
app/
  org/
    [slug]/
      page.tsx                    # Pagina da organizacao
      project/
        [project]/
          page.tsx                # Pagina do projeto (minima)
      create-project/
        page.tsx                  # Criar projeto na org
```

## 4. Pagina minima do projeto (evitar 404)

```tsx
// app/org/[slug]/project/[project]/page.tsx
export default function ProjectPage() {
  return <h1>Project</h1>
}
```

## 5. Skeleton espelhando layout real

```tsx
// Avatar: circular, tamanho fixo
<Skeleton className="size-4 shrink-0 rounded-full" />

// Texto: altura fixa, largura total
<Skeleton className="h-4 w-full" />
```

A chave e que `size-4` no Skeleton corresponde ao `size-4` do Avatar real, e `h-4` corresponde a altura aproximada do texto `text-sm`.

## 6. Delay artificial para testar loading (remover antes de deploy)

```typescript
// TODO: remover - delay artificial para testar skeleton
export async function getProjects(orgSlug: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const response = await api.get(`/organizations/${orgSlug}/projects`)
  return response.data
}
```

## 7. Correcao de spacing no Avatar

O Diego remove `mr-2` do Avatar no organization switcher e project switcher trigger, porque o `gap-2` do flex container ja cuida do espacamento. Margem manual + gap causa espacamento duplo.

```tsx
// Errado: margin + gap
<div className="flex items-center gap-2">
  <Avatar className="mr-2 size-4" /> {/* mr-2 duplica o gap */}
</div>

// Correto: apenas gap
<div className="flex items-center gap-2">
  <Avatar className="size-4" />
</div>
```