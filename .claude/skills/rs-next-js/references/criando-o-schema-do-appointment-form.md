---
name: rs-next-js-criando-schema-appointment-form
description: "Applies Zod schema validation with react-hook-form integration pattern when building forms in Next.js. Use when user asks to 'create a form', 'add form validation', 'setup zod schema', 'integrate react-hook-form', or 'build appointment form'. Enforces typed schemas, inferred types, zodResolver binding, and default values. Make sure to use this skill whenever creating validated forms in React/Next.js projects. Not for API validation, server-side schemas, or database models."
---

# Schema de Formulario com Zod + React Hook Form

> Defina o schema Zod primeiro, infira o tipo, e conecte ao react-hook-form via zodResolver — nunca tipar formularios manualmente.

## Rules

1. **Schema primeiro, tipo inferido** — defina o `z.object()` e use `z.infer<typeof schema>` para gerar o tipo, porque manter tipos manuais e schemas em sincronia e propenso a bugs
2. **Mensagens customizadas em portugues** — passe `{ message: "Campo obrigatório" }` em cada validacao, porque mensagens padrao do Zod sao tecnicas e em ingles
3. **zodResolver como ponte** — use `zodResolver(schema)` no `resolver` do useForm, porque isso conecta validacao Zod ao ciclo de vida do react-hook-form
4. **Default values tipados** — passe `defaultValues` com todas as propriedades do schema como strings vazias, porque o TypeScript infere e autocompleta os campos
5. **Campos complexos depois** — separe campos simples (strings) dos complexos (data/hora) no schema, porque campos com logica especial precisam de tratamento separado
6. **form.register com spread** — use `{...form.register("fieldName")}` nos inputs, porque isso conecta cada campo ao estado do formulario

## How to write

### Schema Zod com validacao

```typescript
import { z } from "zod"

const appointmentFormSchema = z.object({
  tutorName: z.string().min(3, { message: "O nome do tutor é obrigatório" }),
  petName: z.string().min(3, { message: "O nome do pet é obrigatório" }),
  phone: z.string().min(11, { message: "O telefone é obrigatório" }),
  description: z.string().min(3, { message: "A descrição é obrigatória" }),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>
```

### Integracao useForm + zodResolver

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const form = useForm<AppointmentFormValues>({
  defaultValues: {
    tutorName: "",
    petName: "",
    phone: "",
    description: "",
  },
  resolver: zodResolver(appointmentFormSchema),
})
```

### Submit handler tipado

```typescript
function onSubmit(data: AppointmentFormValues) {
  console.log("agendamento", data)
  // data ja esta validado e tipado
}

// No JSX:
<form onSubmit={form.handleSubmit(onSubmit)}>
  <input {...form.register("tutorName")} />
  <button type="submit">Salvar</button>
</form>
```

## Example

**Before (sem schema, tipos manuais):**
```typescript
interface FormData {
  tutorName: string
  petName: string
  phone: string
}

const [formData, setFormData] = useState<FormData>({
  tutorName: "",
  petName: "",
  phone: "",
})

// Validacao manual no submit
const handleSubmit = () => {
  if (!formData.tutorName) alert("Nome obrigatorio")
}
```

**After (com Zod + react-hook-form):**
```typescript
const schema = z.object({
  tutorName: z.string().min(3, { message: "Nome do tutor é obrigatório" }),
  petName: z.string().min(3, { message: "Nome do pet é obrigatório" }),
  phone: z.string().min(11, { message: "Telefone é obrigatório" }),
})

type FormValues = z.infer<typeof schema>

const form = useForm<FormValues>({
  defaultValues: { tutorName: "", petName: "", phone: "" },
  resolver: zodResolver(schema),
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo obrigatorio simples | `z.string().min(N, { message })` |
| Campo com formato especifico (telefone) | `.min(11)` + mascara separada depois |
| Campo complexo (data/hora) | Separar para implementacao posterior |
| Tipo do formulario | Sempre `z.infer<typeof schema>`, nunca interface manual |
| Componente UI (shadcn/ui) | Use `<Form>` wrapper + `form.register` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `interface FormData { ... }` separado do schema | `type FormData = z.infer<typeof schema>` |
| `useState` para cada campo do form | `useForm({ defaultValues })` |
| Validacao manual no onSubmit | `resolver: zodResolver(schema)` |
| `<input onChange={e => setField(e.target.value)}>` | `<input {...form.register("field")}>` |
| Mensagem de erro padrao do Zod | `{ message: "Texto em portugues" }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-criando-o-schema-do-appointment-form/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-criando-o-schema-do-appointment-form/references/code-examples.md)
