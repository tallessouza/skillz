---
name: rs-next-js-estrutura-pagina-de-issue
description: "Applies Next.js nested layout patterns and issue detail page structure when building detail/show pages in Next.js App Router. Use when user asks to 'create a detail page', 'build an issue page', 'add a nested layout', 'structure a show page', or 'reuse layout with different header'. Enforces layout encadeado pattern, component extraction for reuse, and status label mapping with asConst. Make sure to use this skill whenever creating detail views or nested layouts in Next.js App Router. Not for list pages, API routes, or server actions."
---

# Estrutura de Pagina de Detalhe com Layouts Encadeados (Next.js App Router)

> Paginas de detalhe usam layouts encadeados para variar o header sem duplicar estrutura, e extraem componentes compartilhados no momento em que o reuso aparece.

## Rules

1. **Use layout encadeado quando o header muda** — crie `layout.tsx` na pasta da rota (ex: `issues/layout.tsx`) em vez de duplicar logica condicional no layout pai, porque o App Router compoe layouts automaticamente
2. **Extraia componentes no segundo uso** — quando um componente (ex: `UserButton`) aparece em dois layouts, mova para `components/{categoria}/`, porque otimizacao prematura antes do reuso concreto e desperdicio
3. **Use `as const` em objetos de mapeamento de labels** — `const statusLabels = { backlog: 'Backlog', todo: 'TODO' } as const`, porque sem `as const` o TypeScript infere `string` generico e perde a tipagem exata
4. **Pagina de detalhe = container simples** — `max-w` fixo, centralizado com `mx-auto`, com `bg`, `border`, `rounded-xl`, porque paginas de detalhe nao precisam de grid complexo
5. **Botao de voltar com Link, nao button** — use `next/link` com `href` para a pagina anterior, porque navegacao deve ser acessivel e funcionar sem JavaScript
6. **Reuse estilos de badges/status via copia consciente** — se o badge de status ja existe em outra pagina, copie a estrutura e considere extrair componente apenas se aparecer uma terceira vez

## How to write

### Layout encadeado (nested layout)

```typescript
// app/issues/layout.tsx — layout especifico para issues (sem search)
export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4">
        <Logo />
        <UserButton />  {/* sem SearchInput */}
      </header>
      {children}
    </>
  )
}
```

### Status labels com as const

```typescript
const statusLabels = {
  backlog: 'Backlog',
  todo: 'TODO',
  inprogress: 'In Progress',
  done: 'Done',
} as const

// Uso: statusLabels[issue.status] — TypeScript sabe os valores exatos
```

### Estrutura da pagina de detalhe

```typescript
export default function IssuePage({ params }: { params: { id: string } }) {
  return (
    <main className="max-w-[900px] mx-auto w-full flex flex-col gap-4 p-6 bg-zinc-800 border border-zinc-500 rounded-xl">
      {/* Botao voltar */}
      <Link href="/" className="flex items-center gap-2 text-zinc-200 hover:text-zinc-100">
        <MoveLeft className="size-4" />
        <span className="text-xs">Back to board</span>
      </Link>

      {/* Status + acoes */}
      <div className="flex items-center gap-2">
        <span className="bg-zinc-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
          <ArchiveIcon className="size-3" />
          {statusLabels[issue.status]}
        </span>
        <LikeButton issueId={issue.id} likes={issue.likes} />
      </div>

      {/* Corpo */}
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl">{issue.title}</h1>
        <p className="text-zinc-100 text-sm leading-relaxed">{issue.description}</p>
      </div>
    </main>
  )
}
```

## Example

**Before (layout duplicado com condicional):**
```typescript
// app/layout.tsx — tentando cobrir board E issue
export default function Layout({ children }) {
  const pathname = usePathname()
  return (
    <header>
      <Logo />
      {!pathname.includes('/issues') && <SearchInput />}
      <UserButton />
    </header>
    {children}
  )
}
```

**After (layouts encadeados):**
```typescript
// app/(board)/layout.tsx — com search
<header>
  <Logo />
  <SearchInput />
  <UserButton />
</header>

// app/issues/layout.tsx — sem search
<header>
  <Logo />
  <UserButton />
</header>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Header muda entre secoes do app | Criar layout encadeado na pasta da rota |
| Componente aparece em 2 layouts | Extrair para `components/` |
| Componente aparece em 1 lugar so | Manter inline, nao extrair |
| Objeto mapeia enum para labels | Usar `as const` para tipagem exata |
| Pagina de detalhe simples | Container unico com max-w fixo, sem grid |
| Botao de voltar | `Link` do next/link, nunca `router.back()` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Condicional no layout pai baseado em pathname | Layout encadeado na subpasta |
| `useRouter().back()` para voltar | `<Link href="/">` com destino explicito |
| `statusLabels: Record<string, string>` | `statusLabels = { ... } as const` |
| Extrair componente no primeiro uso | Extrair quando aparece em 2+ lugares |
| Duplicar header inteiro entre paginas | Compartilhar componentes, variar via layout |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-estrutura-da-pagina-de-issue/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-estrutura-da-pagina-de-issue/references/code-examples.md)
