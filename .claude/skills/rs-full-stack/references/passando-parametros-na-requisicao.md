---
name: rs-full-stack-passando-parametros-na-requisicao
description: "Enforces dynamic parameter passing in fetch requests when writing JavaScript/TypeScript API calls. Use when user asks to 'fetch by id', 'get specific item', 'make API call with parameter', 'dynamic URL', or 'template literal in fetch'. Applies rules: template literals for dynamic URLs, async/await pattern, parameter-driven functions. Make sure to use this skill whenever generating fetch calls that need dynamic path segments or query parameters. Not for static fetches, form submissions, or POST/PUT request bodies."
---

# Passando Parâmetros na Requisição

> Funções de fetch que buscam recursos específicos recebem o identificador como parâmetro e interpolam na URL com template literals.

## Rules

1. **Receba o identificador como parâmetro da função** — `fetchProductById(id)` não `fetchProductById()` com ID hardcoded, porque a função deve ser reutilizável para qualquer recurso
2. **Use template literals para URLs dinâmicas** — `` `${baseUrl}/products/${id}` `` não `url + "/" + id`, porque template literals são mais legíveis e menos propensos a erro de concatenação
3. **Nomeie a função pelo que ela busca** — `fetchProductById` não `fetchData` ou `getData`, porque o nome comunica a intenção e o parâmetro esperado
4. **Mantenha o padrão async/await** — `const response = await fetch(url)` seguido de `const data = await response.json()`, porque é o fluxo padrão de requisição + parsing
5. **Separe requisição de exibição** — a função busca e retorna os dados, a chamada decide o que fazer com eles, porque isso mantém responsabilidade única

## How to write

### Função parametrizada com async/await

```javascript
async function fetchProductById(id) {
  const response = await fetch(`https://api.example.com/products/${id}`)
  const product = await response.json()
  return product
}

// Chamada dinâmica
const product = await fetchProductById(3)
console.log(product)
```

### Múltiplos parâmetros na URL

```javascript
async function fetchOrderByUserAndId(userId, orderId) {
  const response = await fetch(`https://api.example.com/users/${userId}/orders/${orderId}`)
  const order = await response.json()
  return order
}
```

## Example

**Before (ID hardcoded):**
```javascript
async function fetchProduct() {
  const response = await fetch("https://api.example.com/products/1")
  const data = await response.json()
  console.log(data)
}
```

**After (with this skill applied):**
```javascript
async function fetchProductById(id) {
  const response = await fetch(`https://api.example.com/products/${id}`)
  const product = await response.json()
  return product
}

const product = await fetchProductById(1)
console.log(product)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Buscar recurso por ID | Parâmetro na função + template literal na URL |
| URL com múltiplos segmentos dinâmicos | Múltiplos parâmetros, cada um interpolado |
| Base URL reutilizada em várias funções | Extrair para constante, interpolar o path |
| ID vem de input do usuário ou evento | Passar como argumento na chamada da função |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `fetch("https://api.com/products/1")` | `fetch(\`https://api.com/products/${id}\`)` |
| `fetch(url + "/" + id)` | `fetch(\`${url}/${id}\`)` |
| `function fetchProduct() { /* id hardcoded */ }` | `function fetchProductById(id) { ... }` |
| `const data = await response.json(); console.log(data)` dentro da função | `return await response.json()` e exiba fora |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre parametrização de requisições e template literals
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-passando-parametros-na-requisicao/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-passando-parametros-na-requisicao/references/code-examples.md)
