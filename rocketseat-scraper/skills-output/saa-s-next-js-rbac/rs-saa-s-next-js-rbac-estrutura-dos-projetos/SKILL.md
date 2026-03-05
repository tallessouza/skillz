---
name: rs-saas-nextjs-estrutura-projetos
description: "Enforces Next.js project structure patterns with route groups and co-located components when organizing feature pages. Use when user asks to 'create a page', 'organize components', 'structure a feature', 'list items in cards', or 'add conditional UI based on permissions'. Applies route group folders, permission-based rendering, grid card layouts, and co-located component patterns. Make sure to use this skill whenever scaffolding Next.js App Router pages with multiple related components. Not for API routes, database schemas, or authentication logic."
---

# Estrutura de Projetos Next.js

> Agrupe componentes relacionados a uma feature dentro de route groups para manter organizacao sem afetar URLs.

## Rules

1. **Use route groups para agrupar componentes de feature** — crie pasta `(feature-name)` com parenteses para nao gerar segmento na URL, porque permite co-locar componentes sem poluir o roteamento
2. **Co-locate componentes da feature na mesma pasta** — `project-list.tsx` fica dentro de `(projects)/`, porque facilita encontrar tudo relacionado a aquela feature
3. **Condicione UI por permissao, nao por role** — use `ability.can('get', 'Project')` em vez de checar `role === 'admin'`, porque roles podem mudar mas permissoes sao estaveis
4. **Mostre fallback quando sem permissao** — em vez de redirect, exiba mensagem informativa, porque o usuario pode nao ter permissao em nenhuma rota alternativa
5. **Use grid com cards para listagens** — `grid grid-cols-3 gap-4` com Card components, porque cria layout consistente e responsivo
6. **Limite texto longo com line-clamp** — use `line-clamp-2` ou `line-clamp-3` em descricoes, porque evita cards com alturas inconsistentes

## How to write

### Route group com componentes co-locados

```
app/
└── (app)/
    └── org/
        └── [slug]/
            └── (projects)/       # Route group — nao gera URL
                ├── page.tsx      # Pagina principal
                └── project-list.tsx  # Componente co-locado
```

### Renderizacao condicional por permissao

```tsx
import { ability } from '@/auth/auth'

export default async function Projects() {
  const permissions = await ability()
  const currentOrg = getCurrentOrg()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>

        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrg}/create-project`}>
              <Plus className="size-4 mr-2" />
              Create project
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can('get', 'Project') ? (
        <ProjectList />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to see organization projects.
        </p>
      )}
    </div>
  )
}
```

### Card de listagem com avatar e metadata

```tsx
<div className="grid grid-cols-3 gap-4">
  {projects.map((project) => (
    <Card key={project.id}>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription className="line-clamp-2 leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center gap-1.5">
        <Avatar className="size-4">
          <AvatarImage src={project.owner.avatarUrl} />
          <AvatarFallback />
        </Avatar>
        <span className="text-xs text-muted-foreground">
          Created by{' '}
          <span className="font-medium text-foreground">
            {project.owner.name}
          </span>{' '}
          {formatDistanceToNow(project.createdAt, { addSuffix: true })}
        </span>
        <Button variant="outline" size="xs" className="ml-auto">
          View <ArrowRight className="size-3 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

## Example

**Before (tudo no page.tsx, sem organizacao):**
```tsx
// app/(app)/org/[slug]/page.tsx — componente monolitico
export default async function Page() {
  const user = await getUser()
  if (user.role !== 'admin') return <p>No access</p>

  return (
    <div>
      <h1>Projects</h1>
      <button>Create</button>
      {projects.map(p => <div>{p.name}</div>)}
    </div>
  )
}
```

**After (route group + componentes co-locados + permissoes):**
```tsx
// app/(app)/org/[slug]/(projects)/page.tsx
export default async function Page() {
  const permissions = await ability()
  const currentOrg = getCurrentOrg()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrg}/create-project`}>
              <Plus className="size-4 mr-2" />
              Create project
            </Link>
          </Button>
        )}
      </div>
      {permissions?.can('get', 'Project') ? (
        <ProjectList />
      ) : (
        <p className="text-sm text-muted-foreground">
          You are not allowed to see organization projects.
        </p>
      )}
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Feature tem 2+ componentes | Criar route group `(feature)` |
| Botao depende de permissao | Checar `ability.can()`, nao role |
| Usuario sem permissao | Mostrar mensagem, nao redirect |
| Listagem de items | Grid com Card components |
| Descricao longa em card | `line-clamp-2` ou `line-clamp-3` |
| Botao pequeno em card footer | Criar variant `xs` no button |
| Botao deve navegar | `asChild` + `Link` do Next.js |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `if (role === 'admin')` | `permissions?.can('create', 'Project')` |
| Redirect quando sem permissao (pode causar loop) | Mensagem inline `text-muted-foreground` |
| Todos componentes no `page.tsx` | Route group + componentes separados |
| `<div>{items.map(i => <div>{i.name}</div>)}</div>` | Grid com Card/CardHeader/CardFooter |
| Avatar sem size em contexto compacto | `<Avatar className="size-4">` |
| Texto de metadata sem hierarchy | `font-medium text-foreground` no nome, `text-xs text-muted-foreground` no resto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
