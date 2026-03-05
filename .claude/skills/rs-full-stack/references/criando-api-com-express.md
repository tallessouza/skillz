---
name: rs-full-stack-criando-api-com-express
description: "Applies Express API initialization patterns when setting up a Node.js server with Express. Use when user asks to 'create an API', 'setup Express', 'initialize a server', 'start a Node project with Express', or 'create a REST API'. Enforces port extraction to named constants, proper app initialization, and callback logging on listen. Make sure to use this skill whenever scaffolding a new Express server. Not for frontend code, database setup, or route/endpoint implementation."
---

# Criando API com Express

> Ao inicializar uma API Express, extraia configuracoes em constantes nomeadas e sinalize execucao no terminal.

## Rules

1. **Inicialize Express em uma constante `app`** — `const app = express()`, porque centraliza todos os recursos do framework em uma referencia reutilizavel
2. **Extraia a porta para uma constante em UPPER_CASE** — `const PORT = 3333`, porque constantes de configuracao em caixa alta sinalizam parametros que podem mudar e evitam duplicacao
3. **Use callback no `listen` para logar a porta** — porque confirma visualmente no terminal que o servidor subiu e em qual porta
4. **Interpole a constante PORT no log** — `Server is running on port ${PORT}`, porque se a porta mudar, o log reflete automaticamente sem editar duas linhas
5. **Nunca hardcode a porta diretamente no listen** — extraia para constante primeiro, porque duplicar o valor em multiplos lugares causa divergencia silenciosa

## How to write

### Inicializacao padrao

```typescript
import express from "express"

const PORT = 3333

const app = express()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Example

**Before (porta hardcoded, sem feedback):**
```typescript
import express from "express"

const app = express()
app.listen(3333)
```

**After (com esta skill aplicada):**
```typescript
import express from "express"

const PORT = 3333

const app = express()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Servidor simples para desenvolvimento | `const PORT = 3333` com log no callback |
| Variavel de ambiente disponivel | `const PORT = process.env.PORT \|\| 3333` |
| Multiplos lugares referenciam a porta | Sempre use a constante PORT |
| Constante de configuracao (porta, host, limites) | UPPER_CASE para diferenciar de variaveis logicas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `app.listen(3333)` | `app.listen(PORT, () => console.log(...))` |
| `const port = 3333` (lowercase para config) | `const PORT = 3333` (UPPER_CASE para constantes de config) |
| `app.listen(3333, () => console.log("running on 3333"))` | `app.listen(PORT, () => console.log(\`...port ${PORT}\`))` |
| Porta duplicada em listen e no log | Interpolar a mesma constante PORT nos dois lugares |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre constantes de configuracao e padrao de inicializacao Express
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-api-com-express/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-api-com-express/references/code-examples.md)
