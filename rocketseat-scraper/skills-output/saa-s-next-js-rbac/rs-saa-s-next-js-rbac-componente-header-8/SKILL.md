---
name: rs-saas-next-rbac-componente-header
description: "Applies Next.js authenticated layout and header component patterns when building SaaS dashboards. Use when user asks to 'create a header', 'add user profile menu', 'build authenticated layout', 'add logout button', or 'organize Next.js route groups'. Enforces anchor tags for API route links instead of Next Link to prevent prefetch side-effects. Make sure to use this skill whenever building authenticated app shells in Next.js. Not for authentication flow, API routes, or backend logic."
---

# Componente Header — Next.js SaaS

> Organize rotas autenticadas em route groups, construa headers com profile dropdown, e use anchor tags para links de API routes.

## Rules

1. **Use route groups para separar contextos** — `(app)` para usuario autenticado, `(auth)` para login/registro, porque agrupa arquivos sem afetar a URL
2. **Layout do route group valida autenticacao** — redirecione para `/auth/sign-in` se nao autenticado, porque centraliza a protecao de rotas
3. **Nao fixe elementos no layout prematuramente** — comece com layout minimo (apenas children), adicione header/sidebar apenas quando confirmar que todas as paginas compartilham, porque evita refatoracao
4. **Use anchor HTML para links de API routes** — `<a href="/api/auth/sign-out">` nunca `<Link>`, porque o prefetch do Next.js pode executar a rota antes do clique (ex: deslogar o usuario sem querer)
5. **Use cores semanticas do design system** — `text-muted-foreground` ao inves de `text-zinc-400`, porque se adaptam automaticamente entre tema light e dark
6. **Avatar com fallback de iniciais** — sempre implemente `AvatarFallback` com as iniciais do nome do usuario, porque a imagem pode falhar no carregamento

## How to write

### Route group para usuario autenticado

```typescript
// src/app/(app)/layout.tsx
import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return <>{children}</>
}
```

### Header com profile dropdown

```typescript
// src/components/header.tsx
export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Logo + Org/Project selectors */}
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications, theme toggle, profile */}
        <ProfileButton />
      </div>
    </div>
  )
}
```

### Logout com anchor (nunca Link)

```typescript
// CORRETO: anchor para API route
<DropdownMenuItem asChild>
  <a href="/api/auth/sign-out">
    <LogOut className="mr-2 size-4" />
    Sign out
  </a>
</DropdownMenuItem>

// ERRADO: Link faz prefetch e pode executar logout
<Link href="/api/auth/sign-out">Sign out</Link>
```

### Avatar com fallback de iniciais

```typescript
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

// No componente:
{user.avatarUrl && (
  <Avatar>
    <AvatarImage src={user.avatarUrl} />
    {user.name && <AvatarFallback>{getInitials(user.name)}</AvatarFallback>}
  </Avatar>
)}
```

## Example

**Before (problemas comuns):**
```typescript
// Link para rota de API — prefetch pode deslogar usuario
<Link href="/api/auth/sign-out">Logout</Link>

// Cor hardcoded — nao adapta entre temas
<span className="text-zinc-400">{user.email}</span>

// Sem fallback no avatar
<Avatar>
  <AvatarImage src={user.avatarUrl} />
</Avatar>
```

**After (com esta skill aplicada):**
```typescript
// Anchor para rota de API — sem prefetch
<a href="/api/auth/sign-out">Logout</a>

// Cor semantica — adapta automaticamente
<span className="text-muted-foreground">{user.email}</span>

// Avatar com fallback de iniciais
<Avatar>
  <AvatarImage src={user.avatarUrl} />
  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Link para pagina Next.js | Use `<Link>` do Next |
| Link para API route / route handler | Use `<a>` do HTML |
| Link externo | Use `<a>` do HTML |
| Layout compartilhado parcialmente | Nao coloque no layout, use componente importado por pagina |
| Dropdown trigger com conteudo customizado | Use `asChild` e monte estrutura flex interna |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `<Link href="/api/...">` | `<a href="/api/...">` |
| `className="text-zinc-400"` | `className="text-muted-foreground"` |
| `<Avatar>` sem `<AvatarFallback>` | `<Avatar>` com `<AvatarFallback>` contendo iniciais |
| Header fixo no layout antes de confirmar | Header como componente, importado onde necessario |
| Route group com nome que aparece na URL | Nome entre parenteses: `(app)`, `(auth)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
