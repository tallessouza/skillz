# Code Examples: Listando Organizações

## 1. Função HTTP getOrganizations

Baseada no padrão do instrutor, onde cada endpoint tem sua função dedicada:

```typescript
// src/http/get-organizations.ts
import { api } from './api-client'

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations() {
  const result = await api
    .get('organizations')
    .json<GetOrganizationsResponse>()

  return result
}
```

O instrutor mencionou que a `role` também é retornada pelo backend, mas optou por não incluí-la no tipo porque não é necessária neste componente específico. Campos desnecessários ficam de fora.

## 2. OrganizationSwitcher completo

```tsx
import { getOrganizations } from '@/http/get-organizations'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export async function OrganizationSwitcher() {
  const { organizations } = await getOrganizations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>Selecionar organização</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {organizations.map((org) => (
          <DropdownMenuItem key={org.id} asChild>
            <Link href={`/org/${org.slug}`}>
              {org.avatarUrl ? (
                <Avatar>
                  <AvatarImage src={org.avatarUrl} />
                  <AvatarFallback>{org.name[0]}</AvatarFallback>
                </Avatar>
              ) : null}
              <span>{org.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## 3. Padrão de mapeamento com key e campos

```tsx
// O .map segue sempre o mesmo padrão:
// - key={org.id} — identificador único
// - Dados renderizados: name, avatarUrl
// - Link com slug para navegação
organizations.map((organization) => (
  <DropdownMenuItem key={organization.id} asChild>
    <Link href={`/org/${organization.slug}`}>
      {organization.avatarUrl && (
        <Avatar>
          <AvatarImage src={organization.avatarUrl} />
        </Avatar>
      )}
      <span>{organization.name}</span>
    </Link>
  </DropdownMenuItem>
))
```

## 4. Estrutura de rotas esperada

```
app/
├── org/
│   └── [slug]/
│       └── page.tsx    ← Ainda não implementada nesta aula
```

O instrutor mostra que clicar no link gera 404 porque a rota `/org/[slug]` ainda não existe — mas o link já funciona corretamente. Isso demonstra desenvolvimento incremental: primeiro o switcher, depois a página de destino.