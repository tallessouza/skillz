---
name: rs-clean-code-parametros-e-desestruturacao
description: "Enforces destructuring and named parameters when writing JavaScript/TypeScript functions. Use when user asks to 'create a function', 'write a controller', 'implement a route', 'pass parameters', or 'refactor function signatures'. Applies rules: always destructure before forwarding, receive named objects instead of positional args, return objects for extensibility. Make sure to use this skill whenever generating functions that receive or forward multiple parameters. Not for variable naming, import organization, or class design."
---

# Parâmetros e Desestruturação

> Receba e retorne objetos nomeados em funções — nunca repasse objetos genéricos nem use parâmetros posicionais.

## Rules

1. **Desestruture antes de repassar** — extraia campos explicitamente antes de enviar para a próxima função, porque repassar `data` genérico esconde o que está sendo enviado e permite campos indesejados vazarem
2. **Receba objetos, não parâmetros posicionais** — `({ body, params })` não `(body, params)`, porque parâmetros posicionais forçam `null` placeholders quando opcionais e são ilegíveis fora de contexto
3. **Retorne objetos** — `return { user }` não `return user`, porque adicionar campos futuros não quebra nenhum consumidor existente
4. **Nomeie pelo conteúdo, não pela estrutura** — `{ name, email, password }` não `data`, porque `data` não diz nada sobre o que contém
5. **Filtre explicitamente** — mesmo com TypeScript, desestruture para garantir que apenas os campos esperados são repassados, porque tipagem estática não filtra campos extras em runtime

## How to write

### Desestruturação antes de repassar

```typescript
// Extraia os campos e reenvie explicitamente
function createUserController({ name, email, password }) {
  return usersRepository.create({ name, email, password })
}
```

### Parâmetros nomeados via objeto

```typescript
// Receba um objeto — chamadas ficam legíveis e ordem não importa
function createUserRoute({ body, params }) {
  const { name, email, password } = body
  return createUserController({ name, email, password })
}

// Chamada sem body — sem null placeholder
createUserRoute({ params: { id: 1 } })
```

### Retorno como objeto

```typescript
function createUser({ name, email, password }) {
  const user = createUserOnDatabase({ name, email, password })
  // Retorne objeto — extensível sem quebrar consumidores
  return { user }
}
```

## Example

**Before (repasse genérico + parâmetros posicionais):**

```typescript
function createUserRoute(body) {
  createUserController(body)
}

function createUserController(data) {
  usersRepository.create(data)
}

// Parâmetros posicionais — null placeholder obrigatório
function handler(body, params) { /* ... */ }
handler(null, { id: 1 })
```

**After (desestruturado + objetos nomeados):**

```typescript
function createUserRoute(body) {
  const { name, email, password } = body
  createUserController({ name, email, password })
}

function createUserController({ name, email, password }) {
  usersRepository.create({ name, email, password })
}

// Objeto nomeado — sem placeholders
function handler({ body, params }) { /* ... */ }
handler({ params: { id: 1 } })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Função recebe dados e repassa para outra | Desestruture, reenvie campos explícitos |
| Função tem 2+ parâmetros | Converta para objeto único |
| Função tem 1 parâmetro mas pode crescer | Use objeto desde o início |
| Retorno da função é um valor simples | Encapsule em objeto `{ user }` |
| Parâmetro é opcional | Objeto nomeado elimina null placeholders |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `controller(data)` | `const { name, email } = data; controller({ name, email })` |
| `function fn(a, b, c)` | `function fn({ a, b, c })` |
| `fn(null, { id: 1 })` | `fn({ params: { id: 1 } })` |
| `return user` | `return { user }` |
| `controller(body)` (repasse cego) | `const { name, email, password } = body; controller({ name, email, password })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-parametros-e-desestruturacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-parametros-e-desestruturacao/references/code-examples.md)
