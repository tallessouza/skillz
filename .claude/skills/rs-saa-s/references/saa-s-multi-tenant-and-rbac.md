---
name: rs-saas-nextjs-rbac-multi-tenant-rbac
description: "Enforces SaaS multi-tenant architecture and RBAC/ABAC permission patterns when designing or building SaaS applications. Use when user asks to 'create a SaaS', 'add permissions', 'implement RBAC', 'design multi-tenant', 'add roles', or 'handle authorization'. Applies rules: no subdomain-per-tenant unless public pages needed, no database-per-tenant, roles and permissions in code not database, membership table pattern, RBAC+ABAC combined. Make sure to use this skill whenever architecting a SaaS or permission system. Not for authentication flows, login/signup UI, or OAuth integration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: fundamentos
  tags: [saas, nextjs, oauth, github]
---

# SaaS Multi-Tenant & RBAC

> Permissoes e roles pertencem ao codigo, nao ao banco de dados — o banco so armazena o que o usuario pode mutar.

## Rules

1. **Multi-tenant nao significa multi-subdominio** — use subdominio apenas quando a empresa precisa de paginas publicas (ex: plataforma de membros, loja), porque subdominio sem necessidade so traz complexidade desnecessaria
2. **Multi-tenant nao significa banco por empresa** — use foreign key (organization_id) no mesmo banco, porque 98% dos SaaS nao precisam de isolamento fisico de dados
3. **Roles e permissoes ficam no codigo** — se o usuario nao pode criar roles customizadas, nao ha razao para essas tabelas existirem no banco, porque o banco so deve armazenar dados mutaveis pelo usuario
4. **Use membership table como ponte** — a relacao usuario-empresa passa por uma tabela `members`/`memberships` que carrega a role, porque um usuario pode pertencer a varias organizacoes com roles diferentes em cada uma
5. **Combine RBAC + ABAC** — RBAC para controle alto nivel (membro pode criar projeto), ABAC para granularidade (membro pode editar projeto que ele criou), porque uma estrategia sozinha nao cobre todos os cenarios
6. **Roles podem ser array** — um usuario pode ter mais de uma role na mesma organizacao (ex: financeiro + membro), porque isso evita criar roles compostas artificiais

## How to write

### Schema do banco (membership pattern)

```typescript
// Tabelas necessarias — SEM tabela de roles ou permissions
model Organization {
  id      String   @id
  name    String
  members Member[]
}

model User {
  id      String   @id
  email   String
  members Member[]
}

model Member {
  id             String       @id
  role           Role         @default(MEMBER)
  organizationId String
  userId         String
  organization   Organization @relation(fields: [organizationId])
  user           User         @relation(fields: [userId])
}

enum Role {
  ADMIN
  MEMBER
  BILLING
}
```

### Permissoes no codigo

```typescript
// permissions.ts — fonte da verdade para RBAC
const permissions = {
  ADMIN: ['create:project', 'delete:project', 'update:project', 'list:projects', 'manage:billing', 'invite:member'],
  MEMBER: ['create:project', 'list:projects', 'update:own:project'],
  BILLING: ['manage:billing', 'list:invoices'],
} as const
```

### ABAC — verificacao baseada em atributos

```typescript
// Controle granular: verifica atributos da entidade
function canEditProject(user: Member, project: Project): boolean {
  if (user.role === 'ADMIN') return true
  return project.ownerId === user.userId
}
```

## Example

**Before (permissoes no banco — complexidade desnecessaria):**

```typescript
// 4 tabelas so para permissoes
const role = await db.role.findUnique({ where: { id: user.roleId } })
const permissions = await db.permission.findMany({ where: { roleId: role.id } })
const canCreate = permissions.some(p => p.name === 'create:project')
```

**After (permissoes no codigo — simples e auditavel):**

```typescript
// Zero queries para verificar permissao
import { permissions } from '@/config/permissions'

const member = await db.member.findFirst({
  where: { userId: user.id, organizationId: org.id }
})
const canCreate = permissions[member.role].includes('create:project')
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Empresa precisa de pagina publica propria | Use subdominio |
| SaaS interno/dashboard sem pagina publica | Sem subdominio, identifique por membership |
| Contrato governo/LGPD exige isolamento | Banco separado por empresa |
| SaaS padrao | Mesmo banco, foreign key para organization |
| Menos de 20 permissoes distintas | Roles fixas no codigo |
| 100+ permissoes (tipo AWS IAM) | Considere roles dinamicas no banco |
| Precisa verificar "dono do recurso" | ABAC (atributos da entidade) |
| Precisa verificar "cargo do usuario" | RBAC (role do member) |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Tabela `roles` + tabela `permissions` no banco para SaaS simples | `enum Role` no schema + objeto `permissions` no codigo |
| Um subdominio por empresa sem paginas publicas | Identificar empresa por membership do usuario logado |
| Um banco/schema por empresa sem exigencia legal | Foreign key `organizationId` no mesmo banco |
| `user.roleId` direto na tabela de usuarios | Tabela `members` com role, ligando user a organization |
| Role unica por membro | Array de roles ou multiplas memberships |
| RBAC sozinho para verificar "dono do recurso" | RBAC + ABAC combinados |

## Troubleshooting

### Comportamento inesperado apos implementar
**Symptom:** Feature funciona parcialmente ou com erros intermitentes
**Cause:** Dependencia nao instalada ou configuracao incompleta
**Fix:** Verifique que todas as dependencias estao instaladas com `pnpm install` e que o servidor foi reiniciado

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
