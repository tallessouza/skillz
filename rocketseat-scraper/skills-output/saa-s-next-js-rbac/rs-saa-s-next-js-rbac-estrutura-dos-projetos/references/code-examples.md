# Code Examples: Estrutura de Projetos Next.js

## Estrutura de pastas completa

```
app/
└── (app)/
    └── org/
        └── [slug]/
            ├── (projects)/              # Route group
            │   ├── page.tsx             # Pagina de projetos (home da org)
            │   └── project-list.tsx     # Componente de listagem
            ├── create-project/          # Rota real
            │   └── page.tsx
            └── settings/
                └── page.tsx
```

## page.tsx completo

```tsx
import { ability } from '@/auth/auth'
import { getCurrentOrg } from '@/auth/get-current-org'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ProjectList } from './project-list'

export default async function Projects() {
  const permissions = await ability()
  const currentOrg = getCurrentOrg()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrg}/create-project`}>
              <Plus className="size-4 mr-2" />
              Create project
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can('get', 'Project') ? (
        <ProjectList />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to see organization projects.
        </p>
      )}
    </div>
  )
}
```

## project-list.tsx completo

```tsx
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function ProjectList() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Project 01</CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Consequatur, quaerat.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center gap-1.5">
          <Avatar className="size-4">
            <AvatarImage src="https://github.com/diego3g.png" />
            <AvatarFallback />
          </Avatar>
          <span className="text-xs text-muted-foreground">
            Created by{' '}
            <span className="font-medium text-foreground">
              Diego Fernandes
            </span>{' '}
            a day ago
          </span>
          <Button variant="outline" size="xs" className="ml-auto">
            View
            <ArrowRight className="size-3 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
```

## Customizacao do Button — variant xs

No arquivo de configuracao do Button (ex: `components/ui/button.tsx`), adicionar o size `xs`:

```tsx
const buttonVariants = cva(
  // ... base classes
  {
    variants: {
      // ... outras variants
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        xs: 'h-6 px-2 text-xs',  // Nova variant
      },
    },
  }
)
```

## Checagem de permissao com CASL

```tsx
// ability retorna instancia do CASL
const permissions = await ability()

// Checar permissao especifica
permissions?.can('create', 'Project')  // boolean
permissions?.can('get', 'Project')     // boolean
permissions?.cannot('get', 'Project')  // boolean invertido
```

## Padrao Button + Link com asChild

```tsx
// O Button delega renderizacao pro Link
// Resultado: elemento <a> com estilos de botao + navegacao client-side
<Button size="sm" asChild>
  <Link href={`/org/${currentOrg}/create-project`}>
    <Plus className="size-4 mr-2" />
    Create project
  </Link>
</Button>
```