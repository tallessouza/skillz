---
name: rs-saas-nextjs-rbac-action-criacao-projeto
description: "Generates Next.js Server Actions for creating resources with org-scoped API routes. Use when user asks to 'create a server action', 'add project creation', 'implement create form action', or 'call org-scoped API from action'. Applies patterns: HTTP client wrapper, getCurrentOrg from cookies, non-null assertion for route params, org in URL not body. Make sure to use this skill whenever building CRUD actions in Next.js SaaS with multi-tenant org context. Not for API route handlers, database queries, or form UI components."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: server-actions
  tags: [saas, nextjs, project, server-actions]
---

# Action: Criacao de Projeto (Next.js Server Action com Org Context)

> Ao criar Server Actions que chamam APIs org-scoped, extraia a org dos cookies via getCurrentOrg e passe-a na URL, nunca no body.

## Rules

1. **Separe o HTTP client do action** — crie um arquivo `createProject.http` (ou `.ts`) que encapsula a chamada HTTP, porque isola a logica de request da logica de negocio
2. **Org vai na URL, nao no body** — a rota e `/organizations/${org}/projects`, porque a API usa o slug da org como path param para scoping
3. **Use getCurrentOrg() dentro da Server Action** — como Server Actions tem acesso a cookies, busque a org diretamente, porque evita prop drilling do client
4. **Non-null assertion para contexto garantido** — use `getCurrentOrg()!` quando a pagina garante que a org existe, porque o TypeScript nao sabe que a rota ja validou isso
5. **Body contem apenas dados do recurso** — envie so `name` e `description`, porque a org ja esta no path

## How to write

### HTTP Client wrapper

```typescript
// http/create-project.ts
interface CreateProjectRequest {
  org: string
  name: string
  description: string
}

export async function createProject({ org, name, description }: CreateProjectRequest) {
  // a org vai na URL, name e description no body
  const response = await api.post(`organizations/${org}/projects`, {
    json: { name, description },
  })
  return response
}
```

### Server Action

```typescript
'use server'

import { createProject } from '@/http/create-project'
import { getCurrentOrg } from '@/auth'

export async function createProjectAction(data: FormData) {
  const name = data.get('name') as string
  const description = data.get('description') as string

  // Server Action tem acesso a cookies — busca org diretamente
  const org = getCurrentOrg()!

  await createProject({ org, name, description })
}
```

## Example

**Before (org no body, sem separacao):**

```typescript
'use server'

export async function createProjectAction(data: FormData) {
  const name = data.get('name') as string
  const description = data.get('description') as string
  const org = data.get('org') as string // vindo do form como hidden field

  await fetch(`/api/projects`, {
    method: 'POST',
    body: JSON.stringify({ name, description, org }), // org no body
  })
}
```

**After (com esta skill aplicada):**

```typescript
'use server'

import { createProject } from '@/http/create-project'
import { getCurrentOrg } from '@/auth'

export async function createProjectAction(data: FormData) {
  const name = data.get('name') as string
  const description = data.get('description') as string
  const org = getCurrentOrg()! // dos cookies, nao do form

  await createProject({ org, name, description }) // org na URL via wrapper
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recurso pertence a uma org | Org no path param, nunca no body |
| Server Action precisa de contexto de sessao | Use cookies diretamente (getCurrentOrg, getToken) |
| TypeScript reclama de null | Use `!` quando a rota/page garante o valor |
| Novo endpoint CRUD | Crie wrapper HTTP separado primeiro, depois o action |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Passar org como hidden field no form | `getCurrentOrg()!` dentro do action |
| Org no body do request | Org no path: `/organizations/${org}/projects` |
| Fetch inline dentro do action | Wrapper HTTP separado (`create-project.ts`) |
| `const org = getCurrentOrg() ?? ''` | `const org = getCurrentOrg()!` quando contexto garante |
| Duplicar logica de createOrganization | Copie e adapte: troque rota e campos |

## Troubleshooting

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Cookie nao persiste entre requisicoes
**Symptom:** Token desaparece apos refresh da pagina
**Cause:** Cookie configurado sem `path: '/'` ou com `httpOnly` incorreto
**Fix:** Configure o cookie com `path: '/'` e verifique que `httpOnly` esta correto para o caso de uso

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
