---
name: rs-full-stack-0501-fetch-refunds-mp-4
description: "Enforces Axios GET request patterns with query parameters, error handling, and useEffect integration when fetching paginated data from a REST API. Use when user asks to 'fetch data from API', 'list items with pagination', 'make GET request with params', 'load data on page mount', or 'handle API errors with Axios'. Make sure to use this skill whenever implementing data fetching with query parameters in React. Not for POST/PUT requests, file uploads, or authentication flows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, axios, fetch, pagination, query-params, error-handling]
---

# Fetch de Dados com Axios e Parâmetros de Consulta

> Ao buscar dados paginados de uma API, construa a URL com query parameters interpolados, trate erros com AxiosError tipado, e dispare a busca inicial com useEffect.

## Rules

1. **Importe AxiosError separadamente** — `import { AxiosError } from "axios"`, porque permite verificar `instanceof` e acessar `error.response.data.message` com segurança
2. **Use template literals para query params** — interpole com `${}` e conecte com `&`, porque usar `$` no lugar de `&` faz a URL ser interpretada como parâmetro único
3. **Defina constantes para paginação** — `const PER_PAGE = 5` no topo do componente, porque valores mágicos espalhados dificultam manutenção
4. **Envolva requisições em try/catch** — sempre verifique `instanceof AxiosError` antes de acessar propriedades da resposta, porque erros de rede não possuem `response.data`
5. **Dispare fetch inicial com useEffect** — chame a função de busca no mount para carregar dados sem depender de interação do usuário
6. **Use .trim() no parâmetro de busca** — `name.trim()` remove espaços acidentais que podem afetar o filtro da API

## How to write

### Requisição GET com query params

```typescript
import { AxiosError } from "axios"
import { api } from "@/services/api"

const PER_PAGE = 5

const response = await api.get(
  `/refunds?name=${name.trim()}&page=${page}&per_page=${PER_PAGE}`
)

console.log(response.data)
// { refunds: [...], pagination: { page, perPage, totalPages, totalItems } }
```

### Fetch com tratamento de erro

```typescript
async function fetchRefunds() {
  try {
    const response = await api.get(
      `/refunds?name=${name.trim()}&page=${page}&per_page=${PER_PAGE}`
    )
    console.log(response.data)
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(error.response?.data?.message)
    } else {
      alert("Não foi possível carregar as solicitações.")
    }
  }
}
```

### useEffect para carga inicial

```typescript
useEffect(() => {
  fetchRefunds()
}, [])
```

## Example

**Before (erro comum — `$` no lugar de `&`):**
```typescript
const response = await api.get(
  `/refunds?name=${name.trim()}$page=${page}$per_page=${PER_PAGE}`
)
// Erro de validação: a API recebe tudo como valor único do param "name"
```

**After (com this skill applied):**
```typescript
const response = await api.get(
  `/refunds?name=${name.trim()}&page=${page}&per_page=${PER_PAGE}`
)
// Cada parâmetro é enviado separadamente: name, page, per_page
```

## Heuristics

| Situação | Faça |
|----------|------|
| Busca disparada por formulário E no mount | Extraia para função reutilizável, chame no onSubmit e no useEffect |
| API retorna erro de validação (issues) | Verifique a URL — provável erro de interpolação nos query params |
| Dados de paginação vêm na resposta | Use `totalPages` e `totalItems` para controlar navegação |
| Valor de perPage é fixo | Defina como constante nomeada (`PER_PAGE`), não número mágico |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `$page=${page}` (cifrão como separador) | `&page=${page}` (e-comercial) |
| `catch (error) { alert(error.message) }` | `catch (error) { if (error instanceof AxiosError) ... }` |
| `api.get("/refunds?name=" + name + "&page=" + page)` | `` api.get(`/refunds?name=${name.trim()}&page=${page}`) `` |
| `useEffect(() => { api.get(...) }, [])` inline | `useEffect(() => { fetchRefunds() }, [])` com função nomeada |
| `const perPage = 5` dentro da função | `const PER_PAGE = 5` como constante do módulo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre construção de query params, fluxo de paginação da API, e padrão de erro com AxiosError
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários de erro

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| API retorna erro de validacao (issues) | `$` usado no lugar de `&` nos query params | Substitua `$` por `&` entre parametros: `?name=${name}&page=${page}` |
| Dados nao carregam ao montar componente | `fetchRefunds()` nao chamado no `useEffect` | Adicione `useEffect(() => { fetchRefunds() }, [])` |
| `error.response.data.message` e undefined | Erro de rede (sem response) | Verifique `instanceof AxiosError` antes de acessar `response` |
| Espacos no parametro de busca afetam resultados | `name` nao esta sendo trimado | Use `name.trim()` antes de interpolar na URL |