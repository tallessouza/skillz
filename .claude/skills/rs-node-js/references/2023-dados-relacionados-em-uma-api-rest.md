---
name: rs-node-js-2023-dados-relacionados-rest
description: "Applies REST API data relationship strategies to avoid overfetching and underfetching when designing endpoints. Use when user asks to 'create an endpoint', 'return related data', 'design API routes', 'list with author', or 'fetch nested resources'. Guides decisions on when to include relationships inline vs separate requests. Make sure to use this skill whenever designing REST endpoints that involve related entities. Not for GraphQL APIs, database schema design, or frontend data fetching logic."
---

# Dados Relacionados em uma API REST

> Ao projetar endpoints REST, encontre o meio-termo entre overfetching e underfetching incluindo relacionamentos estrategicamente.

## Key concept

REST APIs sofrem de dois problemas opostos ao lidar com dados relacionados:

- **Overfetching**: retornar dados demais numa rota (ex: pergunta + respostas + comentarios tudo junto), aumentando bytes transferidos e tempo de resposta mesmo quando o frontend nao precisa de tudo
- **Underfetching**: micro-rotas que retornam pedacos minimos (ex: uma rota so pra pergunta, outra so pro autor), forcando o frontend a fazer dezenas de requisicoes para montar uma unica tela

O meio-termo exige comunicacao constante entre backend e frontend.

## Decision framework

| Cenario | Estrategia |
|---------|-----------|
| Listagem de items (ex: perguntas) | Incluir dados do autor inline — frontend nao pode fazer N requisicoes para N items |
| Detalhe de item unico (ex: uma pergunta) | Incluir autor + anexos inline, porque sao poucos relacionamentos essenciais |
| Relacionamento 1:N grande (ex: respostas de uma pergunta) | Rota separada com paginacao — nao embutir na rota do item pai |
| Relacionamento aninhado (ex: autor de cada resposta) | Incluir inline na listagem de respostas — mesmo principio da listagem principal |
| Sub-relacionamento profundo (ex: comentarios de respostas) | Trazer apenas os primeiros (ex: 3) com botao "carregar mais" — rota separada paginada |

## Rules

1. **Listagens sempre incluem relacionamentos essenciais inline** — porque o frontend nao pode fazer uma requisicao por item para buscar o autor
2. **Relacionamentos 1:N grandes vao em rota separada** — porque embutir respostas dentro da pergunta causa overfetching quando o frontend so quer os dados da pergunta
3. **Detalhe de item unico pode incluir 2-3 relacionamentos diretos** — autor + anexos sao aceitaveis, mas nao carregue a arvore inteira
4. **Nunca crie micro-rotas atomicas** — uma rota so pro autor, outra so pro titulo causa underfetching e dezenas de requisicoes

## Heuristics

| Situacao | Faca |
|----------|------|
| Frontend precisa do autor em cada item da lista | Retorne autor inline no endpoint de listagem |
| Relacionamento tem paginacao propria | Crie endpoint separado |
| Dado relacionado e pequeno e sempre necessario | Inclua inline |
| Dado relacionado e grande ou opcional | Endpoint separado |
| Duvida se inclui ou nao | Converse com frontend, priorize menos requisicoes |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Retornar so `authorId` numa listagem | Retornar `author: { id, name, avatar }` inline |
| Embutir todas as respostas + comentarios na rota de detalhe da pergunta | Rota separada `/questions/:id/answers` com paginacao |
| Criar `/authors/:id` como unica forma de obter autor | Incluir autor inline onde necessario |
| Uma mega-rota que retorna tudo aninhado | Dividir em 2-3 rotas estrategicas |

## Example

**Before (underfetching — frontend faz N+1 requisicoes):**
```typescript
// GET /questions -> retorna apenas { id, title, authorId }
// Frontend precisa fazer GET /authors/:id para CADA pergunta
```

**After (relacionamento inline na listagem):**
```typescript
// GET /questions -> retorna { id, title, author: { id, name, avatarUrl } }
// Frontend tem tudo que precisa em uma unica requisicao
```

**Arquitetura de rotas para um forum:**
```typescript
// Listagem: inclui autor inline
GET /questions -> [{ id, title, slug, author: { id, name } }]

// Detalhe: inclui autor + anexos inline
GET /questions/:slug -> { id, title, content, author: { id, name }, attachments: [...] }

// Respostas: rota separada com autor inline
GET /questions/:id/answers -> [{ id, content, author: { id, name }, recentComments: [...] }]

// Comentarios extras: rota separada paginada
GET /answers/:id/comments?page=2 -> [{ id, content, author: { id, name } }]
```

## Limitations

- Este framework assume REST — GraphQL resolve overfetching/underfetching por design
- O meio-termo ideal depende do frontend especifico, nao existe formula universal
- Performance de queries com JOINs deve ser monitorada — incluir relacionamentos inline tem custo no banco

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-dados-relacionados-em-uma-api-rest/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-dados-relacionados-em-uma-api-rest/references/code-examples.md)
