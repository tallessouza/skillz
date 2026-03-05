---
name: rs-saas-nextjs-listando-projetos-dropdown
description: "Applies dropdown project switcher patterns when building Next.js navigation with dynamic routing, skeleton loading states, and organization/project switching. Use when user asks to 'create a project switcher', 'list projects in dropdown', 'add skeleton loading', 'build org navigation', or 'dynamic route switching'. Ensures proper loading states with Skeleton, conditional rendering, and flex layout fixes. Make sure to use this skill whenever building navigation dropdowns with async data in Next.js. Not for API routes, database queries, or backend authentication logic."
---

# Listando Projetos no Dropdown (Project Switcher)

> Ao construir navegacao com dados assincronos, sempre mostre estados de loading elegantes com Skeleton e organize rotas dinamicas por slug de organizacao e projeto.

## Rules

1. **Use Skeleton ao inves de Spinner** — componente `Skeleton` do shadcn/ui cria loading states elegantes, porque spinners genericos parecem amadores e nao representam o layout final
2. **Verifique dados antes de iterar** — cheque `if (data)` antes de `data.projects.map()`, porque dados async sao `undefined` no primeiro render
3. **Rotas dinamicas preservam contexto** — URLs devem conter tanto org slug quanto project slug (`/org/${org.slug}/project/${project.slug}`), porque a navegacao precisa manter o contexto da organizacao
4. **Skeleton deve espelhar o layout final** — dimensoes e formato do Skeleton devem corresponder ao componente real (avatar circular = `rounded-full`, texto = `h-4 w-full`), porque o usuario precisa antecipar o conteudo
5. **Use `shrink-0` em flex containers com Skeleton** — elementos de tamanho fixo dentro de flex containers precisam de `shrink-0`, porque `w-full` em siblings causa compressao indesejada
6. **Derive estado ativo dos params** — `currentProject` vem de `params.projectSlug` + `data.projects.find()`, porque a URL e a fonte de verdade do estado ativo

## How to write

### Skeleton loading state

```tsx
import { Skeleton } from '@/components/ui/skeleton'

{isLoading ? (
  <>
    <Skeleton className="size-4 shrink-0 rounded-full" />
    <Skeleton className="h-4 w-full" />
  </>
) : (
  <>
    <Avatar className="size-4" />
    <span>{currentProject?.name ?? 'Select project'}</span>
  </>
)}
```

### Listagem condicional de projetos

```tsx
{data && data.projects.map((project) => (
  <DropdownMenuItem key={project.id} asChild>
    <Link href={`/org/${org.slug}/project/${project.slug}`}>
      <Avatar className="size-4" />
      <span>{project.name}</span>
    </Link>
  </DropdownMenuItem>
))}
```

### Projeto ativo derivado dos params

```tsx
const { projectSlug } = useParams()

const currentProject =
  data && projectSlug
    ? data.projects.find((p) => p.slug === projectSlug)
    : null
```

### Icone de loading no chevron

```tsx
{isLoading ? (
  <Loader2 className="size-4 animate-spin" />
) : (
  <ChevronsUpDown className="size-4 shrink-0" />
)}
```

## Example

**Before (sem loading state, sem contexto de org):**
```tsx
<DropdownMenuTrigger>
  <span>{project?.name || 'Select project'}</span>
  <ChevronsUpDown />
</DropdownMenuTrigger>
<DropdownMenuContent>
  {projects.map((p) => (
    <Link href={`/project/${p.id}`}>{p.name}</Link>
  ))}
</DropdownMenuContent>
```

**After (com Skeleton, rotas corretas, flex fixes):**
```tsx
<DropdownMenuTrigger className="flex items-center gap-2">
  {isLoading ? (
    <>
      <Skeleton className="size-4 shrink-0 rounded-full" />
      <Skeleton className="h-4 w-full" />
    </>
  ) : (
    <>
      <Avatar className="size-4 shrink-0" />
      <span className="truncate">{currentProject?.name ?? 'Select project'}</span>
    </>
  )}
  {isLoading ? (
    <Loader2 className="size-4 shrink-0 animate-spin" />
  ) : (
    <ChevronsUpDown className="size-4 shrink-0" />
  )}
</DropdownMenuTrigger>
<DropdownMenuContent>
  {data?.projects.map((project) => (
    <DropdownMenuItem key={project.id} asChild>
      <Link href={`/org/${org.slug}/project/${project.slug}`}>
        <Avatar className="size-4" />
        <span>{project.name}</span>
      </Link>
    </DropdownMenuItem>
  ))}
  <DropdownMenuItem asChild>
    <Link href={`/org/${org.slug}/create-project`}>
      <PlusCircle className="size-4" />
      <span>Create project</span>
    </Link>
  </DropdownMenuItem>
</DropdownMenuContent>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dados async em dropdown trigger | Skeleton com dimensoes identicas ao conteudo real |
| Elemento fixo sendo comprimido em flex | Adicionar `shrink-0` |
| URL de navegacao entre entidades aninhadas | Preservar todos os slugs na rota (`/org/slug/project/slug`) |
| Icone de acao durante loading | Substituir por `Loader2` com `animate-spin` |
| Pagina de projeto ainda nao implementada | Criar pagina minima para evitar 404 |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<Link href={`/project/${p.id}`}>` | `<Link href={`/org/${org.slug}/project/${p.slug}`}>` |
| `{projects.map(...)}` sem null check | `{data && data.projects.map(...)}` |
| Spinner generico no dropdown | `<Skeleton>` espelhando layout final |
| `<Avatar>` sem `shrink-0` em flex | `<Avatar className="shrink-0">` |
| Loading text "Carregando..." | Skeleton visual que representa o conteudo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-listando-projetos-no-dropdown/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-listando-projetos-no-dropdown/references/code-examples.md)
