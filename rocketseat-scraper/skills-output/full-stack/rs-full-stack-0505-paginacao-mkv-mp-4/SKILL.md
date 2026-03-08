---
name: rs-full-stack-0505-paginacao-mkv-mp-4
description: "Enforces frontend pagination patterns when building list views with page navigation, per-page controls, and filtered queries. Use when user asks to 'add pagination', 'paginate results', 'navigate between pages', 'limit records per page', or 'filter and paginate'. Applies rules: page state as useEffect dependency, disable navigation buttons at boundaries, re-fetch on page change, combine filters with pagination. Make sure to use this skill whenever implementing paginated lists or tables in React frontends. Not for backend pagination logic, infinite scroll, or virtual list rendering."
---

# Paginação no Frontend

> Toda mudança de página ou filtro dispara nova consulta; botões de navegação refletem os limites reais dos dados.

## Rules

1. **Page state como dependência do useEffect** — adicione o estado da página atual no array de dependências do useEffect que faz o fetch, porque sem isso mudar de página não dispara nova consulta
2. **Desabilite botões nos limites** — bloqueie "voltar" na página 1 e "avançar" na última página, porque o usuário não deve navegar para páginas inexistentes
3. **Re-fetch ao mudar página** — toda alteração no estado da página executa novamente a função de fetch dentro do useEffect, porque a paginação depende de dados atualizados do servidor
4. **Combine filtros com paginação** — ao aplicar filtro (ex: busca por nome), resete a página para 1, porque filtrar muda o total de resultados e a página atual pode não existir mais
5. **Registros por página configurável** — permita que o usuário defina quantos registros ver por página, porque diferentes contextos exigem diferentes densidades de dados
6. **Limpar filtro restaura todos os registros** — campo de busca vazio + Enter retorna à listagem completa, porque o usuário espera um estado "sem filtro" acessível

## How to write

### Estado de paginação com useEffect

```javascript
const [page, setPage] = useState(1)
const [perPage, setPerPage] = useState(5)

useEffect(() => {
  fetchData(page, perPage, searchTerm)
}, [page, perPage, searchTerm])
```

### Botões de navegação com limites

```jsx
<button
  disabled={page <= 1}
  onClick={() => setPage(page - 1)}
>
  Voltar
</button>

<span>Página {page} de {totalPages}</span>

<button
  disabled={page >= totalPages}
  onClick={() => setPage(page + 1)}
>
  Avançar
</button>
```

### Filtro combinado com paginação

```javascript
function handleSearch(term) {
  setSearchTerm(term)
  setPage(1) // Reset para página 1 ao filtrar
}
```

## Example

**Before (página muda mas dados não atualizam):**
```javascript
const [page, setPage] = useState(1)

useEffect(() => {
  fetchData(page)
}, []) // page não está nas dependências

// Botão muda o número mas não reflete na consulta
<button onClick={() => setPage(page + 1)}>Próxima</button>
```

**After (com esta skill aplicada):**
```javascript
const [page, setPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

useEffect(() => {
  fetchData(page)
}, [page]) // page como dependência — re-fetch automático

<button
  disabled={page >= totalPages}
  onClick={() => setPage(page + 1)}
>
  Próxima
</button>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Poucos registros (< perPage) | Mostre 1 página, ambos botões desabilitados |
| Filtro aplicado | Resete page para 1, recalcule totalPages |
| Filtro limpo (campo vazio + Enter) | Restaure listagem completa na página 1 |
| Usuário muda perPage | Resete page para 1, re-fetch com novo limite |
| Última página | Desabilite botão avançar, mantenha voltar ativo |
| Primeira página | Desabilite botão voltar, mantenha avançar ativo |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `useEffect(() => fetch(), [])` com estado de página | `useEffect(() => fetch(page), [page])` |
| Botão avançar sempre ativo | `disabled={page >= totalPages}` |
| Filtrar sem resetar página | `setPage(1)` junto com `setSearchTerm(term)` |
| Calcular paginação só no frontend com todos os dados | Enviar page/perPage como parâmetros na requisição |
| Número de página hardcoded | Estado dinâmico baseado na resposta da API |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre dependências do useEffect, fluxo de dados na paginação e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações de filtro e navegação