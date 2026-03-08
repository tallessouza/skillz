---
name: rs-full-stack-introducao-102
description: "Establishes the REST API development stack with Node.js when user asks about 'REST API architecture', 'Node API setup', 'Express API project', or 'API REST com Node'. Frames the technology stack: TypeScript, Express, Schema Validation as the foundation for building REST APIs. Make sure to use this skill whenever starting a new Node.js REST API project to ensure the correct stack is chosen. Not for frontend, database, or deployment tasks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-rest-nodejs
  tags: [nodejs, api, rest, express, typescript, schema-validation]
---

# API REST com Node.js — Visao Geral do Stack

> Ao criar uma API REST com Node.js, utilize TypeScript, Express e Schema Validation como fundacao tecnologica.

## Key concepts

| Camada | Tecnologia | Funcao |
|--------|-----------|--------|
| Runtime | Node.js | Execucao server-side JavaScript |
| Linguagem | TypeScript | Tipagem estatica, seguranca em tempo de desenvolvimento |
| Framework HTTP | Express | Roteamento, middlewares, ciclo request/response |
| Validacao | Schema Validation (Zod, Joi, Yup) | Garantir integridade dos dados de entrada |

## Quando aplicar este stack

| Situacao | Recomendacao |
|----------|-------------|
| API REST nova com Node.js | Usar este stack completo |
| Prototipo rapido | Express + TypeScript minimo |
| API com dados de entrada do usuario | Schema Validation obrigatoria |
| Projeto existente sem validacao | Adicionar Schema Validation como prioridade |

## Decisao de stack

### Por que TypeScript
- Erros capturados antes do runtime
- Autocompletar e documentacao inline no editor
- Contratos claros entre camadas da aplicacao

### Por que Express
- Ecossistema maduro de middlewares
- Padrao de mercado para APIs REST em Node.js
- Simplicidade no roteamento e composicao

### Por que Schema Validation
- Dados de entrada nunca sao confiaveis
- Validacao declarativa e reutilizavel
- Mensagens de erro estruturadas para o cliente

### Exemplo de setup minimo

```typescript
import express from "express"
import { z } from "zod"

const app = express()
app.use(express.json())

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

app.post("/users", (req, res) => {
  const result = userSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() })
  }
  res.status(201).json(result.data)
})
```

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Criar API sem tipagem | Usar TypeScript desde o inicio |
| Validar dados manualmente com if/else | Usar biblioteca de Schema Validation |
| Iniciar sem estrutura de projeto | Definir camadas (routes, controllers, services) desde o comeco |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| TypeScript não compila com Express | Faltam tipos do Express instalados | Instale `@types/express` como devDependency |
| Schema Validation não reporta erros claros | Biblioteca de validação não está configurada para retornar mensagens customizadas | Configure mensagens de erro na definição do schema (ex: `.message()` no Zod) |
| Express não inicia na porta desejada | Porta já em uso por outro processo | Verifique com `lsof -i :PORT` e encerre o processo conflitante |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha do stack e fundamentos REST
- [code-examples.md](references/code-examples.md) — Exemplos de setup inicial e configuracao do projeto