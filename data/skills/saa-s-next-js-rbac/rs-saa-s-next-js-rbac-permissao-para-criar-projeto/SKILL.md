---
name: rs-saas-nextjs-rbac-permissao-criar-projeto
description: "Enforces server-side permission checks in Next.js pages before rendering protected actions. Use when user asks to 'protect a page', 'check permissions in server component', 'redirect unauthorized users', 'guard a route', or 'block access to create page'. Applies pattern: check permission with cannot() in server component, redirect with next/navigation if unauthorized. Make sure to use this skill whenever implementing page-level authorization in Next.js App Router. Not for API route protection, middleware auth, or client-side permission checks."
---

# Permissao para Criar Projeto — Server Component Permission Guard

> Verifique permissoes no server component ANTES de renderizar a pagina, redirecionando usuarios sem acesso.

## Rules

1. **Verifique permissao no topo do server component** — use `cannot()` antes de qualquer renderizacao, porque o usuario nao deve ver nem o layout da pagina se nao tem acesso
2. **Use `redirect()` do `next/navigation`** — nao retorne JSX condicional, redirecione imediatamente, porque isso evita flash de conteudo proibido
3. **Prefira `cannot()` sobre `can()` para guards** — `if (permissions.cannot('create', 'Project'))` e mais legivel como guarda de seguranca, porque expressa a intencao de bloqueio
4. **Redirecione para a home ou pagina segura** — nunca para uma pagina que tambem exige permissao, porque pode causar loop de redirect
5. **Considere permissoes implicitas** — se quem lista tambem cria, o botao de criar ja esta protegido pelo guard de listagem, nao duplique verificacoes desnecessarias

## How to write

### Guard de permissao em page server component

```typescript
import { redirect } from 'next/navigation'
import { ability } from '@/auth/permissions'

export default async function CreateProjectPage() {
  const permissions = await ability()

  if (permissions.cannot('create', 'Project')) {
    redirect('/')
  }

  return (
    // ... page content
  )
}
```

## Example

**Before (sem verificacao — qualquer usuario acessa a pagina):**
```typescript
export default async function CreateProjectPage() {
  return (
    <form>
      <h1>Create Project</h1>
      {/* formulario acessivel a qualquer usuario */}
    </form>
  )
}
```

**After (com guard de permissao):**
```typescript
import { redirect } from 'next/navigation'
import { ability } from '@/auth/permissions'

export default async function CreateProjectPage() {
  const permissions = await ability()

  if (permissions.cannot('create', 'Project')) {
    redirect('/')
  }

  return (
    <form>
      <h1>Create Project</h1>
      {/* so renderiza se usuario tem permissao */}
    </form>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Pagina de criacao/edicao/delecao | Adicione guard com `cannot()` + `redirect()` no topo |
| Botao que leva a pagina protegida | Verifique se o guard da pagina-pai ja cobre (ex: listar implica criar) |
| Multiplas permissoes necessarias | Encadeie verificacoes: `cannot('create', 'Project') \|\| cannot('manage', 'Organization')` |
| Componente dentro de page ja protegida | Nao duplique o guard, a page-pai ja protege |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `if (!canCreate) return <p>Sem acesso</p>` | `if (permissions.cannot('create', 'Project')) redirect('/')` |
| Guard no client component com `useEffect` | Guard no server component antes do render |
| `redirect('/create-project')` como fallback de permissao | `redirect('/')` para pagina segura sem permissao |
| Duplicar guard no botao quando page-pai ja protege | Confiar no guard da page-pai se permissoes sao implicitas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
