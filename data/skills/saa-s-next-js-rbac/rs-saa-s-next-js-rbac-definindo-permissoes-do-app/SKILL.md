---
name: rs-saas-nextjs-rbac-permissoes-app
description: "Enforces CASL permission architecture patterns when writing authorization code for SaaS applications. Use when user asks to 'define permissions', 'setup RBAC', 'configure authorization', 'implement role-based access', or 'use CASL'. Applies rules: manage-all then deny-specific for admins, granular grants for members, always pass subject instance for conditional checks. Make sure to use this skill whenever generating CASL ability definitions or role-based permission logic. Not for authentication, login flows, or session management."
---

# Definindo Permissoes com CASL

> Ao definir permissoes, parta do principio "negar tudo por padrao", conceda permissoes explicitamente, e use deny+re-grant para restricoes condicionais.

## Rules

1. **Admin: manage all, depois negue e re-conceda** — use `can('manage', 'all')` e depois `cannot` + `can` com condicional, porque negacoes com condicional nao funcionam apos `manage all`
2. **Negacoes condicionais sao proibidas apos manage all** — `cannot('update', 'Organization', { ownerId: { $ne: userId } })` NAO funciona; negue completamente e re-conceda com condicional positiva, porque o CASL ignora condicionais em `cannot` quando `manage all` esta ativo
3. **Member: nunca use manage all** — conceda permissoes uma a uma com `can()`, porque membros tem acesso restrito e granular
4. **Passe o objeto ao verificar permissoes condicionais** — `ability.can('delete', project)` e nao `ability.can('delete', 'Project')`, porque sem o objeto o CASL responde "pode deletar ALGUM projeto?" (true), nao "pode deletar ESTE projeto?"
5. **Billing role usa manage por subject** — `can('manage', 'Billing')` concede todas as acoes daquele subject sem conceder acesso global
6. **Organizacao: create nao pertence a roles** — criar organizacao e uma permissao global do usuario, nao de uma role dentro de uma organizacao, porque roles so existem dentro de uma organizacao ja existente

## How to write

### Admin permissions (deny + re-grant pattern)

```typescript
if (role === 'ADMIN') {
  can('manage', 'all')

  // Deny completely, then re-grant with condition
  cannot(['transfer_ownership', 'update'], 'Organization')
  can(['transfer_ownership', 'update'], 'Organization', {
    ownerId: { $eq: userId },
  })
}
```

### Member permissions (granular grants)

```typescript
if (role === 'MEMBER') {
  can('get', 'User')
  can(['create', 'get'], 'Project')
  can(['update', 'delete'], 'Project', { ownerId: { $eq: userId } })
}
```

### Billing permissions (manage por subject)

```typescript
if (role === 'BILLING') {
  can('manage', 'Billing')
}
```

## Example

**Before (erro comum — condicional no cannot):**

```typescript
can('manage', 'all')
cannot('transfer_ownership', 'Organization', {
  ownerId: { $ne: userId },
})
// BUG: condicional ignorada, usuario nao pode transferir NENHUMA org
```

**After (deny + re-grant correto):**

```typescript
can('manage', 'all')
cannot('transfer_ownership', 'Organization')
can('transfer_ownership', 'Organization', {
  ownerId: { $eq: userId },
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Role com acesso quase total | `manage all` + deny + re-grant |
| Role com acesso restrito | Grants individuais, sem `manage all` |
| Verificar permissao sobre instancia especifica | Passar o objeto: `ability.can('delete', projectInstance)` |
| Verificar se usuario TEM alguma permissao sobre subject | Passar string: `ability.can('delete', 'Project')` |
| Acao que independe de role na org | Nao incluir nas abilities (ex: criar organizacao) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `cannot('action', 'Subject', { field: { $ne: value } })` apos manage all | `cannot('action', 'Subject')` + `can('action', 'Subject', { field: { $eq: value } })` |
| `ability.can('delete', 'Project')` para checar instancia | `ability.can('delete', projectInstance)` |
| `can('create', 'Organization')` dentro de member role | Tratar criacao de org fora do sistema de roles |
| `can('manage', 'all')` para member/billing | `can('action', 'Subject')` granular |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
