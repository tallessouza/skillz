---
name: rs-saas-nextjs-rbac-obtendo-permissoes
description: "Applies centralized permission checking pattern in Next.js SaaS applications using CASL ability. Use when user asks to 'check permissions', 'implement RBAC', 'show component based on role', 'create ability function', or 'get user membership'. Follows pattern: getCurrentOrg → getCurrentMembership → defineAbilityFor → permissions.can(). Make sure to use this skill whenever implementing role-based access control in Next.js server components. Not for authentication flows, login/logout, or JWT token management."
---

# Obtendo Permissoes do Usuario

> Centralizar a verificacao de permissoes em uma unica funcao `ability()` que retorna as capacidades do usuario logado, permitindo checagem de permissoes em qualquer server component.

## Rules

1. **Separe funcoes utilitarias de auth** — `getCurrentOrg`, `getCurrentMembership`, `ability` sao funcoes distintas, porque cada uma tem responsabilidade unica e pode ser reutilizada independentemente
2. **Retorne null em vez de throw** — quando o usuario nao esta autenticado ou nao tem membership, retorne null, porque componentes compartilhados (como header) podem ser renderizados em paginas sem autenticacao
3. **Use optional chaining no consumidor** — `permissions?.can()` em vez de assumir que permissions existe, porque a funcao ability pode retornar null
4. **Compartilhe tipos entre front e back** — importe `Role` do pacote auth compartilhado, porque garante que mudancas no enum de roles propagam automaticamente
5. **Prefira cookies().get() encapsulado** — crie `getCurrentOrg()` para encapsular acesso ao cookie da organizacao, porque evita duplicacao e centraliza a logica

## Steps

### Step 1: Criar getCurrentOrg

```typescript
// auth.ts
export function getCurrentOrg() {
  return cookies().get('org')?.value ?? null
}
```

### Step 2: Criar getCurrentMembership

```typescript
// auth.ts
export async function getCurrentMembership() {
  const org = getCurrentOrg()
  if (!org) return null

  const { membership } = await getMembership(org)
  return membership
}
```

### Step 3: Criar rota HTTP getMembership

```typescript
// http/get-membership.ts
import type { Role } from '@saas/auth'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    userId: string
    organizationId: string
  }
}

export async function getMembership(org: string) {
  const result = await api.get(`organizations/${org}/membership`)
    .json<GetMembershipResponse>()
  return result
}
```

### Step 4: Criar funcao ability

```typescript
// auth.ts
import { defineAbilityFor } from '@saas/auth'

export async function ability() {
  const membership = await getCurrentMembership()
  if (!membership) return null

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}
```

### Step 5: Usar em server components

```typescript
// header.tsx
export async function Header() {
  const permissions = await ability()

  return (
    <div>
      {permissions?.can('get', 'Project') && <ProjectSwitcher />}
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente compartilhado (header, sidebar) | Use `permissions?.can()` com optional chaining |
| Pagina que exige autenticacao | Pode usar `permissions!.can()` ou fazer redirect |
| Novo role adicionado ao sistema | Importe Role do pacote auth compartilhado |
| Precisa do org slug | Use `getCurrentOrg()` em vez de acessar cookies diretamente |
| Membership retorna null | Nao mostre o elemento, nao lance erro |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `throw new Error()` quando membership e null em componente compartilhado | `return null` e use optional chaining |
| Duplicar `cookies().get('org')` em cada componente | Usar `getCurrentOrg()` centralizado |
| Definir tipo Role manualmente no frontend | Importar `Role` do pacote `@saas/auth` compartilhado |
| Verificar role diretamente (`if role === 'ADMIN'`) | Usar `permissions.can('action', 'Subject')` via CASL |
| Colocar toda logica de auth em uma unica funcao | Separar em `getCurrentOrg`, `getCurrentMembership`, `ability` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-obtendo-permissoes-do-usuario/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-obtendo-permissoes-do-usuario/references/code-examples.md)
