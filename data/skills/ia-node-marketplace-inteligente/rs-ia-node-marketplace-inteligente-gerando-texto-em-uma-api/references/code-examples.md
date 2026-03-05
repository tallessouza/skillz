# Code Examples: Gerando Texto em Uma API

## Exemplo 1: Estrutura basica dos arquivos

### app.ts — Configuracao da aplicacao

```typescript
import express from "express"
import OpenAI from "openai"

const app = express()
app.use(express.json())

// Cliente unico — inicializado uma vez no escopo do modulo
const openai = new OpenAI()

app.post("/generate", async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "developer",
        content:
          "Alem de usar emoji, voce e um assistente que gera historias de uma frase.\nO emoji e a cada duas palavras, isso e obrigatorio."
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

### index.ts — Ponto de entrada

```typescript
import "dotenv/config" // PRIMEIRO — antes de qualquer modulo que use env vars
import { app } from "./app"

app.listen(3000, () => {
  console.log("Service running")
})
```

## Exemplo 2: Instalacao de dependencias

```bash
npm install express openai
npm install -D @types/express
```

## Exemplo 3: Script de desenvolvimento com watch

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

O `tsx watch` monitora mudancas e reinicia automaticamente.

## Exemplo 4: Testando a API com HTTP client

Usando qualquer HTTP client (httpie, curl, VS Code REST client, Insomnia):

```http
POST http://localhost:3000/generate
Content-Type: application/json

{
  "message": "cachorros"
}
```

Resposta:
```json
{
  "message": "Cachorro 🐕 corre 🏃 alegremente no 🌳 quintal, brincando 🎾 com sua 🐶 bola."
}
```

## Exemplo 5: Variacao — input minimo do usuario

O instrutor demonstra que o usuario nao precisa ser verboso. Com o developer message definindo "gera historias de uma frase", o usuario pode enviar apenas:

```json
{ "message": "jogador de futebol" }
```

E receber uma historia completa, porque todo o contexto ja esta no developer message.

## Exemplo 6: Erro comum — dotenv carregado tarde demais

```typescript
// ❌ ERRADO — app.ts inicializa OpenAI antes do dotenv ser carregado
import { app } from "./app"     // OpenAI() executa aqui — OPENAI_API_KEY undefined
import "dotenv/config"           // Tarde demais

app.listen(3000)
```

```typescript
// ✅ CORRETO — dotenv carrega primeiro
import "dotenv/config"           // Vars de ambiente disponiveis
import { app } from "./app"     // OpenAI() encontra OPENAI_API_KEY

app.listen(3000)
```

## Exemplo 7: Evolucao do codigo — de toy example para API

### Antes (script isolado):
```typescript
import OpenAI from "openai"

const openai = new OpenAI()

const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "developer", content: "Voce e um assistente." },
    { role: "user", content: "Sobre cachorros" }
  ]
})

console.log(completion.choices[0].message.content)
```

### Depois (API real):
```typescript
// O mesmo codigo, mas agora:
// 1. Dentro de uma rota Express
// 2. Input vem do req.body (nao hardcoded)
// 3. Output vai para res.json (nao console.log)
// 4. Cliente OpenAI inicializado fora da rota
```

A transicao e direta: substitua `console.log` por `res.json`, substitua string hardcoded por `req.body.message`, e mova o client para fora da rota.