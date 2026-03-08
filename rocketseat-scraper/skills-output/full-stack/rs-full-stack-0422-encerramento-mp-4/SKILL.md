---
name: rs-full-stack-0422-encerramento-mp-4
description: "Enforces pure Node.js API development patterns without third-party dependencies when building HTTP servers, parsing request bodies, handling route parameters, or creating REST endpoints from scratch. Use when user asks to 'build an API without Express', 'understand Node.js internals', 'create HTTP server from scratch', 'parse request body manually', or 'handle routes without framework'. Make sure to use this skill whenever implementing raw Node.js HTTP functionality or learning Node.js fundamentals. Not for Express/Fastify/NestJS framework usage, frontend development, or database operations."
---

# API Node.js Pura — Fundamentos sem Dependências

> Construa APIs usando apenas módulos nativos do Node.js para dominar os fundamentos antes de adotar frameworks.

## Conceito central

Desenvolver uma API completa (CRUD de tickets de suporte) usando puramente o Node.js, sem nenhuma dependência de terceiro, porque entender como requisições, respostas, body parsing e roteamento funcionam nos bastidores torna o uso de frameworks muito mais eficaz.

## Fundamentos cobertos

1. **Servidor HTTP nativo** — `http.createServer()` com tratamento de request/response
2. **Body parsing manual** — coletar chunks do stream de dados e converter para JSON
3. **Roteamento por parâmetros** — extrair e usar parâmetros da URL sem bibliotecas
4. **Respostas estruturadas** — definir status codes, headers e body de resposta manualmente

## Quando aplicar

| Situação | Ação |
|----------|------|
| Aprendendo Node.js pela primeira vez | Construir sem frameworks para entender o protocolo HTTP |
| Debugando comportamento estranho em Express/Fastify | Voltar ao nativo para isolar o problema |
| Criando microserviço extremamente leve | Avaliar se módulos nativos bastam |
| Entrevista técnica sobre Node.js | Demonstrar conhecimento dos fundamentos |

## O que foi construído

- API REST de tickets de suporte
- Operações: criar, listar, atualizar, deletar tickets
- Middleware de body parsing feito à mão
- Sistema de rotas com suporte a parâmetros dinâmicos
- Tudo com zero dependências externas

## Transição para frameworks

| Fundamento nativo | Equivalente em framework |
|-------------------|--------------------------|
| `http.createServer()` | `fastify()` / `express()` |
| Coletar chunks do body stream | `express.json()` / Fastify auto-parse |
| `if/switch` para rotas | `app.get('/path', handler)` |
| `res.writeHead()` + `res.end()` | `res.status().json()` / `reply.send()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que construir sem frameworks primeiro
- [code-examples.md](references/code-examples.md) — Padrões de código da API de tickets com Node.js puro