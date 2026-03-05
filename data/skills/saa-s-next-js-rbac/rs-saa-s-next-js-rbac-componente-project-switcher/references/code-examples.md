# Code Examples: Project Switcher

## HTTP function para buscar projetos

```typescript
// src/http/get-projects.ts
import { api } from './api-client'

interface GetProjectsResponse {
  projects: {
    description: string
    id: string
    name: string
    slug: string
    avatarUrl: string | null
    organizationId: string
    ownerId: string
    createdAt: string // Date vira string no JSON
    updatedAt: string
  }[]
}

export async function getProjects(orgSlug: string) {
  const result = await api
    .get(`organizations/${orgSlug}/projects`)
    .json<GetProjectsResponse>()

  return result
}
```

## QueryClient setup

```typescript
// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
```

## Providers wrapper completo

```typescript
// src/app/providers.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { queryClient } from '@/lib/react-query'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
```

## Layout usando Providers

```typescript
// src/app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Project Switcher completo com useQuery

```typescript
'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { getProjects } from '@/http/get-projects'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

export function ProjectSwitcher() {
  const { slug: orgSlug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery({
    queryKey: [orgSlug, 'projects'],
    queryFn: () => getProjects(orgSlug!),
    enabled: !!orgSlug,
  })

  if (isLoading) {
    return <Skeleton className="h-5 w-32" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-sm">
        Select project
        <ChevronsUpDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={12}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {data?.projects.map((project) => (
            <DropdownMenuItem key={project.id} asChild>
              <Link href={`/org/${orgSlug}/project/${project.slug}`}>
                <Avatar className="mr-2 size-4">
                  {project.avatarUrl && (
                    <AvatarImage src={project.avatarUrl} />
                  )}
                  <AvatarFallback />
                </Avatar>
                <span className="line-clamp-1">{project.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/org/${orgSlug}/create-project`}>
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Uso condicional no Header

```tsx
// No header component
{canViewProjects && (
  <>
    <Slash className="size-3 -rotate-[24deg] text-border" />
    <ProjectSwitcher />
  </>
)}
```

## Comparacao: hook use vs react-query

```typescript
// Com hook use (React 19) — simples mas sem features
const projects = use(getProjects(orgSlug!))

// Com react-query — cache, loading, error, dedup
const { data, isLoading, error } = useQuery({
  queryKey: [orgSlug, 'projects'],
  queryFn: () => getProjects(orgSlug!),
  enabled: !!orgSlug,
})
```