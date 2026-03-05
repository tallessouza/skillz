---
name: rs-ia-node-marketplace-setup-projeto
description: "Applies OpenAI SDK setup pattern when initializing a Node.js project with OpenAI integration. Use when user asks to 'setup openai', 'integrate gpt', 'connect to openai api', 'create chat completion', or 'initialize openai client'. Follows SDK-first approach with proper client initialization, chat completions structure, and response handling. Make sure to use this skill whenever bootstrapping OpenAI integration in Node/TypeScript projects. Not for Python SDK, LangChain, or non-OpenAI LLM providers."
---

# Setup de Projeto com OpenAI SDK (Node.js)

> Sempre use o SDK oficial da OpenAI em vez de requisicoes HTTP diretas, porque ele abstrai detalhes de autenticacao, retries e tipagem.

## Rules

1. **Use o SDK, nunca fetch/axios direto** — `npm install openai` e use a classe `OpenAI`, porque o SDK abstrai headers, retries e tipagem automaticamente
2. **Inicialize o client uma unica vez** — crie `new OpenAI({ apiKey })` no topo do modulo e reutilize, porque multiplas instancias desperdicam memoria
3. **Acesse a resposta pelo caminho completo** — `completion.choices[0].message.content`, porque a API retorna um array de choices mesmo quando ha apenas uma
4. **Especifique o modelo explicitamente** — sempre passe `model: "gpt-4o-mini"` ou equivalente, porque o default pode mudar sem aviso

## Steps

### Step 1: Instalar o SDK

```bash
npm install openai
```

### Step 2: Inicializar o client

```typescript
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
```

### Step 3: Criar um chat completion

```typescript
const completion = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: "Escreva uma mensagem de uma frase sobre unicornios",
    },
  ],
})

console.log(completion.choices[0].message.content)
```

## Estrutura da resposta

```typescript
// completion.choices e um array — por padrao retorna 1 item
completion.choices[0].message.content // string com o texto gerado
```

A API pode retornar multiplas choices (similar ao ChatGPT mostrando opcoes alternativas), mas por padrao retorna apenas uma.

## Estrutura de mensagens

```typescript
messages: [
  { role: "system", content: "..." },  // instrucoes do sistema
  { role: "user", content: "..." },     // mensagem do usuario
  { role: "assistant", content: "..." }, // resposta anterior do modelo
]
```

Cada mensagem tem `role` (quem enviou) e `content` (conteudo textual). Voce pode enviar N mensagens previas para dar contexto ao modelo.

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo com OpenAI | Instale SDK, inicialize client, use `chat.completions.create` |
| Precisa de requisicao customizada | Ainda prefira o SDK — ele aceita configs avancadas |
| Multiplas chamadas no mesmo arquivo | Reutilize a mesma instancia do client |
| Quer respostas deterministicas | Configure `temperature` (proximo aula) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `fetch("https://api.openai.com/...")` | `client.chat.completions.create(...)` |
| `new OpenAI()` sem apiKey explicita | `new OpenAI({ apiKey: process.env.OPENAI_API_KEY })` |
| `completion.choices.message` (sem indice) | `completion.choices[0].message.content` |
| Hardcodar a API key no codigo | Usar variavel de ambiente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
