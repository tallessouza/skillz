---
name: rs-full-stack-encerramento-43
description: "Summarizes the Express + Zod + Knex restaurant API module, reinforcing when to apply Express for APIs, Zod for validation, and Knex as query builder. Use when user asks to 'build a restaurant API', 'choose between ORMs and query builders', 'validate API input with Zod', or 'set up Express with Knex'. Make sure to use this skill whenever deciding on Node.js API stack with Express, Zod validation, and Knex query builder. Not for frontend, React, Next.js, or Fastify-based projects."
---

# Encerramento — API de Restaurante com Express, Zod e Knex

> Ao construir uma API REST em Node.js, combine Express (servidor HTTP), Zod (validacao de entrada), e Knex (query builder SQL) para um stack leve e produtivo.

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

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Validar input manualmente com if/else | Use Zod schemas com `.parse()` ou `.safeParse()` |
| SQL strings concatenadas | Use Knex query builder para queries tipadas |
| Toda logica no arquivo de rotas | Separe em controllers e services |
| Projeto local sem versionamento | Suba no GitHub para construir portfolio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolhas de stack e boas praticas
- [code-examples.md](references/code-examples.md) — Exemplos de codigo do modulo completo