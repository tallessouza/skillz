---
name: rs-saas-nextjs-listagem-projetos
description: "Applies project listing patterns when building Next.js pages that fetch and display collections of items as cards. Use when user asks to 'list projects', 'show items in cards', 'display a grid of resources', 'fetch and render a collection', or 'format dates with dayjs'. Covers data fetching with org context, conditional avatar rendering, relative time with dayjs, and card layout fixes. Make sure to use this skill whenever rendering lists of resources in a SaaS dashboard. Not for form creation, authentication, or API route implementation."
---

# Listagem de Projetos em Next.js

> Ao listar recursos em cards, busque dados com contexto organizacional, renderize condicionalmente campos opcionais, e use layout flexivel para manter alinhamento consistente.

## Rules

1. **Busque dados com contexto de organizacao** — use `getCurrentOrg()` para obter o slug e passe para a funcao de fetch, porque em SaaS multi-tenant todo request precisa do contexto da org
2. **Renderize avatares condicionalmente** — verifique `owner.avatarUrl` antes de renderizar `<AvatarImage>`, porque a imagem pode ser null mesmo quando o owner existe
3. **Use dayjs com relativeTime para datas** — `dayjs(date).fromNow()` em vez de formatar data absoluta, porque "3 days ago" comunica melhor que "2026-02-26"
4. **Aplique truncate em textos variaveis** — use `truncate` do Tailwind em nomes e datas para evitar quebra de layout nos cards
5. **Use flex-col + justify-between no card** — garante que o footer fica embaixo mesmo quando nao ha descricao, porque cards sem conteudo opcional ficam desalinhados

## How to write

### Busca de dados com org context

```typescript
import { getCurrentOrg } from '../auth'
import { getProjects } from '../http/get-projects'

export async function ProjectList() {
  const currentOrg = getCurrentOrg()
  const { projects } = await getProjects(currentOrg)
  // ...
}
```

### Mapeamento de projetos em cards

```tsx
{projects.map((project) => (
  <Card key={project.id} className="flex flex-col justify-between">
    <CardHeader>
      <CardTitle className="text-base font-medium">{project.name}</CardTitle>
      <CardDescription>{project.description}</CardDescription>
    </CardHeader>
    <CardFooter className="mt-auto">
      {project.owner.avatarUrl && (
        <AvatarImage src={project.owner.avatarUrl} />
      )}
      <span className="truncate">{project.owner.name}</span>
      <span className="truncate">{dayjs(project.createdAt).fromNow()}</span>
    </CardFooter>
  </Card>
))}
```

### Setup do dayjs com relativeTime

```typescript
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
```

## Example

**Before (sem tratamento de layout):**
```tsx
<Card>
  <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
  <AvatarImage src={project.owner.avatarUrl} />
  <span>Created by {project.owner.name}</span>
  <span>{project.createdAt}</span>
</Card>
```

**After (com esta skill aplicada):**
```tsx
<Card className="flex flex-col justify-between">
  <CardTitle className="text-base font-medium">{project.name}</CardTitle>
  {project.owner.avatarUrl && (
    <AvatarImage src={project.owner.avatarUrl} />
  )}
  <span className="truncate">{project.owner.name}</span>
  <span className="truncate">{dayjs(project.createdAt).fromNow()}</span>
</Card>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo de imagem pode ser null | Renderize condicionalmente com `&&` |
| Texto pode quebrar layout do card | Aplique `truncate` |
| Cards sem descricao ficam desalinhados | `flex flex-col justify-between` no card |
| Texto de contexto ocupa espaco sem valor | Remova labels como "Created by" — so o nome basta |
| Titulo de card muito grande | Reduza de `text-2xl font-bold` para `text-base font-medium` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `<AvatarImage src={owner.avatarUrl} />` sem check | `{owner.avatarUrl && <AvatarImage src={owner.avatarUrl} />}` |
| `new Date(project.createdAt).toLocaleDateString()` | `dayjs(project.createdAt).fromNow()` |
| `<span>Created by {name} on {date}</span>` | `<span>{name}</span> <span>{dayjs(date).fromNow()}</span>` |
| Card sem flex direction | `<Card className="flex flex-col justify-between">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
