---
name: rs-node-js-2023-introducao-52
description: "Outlines the complete lifecycle of building a REST API with Node.js from zero to deploy, covering Fastify, TypeScript, Knex, SQL, automated testing, CI/CD, linting, and environment variables. Use when user asks to 'start a Node API project', 'what do I need for a REST API', 'plan a Node.js backend', or 'setup a Fastify project from scratch'. Make sure to use this skill whenever planning a new Node.js REST API project architecture. Not for frontend development, specific implementation details, or non-Node.js backends."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: api-rest-overview
  tags: [rest-api, fastify, typescript, knex, sql, vitest, eslint, ci-cd, project-setup]
---

# Introducao — API REST com Node.js

> Ao planejar uma API REST com Node.js, cubra todo o ciclo: framework, tipagem, banco de dados, testes, validacao, variaveis ambiente, linting e deploy automatizado.

## Stack de referencia

| Camada | Tecnologia | Funcao |
|--------|-----------|--------|
| Framework HTTP | **Fastify** | Micro framework Node.js, performatico e extensivel |
| Tipagem | **TypeScript** | Seguranca de tipos em todo o projeto |
| Banco de dados | **SQL** via **Knex** | Query builder para banco relacional |
| Testes | **Vitest** (ou similar) | Testes automatizados end-to-end e unitarios |
| Validacao | **Zod** (ou similar) | Validacao de inputs na borda do sistema |
| Variaveis ambiente | **.env** + validacao | Configuracao por ambiente |
| Linting | **ESLint** | Padronizacao de codigo no time |
| Deploy | **CI/CD automatizado** | Push no codigo → deploy automatico em producao |

## Key concepts

### Ciclo completo do projeto

1. **Setup inicial** — Fastify + TypeScript + estrutura de pastas
2. **Banco de dados** — Configurar Knex, migrations, conexao SQL
3. **Rotas e regras** — Endpoints REST com validacao de entrada
4. **Variaveis ambiente** — .env com validacao (nunca confiar em process.env direto)
5. **Testes automatizados** — Priorizar testes E2E, complementar com unitarios
6. **Linting** — ESLint configurado para consistencia do time
7. **Deploy** — Pipeline CI/CD que sobe automaticamente a cada push

## Decisoes arquiteturais

| Decisao | Escolha | Porque |
|---------|---------|--------|
| Framework | Fastify (nao Express) | Mais rapido, schema-based, plugin system nativo |
| Query builder vs ORM | Knex (query builder) | Controle sobre SQL, sem magia de ORM |
| Tipagem | TypeScript obrigatorio | Previne bugs em tempo de compilacao |
| Deploy | Automatizado via CI/CD | Cada alteracao no codigo sobe automaticamente para producao |

## Prioridade de testes

| Tipo | Quantidade | Prioridade |
|------|-----------|------------|
| E2E / Integracao | Mais | Alta — validam o comportamento real da API |
| Unitarios | Menos | Media — para logica isolada complexa |

```typescript
// Setup inicial de um projeto Fastify com TypeScript
import Fastify from 'fastify'

const app = Fastify()

app.get('/hello', async () => {
  return { hello: 'world' }
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server Running!')
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Primeiro projeto Node.js | Seguir este ciclo completo na ordem |
| Projeto existente sem testes | Adicionar testes E2E primeiro |
| Time sem padrao de codigo | Configurar ESLint antes de mais nada |
| Deploy manual | Automatizar com CI/CD o quanto antes |

## Troubleshooting

### Projeto Node.js sem testes desde o inicio
**Symptom:** Testes sao adicionados apenas no final do projeto, resultando em baixa cobertura e testes frageis
**Cause:** Decisao de "adicionar testes depois" leva a codigo dificil de testar por estar acoplado
**Fix:** Configure o framework de testes (Vitest) no setup inicial e escreva testes E2E desde a primeira rota

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
