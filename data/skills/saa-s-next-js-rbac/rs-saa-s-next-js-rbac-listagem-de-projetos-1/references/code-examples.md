# Code Examples: Listagem de Projetos

## Componente completo de listagem

```tsx
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { getCurrentOrg } from '@/auth'
import { getProjects } from '@/http/get-projects'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

dayjs.extend(relativeTime)

export async function ProjectList() {
  const currentOrg = getCurrentOrg()
  const { projects } = await getProjects(currentOrg)

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {project.name}
            </CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Avatar>
              {project.owner.avatarUrl && (
                <AvatarImage src={project.owner.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate">{project.owner.name}</span>
            <span className="truncate">
              {dayjs(project.createdAt).fromNow()}
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
```

## Instalacao do dayjs

```bash
npm install dayjs
```

## Setup do plugin relativeTime

```typescript
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// Extender ANTES de usar fromNow()
dayjs.extend(relativeTime)

// Uso
dayjs('2024-01-15').fromNow() // "2 years ago"
dayjs(new Date()).fromNow()   // "a few seconds ago"
```

## Padrao de avatar condicional

```tsx
// Errado: quebra se avatarUrl e null
<AvatarImage src={project.owner.avatarUrl} />

// Correto: so renderiza se URL existe
{project.owner.avatarUrl && (
  <AvatarImage src={project.owner.avatarUrl} />
)}
<AvatarFallback />
```

## Fix de alinhamento de cards sem descricao

```tsx
// Sem fix: footer cola no header quando nao ha descricao
<Card>
  <CardHeader>...</CardHeader>
  <CardFooter>...</CardFooter>
</Card>

// Com fix: footer sempre fica embaixo
<Card className="flex flex-col justify-between">
  <CardHeader>...</CardHeader>
  <CardFooter className="mt-auto">...</CardFooter>
</Card>
```

## Funcao getProjects (HTTP layer)

```typescript
// Ja existia para o header, reusada na listagem
export async function getProjects(org: string) {
  const response = await api.get(`organizations/${org}/projects`)
  return response.data
}
```