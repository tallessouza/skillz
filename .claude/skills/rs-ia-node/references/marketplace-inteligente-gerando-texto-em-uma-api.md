---
name: rs-ia-node-gerando-texto-api
description: "Applies Express + OpenAI text generation API integration patterns when building Node.js endpoints that call LLMs. Use when user asks to 'create an AI endpoint', 'integrate OpenAI with Express', 'generate text from API', 'build a chat route', or 'add AI to my backend'. Covers client initialization, route structure, developer/user message separation, and body parsing. Make sure to use this skill whenever creating Express routes that call OpenAI or similar LLM APIs. Not for frontend UI, streaming responses, or structured data output (use structured output skill instead)."
---

# Gerando Texto em Uma API com Express + OpenAI

> Inicialize o cliente OpenAI uma unica vez fora da rota e separe mensagens de developer (regras do sistema) das mensagens do usuario (input do cliente).

## Rules

1. **Inicialize o cliente OpenAI fora da rota** — crie uma unica instancia no escopo do modulo, porque nao ha razao para criar multiplos clientes por requisicao
2. **Carregue variaveis de ambiente antes de importar modulos que dependem delas** — configure `dotenv` antes de inicializar o app/client, porque a API key precisa estar disponivel no momento da criacao do cliente
3. **Separe configuracao do app do ponto de entrada** — `app.ts` define rotas e middleware, `index.ts` apenas importa e chama `.listen()`, porque facilita testes e organizacao
4. **Use developer message para regras fixas, user message para input do cliente** — o developer message define o comportamento (persona, restricoes), o user message vem do `req.body`, porque isso permite customizacao sem expor regras internas
5. **Habilite `express.json()` antes das rotas** — sem isso o `req.body` sera `undefined`, porque o Express nao parseia JSON por padrao
6. **Retorne a resposta da IA via `res.json()`** — encapsule em um objeto como `{ message: content }`, porque facilita o consumo pelo frontend

## How to write

### Estrutura basica: app + index separados

```typescript
// src/app.ts
import express from "express"
import OpenAI from "openai"

const app = express()
app.use(express.json())

const openai = new OpenAI() // usa OPENAI_API_KEY do env automaticamente

app.post("/generate", async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "developer",
        content: "Voce e um assistente que gera historias de uma frase."
      },
      {
        role: "user",
        content: req.body.message
      }
    ]
  })

  res.json({ message: completion.choices[0].message.content })
})

export { app }
```

```typescript
// src/index.ts
import "dotenv/config" // ANTES de qualquer import que use env vars
import { app } from "./app"

app.listen(3000, () => console.log("Service running"))
```

### Padrao de mensagens: developer + user

```typescript
messages: [
  // Developer: regras fixas da aplicacao (nunca vem do cliente)
  { role: "developer", content: "Regras e persona do assistente" },
  // User: input dinamico que vem do frontend
  { role: "user", content: req.body.message }
]
```

## Example

**Before (tudo misturado no index, client recriado por request):**
```typescript
import express from "express"
import OpenAI from "openai"

const app = express()

app.post("/generate", async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Escreva uma historia sobre cachorros" }]
  })
  console.log(result.choices[0].message.content)
})

app.listen(3000)
```

**After (com este skill aplicado):**
```typescript
// app.ts
import express from "express"
import OpenAI from "openai"

const app = express()
app.use(express.json())

const openai = new OpenAI()

app.post("/generate", async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "developer", content: "Voce e um assistente que gera historias de uma frase." },
      { role: "user", content: req.body.message }
    ]
  })

  res.json({ message: completion.choices[0].message.content })
})

export { app }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Regras fixas do assistente | Coloque em `developer` message |
| Input do usuario final | Coloque em `user` message via `req.body` |
| Precisa de contexto previo | Adicione `assistant` messages entre developer e user |
| Resposta e so texto simples | Use `res.json({ message })` |
| Resposta precisa ser dados estruturados | Use structured output (outro skill) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `new OpenAI()` dentro da rota | `const openai = new OpenAI()` no escopo do modulo |
| `console.log(result)` sem responder ao cliente | `res.json({ message: content })` |
| Hardcode do prompt do usuario | `req.body.message` dinamico |
| Import dotenv depois do app | `import "dotenv/config"` como primeiro import no index |
| Tudo no `index.ts` | Separe `app.ts` (config) e `index.ts` (entrada) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-gerando-texto-em-uma-api/references/deep-explanation.md)
- [Code examples](../../../data/skills/ia-node/rs-ia-node-marketplace-inteligente-gerando-texto-em-uma-api/references/code-examples.md)
