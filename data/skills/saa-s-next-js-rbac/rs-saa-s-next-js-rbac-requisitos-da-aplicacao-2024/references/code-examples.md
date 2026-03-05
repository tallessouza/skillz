# Code Examples: Requisitos de Aplicacao SaaS com RBAC

## Estrutura do README de Requisitos

O instrutor criou um README organizado por modulos. Aqui esta a estrutura recomendada para documentar requisitos de um SaaS com RBAC:

```markdown
# SaaS App Requirements

## Features

### Authentication
- [ ] Login with e-mail & password
- [ ] Login with GitHub (OAuth)
- [ ] Password recovery via e-mail
- [ ] Account creation

### Organizations
- [ ] Create organization
- [ ] List user organizations
- [ ] Update organization
- [ ] Shutdown organization
- [ ] Transfer organization ownership

### Members
- [ ] Invite member (e-mail + role)
- [ ] Accept invite
- [ ] Revoke pending invite
- [ ] List organization members
- [ ] Update member role

### Projects
- [ ] List projects
- [ ] Create project
- [ ] Update project
- [ ] Delete project

### Billing
- [ ] Get billing information
  - $20/project
  - $10/member (excluding billing role)

## Roles & Permissions

|                          | Admin | Member | Billing |
|--------------------------|-------|--------|---------|
| Create project           | ✅    | ✅     | ❌      |
| List projects            | ✅    | ✅     | ✅      |
| Update project           | ✅    | ⚠️ own | ❌      |
| Delete project           | ✅    | ⚠️ own | ❌      |
| Update organization      | ✅    | ❌     | ❌      |
| Shutdown organization    | ✅    | ❌     | ❌      |
| Transfer organization    | ✅    | ❌     | ❌      |
| Invite member            | ✅    | ❌     | ❌      |
| Revoke invite            | ✅    | ❌     | ❌      |
| Update member role       | ✅    | ❌     | ❌      |
| View billing             | ✅    | ❌     | ✅      |

> ⚠️ = Conditional: only if user is the resource owner
```

## Hierarquia de Entidades

```
User
├── belongs to many Organizations (via Member)
│   ├── has role: ADMIN | MEMBER | BILLING
│   └── Organization
│       ├── has many Members
│       ├── has many Projects
│       │   └── Project has owner (User who created)
│       ├── has many Invites (pending)
│       └── has Billing info (computed)
```

## Exemplo de Verificacao de Permissao Condicional

```typescript
// Permissao simples (role-based apenas)
function canCreateProject(role: Role): boolean {
  return role === 'ADMIN' || role === 'MEMBER'
}

// Permissao condicional (role + ownership)
function canUpdateProject(role: Role, userId: string, project: Project): boolean {
  if (role === 'ADMIN') return true
  if (role === 'MEMBER') return project.ownerId === userId
  return false
}

function canDeleteProject(role: Role, userId: string, project: Project): boolean {
  if (role === 'ADMIN') return true
  if (role === 'MEMBER') return project.ownerId === userId
  return false
}
```

## Exemplo de Calculo de Billing

```typescript
interface BillingInfo {
  projects: {
    amount: number
    unit: number
    price: number
  }
  members: {
    amount: number
    unit: number
    price: number
  }
  total: number
}

function calculateBilling(
  projectCount: number,
  memberCount: number,
  billingMemberCount: number
): BillingInfo {
  const PROJECT_PRICE = 20_00 // $20 in cents
  const MEMBER_PRICE = 10_00  // $10 in cents

  const billableMembers = memberCount - billingMemberCount

  return {
    projects: {
      amount: projectCount,
      unit: PROJECT_PRICE,
      price: projectCount * PROJECT_PRICE,
    },
    members: {
      amount: billableMembers,
      unit: MEMBER_PRICE,
      price: billableMembers * MEMBER_PRICE,
    },
    total: (projectCount * PROJECT_PRICE) + (billableMembers * MEMBER_PRICE),
  }
}
```

## Exemplo de Invite Flow

```typescript
// Criar convite
interface CreateInviteInput {
  email: string
  role: 'ADMIN' | 'MEMBER' | 'BILLING'
  organizationId: string
  invitedByUserId: string
}

// Restricao: apenas 1 billing por organizacao
async function createInvite(input: CreateInviteInput) {
  if (input.role === 'BILLING') {
    const existingBilling = await db.member.findFirst({
      where: {
        organizationId: input.organizationId,
        role: 'BILLING',
      },
    })

    if (existingBilling) {
      throw new Error('Organization already has a billing member')
    }
  }

  return db.invite.create({ data: input })
}

// Aceitar convite
async function acceptInvite(inviteId: string, userId: string) {
  const invite = await db.invite.findUnique({ where: { id: inviteId } })

  await db.member.create({
    data: {
      userId,
      organizationId: invite.organizationId,
      role: invite.role,
    },
  })

  await db.invite.delete({ where: { id: inviteId } })
}

// Revogar convite pendente
async function revokeInvite(inviteId: string) {
  await db.invite.delete({ where: { id: inviteId } })
}
```