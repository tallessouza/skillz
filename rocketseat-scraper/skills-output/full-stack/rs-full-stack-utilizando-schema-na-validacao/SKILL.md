---
name: rs-full-stack-utilizando-schema-na-validacao
description: "Enforces Yup schema validation patterns when building React forms with field-level validation rules. Use when user asks to 'validate a form', 'add form validation', 'use Yup schema', 'define validation rules', or 'add required fields'. Applies Yup schema definition with typed fields, required messages, min/max constraints, and submit blocking. Make sure to use this skill whenever creating form validation schemas in React. Not for server-side validation, Zod schemas, or API input sanitization."
---

# Utilizando Schema na Validação com Yup

> Defina regras de validação no schema usando métodos encadeados do Yup — o formulário só submete quando todos os campos passam.

## Rules

1. **Declare o tipo de cada campo** — use `yup.string()`, `yup.number()`, etc., porque o schema deve refletir o tipo esperado de cada dado
2. **Marque campos obrigatórios com mensagem personalizada** — `.required('Nome é obrigatório')`, porque mensagens genéricas confundem o usuário
3. **Adicione regras de validação encadeadas** — `.min(10, 'Precisa ter pelo menos 10 caracteres')`, porque a sintaxe é praticamente igual ao Zod — métodos encadeados definem as regras
4. **O schema bloqueia o submit automaticamente** — se algum campo não passar na validação, o `onSubmit` não é executado, garantindo que apenas dados válidos sejam processados
5. **Nomeie campos do schema igual ao formulário** — `name`, `date`, `subject`, `description` devem corresponder exatamente aos nomes dos inputs

## How to write

### Schema de validação completo

```typescript
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  date: yup.string().required('Data é obrigatória'),
  subject: yup.string().required('Selecione um assunto'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(10, 'A descrição precisa ter pelo menos 10 caracteres'),
})
```

### Integrando schema com React Hook Form

```typescript
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

type FormData = yup.InferType<typeof schema>

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: yupResolver(schema),
})

function onSubmit(data: FormData) {
  console.log(data) // só executa se TUDO passar
}
```

## Example

**Before (sem validação — submit sempre executa):**
```typescript
const { register, handleSubmit } = useForm()

function onSubmit(data) {
  console.log(data) // executa mesmo com campos vazios
}
```

**After (com schema Yup — submit bloqueado até validar):**
```typescript
const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  date: yup.string().required('Data é obrigatória'),
  subject: yup.string().required('Selecione um assunto'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(10, 'A descrição precisa ter pelo menos 10 caracteres'),
})

const { register, handleSubmit } = useForm({
  resolver: yupResolver(schema),
})

function onSubmit(data: yup.InferType<typeof schema>) {
  console.log(data) // só executa quando todos os campos são válidos
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo de texto obrigatório | `yup.string().required('Mensagem clara')` |
| Campo com tamanho mínimo | `.min(n, 'Mensagem com o número')` |
| Campo de seleção (select/dropdown) | `.required('Selecione um ...')` — mensagem orientando a ação |
| Múltiplas regras no mesmo campo | Encadeie: `.required().min().max()` |
| Precisa do tipo TypeScript do form | `yup.InferType<typeof schema>` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `.required()` sem mensagem | `.required('Nome é obrigatório')` |
| Validação manual no `onSubmit` | Schema Yup + resolver bloqueando submit |
| Nomes diferentes no schema e no form | Nomes idênticos: schema `name` ↔ input `name` |
| Schema sem tipos (`yup.mixed()` genérico) | Tipos explícitos: `yup.string()`, `yup.number()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações