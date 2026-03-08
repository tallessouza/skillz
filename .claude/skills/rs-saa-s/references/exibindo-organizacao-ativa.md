---
name: rs-saas-nextjs-rbac-org-ativa
description: "Applies Next.js middleware pattern for syncing URL state with cookies when building multi-tenant or multi-org applications. Use when user asks to 'sync URL with cookies', 'save active organization', 'middleware Next.js', 'multi-tenant header', or 'show current org in navbar'. Ensures server components access URL-derived state via cookies since they cannot read the URL directly. Make sure to use this skill whenever implementing organization/tenant switching in Next.js App Router. Not for API route middleware, authentication guards, or client-side state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: frontend
  tags: [saas, nextjs, ui, tailwind, organization, server-actions]
---

# Exibindo Organizacao Ativa com Middleware Next.js

> Sincronize estado da URL com cookies via middleware para que server components acessem informacoes de rota sem depender do client-side.

## Rules

1. **Use middleware para sincronizar URL com cookies** — server components no Next.js nao tem acesso a URL atual, entao cookies sao a unica forma de compartilhar estado entre client e server
2. **Salve no cookie quando o usuario esta na rota** — se `pathname` comeca com `/org`, extraia o slug e salve no cookie `org`
3. **Remova o cookie quando o usuario sai da rota** — se o usuario acessa rota fora de `/org`, delete o cookie para evitar estado stale
4. **Nao dependa apenas de click handlers para salvar estado** — o usuario pode trocar a URL diretamente no navegador, bypassing qualquer server action vinculada a um botao
5. **Use `cookies()` de `next/headers` nos server components** — acesse o cookie com nullish coalescing porque pode nao existir
6. **Use `truncate` ao inves de `line-clamp` para nomes longos** — `truncate` do Tailwind aplica `overflow-hidden` + `text-ellipsis` automaticamente

## How to write

### Middleware para sincronizar URL com cookies

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  if (pathname.startsWith('/org')) {
    const [, , slug] = pathname.split('/')
    response.cookies.set('org', slug)
  } else {
    response.cookies.delete('org')
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### Lendo o cookie no server component

```typescript
import { cookies } from 'next/headers'

export async function OrganizationSwitcher() {
  const currentOrg = cookies().get('org')?.value ?? null

  const organizations = await getOrganizations()
  const currentOrganization = organizations.find(
    (org) => org.slug === currentOrg,
  )

  return (
    <div>
      {currentOrganization ? (
        <>
          <Avatar src={currentOrganization.avatarUrl} />
          <span className="truncate text-left">
            {currentOrganization.name}
          </span>
        </>
      ) : (
        <span>Select organization</span>
      )}
    </div>
  )
}
```

## Example

**Before (server action no click — falha quando usuario troca URL manualmente):**
```typescript
// Problema: se usuario digitar URL diretamente, cookie nao atualiza
async function switchOrg(slug: string) {
  'use server'
  cookies().set('org', slug)
  redirect(`/org/${slug}`)
}

<button onClick={() => switchOrg(org.slug)}>{org.name}</button>
```

**After (middleware — funciona independente de como o usuario navega):**
```typescript
// middleware.ts intercepta QUALQUER navegacao
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  if (pathname.startsWith('/org')) {
    const [, , slug] = pathname.split('/')
    response.cookies.set('org', slug)
  } else {
    response.cookies.delete('org')
  }

  return response
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Server component precisa de info da URL | Salve via middleware em cookie, leia com `cookies()` |
| Usuario pode navegar por link E por URL direta | Use middleware, nunca dependa so de click handler |
| Cookie pode nao existir (pagina sem org) | Use nullish coalescing `?.value ?? null` |
| Texto de nome pode exceder espaco | Use `truncate` do Tailwind |
| Middleware deve ignorar rotas estaticas | Use o `config.matcher` padrao do Next.js |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Salvar org em estado client-side (useState) | Salvar em cookie via middleware |
| Depender de server action no click para sincronizar | Usar middleware que intercepta toda navegacao |
| Tentar acessar `usePathname()` em server component | Ler cookie com `cookies()` de `next/headers` |
| Usar `line-clamp-1` para truncar texto inline | Usar `truncate` do Tailwind |
| Deixar cookie stale quando usuario sai de `/org` | Deletar cookie no `else` do middleware |

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
