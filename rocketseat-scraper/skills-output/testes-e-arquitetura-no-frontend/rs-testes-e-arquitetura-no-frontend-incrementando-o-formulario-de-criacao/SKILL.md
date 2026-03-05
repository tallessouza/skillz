---
name: rs-testes-arq-frontend-form-validation
description: "Applies Zod + React Hook Form validation pattern in Next.js forms. Use when user asks to 'create a form', 'add form validation', 'validate inputs', 'use react hook form', or 'create a DTO'. Enforces DTO-first approach with Zod schemas, zodResolver integration, and ShadCN FormField/FormControl wrappers. Make sure to use this skill whenever building forms in Next.js with validation. Not for server actions, API validation, or backend-only schemas."
---

# Validacao de Formularios com Zod + React Hook Form

> Criar o DTO de validacao primeiro, depois integrar ao formulario via useForm + zodResolver + FormField wrappers.

## Rules

1. **DTO primeiro, formulario depois** — criar o schema Zod em `core/application/{domain}/` antes de tocar no componente, porque o DTO define o contrato e a tipagem automaticamente
2. **zodResolver como ponte** — nunca validar manualmente, usar `zodResolver(schema)` no useForm, porque centraliza validacao e tipagem num unico lugar
3. **FormField + FormControl para cada input** — envelopar inputs com FormField (control + name + render) e FormControl, porque isso conecta automaticamente erros, estados e acessibilidade
4. **Spread do field no input** — sempre passar `{...field}` no componente de input dentro do render, porque isso conecta onChange, onBlur, value e ref
5. **"use client" quando usar useForm** — React Hook Form exige client component, porque useForm usa hooks do React
6. **defaultValues sempre definidos** — passar valores iniciais vazios no useForm, porque evita inputs uncontrolled e warnings do React

## How to write

### DTO (Data Transfer Object)

```typescript
// core/application/prompts/createPrompt.dto.ts
import { z } from "zod"

export const createPromptSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio"),
  content: z.string().min(1, "Conteudo e obrigatorio"),
})

export type CreatePromptDto = z.infer<typeof createPromptSchema>
```

### Formulario com useForm + FormField

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form"
import { createPromptSchema, CreatePromptDto } from "@/core/application/prompts/createPrompt.dto"

export function PromptForm() {
  const form = useForm<CreatePromptDto>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: { title: "", content: "" },
  })

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Titulo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Conteudo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

## Example

**Before (sem validacao):**
```tsx
export function PromptForm() {
  return (
    <form action={createPrompt}>
      <Input name="title" placeholder="Titulo" />
      <Textarea name="content" placeholder="Conteudo" />
      <Button type="submit">Criar</Button>
    </form>
  )
}
```

**After (com Zod + RHF):**
```tsx
"use client"

export function PromptForm() {
  const form = useForm<CreatePromptDto>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: { title: "", content: "" },
  })

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Titulo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario com 1+ campos obrigatorios | Usar Zod schema + useForm |
| Precisa exibir erros inline | FormField + FormControl cuida automaticamente |
| Server component com form | Adicionar "use client" ao usar useForm |
| Varios formularios no mesmo dominio | Um DTO por operacao (createPrompt, updatePrompt) |
| Instalar dependencias | `zod react-hook-form @hookform/resolvers` + ShadCN `form` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Validar com `if (!title)` manual | `z.string().min(1, "msg")` no schema |
| `<input>` sem FormField wrapper | `<FormField control={form.control} name="x">` |
| Esquecer defaultValues | Sempre definir todos os campos com valores vazios |
| DTO no mesmo arquivo do componente | Arquivo separado em `core/application/{domain}/` |
| useForm sem generic type | `useForm<CreatePromptDto>()` com tipo do DTO |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
