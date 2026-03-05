---
name: rs-saas-nextjs-rbac-action-criacao-org
description: "Applies Next.js Server Action patterns with Zod validation when creating form submission logic. Use when user asks to 'create a server action', 'add form validation', 'handle form submit in Next.js', 'create organization form', or 'validate form with zod'. Enforces patterns: nullable field validation with refine, checkbox ON/OFF to boolean transform, cross-field validation with refine on object, useFormState integration. Make sure to use this skill whenever building forms with server actions in Next.js App Router. Not for API route handlers, client-side-only validation, or React Server Components without forms."
---

# Server Actions com Zod: Criacao de Organizacao

> Ao criar Server Actions com formularios, valide com Zod no servidor, use refine para validacoes condicionais, e transform para normalizar dados antes de enviar ao backend.

## Rules

1. **Use refine para campos nullable com validacao condicional** — `z.string().nullable()` nao aceita `.regex()` porque null nunca passa na regex. Use `.refine()` checando se o valor existe antes de validar, porque campos opcionais precisam ser validos quando preenchidos mas aceitar null
2. **Transforme checkbox ON/OFF para booleano com transform** — ShadCN/Radix checkbox envia `"on"` ou `"off"` como string, mas o backend espera booleano. Use `z.union()` + `.transform()` porque o mesmo schema sera usado em criacao (ON/OFF) e edicao (true/false do banco)
3. **Use refine no objeto para validacao cross-field** — quando um campo depende de outro (ex: dominio obrigatorio se autojoin ativo), aplique `.refine()` no `.object()` inteiro com `path` apontando pro campo que mostra o erro
4. **Separe formulario em Client Component** — a pagina e Server Component, o formulario e Client Component com `"use client"`, porque formularios precisam de interatividade (useFormState, eventos)
5. **Reutilize schemas entre criacao e edicao** — nomeie o schema genericamente (`organizationSchema` nao `createOrganizationSchema`), porque o mesmo schema serve para ambos os fluxos

## How to write

### Action com validacao Zod

```typescript
// actions.ts
'use server'

import { createOrganization } from '@/http/create-organization'
import { z } from 'zod'

const organizationSchema = z.object({
  name: z.string().min(4, { message: 'Please include at least 4 characters.' }),
  domain: z
    .string()
    .nullable()
    .refine(
      (value) => {
        if (value) {
          const domainRegex = /^[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
          return domainRegex.test(value)
        }
        return true // null e valido
      },
      { message: 'Please enter a valid domain.' },
    ),
  shouldAttachUsersByDomain: z
    .union([z.literal('on'), z.literal('off'), z.boolean()])
    .transform((value) => value === true || value === 'on')
    .default(false),
}).refine(
  (data) => {
    if (data.shouldAttachUsersByDomain && !data.domain) {
      return false
    }
    return true
  },
  {
    message: 'Domain is required when auto-join is enabled.',
    path: ['domain'],
  },
)
```

### Client Component com useFormState

```typescript
'use client'

import { useFormState } from '@/hooks/use-form-state'
import { createOrganizationAction } from './actions'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function OrganizationForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createOrganizationAction)

  return (
    <form onSubmit={handleSubmit}>
      {success === false && message && (
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {success === true && message && (
        <Alert variant="success">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {/* campos do formulario com errors?.name, errors?.domain etc */}
      <button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : 'Save organization'}
      </button>
    </form>
  )
}
```

## Example

**Before (validacao ingenue):**
```typescript
const schema = z.object({
  name: z.string(),
  domain: z.string().regex(/^[a-z]+\.[a-z]+$/), // quebra com null
  shouldAttachUsersByDomain: z.boolean(), // quebra com "on"/"off"
})
```

**After (com este skill aplicado):**
```typescript
const schema = z.object({
  name: z.string().min(4, { message: 'Please include at least 4 characters.' }),
  domain: z.string().nullable().refine((value) => {
    if (value) {
      const domainRegex = /^[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
      return domainRegex.test(value)
    }
    return true
  }, { message: 'Please enter a valid domain.' }),
  shouldAttachUsersByDomain: z
    .union([z.literal('on'), z.literal('off'), z.boolean()])
    .transform((value) => value === true || value === 'on')
    .default(false),
}).refine(
  (data) => !(data.shouldAttachUsersByDomain && !data.domain),
  { message: 'Domain is required when auto-join is enabled.', path: ['domain'] },
)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo opcional com formato especifico | `nullable()` + `refine()` com check de existencia |
| Checkbox ShadCN/Radix | `union(['on','off', boolean])` + `transform` para boolean |
| Campo A depende de campo B | `refine` no object com `path` pro campo que mostra erro |
| Mesmo form para criar e editar | Schema generico, aceita ambos os formatos de input |
| Validar regex em campo nullable | Nunca use `.regex()` direto, sempre `refine` |

## Anti-patterns

| Nunca escreva | Escreva em vez |
|---------------|----------------|
| `z.string().nullable().regex(...)` | `z.string().nullable().refine(v => !v \|\| regex.test(v))` |
| `z.boolean()` para checkbox | `z.union([z.literal('on'), z.literal('off'), z.boolean()]).transform(...)` |
| `createOrganizationSchema` (nome especifico) | `organizationSchema` (reutilizavel para edicao) |
| Validacao cross-field dentro do campo | `.refine()` no `.object()` com `path` |
| Form inline na pagina Server Component | Client Component separado com `"use client"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
