# Code Examples: Validação de Formulários com Zod

## Instalação

```bash
npm install zod
```

## Schema completo de signup

```typescript
import { z, ZodError } from "zod"

const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: "Informe o nome" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 dígitos" }),
  passwordConfirm: z.string().min(1, { message: "Confirme a senha" }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não são iguais",
  path: ["passwordConfirm"],
})
```

## Função onSubmit completa

```typescript
async function onSubmit() {
  try {
    setIsLoading(true)

    const data = signUpSchema.parse({
      name,
      email,
      password,
      passwordConfirm,
    })

    // Após validação, prosseguir com a requisição
    // await api.post("/users", data)

  } catch (error) {
    if (error instanceof ZodError) {
      return alert(error.issues[0].message)
    }

    alert("Não foi possível cadastrar")
  } finally {
    setIsLoading(false)
  }
}
```

## Validação campo a campo — progressão

### Apenas string obrigatória
```typescript
name: z.string().trim().min(1, { message: "Informe o nome" })
```

### E-mail com validação de formato
```typescript
email: z.string().email({ message: "E-mail inválido" })
```
Nota: o `.email()` já garante formato válido. Não é necessário adicionar `.min()` porque um e-mail válido sempre terá caracteres.

### Senha com comprimento mínimo
```typescript
password: z.string().min(6, { message: "Senha deve ter pelo menos 6 dígitos" })
```

### Confirmação de senha (cross-field)
```typescript
// Campo individual
passwordConfirm: z.string().min(1, { message: "Confirme a senha" })

// Validação cruzada no objeto
.refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não são iguais",
  path: ["passwordConfirm"],
})
```

## Variação: Schema de login (mais simples)

```typescript
const signInSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(1, { message: "Informe a senha" }),
})
```

## Variação: Exibindo todos os erros (não apenas o primeiro)

```typescript
catch (error) {
  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => issue.message)
    return alert(messages.join("\n"))
  }
  alert("Não foi possível cadastrar")
}
```

## Variação: Usando safeParse em vez de parse

```typescript
async function onSubmit() {
  setIsLoading(true)

  const result = signUpSchema.safeParse({
    name,
    email,
    password,
    passwordConfirm,
  })

  if (!result.success) {
    setIsLoading(false)
    return alert(result.error.issues[0].message)
  }

  try {
    // result.data contém os dados validados e tipados
    // await api.post("/users", result.data)
  } catch {
    alert("Não foi possível cadastrar")
  } finally {
    setIsLoading(false)
  }
}
```

## Componente Button com loading (referência do instrutor)

```typescript
// O componente Button já implementa a lógica de loading:
// - cursor: progress quando isLoading
// - disabled: true quando isLoading
// - muda o visual para sinalizar processamento

<Button isLoading={isLoading}>
  Cadastrar
</Button>
```

## Fluxo de validação demonstrado na aula

```
1. Formulário vazio → Enter → "Informe o nome" (input required do HTML intercepta)
2. Nome preenchido, email inválido → "E-mail inválido"
3. Email válido, senha "123" → "Senha deve ter pelo menos 6 dígitos"
4. Senha "123456", confirmação "1234567" → "As senhas não são iguais"
5. Senha e confirmação iguais → Validação passa, prossegue para request
```