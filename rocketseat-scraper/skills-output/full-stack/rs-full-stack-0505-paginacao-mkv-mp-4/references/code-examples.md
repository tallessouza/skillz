# Code Examples: Paginação no Frontend

## Exemplo 1: Estado básico de paginação

```javascript
const [page, setPage] = useState(1)
const [perPage, setPerPage] = useState(5)
const [totalPages, setTotalPages] = useState(1)
const [items, setItems] = useState([])
const [searchTerm, setSearchTerm] = useState("")
```

## Exemplo 2: useEffect com todas as dependências de paginação

```javascript
useEffect(() => {
  async function fetchData() {
    const response = await fetch(
      `/api/refunds?page=${page}&perPage=${perPage}&search=${searchTerm}`
    )
    const data = await response.json()

    setItems(data.items)
    setTotalPages(data.totalPages)
  }

  fetchData()
}, [page, perPage, searchTerm])
```

## Exemplo 3: Navegação com botões desabilitados nos limites

```jsx
function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div>
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Voltar
      </button>

      <span>
        Página {page} de {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Avançar
      </button>
    </div>
  )
}
```

## Exemplo 4: Filtro com reset de página

```javascript
function handleSearch(event) {
  event.preventDefault()
  const term = event.target.elements.search.value
  setSearchTerm(term)
  setPage(1) // Sempre resetar ao filtrar
}

function handleClearSearch() {
  setSearchTerm("")
  setPage(1)
}
```

```jsx
<form onSubmit={handleSearch}>
  <input name="search" placeholder="Buscar por nome..." />
  <button type="submit">Buscar</button>
</form>
```

## Exemplo 5: Seletor de registros por página

```jsx
function PerPageSelector({ perPage, onChange }) {
  return (
    <select
      value={perPage}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value={1}>1 por página</option>
      <option value={2}>2 por página</option>
      <option value={5}>5 por página</option>
      <option value={10}>10 por página</option>
    </select>
  )
}
```

```javascript
// No componente pai
function handlePerPageChange(newPerPage) {
  setPerPage(newPerPage)
  setPage(1) // Reset ao mudar quantidade
}
```

## Exemplo 6: Componente completo de listagem paginada

```jsx
function RefundList() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [refunds, setRefunds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchRefunds() {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/refunds?${params}`)
      const data = await response.json()

      setRefunds(data.refunds)
      setTotalPages(data.totalPages)
    }

    fetchRefunds()
  }, [page, perPage, searchTerm])

  function handleSearch(event) {
    event.preventDefault()
    const term = event.target.elements.search.value
    setSearchTerm(term)
    setPage(1)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input name="search" placeholder="Buscar por nome..." />
        <button type="submit">Buscar</button>
      </form>

      <ul>
        {refunds.map((refund) => (
          <li key={refund.id}>
            {refund.userName} — {refund.category} — R$ {refund.amount}
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
```

## Exemplo 7: Bug demonstrado na aula — página muda mas dados não

```javascript
// BUG: page não está nas dependências
useEffect(() => {
  fetchRefunds(page, perPage)
}, []) // Array vazio — só executa na montagem

// O que acontece:
// 1. setPage(2) é chamado ao clicar "Avançar"
// 2. React re-renderiza — o número "2" aparece na tela
// 3. Mas useEffect NÃO re-executa — fetch não é chamado
// 4. Dados continuam da página 1
```

```javascript
// CORREÇÃO: adicionar page como dependência
useEffect(() => {
  fetchRefunds(page, perPage)
}, [page, perPage]) // Agora re-executa quando page ou perPage mudam
```

## Exemplo 8: Dados de teste criados na aula

O instrutor criou o seguinte cenário para testar paginação:

| Usuário | Solicitação | Categoria | Valor |
|---------|-------------|-----------|-------|
| Maria | Vale transporte | Transporte | R$ 70,00 |
| Maria | Viagem para evento | Hospedagem | R$ 257,00 |
| Maria | Coffee break para receber clientes | Alimentação | R$ 545,70 |
| Anderson | (solicitação existente) | — | — |

Com 4 registros totais:
- 5 por página → 1 página
- 2 por página → 2 páginas
- 1 por página → 4 páginas