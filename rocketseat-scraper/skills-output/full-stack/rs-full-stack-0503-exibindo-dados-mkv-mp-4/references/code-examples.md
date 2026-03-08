# Code Examples: Exibindo Dados da API na Interface

## Exemplo 1: Mapeamento completo da resposta

Código demonstrado na aula — transformando `response.data.refunds` em estado formatado:

```typescript
// Antes: console.log para debug
console.log(response.data)

// Depois: mapear e popular estado
const refunds = response.data.refunds.map((refund) => ({
  id: refund.id,
  title: refund.user.name,      // nome do usuário como título
  description: refund.name,      // nome da solicitação como descrição
  amount: formatCurrency(refund.amount),
  categoryImg: refund.category.icon,
}))

setRefunds(refunds)
```

## Exemplo 2: Atualizando paginação da resposta

```typescript
async function fetchRefunds() {
  const response = await api.get(`/refunds?page=${page}`)

  const refunds = response.data.refunds.map((refund) => ({
    id: refund.id,
    title: refund.user.name,
    description: refund.name,
    amount: formatCurrency(refund.amount),
    categoryImg: refund.category.icon,
  }))

  setRefunds(refunds)
  // totalOfPages vem da API — page é controlado localmente
  setTotalOfPages(response.data.pagination.totalPage)
}
```

## Exemplo 3: Estado inicial como lista vazia

```typescript
// Antes: dados mock ou undefined
const [refunds, setRefunds] = useState(mockData)

// Depois: lista vazia até a API responder
const [refunds, setRefunds] = useState([])
const [totalOfPages, setTotalOfPages] = useState(1)
const [page, setPage] = useState(1)
```

## Exemplo 4: Componente RefundItem ajustado

O instrutor renomeia a prop `category` para `description` no componente:

```tsx
// Antes no componente
interface RefundItemProps {
  id: string
  title: string
  category: string  // nome confuso — não é categoria
  amount: string
  categoryImg: string
}

// Depois
interface RefundItemProps {
  id: string
  title: string
  description: string  // agora reflete o que exibe
  amount: string
  categoryImg: string
}

function RefundItem({ id, title, description, amount, categoryImg }: RefundItemProps) {
  return (
    <div>
      <img src={categoryImg} alt="" />
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <span>{amount}</span>
    </div>
  )
}
```

## Exemplo 5: Dashboard completo com fetch e paginação

```tsx
function Dashboard() {
  const [refunds, setRefunds] = useState([])
  const [page, setPage] = useState(1)
  const [totalOfPages, setTotalOfPages] = useState(1)

  async function fetchRefunds() {
    const response = await api.get(`/refunds?page=${page}`)

    const formatted = response.data.refunds.map((refund) => ({
      id: refund.id,
      title: refund.user.name,
      description: refund.name,
      amount: formatCurrency(refund.amount),
      categoryImg: refund.category.icon,
    }))

    setRefunds(formatted)
    setTotalOfPages(response.data.pagination.totalPage)
  }

  useEffect(() => {
    fetchRefunds()
  }, [page])

  return (
    <div>
      {refunds.map((refund) => (
        <RefundItem key={refund.id} {...refund} />
      ))}

      <Pagination
        page={page}
        totalOfPages={totalOfPages}
        onNext={() => setPage((prev) => prev + 1)}
        onPrevious={() => setPage((prev) => prev - 1)}
      />
    </div>
  )
}
```

## Variação: Tratando resposta vazia

```typescript
const formatted = response.data.refunds?.map((refund) => ({
  id: refund.id,
  title: refund.user.name,
  description: refund.name,
  amount: formatCurrency(refund.amount),
  categoryImg: refund.category.icon,
})) ?? []

setRefunds(formatted)
```

## Variação: Separando a função de formatação

```typescript
function formatRefund(refund) {
  return {
    id: refund.id,
    title: refund.user.name,
    description: refund.name,
    amount: formatCurrency(refund.amount),
    categoryImg: refund.category.icon,
  }
}

// No fetch:
setRefunds(response.data.refunds.map(formatRefund))
```