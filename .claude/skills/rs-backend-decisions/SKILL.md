---
name: rs-backend-decisions
description: "Guides backend development decisions when building Node.js APIs, services, and server-side applications. Use when user asks to 'create an API', 'build a backend', 'set up a server', 'add authentication', 'connect a database', 'implement use cases', or any server-side development task. Walks through architectural decisions: runtime selection, framework choice, domain modeling, data layer, authentication strategy, input validation, error handling, testing, security hardening, and deployment. Make sure to use this skill whenever starting a new backend project, adding a major backend feature, or making architectural decisions about server-side code. Not for frontend React components, CSS styling, browser-side JavaScript, or DevOps infrastructure planning."
---

# Backend — Fluxo de Decisoes

> Cada decisao de backend segue: escolha a ferramenta mais simples que resolve o problema real.
> Este router e CROSS-CUTTING — referencia skills de multiplos routers por dominio.

> **Caminho rapido para API Node.js:**
> Fastify + TypeScript → Prisma + PostgreSQL → JWT → Vitest → Docker
> [setup-fastify](../rs-node-js/references/2023-conhecendo-o-fastify.md) → [prisma-setup](../rs-node-js/references/2023-setup-do-prisma.md) → [jwt-auth](../rs-node-js/references/2023-implementando-jwt-no-fastify.md) → [primeiro-teste](../rs-node-js/references/2023-primeiro-teste-unitario.md) → [docker](../rs-node-js/references/2023-postgre-sql-com-docker.md)

> **Caminho rapido para API com Bun:**
> Bun + Elysia → Drizzle + PostgreSQL → JWT magic link → Docker
> [bun-elysia](../rs-api-com/references/criando-api-com-bun-e-elysia.md) → [drizzle](../rs-api-com/references/configurando-drizzle-orm.md) → [jwt](../rs-api-com/references/setup-da-autenticacao-jwt.md) → [docker](../rs-api-com/references/postgre-sql-no-docker-compose.md)

> **Caminho rapido para SaaS multi-tenant:**
> Monorepo TurboRepo → Fastify API + Prisma → RBAC com CASL → OAuth GitHub → Deploy
> [monorepo](../rs-saa-s/references/criando-monorepo-com-turbo-repo.md) → [fastify-api](../rs-saa-s/references/setup-do-app-com-fastify.md) → [rbac](../rs-saa-s/references/introducao-ao-casl.md) → [oauth](../rs-saa-s/references/fluxo-de-o-auth-com-git-hub.md) → [deploy](../rs-saa-s/references/deploy-do-back-end.md)

---

## Que tipo de backend estou criando?

