# Code Examples: Validacao de Formularios com Zod + React Hook Form

## 1. DTO completo com Zod

```typescript
// core/application/prompts/createPrompt.dto.ts
import { z } from "zod"

export const createPromptSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio"),
  content: z.string().min(1, "Conteudo e obrigatorio"),
})

export type CreatePromptDto = z.infer<typeof createPromptSchema>
// Resultado: { title: string; content: string }
```

## 2. Setup do useForm com zodResolver

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPromptSchema, CreatePromptDto } from "@/core/application/prompts/createPrompt.dto"

const form = useForm<CreatePromptDto>({
  resolver: zodResolver(createPromptSchema),
  defaultValues: {
    title: "",
    content: "",
  },
})
```

**Notas:**
- O generic `<CreatePromptDto>` garante autocomplete no `form.control` e `name`
- `defaultValues` deve ter todos os campos do schema, mesmo que vazios
- `zodResolver` importado de `@hookform/resolvers/zod` (nao importa automaticamente)

## 3. FormField com Input

```tsx
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input placeholder="Titulo do prompt" {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

**O `field` contem:** `{ onChange, onBlur, value, name, ref }`

## 4. FormField com Textarea

```tsx
<FormField
  control={form.control}
  name="content"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Textarea placeholder="Conteudo do prompt" {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

## 5. Formulario completo montado

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  createPromptSchema,
  type CreatePromptDto,
} from "@/core/application/prompts/createPrompt.dto"

export function CreatePromptForm() {
  const form = useForm<CreatePromptDto>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      title: "",
      content: "",
    },
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
                <Input placeholder="Titulo do prompt" {...field} />
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
                <Textarea placeholder="Conteudo do prompt" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Criar Prompt</Button>
      </form>
    </Form>
  )
}
```

## 6. Variacao: DTO com mais regras de validacao

```typescript
export const createPromptSchema = z.object({
  title: z
    .string()
    .min(1, "Titulo e obrigatorio")
    .max(100, "Titulo deve ter no maximo 100 caracteres"),
  content: z
    .string()
    .min(1, "Conteudo e obrigatorio")
    .max(5000, "Conteudo deve ter no maximo 5000 caracteres"),
  category: z.enum(["general", "code", "writing"], {
    required_error: "Selecione uma categoria",
  }),
})
```

## 7. Comandos de instalacao

```bash
# Dependencias de validacao e formulario
npm install zod react-hook-form @hookform/resolvers

# Componente form do ShadCN (instala FormField, FormControl, etc)
npx shadcn@latest add form
```