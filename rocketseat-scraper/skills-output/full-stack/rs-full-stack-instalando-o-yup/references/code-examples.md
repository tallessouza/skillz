# Code Examples: Validação com Yup + React Hook Form

## Instalação

```bash
# Com versões fixas (recomendado pelo instrutor)
npm install @hookform/resolvers@3.9.1 yup@1.5.0

# Sem fixar versão (pega a latest)
npm install @hookform/resolvers yup
```

## Setup mínimo completo

```typescript
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

// Schema declarado FORA do componente
const schema = yup.object({
  // campos serão adicionados aqui
})

function MyForm() {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  })

  function onSubmit(data) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* campos do formulário */}
    </form>
  )
}
```

## Comparação: imports por biblioteca

O `@hookform/resolvers` suporta múltiplas bibliotecas. O import muda conforme a escolha:

```typescript
// Yup
import { yupResolver } from "@hookform/resolvers/yup"

// Zod
import { zodResolver } from "@hookform/resolvers/zod"

// Joi
import { joiResolver } from "@hookform/resolvers/joi"

// SuperStruct
import { superstructResolver } from "@hookform/resolvers/superstruct"
```

## Integração com useForm — antes e depois

### Antes (sem validação por schema)

```typescript
const { register, handleSubmit } = useForm()
```

### Depois (com Yup resolver)

```typescript
const { register, handleSubmit } = useForm({
  resolver: yupResolver(schema),
})
```

A única mudança é passar o objeto de configuração com o `resolver`.

## Schema com campos (preview da próxima etapa)

```typescript
const schema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("Senha é obrigatória"),
})
```

## Extraindo schema para arquivo separado

Para formulários complexos, mover o schema para seu próprio arquivo:

```typescript
// schemas/userFormSchema.ts
import * as yup from "yup"

export const userFormSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
})

// components/UserForm.tsx
import { userFormSchema } from "../schemas/userFormSchema"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"

function UserForm() {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(userFormSchema),
  })
  // ...
}
```