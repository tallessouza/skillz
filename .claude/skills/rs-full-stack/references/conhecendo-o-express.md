---
name: rs-full-stack-conhecendo-o-express
description: "Applies Express.js fundamentals when setting up Node.js APIs. Use when user asks to 'create an API', 'setup Express', 'handle routes', 'parse request body', or 'add middleware'. Covers Express architecture: built-in request/response handling, routing, query params, route params, JSON body parsing, and middleware extension. Make sure to use this skill whenever starting a new Express project or explaining Express concepts. Not for frontend frameworks, database setup, or advanced Express patterns like error middleware chains."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-express
  tags: [express, nodejs, middleware, routing, req-body, req-params, api]
---

# Conhecendo o Express

> Express e um framework minimalista e flexivel para Node.js que abstrai o trabalho manual de lidar com requisicoes e respostas HTTP.

## Key concepts

Express e um conjunto de ferramentas (framework) que elimina o trabalho manual que voce faria com Node puro. Em vez de criar middleware customizado para parsear chunks do body, extrair parametros com regex, ou converter query strings manualmente, Express entrega tudo isso pronto dentro do objeto `request`.

A analogia central: com Node puro voce constroi a estrada antes de dirigir. Com Express, a estrada ja existe — voce so dirige.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Precisa parsear JSON do body da requisicao | `express.json()` middleware — nao faca manualmente com chunks |
| Precisa extrair query params | `req.query` — ja disponivel, sem regex |
| Precisa extrair route params | `req.params` — ja disponivel, sem regex |
| Precisa organizar logica entre request e response | Middleware pattern — funcoes encadeadas |
| Precisa criar rotas HTTP | Metodos `app.get()`, `app.post()`, etc. — roteamento leve e flexivel |

## How to think about it

### Node puro vs Express

Com Node puro, voce precisa:
1. Escutar chunks do body manualmente (`req.on('data')`, `req.on('end')`)
2. Criar regex para extrair parametros da URL
3. Parsear query strings manualmente
4. Converter JSON do body manualmente

Com Express, tudo isso ja vem resolvido — voce acessa `req.body`, `req.params`, `req.query` diretamente.

### Middleware como extensao

Express e minimalista por design. Funcionalidades extras sao adicionadas via middlewares, que sao funcoes encadeadas entre a requisicao e a resposta. Isso torna o framework flexivel — voce adiciona so o que precisa.

## Tres caracteristicas principais

1. **Minimalista e flexivel** — conjunto robusto de recursos sem complexidade desnecessaria
2. **Metodos utilitarios HTTP** — crie APIs robustas com agilidade reaproveitando recursos prontos
3. **Roteamento leve e extensivel** — estrutura de rotas que pode ser aumentada com middlewares

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Express faz tudo sozinho | Express e minimalista — funcionalidades extras vem via middleware |
| Preciso parsear body manualmente no Express | `express.json()` resolve isso em uma linha |
| Express e pesado e complexo | Express e leve — o core e pequeno, voce estende conforme necessidade |
| Node puro e melhor para aprender | Node puro ensina fundamentos, mas Express e o padrao para producao |

## When to apply

- Ao iniciar qualquer API REST com Node.js
- Ao migrar de Node puro para um framework
- Ao precisar de roteamento, parsing de body, query params, ou middleware
- Ao organizar uma aplicacao server-side com clareza

## Code example

```javascript
import express from 'express'

const app = express()
app.use(express.json()) // Middleware para parsear JSON do body

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'John' }])
})

app.post('/users', (req, res) => {
  const { name } = req.body // Body ja parseado pelo middleware
  res.status(201).json({ id: 2, name })
})

app.listen(3000, () => console.log('Server running on port 3000'))
```

## Limitations

- Express nao inclui ORM, validacao, ou autenticacao por padrao — use middlewares/libs
- Para aplicacoes real-time pesadas (WebSockets), Express sozinho nao basta
- Express e callback-based por padrao — async/await requer tratamento adicional de erros

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `req.body` retorna `undefined` | Middleware `express.json()` nao registrado | Adicionar `app.use(express.json())` antes das rotas |
| Rota retorna 404 | Metodo HTTP ou path incorreto | Verificar se o metodo (`app.get`, `app.post`) e o path coincidem com a requisicao |
| `Cannot GET /rota` | Rota nao registrada ou servidor nao reiniciado | Verificar registro da rota e reiniciar o servidor |
| Middleware nao executa | Registrado depois da rota que deveria interceptar | Registrar middlewares antes das rotas que dependem deles |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que Express existe e como ele se compara ao Node puro
- [code-examples.md](references/code-examples.md) — Exemplos praticos de setup, rotas, middleware e parsing