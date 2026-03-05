# Code Examples: Exibindo Organizacao Ativa com Middleware

## 1. Estrutura de pastas para rotas de organizacao

```
src/app/
├── page.tsx                    # Home (sem org ativa)
└── org/
    └── [slug]/
        └── page.tsx            # Pagina da organizacao (lista projetos)
```

A pasta `[slug]` indica um parametro dinamico no Next.js App Router.

## 2. Middleware completo

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

### Passo a passo:

1. `request.nextUrl.pathname` — extrai o path da URL (ex: `/org/acme-admin`)
2. `NextResponse.next()` — cria response que permite acesso a rota
3. `pathname.startsWith('/org')` — verifica se e rota de organizacao
4. `pathname.split('/')` — divide em `['', 'org', 'acme-admin']`
5. `[, , slug]` — desestrutura ignorando primeiros 2 elementos
6. `response.cookies.set('org', slug)` — salva slug no cookie
7. `response.cookies.delete('org')` — limpa quando fora de `/org`

## 3. Organization Switcher com cookie

```typescript
// src/components/organization-switcher.tsx
import { cookies } from 'next/headers'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export async function OrganizationSwitcher() {
  const currentOrg = cookies().get('org')?.value ?? null

  // Busca organizacoes do backend
  const organizations = await getOrganizations()

  // Encontra a organizacao ativa pelo slug do cookie
  const currentOrganization = organizations.find(
    (org) => org.slug === currentOrg,
  )

  return (
    <div>
      {currentOrganization ? (
        <>
          <Avatar className="size-4">
            {currentOrganization.avatarUrl && (
              <AvatarImage src={currentOrganization.avatarUrl} />
            )}
            <AvatarFallback />
          </Avatar>
          <span className="truncate text-left">
            {currentOrganization.name}
          </span>
        </>
      ) : (
        <span className="text-muted-foreground">Select organization</span>
      )}
    </div>
  )
}
```

### Detalhes:

- `cookies().get('org')?.value` — le o cookie; pode ser `undefined` se nao existir
- `?? null` — converte `undefined` para `null` explicitamente
- `.find()` — busca na lista de organizacoes a que tem o slug igual ao cookie
- `truncate` — classe Tailwind que aplica `overflow-hidden` + `text-ellipsis`
- `text-left` — alinha texto a esquerda dentro do botao

## 4. Pagina da organizacao

```typescript
// src/app/org/[slug]/page.tsx
export default async function Organization() {
  return (
    <div>
      <h1>Projects</h1>
      {/* Lista de projetos da organizacao */}
    </div>
  )
}
```

A pagina da organizacao serve como listagem de projetos — nao existe uma "home" separada da organizacao.

## 5. Verificando cookies no DevTools

Para verificar se o middleware esta funcionando:

1. Abra DevTools (F12)
2. Va em **Application** > **Cookies**
3. Observe o cookie `org` mudando conforme voce navega:
   - `/org/acme-admin` → cookie `org = acme-admin`
   - `/org/acme-member` → cookie `org = acme-member`
   - `/` (home) → cookie `org` removido

## 6. Ajuste visual do avatar no header

```typescript
// Profile button — reduzir tamanho do avatar
<Avatar className="size-8">
  {/* size-8 em vez de size-10 para melhor proporcao no header */}
</Avatar>
```