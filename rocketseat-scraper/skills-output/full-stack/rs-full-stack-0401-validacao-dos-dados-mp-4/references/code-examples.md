# Code Examples: Validação de Dados com Zod em Formulários React

## Exemplo 1: Schema completo de reembolso

```typescript
import { z } from "zod"

const refundSchema = z.object({
  name: z.string().min(3, { message: "Informe um nome claro para sua solicitação" }),
  category: z.string().min(1, { message: "Informe a categoria" }),
  amount: z.coerce
    .number({ message: "Informe um valor válido" })
    .positive({ message: "Informe um valor válido e superior a zero" }),
})
```

## Exemplo 2: Submit handler completo com try-catch-finally

```typescript
const [isLoading, setIsLoading] = useState(false)
const [name, setName] = useState("")
const [category, setCategory] = useState("")
const [amount, setAmount] = useState("")

async function onSubmit(e: React.FormEvent) {
  e.preventDefault()

  try {
    setIsLoading(true)

    const data = refundSchema.parse({
      name,
      category,
      amount: amount.replace(",", "."),
    })

    console.log(data)
    // { name: "Reposição de peça", category: "Transporte", amount: 34 }

    navigate("/refund/confirm")
  } catch (error) {
    if (error instanceof z.ZodError) {
      alert(error.issues[0].message)
    } else {
      alert("Não foi possível realizar a solicitação")
    }
  } finally {
    setIsLoading(false)
  }
}
```

## Exemplo 3: Botão com estado de loading

```tsx
<button type="submit" disabled={isLoading}>
  {isLoading ? "Enviando..." : "Enviar solicitação"}
</button>
```

## Exemplo 4: Formulário conectado ao submit

```tsx
<form onSubmit={onSubmit}>
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Nome da solicitação"
  />

  <select value={category} onChange={(e) => setCategory(e.target.value)}>
    <option value="">Selecione</option>
    <option value="alimentacao">Alimentação</option>
    <option value="transporte">Transporte</option>
  </select>

  <input
    type="text"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    placeholder="Valor"
  />

  <button type="submit" disabled={isLoading}>
    {isLoading ? "Enviando..." : "Enviar"}
  </button>
</form>
```

## Exemplo 5: Variação com safeParse para erros inline

```typescript
function onSubmit(e: React.FormEvent) {
  e.preventDefault()

  const result = refundSchema.safeParse({
    name,
    category,
    amount: amount.replace(",", "."),
  })

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    setErrors({
      name: fieldErrors.name?.[0],
      category: fieldErrors.category?.[0],
      amount: fieldErrors.amount?.[0],
    })
    return
  }

  // result.data contém os dados validados e tipados
  submitRefund(result.data)
}
```

## Exemplo 6: Schema com valores default e transformações

```typescript
const refundSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Informe um nome claro" })
    .trim(),
  category: z.string().min(1, { message: "Informe a categoria" }),
  amount: z
    .string()
    .transform((val) => val.replace(",", "."))
    .pipe(z.coerce.number().positive({ message: "Valor deve ser superior a zero" })),
})
```

Nesta variação, a transformação de vírgula para ponto acontece dentro do próprio schema com `.transform()` encadeado com `.pipe()`, eliminando a necessidade de fazer `replace` manualmente no handler.

## Exemplo 7: Página de confirmação

```tsx
function RefundConfirm() {
  return (
    <div>
      <img src="/success.svg" alt="Sucesso" />
      <h1>Solicitação enviada</h1>
      <p>Sua solicitação de reembolso foi enviada com sucesso.</p>
      <a href="/refund">Nova solicitação</a>
    </div>
  )
}
```