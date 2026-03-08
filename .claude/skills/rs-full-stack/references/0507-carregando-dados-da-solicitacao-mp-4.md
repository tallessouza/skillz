---
name: rs-full-stack-0507-carregando-dados-da-solicitacao
description: "Enforces best practices for loading API data into React forms when fetching details by ID, populating inputs, and handling async errors with Axios. Use when user asks to 'load data into a form', 'fetch details by ID', 'populate form fields from API', 'display readonly data', or 'useEffect with API call'. Applies patterns: async fetch with try/catch, Axios error handling, useEffect with ID dependency, form population with setState, and conditional readonly inputs. Make sure to use this skill whenever building detail/view pages that load data from an API into form fields. Not for form submission, file upload logic, or pagination."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, forms, api-fetch, useEffect, axios-error-handling]
---

# Carregando Dados da Solicitação

> Ao carregar dados de uma API para popular um formulário, use uma função async dedicada com tratamento de erro específico do Axios, chamada via useEffect com dependência no ID.

## Rules

1. **Crie uma função async dedicada para o fetch** — `fetchRefund(id: string)` separada do submit, porque cada operação (carregar vs enviar) tem ciclo de vida próprio
2. **Use try/catch com verificação de instância Axios** — `instanceof AxiosError` permite extrair `error.response.data.message` para mensagens específicas da API, com fallback genérico
3. **Chame o fetch via useEffect com guard clause** — verifique se o ID existe antes de chamar, e inclua o ID como dependência do useEffect
4. **Desestruture response.data uma vez** — `const { data } = response` evita repetir `response.data.campo` em cada setter
5. **Use tipagens separadas para item único vs lista** — `RefundAPIResponse` (singular) separado de `RefundsAPIResponse` (plural), porque reaproveitamento é melhor quando tipagens são granulares
6. **Inputs readonly quando visualizando** — desabilite inputs quando existe um ID nos params, indicando modo visualização

## How to write

### Função async de fetch com error handling

```typescript
async function fetchRefund(id: string) {
  try {
    const { data } = await api.get<RefundAPIResponse>(`/refunds/${id}`)

    setName(data.name)
    setCategory(data.category)
    setAmount(formatCurrency(data.amount))
    setFileURL(data.fileName)
  } catch (error) {
    if (error instanceof AxiosError) {
      return alert(error.response?.data.message)
    }
    alert("Não foi possível carregar")
  }
}
```

### useEffect com guard clause e dependência

```typescript
useEffect(() => {
  if (params.id) {
    fetchRefund(params.id)
  }
}, [params.id])
```

### Inputs condicionalmente readonly

```tsx
<input
  value={name}
  disabled={!!params.id}
  readOnly={!!params.id}
/>
```

## Example

**Before (erro comum — sem tratamento, sem guard):**

```typescript
useEffect(() => {
  api.get(`/refunds/${params.id}`).then(res => {
    console.log(res.data)
  })
}, [])
```

**After (com esta skill aplicada):**

```typescript
async function fetchRefund(id: string) {
  try {
    const { data } = await api.get<RefundAPIResponse>(`/refunds/${id}`)
    setName(data.name)
    setCategory(data.category)
    setAmount(formatCurrency(data.amount))
    setFileURL(data.fileName)
  } catch (error) {
    if (error instanceof AxiosError) {
      return alert(error.response?.data.message)
    }
    alert("Não foi possível carregar")
  }
}

useEffect(() => {
  if (params.id) {
    fetchRefund(params.id)
  }
}, [params.id])
```

## Heuristics

| Situação | Faça |
|----------|------|
| Página de detalhe com ID na URL | Crie fetch dedicado + useEffect com guard |
| Resposta da API tem campos para popular form | Desestruture `{ data }` e chame setters individuais |
| Valor monetário vindo da API | Converta com `formatCurrency` antes de setar |
| Arquivo/imagem associado ao registro | Use estado separado (`fileURL`) do arquivo de upload (`file`) |
| Modo visualização vs edição | Condicione `disabled`/`readOnly` pela presença de `params.id` |
| Tipagem de resposta singular vs plural | Crie tipos separados para reaproveitamento |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `api.get(...).then(res => console.log(res))` | `const { data } = await api.get<Type>(...)` com try/catch |
| `catch (error) { alert("erro") }` | `catch (error) { if (error instanceof AxiosError) ... }` |
| `useEffect(() => { fetch(id) }, [])` | `useEffect(() => { if (id) fetch(id) }, [id])` |
| `response.data.name ... response.data.category` | `const { data } = response` + `data.name` |
| Estado único para file view e file upload | `fileURL` (exibição) separado de `file` (envio) |
| Mesmo tipo para lista e item único | `RefundAPIResponse` (singular) + `RefundsAPIResponse` (plural) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação de tipos, guard clauses no useEffect, e tratamento de erro Axios
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e anotações

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Dados nao carregam na pagina de detalhe | `useEffect` sem guard clause ou sem dependencia | Adicione `if (params.id) fetchRefund(params.id)` com `[params.id]` |
| `response.data` repetido em cada setter | Nao desestruturou a resposta | Use `const { data } = response` e acesse `data.campo` |
| Inputs editaveis quando deveria ser readonly | `disabled`/`readOnly` nao condicionado | Adicione `disabled={!!params.id}` nos inputs |
| Erro generico sem mensagem da API | `catch` nao verifica `instanceof AxiosError` | Verifique `instanceof AxiosError` antes de acessar `response.data.message` |