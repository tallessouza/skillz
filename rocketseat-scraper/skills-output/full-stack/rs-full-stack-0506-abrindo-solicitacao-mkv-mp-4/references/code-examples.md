# Code Examples: Abrindo Solicitação

## 1. Dashboard com links para detalhes

```typescript
// pages/dashboard.tsx
import { Link } from 'react-router-dom'
import { RefundItem } from '../components/RefundItem'

function Dashboard() {
  const [refunds, setRefunds] = useState([])

  return (
    <div className="refund-list">
      {refunds.map(item => (
        <Link key={item.id} to={`/refund/${item.id}`}>
          <RefundItem data={item} />
        </Link>
      ))}
    </div>
  )
}
```

## 2. Página de refund compartilhada

```typescript
// pages/refund.tsx
import { useParams, useNavigate } from 'react-router-dom'

function Refund() {
  const { id } = useParams()
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()

    // Se tem ID, é visualização — voltar
    if (id) {
      navigate(-1)
      return
    }

    // Se não tem ID, é criação — enviar dados
    createRefund(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{id ? "Detalhes da Solicitação" : "Nova Solicitação"}</h1>

      {/* Campos do formulário — read-only quando tem ID */}
      <input 
        name="description" 
        readOnly={!!id}
        defaultValue={refundData?.description}
      />

      {/* Upload ou visualização de comprovante */}
      {id ? (
        <button type="button" onClick={() => openAttachment(id)}>
          Abrir comprovante
        </button>
      ) : (
        <UploadComponent />
      )}

      {/* Botão muda conforme contexto */}
      <button type="submit">
        {id ? "Voltar" : "Enviar"}
      </button>
    </form>
  )
}
```

## 3. Registro de rotas compartilhadas

```typescript
// routes.tsx
import { Refund } from './pages/refund'

const routes = [
  {
    path: '/employee',
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'refund', element: <Refund /> },        // criação
      { path: 'refund/:id', element: <Refund /> },     // visualização
    ]
  },
  {
    path: '/manager',
    children: [
      { path: 'dashboard', element: <ManagerDashboard /> },
      { path: 'refund/:id', element: <Refund /> },     // sempre visualização
    ]
  }
]
```

## 4. Variação com param opcional

```typescript
// Alternativa: usar param opcional com ?
const routes = [
  { path: '/employee/refund/:id?', element: <Refund /> },
  { path: '/manager/refund/:id', element: <Refund /> },
]
```

O `:id?` torna o parâmetro opcional, permitindo que a mesma rota sirva tanto para criação (sem ID) quanto para visualização (com ID).

## 5. Componente RefundItem como link

```typescript
// components/RefundItem.tsx
function RefundItem({ data }) {
  return (
    <div className="refund-item">
      <span>{data.description}</span>
      <span>{data.status}</span>
      <span>{formatCurrency(data.amount)}</span>
    </div>
  )
}

// Uso no dashboard — o Link envolve o componente
<Link to={`/refund/${item.id}`}>
  <RefundItem data={item} />
</Link>
```

## 6. Carregamento condicional de dados

```typescript
// Quando tem ID, buscar dados existentes
function Refund() {
  const { id } = useParams()
  const [refundData, setRefundData] = useState(null)

  useEffect(() => {
    if (id) {
      // Modo visualização: carregar dados da API
      fetchRefund(id).then(setRefundData)
    }
  }, [id])

  // Campos pré-preenchidos quando visualizando
  return (
    <form>
      <input 
        defaultValue={refundData?.description ?? ''} 
        readOnly={!!id}
      />
    </form>
  )
}
```