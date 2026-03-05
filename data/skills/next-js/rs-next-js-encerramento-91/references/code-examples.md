# Code Examples: Redirect Apos Logout em Paginas Server-Rendered

## Exemplo do instrutor: fix no logout

O instrutor mostra o fluxo exato do bug e da correcao:

### Cenario do bug

1. Usuario faz login
2. Navega ate pagina de detalhes de uma issue (server-rendered)
3. Faz logout
4. Pagina continua mostrando conteudo autenticado (botoes de edicao, dados privados, etc.)

### Correcao aplicada

```typescript
// No componente de logout (Client Component)
import { useRouter } from 'next/navigation'

function LogoutHandler() {
  const router = useRouter()

  // O instrutor usa fetchOptions com onSuccess
  // A implementacao exata depende da lib de auth usada
  await logout({
    fetchOptions: {
      onSuccess: () => {
        router.push('/')
      }
    }
  })
}
```

### Por que `router.push('/')` e nao `window.location.href = '/'`

```typescript
// CORRETO — usa o sistema de navegacao do Next.js
router.push('/')

// FUNCIONA mas nao e ideal — faz full page reload, perde estado do framework
window.location.href = '/'

// FUNCIONA mas nao e ideal — recarrega a mesma pagina em vez de redirecionar
window.location.reload()

// BOM para revalidar a pagina atual sem mudar de rota
router.refresh()
```

## Variacao: usar router.refresh() quando quer ficar na mesma pagina

```typescript
// Se apos uma acao voce quer ficar na mesma pagina mas atualizar os Server Components:
async function handleAction() {
  await performServerAction()
  router.refresh() // Revalida os Server Components da rota atual
}
```

## Variacao: pagina com mix de Server e Client Components

```typescript
// layout.tsx (Server Component) — verifica auth
export default async function Layout({ children }) {
  const session = await getSession()

  return (
    <div>
      <Navbar user={session?.user} /> {/* Server-rendered */}
      {children}
    </div>
  )
}

// Navbar mostra o nome do usuario — server-rendered
// Apos logout SEM redirect, o nome continua aparecendo
// Apos logout COM router.push('/'), o layout e recalculado no servidor
```

## Pattern completo: auth guard com redirect

```typescript
// middleware.ts — protege rotas no servidor
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// logout-button.tsx — Client Component
'use client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/') // Forca recalculo de todos os Server Components
  }

  return <button onClick={handleLogout}>Sair</button>
}
```