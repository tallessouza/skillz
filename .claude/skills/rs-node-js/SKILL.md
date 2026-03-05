---
name: rs-node-js
description: "Enforces Node.js best practices when building REST APIs with Fastify or NestJS, implementing DDD patterns with entities/repositories/use cases, configuring Prisma ORM schemas and migrations, writing unit and E2E tests with Vitest, handling authentication with JWT, managing streams and buffers, or structuring Clean Architecture layers. Make sure to use this skill whenever creating API routes, designing domain entities, implementing repository pattern, writing test factories, configuring Docker/Prisma, or handling error flows with Either pattern. Not for frontend React components, CSS styling, or browser-side JavaScript."
---

# Node.js — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 272 skills organizadas em 8 domínios.

## Decision Tree

```
O que você está fazendo com Node.js?
│
├─ Configurando projeto / fundamentos?
│  ├─ Criando projeto do zero → [2023-criando-um-projeto-node.md](references/2023-criando-um-projeto-node.md)
│  ├─ Configurando TypeScript → [2023-entendendo-o-type-script.md](references/2023-entendendo-o-type-script.md)
│  ├─ Configurando ESLint → [2023-configuracao-do-es-lint-1.md](references/2023-configuracao-do-es-lint-1.md)
│  ├─ Variáveis de ambiente (Zod) → [2023-tratando-env-com-zod.md](references/2023-tratando-env-com-zod.md)
│  ├─ Streams / Buffers → [2023-entendendo-streams-no-node.md](references/2023-entendendo-streams-no-node.md)
│  ├─ HTTP server puro → [2023-aplicando-streams-no-modulo-http.md](references/2023-aplicando-streams-no-modulo-http.md)
│  └─ Import aliases → [2023-criando-aliases-de-importacao.md](references/2023-criando-aliases-de-importacao.md)
│
├─ Construindo API com Fastify?
│  ├─ Setup Fastify → [2023-conhecendo-o-fastify.md](references/2023-conhecendo-o-fastify.md)
│  ├─ Rotas e parâmetros → [2023-route-e-query-parameters.md](references/2023-route-e-query-parameters.md)
│  ├─ Separando rotas → [2023-separando-rotas-da-aplicacao.md](references/2023-separando-rotas-da-aplicacao.md)
│  ├─ Hooks globais → [2023-configurando-um-hook-global.md](references/2023-configurando-um-hook-global.md)
│  ├─ Plugins → [2023-plugins-do-fastify.md](references/2023-plugins-do-fastify.md)
│  ├─ Error handler global → [2023-handler-de-erros-global.md](references/2023-handler-de-erros-global.md)
│  ├─ JWT no Fastify → [2023-implementando-jwt-no-fastify.md](references/2023-implementando-jwt-no-fastify.md)
│  ├─ Refresh token → [2023-estrategia-de-refresh-de-token.md](references/2023-estrategia-de-refresh-de-token.md)
│  ├─ Cookies → [2023-utilizando-cookies-no-fastify.md](references/2023-utilizando-cookies-no-fastify.md)
│  └─ Knex migrations/queries → [2023-configurando-o-knex.md](references/2023-configurando-o-knex.md)
│
├─ Modelando domínio (DDD)?
│  ├─ Conceitos de DDD → [2023-design-de-software-e-ddd.md](references/2023-design-de-software-e-ddd.md)
│  ├─ Subdomínios → [2023-fundamentos-de-subdominios.md](references/2023-fundamentos-de-subdominios.md)
│  ├─ Entidades e casos de uso → [2023-entidades-e-casos-de-uso.md](references/2023-entidades-e-casos-de-uso.md)
│  ├─ Classe base de entidades → [2023-classe-base-de-entidades.md](references/2023-classe-base-de-entidades.md)
│  ├─ Value Objects → [2023-value-object-de-slug.md](references/2023-value-object-de-slug.md)
│  ├─ Aggregates & WatchedList → [2023-aggregates-and-watched-lists.md](references/2023-aggregates-and-watched-lists.md)
│  ├─ Either pattern (error handling) → [2023-functional-error-handling.md](references/2023-functional-error-handling.md)
│  ├─ Clean Architecture camadas → [2023-fundamentos-de-clean-architecture.md](references/2023-fundamentos-de-clean-architecture.md)
│  └─ Estrutura de pastas → [2023-refatorando-as-pastas.md](references/2023-refatorando-as-pastas.md)
│
├─ Implementando Use Cases?
│  ├─ Padrão de criação (create) → [2023-caso-de-uso-criar-pergunta.md](references/2023-caso-de-uso-criar-pergunta.md)
│  ├─ Busca por slug → [2023-caso-de-uso-buscar-pergunta-pelo-slug.md](references/2023-caso-de-uso-buscar-pergunta-pelo-slug.md)
│  ├─ Listagem com paginação → [2023-caso-de-uso-listar-perguntas-recentes.md](references/2023-caso-de-uso-listar-perguntas-recentes.md)
│  ├─ Edição com autorização → [2023-caso-de-uso-editar-pergunta.md](references/2023-caso-de-uso-editar-pergunta.md)
│  ├─ Deleção com autorização → [2023-caso-de-uso-deletar-pergunta.md](references/2023-caso-de-uso-deletar-pergunta.md)
│  ├─ Autenticação → [2023-caso-de-uso-de-autenticacao.md](references/2023-caso-de-uso-de-autenticacao.md)
│  ├─ Upload de arquivos → [2023-caso-de-uso-upload-do-anexo.md](references/2023-caso-de-uso-upload-do-anexo.md)
│  ├─ Busca por proximidade → [2023-caso-de-uso-de-academias-proximas.md](references/2023-caso-de-uso-de-academias-proximas.md)
│  ├─ Métricas / contagem → [2023-caso-de-uso-de-metricas.md](references/2023-caso-de-uso-de-metricas.md)
│  └─ Refatorando com Either → [2023-refatorando-casos-de-uso.md](references/2023-refatorando-casos-de-uso.md)
│
├─ Implementando Repository / Prisma / Database?
│  ├─ Repository pattern → [2023-repository-pattern.md](references/2023-repository-pattern.md)
│  ├─ Interface do repositório (DIP) → [2023-interface-do-repositorio.md](references/2023-interface-do-repositorio.md)
│  ├─ Setup Prisma → [2023-setup-do-prisma.md](references/2023-setup-do-prisma.md)
│  ├─ Schema design → [2023-criando-schema-do-prisma.md](references/2023-criando-schema-do-prisma.md)
│  ├─ Relacionamentos → [2023-relacionamentos-entre-tabelas.md](references/2023-relacionamentos-entre-tabelas.md)
│  ├─ Mappers (Prisma ↔ Domain) → [2023-conversa-entre-camadas-mappers.md](references/2023-conversa-entre-camadas-mappers.md)
│  ├─ Repositórios Prisma → [2023-implementando-questions-repository.md](references/2023-implementando-questions-repository.md)
│  ├─ Docker + PostgreSQL → [2023-postgre-sql-com-docker.md](references/2023-postgre-sql-com-docker.md)
│  ├─ Docker Compose → [2023-setup-docker-compose.md](references/2023-setup-docker-compose.md)
│  └─ Cache repository → [2023-criando-repositorio-de-cache.md](references/2023-criando-repositorio-de-cache.md)
│
├─ Construindo com NestJS?
│  ├─ Setup NestJS → [2023-criando-projeto-com-nest.md](references/2023-criando-projeto-com-nest.md)
│  ├─ Módulos, serviços, controllers → [2023-modulos-servicos-e-controllers.md](references/2023-modulos-servicos-e-controllers.md)
│  ├─ Controller CRUD → [2023-controller-de-criacao-de-conta.md](references/2023-controller-de-criacao-de-conta.md)
│  ├─ Controller com Zod validation → [2023-controller-de-criacao-de-pergunta.md](references/2023-controller-de-criacao-de-pergunta.md)
│  ├─ Listagem com paginação → [2023-controller-de-listagem-de-perguntas.md](references/2023-controller-de-listagem-de-perguntas.md)
│  ├─ Presenter pattern → [2023-presenter-de-perguntas.md](references/2023-presenter-de-perguntas.md)
│  ├─ JWT auth → [2023-configurando-autenticacao-jwt.md](references/2023-configurando-autenticacao-jwt.md)
│  ├─ Guards e rotas privadas → [2023-protegendo-totas-com-guards.md](references/2023-protegendo-totas-com-guards.md)
│  ├─ RBAC → [2023-autorizacao-por-cargos-rbac.md](references/2023-autorizacao-por-cargos-rbac.md)
│  ├─ Camada de infraestrutura → [2023-criando-camada-de-infraestrutura.md](references/2023-criando-camada-de-infraestrutura.md)
│  ├─ Upload de arquivo → [2023-controller-upload-de-arquivo.md](references/2023-controller-upload-de-arquivo.md)
│  ├─ Redis cache → [2023-implementando-cache-com-redis.md](references/2023-implementando-cache-com-redis.md)
│  └─ Cloudflare R2 → [2023-integracao-com-cloudflare-r-2.md](references/2023-integracao-com-cloudflare-r-2.md)
│
├─ Implementando Domain Events?
│  ├─ Estrutura de eventos → [2023-estrutura-de-eventos-de-dominio.md](references/2023-estrutura-de-eventos-de-dominio.md)
│  ├─ Disparando eventos → [2023-disparando-eventos-de-dominio.md](references/2023-disparando-eventos-de-dominio.md)
│  ├─ Subscribers → [2023-ouvindo-um-evento-de-dominio.md](references/2023-ouvindo-um-evento-de-dominio.md)
│  ├─ Registrando no NestJS → [2023-registrando-eventos-de-dominio.md](references/2023-registrando-eventos-de-dominio.md)
│  └─ Notificações → [2023-enviando-notificacao-no-subscriber.md](references/2023-enviando-notificacao-no-subscriber.md)
│
└─ Escrevendo testes?
   ├─ Configurando Vitest → [2023-configurando-vitest.md](references/2023-configurando-vitest.md)
   ├─ Primeiro teste unitário → [2023-primeiro-teste-unitario.md](references/2023-primeiro-teste-unitario.md)
   ├─ In-memory repositories → [2023-in-memory-databases.md](references/2023-in-memory-databases.md)
   ├─ Factories de testes → [2023-factories-de-testes.md](references/2023-factories-de-testes.md)
   ├─ TDD & mocking → [2023-tdd-and-mocking.md](references/2023-tdd-and-mocking.md)
   ├─ Test environment (Prisma) → [2023-criando-test-environment-2024.md](references/2023-criando-test-environment-2024.md)
   ├─ Testes E2E com Supertest → [2023-teste-e-2-e-do-registro.md](references/2023-teste-e-2-e-do-registro.md)
   ├─ E2E com factories → [2023-utilizando-factories-nos-testes-e-2-e.md](references/2023-utilizando-factories-nos-testes-e-2-e.md)
   ├─ Coverage → [2023-gerando-coverage-de-testes.md](references/2023-gerando-coverage-de-testes.md)
   └─ CI (GitHub Actions) → [2023-executando-testes-e-2-e-no-ci.md](references/2023-executando-testes-e-2-e-no-ci.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 1 (DDD)** → Siga o ramo "Modelando domínio"
- **Fase 2 (SOLID/Architecture)** → Siga "Modelando domínio" (Clean Architecture) + "NestJS" (camadas)
- **Fase 3 (Implementação)** → Siga o ramo relevante: "Use Cases", "Repository/Prisma", "NestJS", "Fastify"
- **Fase 4 (Validação)** → Siga o ramo "Escrevendo testes"

## Nota

Esta árvore mostra os entry points principais de cada domínio. Cada reference carregada tem links para deep-explanation.md e code-examples.md com detalhes expandidos. Para ver TODAS as 272 skills, navegue as references/ diretamente.
