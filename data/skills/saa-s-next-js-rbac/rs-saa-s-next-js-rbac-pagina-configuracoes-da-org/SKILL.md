---
name: rs-saas-next-rbac-pagina-config-org
description: "Generates organization settings pages with permission-based sections in Next.js SaaS apps. Use when user asks to 'create settings page', 'add org settings', 'build admin page with permissions', 'delete organization button', or 'shutdown organization'. Applies pattern: check permission then render section, server actions for destructive operations, form reuse across create/edit. Make sure to use this skill whenever building settings or admin pages with role-based visibility. Not for API route creation, authentication setup, or database schema design."
---

# Pagina de Configuracoes da Organizacao

> Construa paginas de configuracoes com secoes condicionais baseadas em permissoes RBAC, reutilizando formularios e usando server actions para operacoes destrutivas.

## Rules

1. **Cada secao protegida por permissao** — verifique `ability.can()` antes de renderizar cada card, porque usuarios sem permissao nao devem ver opcoes que nao podem usar
2. **Reutilize formularios entre criar e editar** — mova o form para uma pasta compartilhada (ex: pasta da org), porque duplicar forms gera divergencia inevitavel
3. **Server actions para operacoes destrutivas** — use `'use server'` com `<form action={}>`, porque garante execucao server-side e progressive enhancement
4. **Redirecione apos delecao** — chame `redirect('/')` apos deletar recursos, porque o usuario nao deve permanecer numa pagina de recurso inexistente
5. **Componentes de botao destrutivo separados** — extraia botoes como `ShutdownOrganizationButton` em componentes proprios, porque isola logica destrutiva e facilita adicionar confirmacao

## Steps

### Step 1: Criar a pagina de settings

```
org/[slug]/settings/page.tsx
```

```typescript
export default async function SettingsPage() {
  return (
    <div className="space-y-4">
      {/* Secoes condicionais aqui */}
    </div>
  )
}
```

### Step 2: Renderizar secoes por permissao

```typescript
const { membership, organization } = await getCurrentOrg()
const ability = getUserAbility(membership.role)

{ability.can('update', 'Organization') && (
  <Card>
    <CardHeader>
      <CardTitle>Organization settings</CardTitle>
      <CardDescription>Update your organization details</CardDescription>
    </CardHeader>
    <CardContent>
      <OrganizationForm />
    </CardContent>
  </Card>
)}

{ability.can('get', 'Billing') && (
  <Billing />
)}

{ability.can('delete', 'Organization') && (
  <Card>
    <CardHeader>
      <CardTitle>Shutdown organization</CardTitle>
      <CardDescription>
        This will delete all organization data including all projects.
        You cannot undo this action.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ShutdownOrganizationButton />
    </CardContent>
  </Card>
)}
```

### Step 3: Criar server action de delecao

```typescript
async function shutdownOrganizationAction() {
  'use server'

  const currentOrg = getCurrentOrg()
  await shutdownOrganization(currentOrg!)

  redirect('/')
}
```

### Step 4: Botao destrutivo com form

```typescript
function ShutdownOrganizationButton() {
  return (
    <form action={shutdownOrganizationAction}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="mr-2 size-4" />
        Shutdown organization
      </Button>
    </form>
  )
}
```

### Step 5: Adicionar chamada HTTP

```typescript
async function shutdownOrganization(org: string) {
  await api.delete(`organizations/${org}`)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario usado em criar e editar | Mova para pasta compartilhada da feature |
| Operacao destrutiva | Server action + form + variant="destructive" |
| Secao admin com restricao | Verifique permissao antes de renderizar |
| Apos deletar recurso | `redirect()` para pagina segura |
| Botao destrutivo em producao | Adicione dialog de confirmacao |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Mostrar form de edit sem checar permissao | `ability.can('update', 'Organization') && <Form />` |
| Duplicar form de create em edit | Mover form para local compartilhado |
| `onClick` handler para deletar recurso | `<form action={serverAction}>` com button submit |
| Permanecer na pagina apos deletar | `redirect('/')` apos delecao |
| Inline da logica destrutiva no JSX | Extrair componente `ShutdownButton` separado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
