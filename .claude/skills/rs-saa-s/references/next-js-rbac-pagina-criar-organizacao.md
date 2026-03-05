---
name: rs-saas-nextjs-pagina-criar-organizacao
description: "Applies Next.js form page creation patterns when building organization forms, settings pages, or CRUD pages in Next.js App Router. Use when user asks to 'create a form page', 'build an organization page', 'add a settings form', 'create a CRUD form', or 'build a page with checkbox and inputs'. Enforces layout extraction, inputMode usage, items-baseline alignment, and reusable form naming. Make sure to use this skill whenever creating form pages in Next.js App Router projects. Not for API routes, authentication flows, or database operations."
---

# Pagina de Formulario em Next.js App Router

> Ao criar paginas de formulario, extraia navegacao para o layout, reutilize componentes existentes e nomeie acoes de forma reutilizavel.

## Rules

1. **Extraia header/navegacao para o layout** — componentes compartilhados entre paginas vao no `layout.tsx`, porque evita duplicacao e garante consistencia
2. **Centralize conteudo no main do layout** — use `mx-auto w-full max-w-[1200px]` no main, porque todas as paginas filhas herdam o alinhamento
3. **Use `space-y` para espaçamento vertical** — tanto no layout quanto nos formularios, porque cria ritmo visual consistente sem margin manual
4. **Reutilize formularios existentes** — copie e adapte forms ja criados (ex: signup → create org), porque mantem padroes de UI consistentes
5. **Use `inputMode` para inputs especiais** — `inputMode="url"` em campos de dominio abre teclado com `.com` no mobile, porque melhora UX sem mudar o `type`
6. **Nomeie botoes de forma reutilizavel** — "Save organization" em vez de "Create organization", porque o mesmo form pode servir para criar e editar
7. **Use `items-baseline` para checkbox com texto** — alinha checkbox com a primeira linha do texto, porque `items-center` centraliza verticalmente e fica desalinhado com texto multi-linha

## How to write

### Layout com header compartilhado

```tsx
// app/(app)/layout.tsx
import { Header } from './header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        {children}
      </main>
    </div>
  )
}
```

### Pagina de formulario

```tsx
// app/(app)/create-organization/page.tsx
export default function CreateOrganization() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create organization</h1>
      {/* formulario aqui */}
    </div>
  )
}
```

### Input com inputMode

```tsx
<Input
  id="domain"
  name="domain"
  type="text"
  inputMode="url"
  placeholder="example.com"
/>
```

### Checkbox com label multi-linha

```tsx
<div className="flex items-baseline space-x-2">
  <Checkbox id="shouldAttachUsersByDomain" name="shouldAttachUsersByDomain" />
  <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
    <span className="text-sm font-medium leading-none">
      Auto-join new members
    </span>
    <p className="text-sm text-muted-foreground">
      This will automatically invite all members with same email domain
      to this organization.
    </p>
  </label>
</div>
```

## Example

**Before (tudo na page, sem layout):**
```tsx
// app/(app)/page.tsx
export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <h1>Projects</h1>
      </main>
    </div>
  )
}
```

**After (header no layout, page limpa):**
```tsx
// app/(app)/layout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        {children}
      </main>
    </div>
  )
}

// app/(app)/page.tsx
export default function Home() {
  return <p>Select an organization</p>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente aparece em todas as paginas do grupo | Mova para `layout.tsx` |
| Campo de dominio/URL no mobile | Use `inputMode="url"` com `type="text"` |
| Checkbox com texto explicativo | Use `items-baseline` na div wrapper |
| Form serve para criar e editar | Nomeie botao como "Save {entity}" |
| Label do ShadCN nao se encaixa | Use `<label>` nativo do HTML |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<Button>Create organization</Button>` (se form reutilizavel) | `<Button>Save organization</Button>` |
| `items-center` com checkbox + texto longo | `items-baseline` ou `items-start` |
| Header duplicado em cada page | Header no `layout.tsx` |
| `type="url"` para campo de dominio | `type="text" inputMode="url"` |
| Label do ShadCN para checkbox com descricao | `<label>` nativo com `space-y-1` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-pagina-criar-organizacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-pagina-criar-organizacao/references/code-examples.md)
