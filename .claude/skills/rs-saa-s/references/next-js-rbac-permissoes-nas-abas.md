---
name: rs-saas-nextjs-rbac-permissoes-abas
description: "Enforces tab-level permission gating in Next.js layouts when building RBAC or multi-tenant SaaS apps. Use when user asks to 'hide tabs based on permissions', 'conditionally show navigation', 'control access to tabs', 'implement role-based UI', or 'gate UI elements by permission'. Applies pattern: check abilities server-side, conditionally render navigation links, combine multiple permissions with OR for shared pages. Make sure to use this skill whenever building permission-aware navigation in React/Next.js. Not for API route protection, middleware guards, or database-level RLS."
---

# Permissoes nas Abas

> Controle a visibilidade de cada aba/link de navegacao verificando permissoes server-side antes de renderizar, garantindo granularidade por funcionalidade.

## Rules

1. **Resolva permissoes uma unica vez no componente pai** — chame `await ability()` uma vez e extraia todas as permissoes necessarias em constantes, porque multiplas chamadas async sao desperdicios e inconsistentes
2. **Nomeie cada permissao pelo que ela guarda** — `canUpdateOrganization`, `canGetMembers`, `canGetProjects`, `canGetBilling`, porque o nome deve refletir a acao protegida, nao o elemento de UI
3. **Combine permissoes com OR para paginas multi-proposito** — uma pagina de Settings que mostra configuracoes E billing deve aparecer se o usuario pode fazer QUALQUER uma das duas coisas, porque esconder completamente remove acesso legitimo
4. **Controle interno separado do controle de navegacao** — mostrar a aba e esconder conteudo interno sao decisoes independentes, porque o usuario pode ter permissao parcial
5. **Envolva cada link individualmente** — cada `NavLink` ou `Button` recebe seu proprio guard condicional, porque permissoes sao granulares por funcionalidade

## How to write

### Extrair permissoes do ability

```typescript
const permissions = await ability()

const canUpdateOrganization = permissions.can('update', 'Organization')
const canGetMembers = permissions.can('get', 'User')
const canGetProjects = permissions.can('get', 'Project')
const canGetBilling = permissions.can('get', 'Billing')
```

### Condicional simples por aba

```tsx
{canGetProjects && (
  <Button variant="ghost" asChild>
    <Link href={`/org/${currentOrg}/projects`}>Projects</Link>
  </Button>
)}

{canGetMembers && (
  <Button variant="ghost" asChild>
    <Link href={`/org/${currentOrg}/members`}>Members</Link>
  </Button>
)}
```

### Condicional combinada (OR) para paginas multi-proposito

```tsx
{(canUpdateOrganization || canGetBilling) && (
  <Button variant="ghost" asChild>
    <Link href={`/org/${currentOrg}/settings`}>Settings & Billing</Link>
  </Button>
)}
```

## Example

**Before (sem controle de permissao):**
```tsx
export async function Tabs() {
  return (
    <div>
      <Button asChild><Link href="/org/acme/projects">Projects</Link></Button>
      <Button asChild><Link href="/org/acme/members">Members</Link></Button>
      <Button asChild><Link href="/org/acme/settings">Settings</Link></Button>
    </div>
  )
}
```

**After (com permissoes granulares):**
```tsx
export async function Tabs() {
  const permissions = await ability()

  const canGetProjects = permissions.can('get', 'Project')
  const canGetMembers = permissions.can('get', 'User')
  const canUpdateOrganization = permissions.can('update', 'Organization')
  const canGetBilling = permissions.can('get', 'Billing')

  return (
    <div>
      {canGetProjects && (
        <Button asChild><Link href="/org/acme/projects">Projects</Link></Button>
      )}
      {canGetMembers && (
        <Button asChild><Link href="/org/acme/members">Members</Link></Button>
      )}
      {(canUpdateOrganization || canGetBilling) && (
        <Button asChild><Link href="/org/acme/settings">Settings</Link></Button>
      )}
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aba guarda uma unica funcionalidade | Guard simples: `{canX && <Tab />}` |
| Aba guarda multiplas funcionalidades | Guard com OR: `{(canX \|\| canY) && <Tab />}` |
| Usuario acessa aba mas nao todo o conteudo | Mostre a aba, controle conteudo interno separadamente |
| Pagina acessada diretamente via URL | Adicione redirect server-side na propria pagina |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Chamar `ability()` dentro de cada condicional | Chamar uma vez e extrair em constantes |
| `{role === 'admin' && <Tab />}` | `{canDoAction && <Tab />}` — verifique permissao, nao role |
| Esconder aba sem proteger a rota | Esconda a aba E proteja a pagina/API |
| `{!canUpdate && !canBilling ? null : <Tab />}` | `{(canUpdate \|\| canBilling) && <Tab />}` — OR positivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-permissoes-nas-abas/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-permissoes-nas-abas/references/code-examples.md)
