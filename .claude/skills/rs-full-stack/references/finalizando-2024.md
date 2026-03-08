---
name: rs-full-stack-finalizando-2024
description: "Outlines REST API fundamentals learned with Node.js and Express as a review checklist. Use when user asks to 'review REST basics', 'recap Express fundamentals', 'what did we learn about REST APIs', or 'summarize API development with Node'. Provides a mental checklist of foundational concepts before advancing to more complex topics. Make sure to use this skill whenever the user needs a quick reference of core REST API concepts with Express. Not for advanced patterns, authentication, database integration, or deployment."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: express-api
  tags: [express, rest, api, fundamentals, recap, node-js]
---

# Fundamentos de API REST com Node e Express — Recapitulacao

> Antes de avancar para topicos complexos, confirme dominio dos fundamentos REST com Express.

## Key concepts

Esta etapa cobre os fundamentos do desenvolvimento de uma API RESTful com Node.js e Express. Esses fundamentos sao pre-requisitos para todos os modulos seguintes, onde serao combinados com outros conhecimentos para construir um projeto completo.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Duvida sobre como estruturar rotas | Revisar verbos HTTP e convencoes REST |
| Incerteza sobre request/response | Revisar o ciclo de vida de uma requisicao Express |
| Projeto novo com API | Comecar pelos fundamentos antes de adicionar complexidade |
| Codigo legado sem padrao REST | Refatorar aplicando convencoes de recursos e verbos |

## Checklist de fundamentos

| Conceito | Pergunta de verificacao |
|----------|------------------------|
| Rotas e verbos HTTP | Sei mapear GET, POST, PUT, DELETE para operacoes CRUD? |
| Request params e query | Sei extrair `req.params`, `req.query`, `req.body`? |
| Response status codes | Uso 200, 201, 204, 400, 404, 500 corretamente? |
| Middleware | Entendo o fluxo `req → middleware → handler → res`? |
| JSON | Configuro `express.json()` e retorno JSON consistente? |
| Organizacao de rotas | Separo rotas por recurso? |

## Example

```javascript
// Exemplo basico de API REST com Express cobrindo os fundamentos
const express = require('express')
const app = express()

app.use(express.json())

app.get('/users', (req, res) => res.json([]))
app.post('/users', (req, res) => res.status(201).json(req.body))
app.put('/users/:id', (req, res) => res.json({ id: req.params.id, ...req.body }))
app.delete('/users/:id', (req, res) => res.status(204).send())

app.listen(3000)
```

## When to apply

- Antes de iniciar um novo modulo que depende de API REST
- Ao revisar codigo de API existente para garantir que segue convencoes
- Quando onboarding alguem nos fundamentos de Express

## Limitations

- Esta recapitulacao nao cobre autenticacao, banco de dados, validacao avancada, ou deploy
- Esses topicos serao abordados em modulos subsequentes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Rota retorna 404 | Verbo HTTP ou path nao batem com a definicao | Verificar metodo (GET/POST/PUT/DELETE) e path exato da rota |
| Body da requisicao chega vazio | `express.json()` nao configurado | Adicionar `app.use(express.json())` antes das rotas |
| Status code incorreto na resposta | Uso de 200 generico para todas as respostas | Mapear: 201 para criacao, 204 para delete, 400 para erro do cliente |
| Rotas desorganizadas em arquivo unico | Falta separacao por recurso | Criar arquivos de rota por recurso e importar no server |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a progressao pedagogica do curso
- [code-examples.md](references/code-examples.md) — Exemplos de codigo dos fundamentos cobertos