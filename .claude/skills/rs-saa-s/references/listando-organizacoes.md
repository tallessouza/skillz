---
name: rs-saas-nextjs-listando-organizacoes
description: "Applies pattern for listing user organizations in Next.js SaaS apps with server components. Use when user asks to 'list organizations', 'create org switcher', 'fetch user orgs', or 'build organization dropdown'. Covers async data fetching, dropdown rendering with avatars, and slug-based routing. Make sure to use this skill whenever building multi-tenant org selection UI in Next.js. Not for org creation, settings, or RBAC permission checks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: frontend
  tags: [saas, nextjs, organization]
---

# Listando Organizações em SaaS Next.js

> Buscar organizações do usuário via função HTTP assíncrona e renderizar em dropdown com navegação por slug.

## Rules

1. **Crie função HTTP dedicada para buscar organizações** — `getOrganizations` separada do perfil, porque cada recurso da API merece sua própria função de acesso
2. **Retorne apenas os campos necessários para a UI** — `id`, `name`, `slug`, `avatarUrl`, porque dados extras aumentam payload sem necessidade
3. **Use server components assíncronos para data fetching** — `async function` no componente com `await`, porque evita useEffect e loading states desnecessários
4. **Navegue por slug, não por id** — `/org/${organization.slug}` na URL, porque slugs são legíveis e SEO-friendly
5. **Use `asChild` no DropdownMenuItem com Link do Next.js** — porque preserva a semântica do dropdown enquanto usa navegação client-side
6. **Trate avatar nulo com verificação condicional** — `avatarUrl` pode ser `null`, sempre verificar antes de renderizar

## How to write

### Função HTTP para buscar organizações

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
  const result = await api.get('organizations').json<GetOrganizationsResponse>()
  return result
}
```

### Organization Switcher com server component assíncrono

```tsx
// Transformar em componente assíncrono para fetch direto
export async function OrganizationSwitcher() {
  const { organizations } = await getOrganizations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{/* trigger UI */}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {organizations.map((org) => (
          <DropdownMenuItem key={org.id} asChild>
            <Link href={`/org/${org.slug}`}>
              {org.avatarUrl && <Avatar src={org.avatarUrl} />}
              <span>{org.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Example

**Before (dados mockados):**
```tsx
function OrganizationSwitcher() {
  const orgs = [
    { id: '1', name: 'Acme Inc', slug: 'acme' },
  ]
  return (
    <select onChange={(e) => router.push(e.target.value)}>
      {orgs.map(org => <option key={org.id}>{org.name}</option>)}
    </select>
  )
}
```

**After (com esta skill aplicada):**
```tsx
async function OrganizationSwitcher() {
  const { organizations } = await getOrganizations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Selecionar organização</DropdownMenuTrigger>
      <DropdownMenuContent>
        {organizations.map((org) => (
          <DropdownMenuItem key={org.id} asChild>
            <Link href={`/org/${org.slug}`}>
              {org.avatarUrl && <Avatar src={org.avatarUrl} />}
              <span>{org.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Componente precisa de dados do servidor | Torne-o `async` e use `await` direto |
| Item de dropdown precisa ser um link | Use `asChild` + `<Link>` do Next.js |
| Avatar pode ser nulo | Renderize condicionalmente com `&&` |
| Navegação entre orgs | Use slug na URL: `/org/${slug}` |
| Função HTTP já existe para recurso similar | Crie uma nova, cada recurso tem sua função |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `useEffect` + `useState` para buscar orgs em server component | `await getOrganizations()` direto no componente async |
| `router.push('/org/' + org.id)` | `<Link href={/org/${org.slug}}>` |
| `<DropdownMenuItem><Link>...</Link></DropdownMenuItem>` sem asChild | `<DropdownMenuItem asChild><Link>...</Link></DropdownMenuItem>` |
| `org.avatarUrl ? <Avatar /> : null` em todo lugar | `{org.avatarUrl && <Avatar />}` |
| Uma função HTTP genérica para tudo | Função dedicada `getOrganizations()` |

## Troubleshooting

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
