---
name: rs-full-stack-0503-exibindo-dados
description: "Enforces patterns for mapping API response data to React UI state when building lists and dashboards. Use when user asks to 'display API data', 'render a list from API', 'map response to components', 'populate state from fetch', or 'show paginated results'. Applies rules: map and format response before setState, destructure only needed fields, sync pagination state from response metadata. Make sure to use this skill whenever transforming API responses into component-ready state. Not for API route creation, database queries, or CSS styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, state, api-response, data-mapping, pagination]
---

# Exibindo Dados da API na Interface

> Transforme a resposta da API em estado formatado antes de popular o componente — nunca passe dados brutos diretamente para a UI.

## Rules

1. **Mapeie e formate antes de setar estado** — use `.map()` na resposta para extrair e renomear campos, porque o componente espera uma estrutura específica, não o shape cru da API
2. **Extraia apenas campos necessários** — selecione `id`, `name`, `amount`, `description` etc., porque passar o objeto inteiro acopla o componente ao formato da API
3. **Sincronize paginação da resposta** — atualize `totalOfPages` a partir de `response.data.pagination.totalPage`, porque o componente de paginação depende desse valor para desabilitar botões
4. **Não duplique estado controlado** — se `page` já é um estado local controlado pelo usuário, não sobrescreva com o valor da resposta, porque isso causa loops de renderização
5. **Limpe estado inicial como lista vazia** — inicialize com `[]` ao invés de dados mock, porque garante que a UI reflita o estado real da API

## How to write

### Mapeando resposta para estado formatado

```typescript
const refunds = response.data.refunds.map((refund) => ({
  id: refund.id,
  title: refund.user.name,
  description: refund.name,
  amount: formatCurrency(refund.amount),
  categoryImg: refund.category.icon,
}))

setRefunds(refunds)
setTotalOfPages(response.data.pagination.totalPage)
```

### Componente com paginação controlada

```tsx
// page já é estado local — não precisa setar da resposta
const [page, setPage] = useState(1)
const [totalOfPages, setTotalOfPages] = useState(1)
const [refunds, setRefunds] = useState([])

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
```

## Example

**Before (dados crus direto no estado):**
```typescript
const response = await api.get("/refunds")
console.log(response.data)
// ou pior: setRefunds(response.data.refunds)
```

**After (mapeado e formatado):**
```typescript
const response = await api.get("/refunds")

const refunds = response.data.refunds.map((refund) => ({
  id: refund.id,
  title: refund.user.name,
  description: refund.name,
  amount: formatCurrency(refund.amount),
  categoryImg: refund.category.icon,
}))

setRefunds(refunds)
setTotalOfPages(response.data.pagination.totalPage)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| API retorna campos extras que a UI não usa | Extraia apenas os campos necessários no `.map()` |
| Precisa renomear campo (ex: `user.name` → `title`) | Faça a renomeação dentro do `.map()`, não no componente |
| Paginação tem `totalPage` na resposta | Atualize `setTotalOfPages` após o fetch |
| `page` é estado local controlado | Não sobrescreva com valor da resposta |
| Só tem 1 página de resultados | Botões de avançar/voltar ficam desabilitados automaticamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `setRefunds(response.data.refunds)` | `setRefunds(response.data.refunds.map(...))` |
| `console.log(response.data)` em produção | `setRefunds(formatted)` |
| `const [refunds, setRefunds] = useState(mockData)` | `const [refunds, setRefunds] = useState([])` |
| Formatar valores dentro do JSX | Formatar no `.map()` antes de setar estado |
| Ignorar `pagination.totalPage` da resposta | `setTotalOfPages(response.data.pagination.totalPage)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação de dados da API vs estado da UI, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Lista renderiza vazia mesmo com dados | `setRefunds` recebe dados brutos sem `.map()` | Mapeie e formate os dados antes de setar estado |
| Paginacao mostra total incorreto | `totalOfPages` nao atualizado da resposta | Adicione `setTotalOfPages(response.data.pagination.totalPage)` |
| Valores monetarios sem formatacao | Formatacao feita no JSX ou nao feita | Aplique `formatCurrency` no `.map()` antes de setar estado |
| Componente re-renderiza em loop | `page` setado a partir da resposta | Nao sobrescreva estado controlado com valor da resposta |