### REST API simples
Quando escolher: CRUD, poucos endpoints, time pequeno, MVP
- Siga para: [Qual framework HTTP usar?](#qual-framework-http-usar)

### SaaS multi-tenant
Quando escolher: multiplas organizacoes, permissoes por cargo, billing
- [Visao geral SaaS](../rs-saa-s/references/introducao-82.md) — contexto e decisoes
- [Multi-tenant e RBAC](../rs-saa-s/references/saa-s-multi-tenant-and-rbac.md) — arquitetura
- [Monorepo TurboRepo](../rs-saa-s/references/criando-monorepo-com-turbo-repo.md) — setup monorepo
- Siga para: [RBAC e permissoes](#como-controlar-acesso-rbac)

### Servico com IA integrada
Quando escolher: LLMs, embeddings, function calling, chat
- Delegue para: [rs-ia-node](../rs-ia-node/SKILL.md) — router completo de IA com Node.js

### API de metricas / dashboard
Quando escolher: aggregations, receita, contagem, graficos
- [Pedidos diarios](../rs-api-com/references/rota-metrica-de-pedidos-diarios.md) — metrica diaria
- [Receita mensal](../rs-api-com/references/rota-metrica-de-receita-mensal.md) — aggregation mensal
- [Produtos populares](../rs-api-com/references/rota-metrica-produtos-populares.md) — ranking
- [Receita por periodo](../rs-api-com/references/rota-metrica-receita-diaria-no-periodo.md) — serie temporal

---

## Qual framework HTTP usar?

### Fastify
Quando escolher: API REST, performance importa, TypeScript, ecossistema de plugins
- [Setup Fastify](../rs-node-js/references/2023-conhecendo-o-fastify.md) — configuracao inicial
- [Rotas e parametros](../rs-node-js/references/2023-route-e-query-parameters.md) — route/query params
- [Separando rotas](../rs-node-js/references/2023-separando-rotas-da-aplicacao.md) — organizacao por dominio
- [Hooks globais](../rs-node-js/references/2023-configurando-um-hook-global.md) — middlewares Fastify
- [Plugins](../rs-node-js/references/2023-plugins-do-fastify.md) — sistema de plugins
- [Error handler](../rs-node-js/references/2023-handler-de-erros-global.md) — tratamento global de erros

#### Preciso de Fastify para SaaS?
- [Setup Fastify SaaS](../rs-saa-s/references/setup-do-app-com-fastify.md) — Fastify em contexto multi-tenant
- [Swagger](../rs-saa-s/references/setup-do-swagger.md) — documentacao automatica

### NestJS
Quando escolher: projeto enterprise, DI nativo, team grande, decorators
- [Setup NestJS](../rs-node-js/references/2023-criando-projeto-com-nest.md) — criando projeto
- [Modulos, servicos, controllers](../rs-node-js/references/2023-modulos-servicos-e-controllers.md) — arquitetura
- [Controller CRUD](../rs-node-js/references/2023-controller-de-criacao-de-conta.md) — primeiro controller
- [Controller com Zod](../rs-node-js/references/2023-controller-de-criacao-de-pergunta.md) — validacao
- [Listagem paginada](../rs-node-js/references/2023-controller-de-listagem-de-perguntas.md) — paginacao
- [Presenter pattern](../rs-node-js/references/2023-presenter-de-perguntas.md) — transformacao de output
- [Camada infra](../rs-node-js/references/2023-criando-camada-de-infraestrutura.md) — separacao de camadas
- [Upload arquivo](../rs-node-js/references/2023-controller-upload-de-arquivo.md) — file upload
- [Redis cache](../rs-node-js/references/2023-implementando-cache-com-redis.md) — caching
- [Cloudflare R2](../rs-node-js/references/2023-integracao-com-cloudflare-r-2.md) — storage externo

### Bun + Elysia
Quando escolher: performance maxima, runtime alternativo, Drizzle ORM, API rapida
- [Criando API Bun + Elysia](../rs-api-com/references/criando-api-com-bun-e-elysia.md) — setup inicial
- [Variaveis ambiente](../rs-api-com/references/variaveis-ambiente-no-bun.md) — env no Bun
- [ESLint](../rs-api-com/references/configurando-es-lint-no-projeto.md) — linting
- [Tipagem entrada](../rs-api-com/references/tipagem-na-entrada-de-dados.md) — type-safe body
- [Error handling](../rs-api-com/references/lidando-com-erros-no-elysia.md) — erros no Elysia

### Node.js puro (sem framework)
Quando escolher: aprendizado, entender fundamentos, projeto minimo
- [Servidor HTTP nativo](../rs-full-stack/references/0108-criando-o-primeiro-servidor-nodejs-mkv-mp-4.md) — http.createServer
- [Metodos HTTP](../rs-full-stack/references/0204-metodos-http-mkv-mp-4.md) — GET, POST, PUT, DELETE
- [Middleware manual](../rs-full-stack/references/0210-conceito-de-middleware-mkv-mp-4.md) — pattern manual
- [Separando rotas](../rs-full-stack/references/0212-separando-as-rotas-mkv-mp-4.md) — roteamento manual
- [Route params](../rs-full-stack/references/0213-route-params-mp-4.md) — parametros dinamicos
- [Body parsing](../rs-full-stack/references/0209-recuperando-dados-no-body-mkv-mp-4.md) — lendo body

### Express
Quando escolher: projeto simples, muitos middlewares disponiveis, equipe ja conhece
- [Conhecendo Express](../rs-full-stack/references/conhecendo-o-express.md) — introducao
> Tambem disponivel em: [rs-full-stack](../rs-full-stack/SKILL.md) — ramo Express completo

---

## Como modelar o dominio?

### DDD completo (entidades, VOs, use cases)
Quando escolher: dominio complexo, muitas regras de negocio, projeto de longa vida
- [Conceitos DDD](../rs-node-js/references/2023-design-de-software-e-ddd.md) — fundamentos
- [Subdominios](../rs-node-js/references/2023-fundamentos-de-subdominios.md) — separacao de contextos
- [Entidades e casos de uso](../rs-node-js/references/2023-entidades-e-casos-de-uso.md) — modelagem
- [Classe base](../rs-node-js/references/2023-classe-base-de-entidades.md) — Entity base class
- [Value Objects](../rs-node-js/references/2023-value-object-de-slug.md) — objetos sem identidade
- [Aggregates](../rs-node-js/references/2023-aggregates-and-watched-lists.md) — agrupamento de entidades
- [Clean Architecture](../rs-node-js/references/2023-fundamentos-de-clean-architecture.md) — camadas
- [Estrutura de pastas](../rs-node-js/references/2023-refatorando-as-pastas.md) — organizacao

#### Principios de clean code aplicados
- [Principios DDD](../rs-clean-code/references/principios-de-ddd.md) — teoria
- [Exemplo pratico DDD](../rs-clean-code/references/exemplo-pratico-de-ddd.md) — pratica
- [SOLID](../rs-clean-code/references/principios-de-solid.md) — principios
- [SOLID pratico](../rs-clean-code/references/exemplo-pratico-de-solid.md) — aplicacao
- [DDD + SOLID](../rs-clean-code/references/unindo-ddd-ao-solid.md) — integracao

### CRUD simples (sem DDD)
Quando escolher: poucas entidades, regras simples, prototipo rapido
- [Criando controllers](../rs-full-stack/references/0407-separando-o-controller-mkv-mp-4.md) — separacao basica
- [Objetos de recurso](../rs-full-stack/references/0408-criando-o-objeto-de-ticket-mkv-mp-4.md) — modelagem simples

---

## Como persistir dados?

### Prisma + PostgreSQL
Quando escolher: DX prioritaria, schema declarativo, migrations automaticas
- [Setup Prisma](../rs-node-js/references/2023-setup-do-prisma.md) — configuracao
- [Schema design](../rs-node-js/references/2023-criando-schema-do-prisma.md) — modelagem
- [Relacionamentos](../rs-node-js/references/2023-relacionamentos-entre-tabelas.md) — FK, 1:N, N:N
- [Mappers](../rs-node-js/references/2023-conversa-entre-camadas-mappers.md) — Prisma ↔ Domain
- [Repositorios Prisma](../rs-node-js/references/2023-implementando-questions-repository.md) — implementacao
- [Docker + PostgreSQL](../rs-node-js/references/2023-postgre-sql-com-docker.md) — banco local
- [Docker Compose](../rs-node-js/references/2023-setup-docker-compose.md) — multi-container
- [Cache repository](../rs-node-js/references/2023-criando-repositorio-de-cache.md) — caching layer

#### Prisma para SaaS
- [Setup banco SaaS](../rs-saa-s/references/setup-do-banco-de-dados.md) — Prisma multi-tenant

### Drizzle ORM + PostgreSQL
Quando escolher: type-safety maxima, controle fino, SQL-like API, Bun
- [Setup Drizzle](../rs-api-com/references/configurando-drizzle-orm.md) — configuracao
- [Migrations](../rs-api-com/references/migrations-no-drizzle.md) — versionamento schema
- [Relacionamentos](../rs-api-com/references/configurando-relacionamentos-no-drizzle.md) — relations
- [Schema](../rs-api-com/references/schema-de-produtos-e-pedidos.md) — tabelas
- [Seed](../rs-api-com/references/seed-de-produtos-e-pedidos.md) — dados de teste
- [PostgreSQL Docker](../rs-api-com/references/postgre-sql-no-docker-compose.md) — banco local

### Knex.js (Query Builder)
Quando escolher: query builder flexivel, migrations manuais, controle total sobre SQL
- [Configurando Knex](../rs-node-js/references/2023-configurando-o-knex.md) — setup
> Tambem disponivel em: [rs-full-stack](../rs-full-stack/SKILL.md) — ramo SQL/Knex completo

### Repository Pattern (DIP)
Quando escolher: clean architecture, inversao de dependencia, testabilidade
- [Repository pattern](../rs-node-js/references/2023-repository-pattern.md) — conceito
- [Interface do repositorio](../rs-node-js/references/2023-interface-do-repositorio.md) — contrato (DIP)

### Em memoria / arquivo
Quando escolher: prototipo, dados temporarios, aprendizado
- [Banco em memoria](../rs-full-stack/references/0302-salvando-usuarios-em-memoria-mkv-mp-4.md) — classe com array
- [Persistencia em arquivo](../rs-full-stack/references/0304-salvando-dados-no-arquivo-mkv-mp-4.md) — file-based DB

---

## Como autenticar?

### JWT (stateless)
Quando escolher: API REST, mobile clients, microservicos
- [JWT no Fastify](../rs-node-js/references/2023-implementando-jwt-no-fastify.md) — implementacao
- [Refresh token](../rs-node-js/references/2023-estrategia-de-refresh-de-token.md) — renovacao
- [Cookies](../rs-node-js/references/2023-utilizando-cookies-no-fastify.md) — armazenamento seguro

#### JWT no NestJS
- [JWT auth NestJS](../rs-node-js/references/2023-configurando-autenticacao-jwt.md) — configuracao
- [Guards](../rs-node-js/references/2023-protegendo-totas-com-guards.md) — rotas privadas

#### JWT no Bun/Elysia
- [JWT setup Elysia](../rs-api-com/references/setup-da-autenticacao-jwt.md) — configuracao
- [Magic link](../rs-api-com/references/rota-autenticacao-pelo-link.md) — auth sem senha
- [Envio de email](../rs-api-com/references/envio-de-e-mail-com-nodemailer.md) — nodemailer

#### JWT para SaaS
- [Auth via senha](../rs-saa-s/references/rota-autenticacao-via-senha.md) — login
- [Cadastro](../rs-saa-s/references/rota-cadastro-de-usuario.md) — registro
- [Middleware auth](../rs-saa-s/references/criando-middleware-de-autenticacao.md) — protecao

### OAuth
Quando escolher: login social, GitHub/Google, menos fricao pro usuario
- [OAuth GitHub](../rs-saa-s/references/fluxo-de-o-auth-com-git-hub.md) — fluxo completo

### Seguranca de autenticacao (hardening)
- [Boas praticas auth](../rs-seguranca-para/references/devs-boas-praticas-para-autenticacao-e-criacao-de-senha.md) — regras
- [Armazenamento de senhas](../rs-seguranca-para/references/devs-seguranca-no-armazenamento-de-senhas.md) — hash seguro
- [Reset de senha](../rs-seguranca-para/references/devs-sobre-reset-de-senha-e-user-enumeration.md) — fluxo seguro
- [MFA](../rs-seguranca-para/references/devs-seguranca-em-multiplos-fatores-de-autenticacao.md) — multi-fator
- [OTP](../rs-seguranca-para/references/devs-implementando-otp.md) — one-time password
- [Passkeys FIDO](../rs-seguranca-para/references/devs-gerando-passkey-fido.md) — passwordless
- [Sessoes seguras](../rs-seguranca-para/references/devs-sobre-sessoes.md) — gerenciamento

---

## Como controlar acesso (RBAC)?

### RBAC simples (NestJS)
Quando escolher: poucos roles, decorators, guards
- [RBAC NestJS](../rs-node-js/references/2023-autorizacao-por-cargos-rbac.md) — autorizacao por cargo

### RBAC com CASL (SaaS)
Quando escolher: permissoes granulares, condicionais, multi-tenant
- [Intro CASL](../rs-saa-s/references/introducao-ao-casl.md) — conceito
- [Primeiras permissoes](../rs-saa-s/references/criando-primeiras-permissoes.md) — setup
- [Tipagem subjects](../rs-saa-s/references/criando-tipagem-das-subjects.md) — type-safe
- [Permissoes por cargo](../rs-saa-s/references/permissoes-por-cargos.md) — roles
- [Permissoes condicionais](../rs-saa-s/references/permissoes-com-condicionais.md) — ownership

### Broken access control (seguranca)
- [Broken access control](../rs-seguranca-para/references/devs-broken-access-control-em-aplicacoes.md) — vulnerabilidades
- [Validacao owner](../rs-api-com/references/validando-restaurante-nas-rotas.md) — verificacao de posse

---

## Como implementar Use Cases?

### Padrao completo (DDD)
- [Criar recurso](../rs-node-js/references/2023-caso-de-uso-criar-pergunta.md) — create pattern
- [Buscar por slug](../rs-node-js/references/2023-caso-de-uso-buscar-pergunta-pelo-slug.md) — find by identifier
- [Listar com paginacao](../rs-node-js/references/2023-caso-de-uso-listar-perguntas-recentes.md) — list + pagination
- [Editar com autorizacao](../rs-node-js/references/2023-caso-de-uso-editar-pergunta.md) — update + auth check
- [Deletar com autorizacao](../rs-node-js/references/2023-caso-de-uso-deletar-pergunta.md) — delete + auth check
- [Autenticacao](../rs-node-js/references/2023-caso-de-uso-de-autenticacao.md) — login use case
- [Upload de arquivos](../rs-node-js/references/2023-caso-de-uso-upload-do-anexo.md) — file upload
- [Busca por proximidade](../rs-node-js/references/2023-caso-de-uso-de-academias-proximas.md) — geo queries
- [Metricas](../rs-node-js/references/2023-caso-de-uso-de-metricas.md) — contagem/aggregation
- [Refatorando com Either](../rs-node-js/references/2023-refatorando-casos-de-uso.md) — error handling funcional

### Either pattern (functional error handling)
- [Either / functional errors](../rs-node-js/references/2023-functional-error-handling.md) — Left/Right pattern

### CRUD com Elysia + Drizzle
- [Cadastro](../rs-api-com/references/rota-cadastro-de-restaurante.md) — create
- [Listagem paginada](../rs-api-com/references/rota-listagem-de-pedidos.md) — list
- [Detalhes](../rs-api-com/references/rota-detalhes-do-pedido.md) — show
- [Status transitions](../rs-api-com/references/rota-aprovar-pedido.md) — state machine
- [Ordenacao](../rs-api-com/references/rota-ordenacao-dos-pedidos.md) — sorting

### CRUD para SaaS
- [Criar organizacao](../rs-saa-s/references/rota-criacao-de-organizacao.md) — create org
- [Editar organizacao](../rs-saa-s/references/edicao-da-organizacao.md) — update org
- [Transferir organizacao](../rs-saa-s/references/rota-transferir-organizacao.md) — ownership transfer
- [Criar convite](../rs-saa-s/references/rota-criacao-de-convites.md) — invite flow
- [Aceitar convite](../rs-saa-s/references/rota-aceitar-convite.md) — accept invite
- [Criar projeto](../rs-saa-s/references/rota-criacao-de-projetos.md) — project CRUD
- [Billing](../rs-saa-s/references/rota-dados-de-faturamento.md) — dados de faturamento

---

## Como validar input?

### Zod (recomendado)
- [Env com Zod](../rs-node-js/references/2023-tratando-env-com-zod.md) — variaveis de ambiente
- [Zod em APIs](../rs-full-stack/references/adicionando-e-configurando-zod.md) — setup
- [Regras de validacao](../rs-full-stack/references/adicionando-regras-de-validacao.md) — schemas

### Type-safe body (Elysia)
- [Tipagem entrada](../rs-api-com/references/tipagem-na-entrada-de-dados.md) — body typing

### Input validation (seguranca)
- [Input validation](../rs-seguranca-para/references/devs-input-validation-e-falhas.md) — falhas comuns
- [Sanitizacao](../rs-seguranca-para/references/devs-validacao-de-entrada-e-sanitizacao.md) — limpeza de input
- [JSON serializacao](../rs-seguranca-para/references/devs-json-serializacao-validacao.md) — parsing seguro

---

## Como lidar com erros?

### Error handler global
- [Handler Fastify](../rs-node-js/references/2023-handler-de-erros-global.md) — tratamento global
- [Erros Elysia](../rs-api-com/references/lidando-com-erros-no-elysia.md) — error handling Bun

### Either pattern (funcional)
- [Functional error handling](../rs-node-js/references/2023-functional-error-handling.md) — Left/Right
- [Refatorando use cases](../rs-node-js/references/2023-refatorando-casos-de-uso.md) — aplicacao pratica

### Error reporting (seguranca)
- [Error reporting](../rs-seguranca-para/references/devs-error-reporting-em-backend.md) — o que expor e o que esconder

### Clean code em erros
- [Clean code backend](../rs-clean-code/references/clean-code-no-back-end.md) — boas praticas

---

## Como implementar Domain Events?

- [Estrutura de eventos](../rs-node-js/references/2023-estrutura-de-eventos-de-dominio.md) — design
- [Disparando eventos](../rs-node-js/references/2023-disparando-eventos-de-dominio.md) — emissao
- [Subscribers](../rs-node-js/references/2023-ouvindo-um-evento-de-dominio.md) — handlers
- [Registrando no NestJS](../rs-node-js/references/2023-registrando-eventos-de-dominio.md) — integracao
- [Notificacoes](../rs-node-js/references/2023-enviando-notificacao-no-subscriber.md) — side effects

---

## Como testar?

### Unit tests (Vitest)
- [Configurando Vitest](../rs-node-js/references/2023-configurando-vitest.md) — setup
- [Primeiro teste](../rs-node-js/references/2023-primeiro-teste-unitario.md) — red-green-refactor
- [In-memory repos](../rs-node-js/references/2023-in-memory-databases.md) — test doubles
- [Factories](../rs-node-js/references/2023-factories-de-testes.md) — geracao de dados
- [TDD e mocking](../rs-node-js/references/2023-tdd-and-mocking.md) — pratica TDD
- [Coverage](../rs-node-js/references/2023-gerando-coverage-de-testes.md) — metricas

### E2E tests (Supertest)
- [Test environment](../rs-node-js/references/2023-criando-test-environment-2024.md) — Prisma test env
- [E2E registro](../rs-node-js/references/2023-teste-e-2-e-do-registro.md) — primeiro E2E
- [E2E com factories](../rs-node-js/references/2023-utilizando-factories-nos-testes-e-2-e.md) — dados de teste
- [CI](../rs-node-js/references/2023-executando-testes-e-2-e-no-ci.md) — GitHub Actions

### Frontend testing (delegacao)
> Para testes de frontend, delegue para: [rs-testes-e](../rs-testes-e/SKILL.md) — Jest, RTL, Playwright

---

## Como proteger contra ataques?

### Injection
- [CSRF](../rs-seguranca-para/references/devs-cross-site-request-forgery-csrf.md) — protecao
- [SSRF](../rs-seguranca-para/references/devs-server-side-request-forgery-ssrf.md) — server-side
- [NoSQL injection](../rs-seguranca-para/references/devs-nosql-injection.md) — MongoDB
- [Command injection](../rs-seguranca-para/references/devs-execucao-de-comandos-do-so-em-aplicacoes.md) — OS commands
- [Prototype pollution](../rs-seguranca-para/references/devs-object-prototype-pollution.md) — JS objects
- [Open redirects](../rs-seguranca-para/references/devs-unvalidated-redirects-em-backend.md) — URLs

### HTTP / CORS / TLS
- [CORS](../rs-seguranca-para/references/devs-headers-http-para-o-cors.md) — configuracao
- [Content-Type](../rs-seguranca-para/references/devs-headers-http-para-o-content-type.md) — headers
- [Security headers](../rs-seguranca-para/references/devs-mais-alguns-headers-http.md) — hardening
- [TLS](../rs-seguranca-para/references/devs-tls-com-lets-encrypt.md) — HTTPS

### Secrets e dependencias
- [Gerenciamento de segredos](../rs-seguranca-para/references/devs-gerenciamento-de-segredos.md) — env vars
- [Auditoria de deps](../rs-seguranca-para/references/devs-seguranca-em-gestao-de-dependencias.md) — npm audit
- [SAST](../rs-seguranca-para/references/devs-sast.md) — analise estatica
- [WAF](../rs-seguranca-para/references/devs-web-application-firewall.md) — firewall
- [Threat modeling](../rs-seguranca-para/references/devs-modelagem-de-ameacas.md) — modelagem

---

## Como fazer deploy?

### Docker
- [PostgreSQL Docker](../rs-node-js/references/2023-postgre-sql-com-docker.md) — banco local
- [Docker Compose](../rs-node-js/references/2023-setup-docker-compose.md) — multi-container
- [PostgreSQL Docker Bun](../rs-api-com/references/postgre-sql-no-docker-compose.md) — Bun + Docker

### Deploy SaaS
- [Backend Render](../rs-saa-s/references/deploy-do-back-end.md) — deploy API
- [Setup GitHub + DB](../rs-saa-s/references/setup-github-e-database.md) — infra

### DevOps avancado (delegacao)
> Para Kubernetes, Terraform, CI/CD, Istio, observabilidade: [rs-devops](../rs-devops/SKILL.md)

---

## Decisoes transversais

### Como nomear e estruturar codigo?
- [Naming](../rs-clean-code/references/nomenclatura-de-variaveis-download-exercicio.md) — variaveis
- [Causa vs efeito](../rs-clean-code/references/causa-vs-efeito.md) — booleanos
- [Condicionais](../rs-clean-code/references/regras-em-condicionais.md) — early return
- [Parametros](../rs-clean-code/references/parametros-e-desestruturacao.md) — desestruturacao
- [Magic numbers](../rs-clean-code/references/numeros-magicos.md) — constantes
- [Codigo em ingles](../rs-clean-code/references/codigo-em-ingles.md) — convencao
- [Comentarios](../rs-clean-code/references/comentarios-vs-documentacao.md) — quando usar

### Setup de projeto
- [Criando projeto Node](../rs-node-js/references/2023-criando-um-projeto-node.md) — npm init
- [TypeScript](../rs-node-js/references/2023-entendendo-o-type-script.md) — configuracao
- [ESLint](../rs-node-js/references/2023-configuracao-do-es-lint-1.md) — linting
- [Import aliases](../rs-node-js/references/2023-criando-aliases-de-importacao.md) — paths

### Streams e fundamentos Node.js
- [Streams](../rs-node-js/references/2023-entendendo-streams-no-node.md) — conceito
- [HTTP + Streams](../rs-node-js/references/2023-aplicando-streams-no-modulo-http.md) — integracao

---

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 1 (DDD)** → Siga [Como modelar o dominio?](#como-modelar-o-dominio)
- **Fase 2 (SOLID/Architecture)** → Siga DDD (Clean Architecture) + [Decisoes transversais](#decisoes-transversais)
- **Fase 3 (Implementacao)** → Siga o ramo relevante: framework, data layer, auth, use cases
- **Fase 4 (Validacao)** → Siga [Como testar?](#como-testar) + [Como proteger?](#como-proteger-contra-ataques)

## Cross-References — Decision Coverage

Quando este router nao cobre uma decisao, delegue para:

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| Frontend React/Next.js | [rs-next-js](../rs-next-js/SKILL.md) | SSR, App Router, Server Components |
| State management | [rs-redux-zustand](../rs-redux-zustand/SKILL.md) | Redux, Zustand |
| Tailwind CSS | [rs-masterizando](../rs-masterizando/SKILL.md) | Styling profundo |
| DevOps avancado | [rs-devops](../rs-devops/SKILL.md) | K8s, Terraform, CI/CD, Istio |
| IA com Node.js | [rs-ia-node](../rs-ia-node/SKILL.md) | LLMs, embeddings, function calling |
| Testes frontend | [rs-testes-e](../rs-testes-e/SKILL.md) | Jest, RTL, Playwright |
| Full-stack fundamentos | [rs-full-stack](../rs-full-stack/SKILL.md) | HTML, CSS, JS, Express, SQL basico |
