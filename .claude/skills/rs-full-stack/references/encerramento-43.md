---
name: rs-full-stack-encerramento-43
description: "Outlines the Express + Zod + Knex restaurant API module, reinforcing when to apply Express for APIs, Zod for validation, and Knex as query builder. Use when user asks to 'build a restaurant API', 'choose between ORMs and query builders', 'validate API input with Zod', or 'set up Express with Knex'. Make sure to use this skill whenever deciding on Node.js API stack with Express, Zod validation, and Knex query builder. Not for frontend, React, Next.js, or Fastify-based projects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-express
  tags: [express, zod, knex, api, node-js, rest]
---

# Encerramento — API de Restaurante com Express, Zod e Knex

> Ao construir uma API REST em Node.js, combine Express (servidor HTTP), Zod (validacao de entrada), e Knex (query builder SQL) para um stack leve e produtivo.

## Key concepts

- Express como servidor HTTP leve para APIs REST
- Zod para validacao de entrada com schemas declarativos
- Knex como query builder SQL com migrations e seeds
- Separacao de responsabilidades entre controllers, services e banco

## Stack consolidado neste modulo

| Camada | Ferramenta | Responsabilidade |
|--------|-----------|-----------------|
| Servidor HTTP | Express | Rotas, middlewares, controllers |
| Validacao | Zod | Schema validation de request body/params |
| Banco de dados | Knex (Query Builder) | Queries SQL tipadas, migrations, seeds |

## Quando usar este stack

| Situacao | Recomendacao |
|----------|-------------|
| API REST simples a media complexidade | Express + Zod + Knex e ideal |
| Precisa de controle fino sobre SQL | Knex (query builder) sobre ORMs como Prisma |
| Validacao de input do usuario | Zod no controller antes de processar |
| Projeto para portfolio | Estruturar bem, subir no GitHub com README |

## Habilidades consolidadas

1. **Criar API com Express** — rotas, middlewares, controllers separados
2. **Validar com Zod** — schemas de entrada, parse seguro, mensagens de erro claras
3. **Usar Knex como Query Builder** — migrations, seeds, queries encadeadas
4. **Estruturar projeto** — separacao de responsabilidades entre camadas

## Example

```javascript
import { z } from 'zod'

const createOrderSchema = z.object({
  tableNumber: z.number().min(1),
  items: z.array(z.string()).min(1),
})

app.post('/orders', (req, res) => {
  const data = createOrderSchema.parse(req.body)
  // proceed with validated data
})
```

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Validar input manualmente com if/else | Use Zod schemas com `.parse()` ou `.safeParse()` |
| SQL strings concatenadas | Use Knex query builder para queries tipadas |
| Toda logica no arquivo de rotas | Separe em controllers e services |
| Projeto local sem versionamento | Suba no GitHub para construir portfolio |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Zod parse lanca excecao nao tratada | Erro de validacao nao capturado | Use safeParse() ou adicione error handler middleware no Express |
| Rota retorna 404 inesperado | Rota nao registrada ou metodo HTTP errado | Verifique app.use() e confirme GET/POST/PUT/DELETE correto |
| Knex migration nao cria tabela | Funcao up() vazia ou com erro de sintaxe | Verifique exports.up e teste com knex migrate:latest --debug |
| CORS bloqueando requisicoes do frontend | Middleware cors() nao configurado | Instale e configure cors: app.use(cors()) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolhas de stack e boas praticas
- [code-examples.md](references/code-examples.md) — Exemplos de codigo do modulo completo