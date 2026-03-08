# Code Examples: Utilizando Schema na Validação com Yup

## Exemplo 1: Schema básico da aula

O schema exato construído durante a aula:

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

## Exemplo 2: Integração completa com React Hook Form

```typescript
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  date: yup.string().required('Data é obrigatória'),
  subject: yup.string().required('Selecione um assunto'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(10, 'A descrição precisa ter pelo menos 10 caracteres'),
})

type FormData = yup.InferType<typeof schema>

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  function onSubmit(data: FormData) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Nome" />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('date')} type="date" />
      {errors.date && <span>{errors.date.message}</span>}

      <select {...register('subject')}>
        <option value="">Selecione</option>
        <option value="react">React</option>
        <option value="node">Node</option>
      </select>
      {errors.subject && <span>{errors.subject.message}</span>}

      <textarea {...register('description')} placeholder="Descrição" />
      {errors.description && <span>{errors.description.message}</span>}

      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Exemplo 3: Variações de regras de validação

```typescript
// Email com formato válido
email: yup
  .string()
  .required('Email é obrigatório')
  .email('Formato de email inválido'),

// Senha com mínimo e máximo
password: yup
  .string()
  .required('Senha é obrigatória')
  .min(6, 'Senha precisa ter pelo menos 6 caracteres')
  .max(20, 'Senha pode ter no máximo 20 caracteres'),

// Número com valor mínimo
age: yup
  .number()
  .required('Idade é obrigatória')
  .min(18, 'Precisa ter pelo menos 18 anos')
  .typeError('Idade deve ser um número'),

// Campo condicional
phone: yup
  .string()
  .when('contactPreference', {
    is: 'phone',
    then: (schema) => schema.required('Telefone é obrigatório'),
    otherwise: (schema) => schema.optional(),
  }),
```

## Exemplo 4: Fluxo de submit bloqueado (demonstrado na aula)

```typescript
// O instrutor demonstrou este fluxo:
// 1. Clica "Salvar" sem preencher nada → submit NÃO executa
// 2. Preenche "name" com "react" → clica "Salvar" → foco vai para "date"
// 3. Seleciona data → clica "Salvar" → foco vai para "subject"
// 4. Seleciona assunto → clica "Salvar" → foco vai para "description"
// 5. Digita texto curto (<10 chars) → clica "Salvar" → ainda bloqueado
// 6. Digita texto com 10+ chars → clica "Salvar" → submit EXECUTA

// Esse comportamento é automático com yupResolver — não precisa implementar
```

## Exemplo 5: Schema separado em arquivo próprio

```typescript
// schemas/contact-form.ts
import * as yup from 'yup'

export const contactFormSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  date: yup.string().required('Data é obrigatória'),
  subject: yup.string().required('Selecione um assunto'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(10, 'A descrição precisa ter pelo menos 10 caracteres'),
})

export type ContactFormData = yup.InferType<typeof contactFormSchema>
```

```typescript
// components/ContactForm.tsx
import { contactFormSchema, ContactFormData } from '../schemas/contact-form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

export function ContactForm() {
  const { register, handleSubmit } = useForm<ContactFormData>({
    resolver: yupResolver(contactFormSchema),
  })

  // ...
}
```