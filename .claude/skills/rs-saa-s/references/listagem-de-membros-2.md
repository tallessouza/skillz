---
name: rs-saas-nextjs-rbac-listagem-membros
description: "Generates member listing pages with avatars, roles, and permission-gated actions in Next.js SaaS applications. Use when user asks to 'list members', 'show team members', 'create members page', 'display organization users', or 'build user management UI'. Applies patterns: parallel data fetching with Promise.all, permission-based UI rendering, current user highlighting, ownership indicators. Make sure to use this skill whenever building member/team listing interfaces in Next.js with RBAC. Not for authentication flows, invite forms, or role editing selectors."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: frontend
  tags: [saas, nextjs, ui, tailwind, members]
---

# Listagem de Membros com RBAC

> Ao construir listagens de membros em SaaS, combine fetching paralelo, verificacao de permissoes granulares e indicadores visuais de identidade (eu/owner).

## Rules

1. **Use Promise.all para requests independentes** — `Promise.all([getMembership(), getMembers(), getOrganization()])` porque as requests nao dependem uma da outra e rodam ao mesmo tempo
2. **Gate componentes por permissao** — renderize `<Invites />` e `<MemberList />` condicionalmente baseado em `permissions.can()`, porque diferentes roles veem diferentes secoes
3. **Destaque o usuario logado** — mostre "(me)" ao lado do nome quando `member.userId === membership.userId`, porque ajuda o usuario a se localizar na lista
4. **Indique o owner da organizacao** — mostre icone de coroa + "owner" quando `organization.ownerId === member.userId`, porque torna a hierarquia visivel
5. **Parse organization com schema de auth** — use `organizationSchema.parse(organization)` antes de passar para checagem de permissoes, porque o formato do banco difere do formato esperado pelo pacote de autorizacao
6. **Configure remote patterns para avatars** — adicione hostnames de avatar (github, etc) no `next.config` em `images.remotePatterns`, porque Next.js bloqueia imagens externas por padrao

## How to write

### Pagina com permissoes e componentes condicionais

```typescript
export default async function MembersPage() {
  const permissions = await ability()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>
      <div className="space-y-4">
        {permissions?.can('get', 'Invite') && <Invites />}
        {permissions?.can('get', 'User') && <MemberList />}
      </div>
    </div>
  )
}
```

### Fetching paralelo no server component

```typescript
async function MemberList() {
  const currentOrg = await getCurrentOrg()

  const [membership, members, { organization }] = await Promise.all([
    getMembership(currentOrg!),
    getMembers(currentOrg!),
    getOrganization(currentOrg!),
  ])

  // ...render
}
```

### Indicadores de usuario e owner

```tsx
<span className="inline-flex items-center gap-2">
  {member.name}
  {member.userId === membership.userId && ' (me)'}
</span>
{organization.ownerId === member.userId && (
  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
    <Crown size={13} />
    owner
  </span>
)}
```

### Permissao granular com subject tipado

```typescript
const authOrganization = organizationSchema.parse(organization)

// Passa o subject tipado, nao apenas a string
permissions?.can('transfer_ownership', authOrganization)
```

## Example

**Before (requests sequenciais, sem permissoes):**
```typescript
async function MemberList() {
  const currentOrg = await getCurrentOrg()
  const membership = await getMembership(currentOrg!)
  const members = await getMembers(currentOrg!)
  const { organization } = await getOrganization(currentOrg!)

  return (
    <div>
      {members.map(member => (
        <div key={member.id}>
          <span>{member.name}</span>
          <button>Transfer ownership</button>
        </div>
      ))}
    </div>
  )
}
```

**After (com this skill applied):**
```typescript
async function MemberList() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const [membership, members, { organization }] = await Promise.all([
    getMembership(currentOrg!),
    getMembers(currentOrg!),
    getOrganization(currentOrg!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>
      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="py-2.5" style={{ width: 48 }}>
                  <Avatar>
                    <AvatarFallback />
                    {member.avatarUrl && (
                      <Image
                        src={member.avatarUrl}
                        width={32}
                        height={32}
                        className="aspect-square size-full"
                        alt=""
                      />
                    )}
                  </Avatar>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center gap-2 font-medium">
                      {member.name}
                      {member.userId === membership.userId && ' (me)'}
                    </span>
                    {organization.ownerId === member.userId && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Crown size={13} /> owner
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    {permissions?.can('transfer_ownership', authOrganization) && (
                      <Button size="sm" variant="ghost">
                        <ArrowLeftRight className="mr-2 size-4" />
                        Transfer ownership
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Multiplas requests independentes no server component | `Promise.all()` para paralelizar |
| Permissao depende de subject especifico (nao generico) | Parse com schema do pacote de auth antes de passar para `can()` |
| Imagens de dominio externo no Next.js | Adicionar hostname em `next.config` `images.remotePatterns` |
| Componente importado do shadcn tem mesmo nome que do lucide | Verificar import — usar o do shadcn/ui para Table, Avatar etc |
| Botao de acao condicional por permissao | Checar `permissions?.can()` inline no JSX |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const membership = await ...; const members = await ...; const org = await ...` (sequencial) | `const [membership, members, { organization }] = await Promise.all([...])` |
| `permissions?.can('transfer_ownership', 'Organization')` (string generica) | `permissions?.can('transfer_ownership', organizationSchema.parse(organization))` (subject tipado) |
| `<button>Transfer</button>` sem checar permissao | `{permissions?.can('transfer_ownership', authOrg) && <Button>...</Button>}` |
| `import { Table } from 'lucide-react'` | `import { Table } from '@/components/ui/table'` |
| Avatar sem fallback | `<Avatar><AvatarFallback />{img && <Image ... />}</Avatar>` |

## Troubleshooting

### Permissao retorna resultado inesperado
**Symptom:** `ability.can()` retorna valor incorreto
**Cause:** A role do usuario nao esta mapeada corretamente ou o subject nao tem __typename
**Fix:** Verifique que `defineAbilityFor` recebe o usuario com role correta e que objetos tem `__typename`

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
