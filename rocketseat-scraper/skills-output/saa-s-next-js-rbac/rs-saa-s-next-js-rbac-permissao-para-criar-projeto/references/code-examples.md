# Code Examples: Permissao para Criar Projeto

## Exemplo 1: Guard basico na pagina de criacao

Exatamente como demonstrado na aula:

```typescript
// app/(app)/org/[slug]/create-project/page.tsx
import { redirect } from 'next/navigation'
import { ability } from '@/auth/permissions'

export default async function CreateProjectPage() {
  const permissions = await ability()

  if (permissions.cannot('create', 'Project')) {
    redirect('/')
  }

  return (
    <div>
      <h1>Create Project</h1>
      {/* form content */}
    </div>
  )
}
```

## Exemplo 2: Referencia — como o header usa o mesmo padrao

O Diego menciona que o header ja usa `permissions` da mesma forma:

```typescript
// components/header.tsx (server component)
import { ability } from '@/auth/permissions'

export async function Header() {
  const permissions = await ability()

  return (
    <header>
      {permissions.can('create', 'Project') && (
        <Link href="/create-project">New Project</Link>
      )}
    </header>
  )
}
```

Nota: no header, usa-se `can()` para **mostrar condicionalmente** um elemento. Na pagina, usa-se `cannot()` para **bloquear acesso**. Sao usos complementares do mesmo objeto de permissao.

## Exemplo 3: ProjectSwitcher — guard implicito (sem codigo adicional necessario)

O Diego explica que o botao de criar no ProjectSwitcher nao precisa de guard adicional:

```typescript
// components/project-switcher.tsx
export async function ProjectSwitcher() {
  const permissions = await ability()

  // Se o usuario nao pode listar projetos, este componente
  // nem renderiza. E quem pode listar, pode criar.
  // Portanto, o botao "Create Project" aqui dentro
  // ja esta implicitamente protegido.

  if (permissions.cannot('get', 'Project')) {
    return null
  }

  return (
    <div>
      {/* lista de projetos */}
      <Button>Create Project</Button> {/* nao precisa de guard extra */}
    </div>
  )
}
```

## Exemplo 4: Variacao — guard com multiplas permissoes

Extrapolando o padrao para cenarios mais complexos:

```typescript
export default async function ProjectSettingsPage() {
  const permissions = await ability()

  if (permissions.cannot('update', 'Project')) {
    redirect('/')
  }

  // Verificacao adicional para secao de delete
  const canDelete = permissions.can('delete', 'Project')

  return (
    <div>
      <h1>Project Settings</h1>
      <UpdateProjectForm />
      {canDelete && <DeleteProjectSection />}
    </div>
  )
}
```

## Exemplo 5: Teste manual (fluxo descrito pelo Diego)

1. Acessar organizacao onde tem permissao total → pagina carrega normalmente
2. Copiar URL: `/org/acme-billing/create-project`
3. Trocar para organizacao com role `billing` (sem permissao de criar projeto)
4. Colar URL e dar Enter
5. Resultado: redirect automatico para `/` (home)