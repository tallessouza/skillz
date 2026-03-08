# Code Examples: Definindo Valor Inicial com useForm

## Exemplo 1: Configuração básica (da aula)

O instrutor mostra a configuração mínima para resolver o warning:

```typescript
import { useForm } from "react-hook-form"

function MyForm() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
    },
  })

  function handleSave(data) {
    console.log(data) // { name: "react" }
  }

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <input type="text" {...register("name")} />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

**Comportamento demonstrado:**
1. Carregar a página — nenhum warning
2. Digitar "react" no campo — nenhum warning
3. Clicar em "Salvar" — `{ name: "react" }` aparece no console
4. Pressionar Enter no campo — mesmo resultado, sem precisar clicar no botão

## Exemplo 2: Múltiplos campos com defaultValues

```typescript
const { register, handleSubmit } = useForm({
  defaultValues: {
    name: "",
    email: "",
    age: 0,
    acceptTerms: false,
  },
})
```

## Exemplo 3: Formulário de edição com dados existentes

```typescript
function EditUserForm({ user }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  function handleUpdate(data) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(handleUpdate)}>
      <input type="text" {...register("name")} />
      <input type="email" {...register("email")} />
      <button type="submit">Atualizar</button>
    </form>
  )
}
```

## Exemplo 4: Usando reset() para dados assíncronos

```typescript
function EditUserForm({ userId }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  })

  useEffect(() => {
    async function loadUser() {
      const response = await fetch(`/api/users/${userId}`)
      const user = await response.json()
      reset(user) // Atualiza os defaultValues com os dados carregados
    }
    loadUser()
  }, [userId, reset])

  return (
    <form onSubmit={handleSubmit(handleUpdate)}>
      <input type="text" {...register("name")} />
      <input type="email" {...register("email")} />
      <button type="submit">Atualizar</button>
    </form>
  )
}
```

## Exemplo 5: Submit via Enter (demonstrado na aula)

O instrutor destaca que não é necessário código adicional para habilitar submit via Enter. O comportamento é nativo do HTML quando:

```tsx
// Estes dois elementos existem dentro de um <form>:
<input type="text" {...register("name")} />  // Enter aqui dispara submit
<button type="submit">Salvar</button>        // Click aqui também dispara
```

O browser automaticamente dispara o evento `submit` do formulário quando Enter é pressionado em um input de texto dentro de um form que contém um botão `type="submit"`.

## Comparação: Com e sem defaultValues

### Sem defaultValues (causa warning):
```typescript
const { register } = useForm()
// Internamente: name = undefined
// Primeira digitação: undefined → "a" (uncontrolled → controlled)
// React warning aparece
```

### Com defaultValues (correto):
```typescript
const { register } = useForm({
  defaultValues: { name: "" },
})
// Internamente: name = ""
// Primeira digitação: "" → "a" (controlled → controlled)
// Nenhum warning
```