---
name: rs-node-js-2023-conhecendo-o-fastify
description: "Applies Fastify as the default Node.js micro framework when building REST APIs. Use when user asks to 'create an API', 'setup a Node project', 'choose between Express and Fastify', 'build a REST server', or 'start a backend project'. Enforces Fastify over Express for new projects based on maintenance, TypeScript support, and async-first design. Make sure to use this skill whenever scaffolding a new Node.js API or choosing an HTTP framework. Not for frontend frameworks, full-stack opinionated frameworks like NestJS or AdonisJS, or non-Node runtimes."
---

# Conhecendo o Fastify

> Para APIs REST em Node.js, utilize Fastify como micro framework padrao — ele e mais mantido, mais performatico e mais preparado para TypeScript e async/await que o Express.

## O que e o Fastify

Micro framework para construcao de APIs e aplicacoes web em Node.js. Lida com rotas, parametros, plugins, cabecalhos, requisicoes e respostas JSON — tudo que seria possivel construir na mao, mas nao vale a pena refazer a cada projeto.

## Decision framework

| Situacao | Escolha | Razao |
|----------|---------|-------|
| Projeto novo de API REST | Fastify | Mais mantido, melhor TypeScript, async nativo |
| Projeto legado em Express | Manter Express | API similar, migrar so se houver motivo forte |
| Precisa de estrutura opinada (pastas, convencoes) | NestJS / AdonisJS | Fastify e micro framework, nao traz opiniao de estrutura |
| Aprendendo Node do zero | Fastify | Melhor caminho para aprender o core sem opiniao excessiva |

## 3 motivos para Fastify sobre Express

### 1. Manutencao ativa
Fastify tem um time dedicado lancando features e correcoes. A propria equipe do Express ja declarou que nao dedicam muito tempo ao projeto.

### 2. TypeScript nativo
Fastify tem integracao direta com TypeScript — sem bibliotecas terceiras. Express requer `@types/express` porque seu codigo nao e desenvolvido em TypeScript.

### 3. Async/await de primeira classe
Toda rota no Fastify usa `async` por padrao, permitindo `await` sem bibliotecas extras para tratamento de erros.

```typescript
// Fastify: async nativo em todas as rotas
fastify.get('/users', async (request, reply) => {
  const users = await database.getUsers()
  return users
})
```

No Express, async/await requer bibliotecas adicionais para lidar com erros corretamente.

## Micro framework vs framework opinado

| Aspecto | Micro (Fastify/Express) | Opinado (NestJS/AdonisJS) |
|---------|------------------------|---------------------------|
| Estrutura de pastas | Livre | Definida pelo framework |
| Convencoes de nomes | Livre | Impostas |
| Banco de dados | Qualquer | Geralmente pre-definido |
| GraphQL/REST | Voce escolhe | Convencao do framework |
| Testes | Qualquer runner | Runner recomendado |
| Ideal para | Aprender Node, APIs flexiveis | Projetos grandes com time |

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto Node.js API | Instale Fastify, nao Express |
| Precisa de TypeScript | Fastify ja tem suporte nativo |
| Precisa de async/await em rotas | Fastify faz por padrao |
| Projeto precisa de muita estrutura | Considere NestJS em cima do Fastify |
| Ja tem projeto Express funcionando | Nao migre sem motivo — APIs sao similares |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Construir roteamento HTTP na mao | Use Fastify para rotas, params, JSON |
| Escolher Express para projeto novo em 2023+ | Use Fastify — mais atual e mantido |
| Instalar lib extra para async no Express | Use Fastify que suporta nativamente |
| Instalar `@types/express` para TS | Use Fastify com TypeScript nativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-conhecendo-o-fastify/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-conhecendo-o-fastify/references/code-examples.md)
