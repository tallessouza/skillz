---
name: rs-node-js
description: "Enforces Node.js best practices when building REST APIs with Fastify or NestJS, implementing DDD patterns with entities/repositories/use cases, configuring Prisma ORM schemas and migrations, writing unit and E2E tests with Vitest, handling authentication with JWT, managing streams and buffers, or structuring Clean Architecture layers. Make sure to use this skill whenever creating API routes, designing domain entities, implementing repository pattern, writing test factories, configuring Docker/Prisma, or handling error flows with Either pattern. Not for frontend React components, CSS styling, or browser-side JavaScript."
---

# Node.js — Decision Tree Router

> 272 skills organizadas por decisao de desenvolvimento. Siga as perguntas para chegar na skill certa.

## Tracer Bullet — Caminho Rapido

Precisa de algo rapido? Siga a linha do que voce esta fazendo AGORA:

| Estou fazendo... | Skill |
|------------------|-------|
| Criando projeto do zero | [2023-criando-projeto-node-js](references/2023-criando-projeto-node-js.md) |
| Configurando Fastify | [2023-conhecendo-o-fastify](references/2023-conhecendo-o-fastify.md) |
| Criando projeto NestJS | [2023-criando-projeto-com-nest](references/2023-criando-projeto-com-nest.md) |
| Modelando entidade DDD | [2023-entidades-e-casos-de-uso](references/2023-entidades-e-casos-de-uso.md) |
| Escrevendo use case | [2023-primeiro-caso-de-uso](references/2023-primeiro-caso-de-uso.md) |
| Configurando Prisma | [2023-setup-do-prisma](references/2023-setup-do-prisma.md) |
| Escrevendo primeiro teste | [2023-primeiro-teste-unitario](references/2023-primeiro-teste-unitario.md) |
| Implementando JWT | [2023-principios-da-autenticacao-jwt](references/2023-principios-da-autenticacao-jwt.md) |
| Tratando erros | [2023-handler-de-erros-global](references/2023-handler-de-erros-global.md) |
| Deploy | [2023-preparando-para-deploy](references/2023-preparando-para-deploy.md) |

---

## Decision Tree

### 1. Qual e o fundamento Node.js que voce precisa?

#### 1.1 Conceitos e setup inicial

- [2023-introducao-51](references/2023-introducao-51.md) — modelo mental Node.js (V8, non-blocking IO)
- [2023-introducao-52](references/2023-introducao-52.md) — visao geral de uma API REST com Node.js
- [2023-introducao-53](references/2023-introducao-53.md) — SOLID architecture overview para Node.js
- [2023-introducao-54](references/2023-introducao-54.md) — introducao NestJS com DDD e Clean Architecture
- [2023-criando-um-projeto-node](references/2023-criando-um-projeto-node.md) — criando projeto Node.js do zero (HTTP puro)
- [2023-criando-projeto-node-js](references/2023-criando-projeto-node-js.md) — setup Fastify + TypeScript + TSX/tsup
- [2023-criando-aplicacao-2](references/2023-criando-aplicacao-2.md) — setup Fastify com TSX watch
- [2023-node-watch](references/2023-node-watch.md) — node --watch e npm scripts
- [2023-usando-versoes-exatas-do-npm](references/2023-usando-versoes-exatas-do-npm.md) — .npmrc save-exact
- [2023-entendendo-o-type-script](references/2023-entendendo-o-type-script.md) — TypeScript no Node.js
- [2023-criando-aliases-de-importacao](references/2023-criando-aliases-de-importacao.md) — path aliases (@/)

#### 1.2 Streams, Buffers e HTTP puro

- [2023-entendendo-streams-no-node](references/2023-entendendo-streams-no-node.md) — conceitos de streams (Readable/Writable/pipe)
- [2023-criando-stream-de-leitura](references/2023-criando-stream-de-leitura.md) — criando Readable stream customizada
- [2023-stream-de-escrita-e-transformacao](references/2023-stream-de-escrita-e-transformacao.md) — Writable e Transform streams
- [2023-consumindo-uma-stream-completa](references/2023-consumindo-uma-stream-completa.md) — consumindo stream completa
- [2023-entendendo-buffers-no-node](references/2023-entendendo-buffers-no-node.md) — conceitos de Buffers
- [2023-aplicando-streams-no-modulo-http](references/2023-aplicando-streams-no-modulo-http.md) — streams no modulo HTTP nativo
- [2023-corpo-da-requisicao-em-json-stream-buffers](references/2023-corpo-da-requisicao-em-json-stream-buffers.md) — parsing JSON body com streams/buffers
- [2023-criando-middleware-de-json](references/2023-criando-middleware-de-json.md) — middleware JSON para HTTP puro
- [2023-salvando-usuarios-em-memoria-headers](references/2023-salvando-usuarios-em-memoria-headers.md) — dados em memoria e headers HTTP
- [2023-conhecendo-http-status-codes](references/2023-conhecendo-http-status-codes.md) — HTTP status codes corretos

#### 1.3 Roteamento HTTP puro (sem framework)

- [2023-rotas-de-criacao-e-listagem-metodos-http](references/2023-rotas-de-criacao-e-listagem-metodos-http.md) — rotas de criacao/listagem com metodos HTTP
- [2023-rotas-com-parametros-regex](references/2023-rotas-com-parametros-regex.md) — rotas com parametros via RegEx
- [2023-criando-regex-dos-parametros](references/2023-criando-regex-dos-parametros.md) — regex para capturar route params
- [2023-capturando-query-parameters](references/2023-capturando-query-parameters.md) — query parameters manual
- [2023-filtrando-lista-do-banco-de-dados](references/2023-filtrando-lista-do-banco-de-dados.md) — filtragem in-memory de listas

#### 1.4 Persistencia basica (JSON / em memoria)

- [2023-criando-banco-de-dados-json](references/2023-criando-banco-de-dados-json.md) — banco de dados JSON generico
- [2023-persistindo-banco-de-dados](references/2023-persistindo-banco-de-dados.md) — persistencia em arquivo com fs/promises
- [2023-remocao-de-registros](references/2023-remocao-de-registros.md) — remocao de registros do banco JSON
- [2023-atualizacao-de-registros](references/2023-atualizacao-de-registros.md) — atualizacao de registros

#### 1.5 Configuracao de ambiente e linting

- [2023-variaveis-ambiente-7](references/2023-variaveis-ambiente-7.md) — variaveis de ambiente com dotenv
- [2023-carregando-variaveis-ambiente](references/2023-carregando-variaveis-ambiente.md) — carregando env vars
- [2023-tratando-env-com-zod](references/2023-tratando-env-com-zod.md) — validacao de env com Zod
- [2023-criando-env-module](references/2023-criando-env-module.md) — env module no NestJS (ConfigModule)
- [2023-usando-config-module-no-nest-js](references/2023-usando-config-module-no-nest-js.md) — ConfigModule do NestJS
- [2023-configuracao-do-es-lint-1](references/2023-configuracao-do-es-lint-1.md) — ESLint setup (fundamentos)
- [2023-configurando-es-lint-2](references/2023-configurando-es-lint-2.md) — ESLint configuracao (API REST)
- [2023-configurando-es-lint-3](references/2023-configurando-es-lint-3.md) — ESLint configuracao (SOLID)
- [2023-configurando-es-lint-e-prettier-1](references/2023-configurando-es-lint-e-prettier-1.md) — ESLint + Prettier
- [2023-extensao-rest-client-no-vs-code](references/2023-extensao-rest-client-no-vs-code.md) — REST Client extension (.http files)
- [2023-path-aliases-e-vitest-globals](references/2023-path-aliases-e-vitest-globals.md) — path aliases + vitest globals

---

### 2. Qual framework HTTP voce esta usando?

#### 2.1 Fastify

##### Setup e configuracao
- [2023-conhecendo-o-fastify](references/2023-conhecendo-o-fastify.md) — setup inicial do Fastify
- [2023-plugins-do-fastify](references/2023-plugins-do-fastify.md) — plugins do Fastify
- [2023-configurando-um-hook-global](references/2023-configurando-um-hook-global.md) — hooks globais
- [2023-separando-rotas-da-aplicacao](references/2023-separando-rotas-da-aplicacao.md) — separando rotas em modulos

##### Rotas e parametros
- [2023-route-e-query-parameters](references/2023-route-e-query-parameters.md) — route e query parameters
- [2023-dados-relacionados-em-uma-api-rest](references/2023-dados-relacionados-em-uma-api-rest.md) — dados relacionados numa API REST
- [2023-criando-pipe-de-validacao-do-zod](references/2023-criando-pipe-de-validacao-do-zod.md) — pipe de validacao Zod

##### Transacoes (Knex)
- [2023-configurando-o-knex](references/2023-configurando-o-knex.md) — setup do Knex.js
- [2023-criando-primeira-migration](references/2023-criando-primeira-migration.md) — primeira migration com Knex
- [2023-criando-tabela-de-transacoes](references/2023-criando-tabela-de-transacoes.md) — tabela de transacoes
- [2023-criacao-de-transacoes](references/2023-criacao-de-transacoes.md) — criacao de transacoes
- [2023-listagem-das-transacoes](references/2023-listagem-das-transacoes.md) — listagem de transacoes
- [2023-resumo-de-transacoes](references/2023-resumo-de-transacoes.md) — resumo de transacoes
- [2023-realizando-queries-com-knex](references/2023-realizando-queries-com-knex.md) — queries com Knex
- [2023-tipagem-no-knex](references/2023-tipagem-no-knex.md) — tipagem no Knex

##### Autenticacao Fastify
- [2023-implementando-jwt-no-fastify](references/2023-implementando-jwt-no-fastify.md) — JWT no Fastify
- [2023-estrategia-de-refresh-de-token](references/2023-estrategia-de-refresh-de-token.md) — estrategia de refresh token
- [2023-implementacao-do-refresh-token](references/2023-implementacao-do-refresh-token.md) — implementacao do refresh token
- [2023-utilizando-cookies-no-fastify](references/2023-utilizando-cookies-no-fastify.md) — cookies no Fastify
- [2023-validando-existencia-do-cookie](references/2023-validando-existencia-do-cookie.md) — validando existencia do cookie

##### Error handling Fastify
- [2023-handler-de-erros-global](references/2023-handler-de-erros-global.md) — handler de erros global
- [2023-problemas-com-error-handling](references/2023-problemas-com-error-handling.md) — problemas comuns de error handling
- [2023-criando-erros-genericos](references/2023-criando-erros-genericos.md) — erros genericos customizados
- [2023-lidando-com-erros-do-use-case](references/2023-lidando-com-erros-do-use-case.md) — erros vindos do use case
- [2023-tratando-erros-nos-controllers](references/2023-tratando-erros-nos-controllers.md) — erros nos controllers

#### 2.2 NestJS

##### Setup e arquitetura
- [2023-criando-projeto-com-nest](references/2023-criando-projeto-com-nest.md) — setup projeto NestJS
- [2023-modulos-servicos-e-controllers](references/2023-modulos-servicos-e-controllers.md) — modulos, servicos e controllers
- [2023-copiando-camada-de-dominio](references/2023-copiando-camada-de-dominio.md) — migrando camada de dominio para NestJS
- [2023-criando-camada-de-infraestrutura](references/2023-criando-camada-de-infraestrutura.md) — camada de infraestrutura

##### Controllers NestJS — CRUD basico
- [2023-controller-de-criacao-de-conta](references/2023-controller-de-criacao-de-conta.md) — controller criacao de conta
- [2023-controller-de-criacao-de-pergunta](references/2023-controller-de-criacao-de-pergunta.md) — controller criacao com Zod validation
- [2023-controller-de-listagem-de-perguntas](references/2023-controller-de-listagem-de-perguntas.md) — controller listagem com paginacao
- [2023-controller-buscar-pergunta-por-slug](references/2023-controller-buscar-pergunta-por-slug.md) — controller busca por slug
- [2023-controller-editar-pergunta](references/2023-controller-editar-pergunta.md) — controller editar pergunta
- [2023-controller-editar-resposta](references/2023-controller-editar-resposta.md) — controller editar resposta
- [2023-controller-deletar-pergunta](references/2023-controller-deletar-pergunta.md) — controller deletar pergunta
- [2023-controller-deletar-resposta](references/2023-controller-deletar-resposta.md) — controller deletar resposta
- [2023-controller-escolher-melhor-resposta](references/2023-controller-escolher-melhor-resposta.md) — controller escolher melhor resposta

##### Controllers NestJS — Comentarios
- [2023-controller-comentar-pergunta](references/2023-controller-comentar-pergunta.md) — controller comentar pergunta
- [2023-controller-comentar-resposta](references/2023-controller-comentar-resposta.md) — controller comentar resposta
- [2023-controller-deletar-comentario-da-pergunta](references/2023-controller-deletar-comentario-da-pergunta.md) — controller deletar comentario da pergunta
- [2023-controller-deletar-comentario-da-resposta](references/2023-controller-deletar-comentario-da-resposta.md) — controller deletar comentario da resposta
- [2023-controller-listar-comentarios-da-pergunta](references/2023-controller-listar-comentarios-da-pergunta.md) — controller listar comentarios da pergunta
- [2023-controller-listar-comentarios-da-resposta](references/2023-controller-listar-comentarios-da-resposta.md) — controller listar comentarios da resposta
- [2023-controller-comentario-com-autor](references/2023-controller-comentario-com-autor.md) — controller comentario com dados do autor

##### Controllers NestJS — Respostas e Notificacoes
- [2023-controller-responder-pergunta](references/2023-controller-responder-pergunta.md) — controller responder pergunta
- [2023-controller-listar-respostas-da-pergunta](references/2023-controller-listar-respostas-da-pergunta.md) — controller listar respostas
- [2023-controller-leitura-de-notificacao](references/2023-controller-leitura-de-notificacao.md) — controller leitura de notificacao

##### Controllers NestJS — Auth, Perfil, Upload
- [2023-controller-de-autenticacao](references/2023-controller-de-autenticacao.md) — controller de autenticacao
- [2023-controller-de-perfil](references/2023-controller-de-perfil.md) — controller de perfil
- [2023-controller-de-registro](references/2023-controller-de-registro.md) — controller de registro
- [2023-controller-upload-de-arquivo](references/2023-controller-upload-de-arquivo.md) — controller upload de arquivo
- [2023-controller-de-criacao-de-academia](references/2023-controller-de-criacao-de-academia.md) — controller criacao de academia
- [2023-controllers-das-rotas-de-check-ins](references/2023-controllers-das-rotas-de-check-ins.md) — controllers de check-ins
- [2023-outros-controllers-da-academia](references/2023-outros-controllers-da-academia.md) — outros controllers da academia

##### Autenticacao NestJS
- [2023-configurando-autenticacao-jwt](references/2023-configurando-autenticacao-jwt.md) — JWT auth no NestJS
- [2023-protegendo-totas-com-guards](references/2023-protegendo-totas-com-guards.md) — guards e rotas privadas
- [2023-rotas-privadas-por-padrao](references/2023-rotas-privadas-por-padrao.md) — rotas privadas por padrao
- [2023-criando-decorator-de-autenticacao](references/2023-criando-decorator-de-autenticacao.md) — decorator de autenticacao (@CurrentUser)
- [2023-autorizacao-por-cargos-rbac](references/2023-autorizacao-por-cargos-rbac.md) — RBAC por cargos
- [2023-refatorando-controller-de-autenticacao](references/2023-refatorando-controller-de-autenticacao.md) — refatorando controller auth
- [2023-refatorando-controller-de-cadastro](references/2023-refatorando-controller-de-cadastro.md) — refatorando controller cadastro

##### Presenters e Mappers NestJS
- [2023-presenter-de-perguntas](references/2023-presenter-de-perguntas.md) — presenter pattern
- [2023-prisma-e-controller-detalhe-da-pergunta](references/2023-prisma-e-controller-detalhe-da-pergunta.md) — detalhe da pergunta com Prisma
- [2023-prisma-comentario-com-autor](references/2023-prisma-comentario-com-autor.md) — comentario com autor via Prisma

##### Cache e Storage NestJS
- [2023-implementando-cache-com-redis](references/2023-implementando-cache-com-redis.md) — cache com Redis
- [2023-criando-service-do-redis](references/2023-criando-service-do-redis.md) — service do Redis
- [2023-criando-repositorio-de-cache](references/2023-criando-repositorio-de-cache.md) — repositorio de cache
- [2023-ajustes-no-cache](references/2023-ajustes-no-cache.md) — ajustes e tuning de cache
- [2023-integrando-cache-no-prisma](references/2023-integrando-cache-no-prisma.md) — integrando cache com Prisma
- [2023-testando-persistencia-em-cache](references/2023-testando-persistencia-em-cache.md) — testando persistencia em cache
- [2023-integracao-com-cloudflare-r-2](references/2023-integracao-com-cloudflare-r-2.md) — integracao Cloudflare R2 (storage)

---

### 3. Voce esta modelando dominio (DDD)?

#### 3.1 Conceitos e fundamentos DDD

- [2023-design-de-software-e-ddd](references/2023-design-de-software-e-ddd.md) — conceitos de DDD
- [2023-fundamentos-de-subdominios](references/2023-fundamentos-de-subdominios.md) — subdominios (core, supporting, generic)
- [2023-entendendo-as-camadas](references/2023-entendendo-as-camadas.md) — camadas da aplicacao
- [2023-comunicacao-entre-camadas](references/2023-comunicacao-entre-camadas.md) — comunicacao entre camadas
- [2023-fundamentos-de-clean-architecture](references/2023-fundamentos-de-clean-architecture.md) — Clean Architecture
- [2023-refatorando-as-pastas](references/2023-refatorando-as-pastas.md) — estrutura de pastas DDD
- [2023-definindo-requisitos-e-regras](references/2023-definindo-requisitos-e-regras.md) — requisitos e regras de negocio
- [2023-requisitos-da-aplicacao](references/2023-requisitos-da-aplicacao.md) — levantamento de requisitos
- [2023-dependencias-externas](references/2023-dependencias-externas.md) — isolando dependencias externas

> Cross-ref: Para SOLID e DDD patterns avancados, consulte [rs-clean-code](../rs-clean-code/SKILL.md)

#### 3.2 Entidades

- [2023-entidades-e-casos-de-uso](references/2023-entidades-e-casos-de-uso.md) — entidades e casos de uso (conceito)
- [2023-classe-base-de-entidades](references/2023-classe-base-de-entidades.md) — classe base Entity
- [2023-id-das-entidades](references/2023-id-das-entidades.md) — ID das entidades (UniqueEntityID)
- [2023-criando-id-unico-e-universal-uuid](references/2023-criando-id-unico-e-universal-uuid.md) — UUID
- [2023-getters-and-setters-das-entidades](references/2023-getters-and-setters-das-entidades.md) — getters e setters
- [2023-mapeando-propriedades](references/2023-mapeando-propriedades.md) — mapeando propriedades de entidade
- [2023-abstraindo-criacao-de-entidades](references/2023-abstraindo-criacao-de-entidades.md) — abstraindo criacao
- [2023-entidade-de-notificacao](references/2023-entidade-de-notificacao.md) — entidade de Notificacao
- [2023-entidades-de-comentarios](references/2023-entidades-de-comentarios.md) — entidades de Comentarios
- [2023-classe-base-de-comentarios](references/2023-classe-base-de-comentarios.md) — classe base de Comentarios
- [2023-entidades-de-anexo](references/2023-entidades-de-anexo.md) — entidades de Anexo

#### 3.3 Value Objects

- [2023-value-object-de-slug](references/2023-value-object-de-slug.md) — Value Object de Slug
- [2023-value-object-comentario-com-autor](references/2023-value-object-comentario-com-autor.md) — Value Object comentario com autor
- [2023-value-object-detalhes-da-pergunta](references/2023-value-object-detalhes-da-pergunta.md) — Value Object detalhes da pergunta
- [2023-comentario-da-resposta-com-autor](references/2023-comentario-da-resposta-com-autor.md) — comentario da resposta com autor

#### 3.4 Aggregates e Watched Lists

- [2023-aggregates-and-watched-lists](references/2023-aggregates-and-watched-lists.md) — Aggregates e WatchedList
- [2023-classe-base-de-aggregate-root](references/2023-classe-base-de-aggregate-root.md) — classe base AggregateRoot
- [2023-pattern-watched-list](references/2023-pattern-watched-list.md) — pattern WatchedList

#### 3.5 Error Handling funcional (Either pattern)

- [2023-functional-error-handling](references/2023-functional-error-handling.md) — Either pattern (Left/Right)
- [2023-refatorando-casos-de-uso](references/2023-refatorando-casos-de-uso.md) — refatorando use cases com Either
- [2023-testando-classes-de-erro](references/2023-testando-classes-de-erro.md) — testando classes de erro

---

### 4. Voce esta implementando um Use Case?

#### 4.1 Perguntas e respostas (Forum)

- [2023-primeiro-caso-de-uso](references/2023-primeiro-caso-de-uso.md) — primeiro caso de uso (padrao base)
- [2023-caso-de-uso-criar-pergunta](references/2023-caso-de-uso-criar-pergunta.md) — criar pergunta
- [2023-caso-de-uso-buscar-pergunta-pelo-slug](references/2023-caso-de-uso-buscar-pergunta-pelo-slug.md) — buscar pergunta por slug
- [2023-caso-de-uso-listar-perguntas-recentes](references/2023-caso-de-uso-listar-perguntas-recentes.md) — listar perguntas recentes
- [2023-caso-de-uso-editar-pergunta](references/2023-caso-de-uso-editar-pergunta.md) — editar pergunta (com autorizacao)
- [2023-caso-de-uso-deletar-pergunta](references/2023-caso-de-uso-deletar-pergunta.md) — deletar pergunta
- [2023-caso-de-uso-editar-resposta](references/2023-caso-de-uso-editar-resposta.md) — editar resposta
- [2023-caso-de-uso-deletar-resposta](references/2023-caso-de-uso-deletar-resposta.md) — deletar resposta
- [2023-caso-de-uso-escolher-melhor-resposta](references/2023-caso-de-uso-escolher-melhor-resposta.md) — escolher melhor resposta
- [2023-fluxo-de-melhor-resposta](references/2023-fluxo-de-melhor-resposta.md) — fluxo completo de melhor resposta
- [2023-listando-perguntas-recentes](references/2023-listando-perguntas-recentes.md) — implementacao listagem recentes

#### 4.2 Comentarios

- [2023-caso-de-uso-comentar-na-pergunta](references/2023-caso-de-uso-comentar-na-pergunta.md) — comentar na pergunta
- [2023-caso-de-uso-comentar-na-resposta](references/2023-caso-de-uso-comentar-na-resposta.md) — comentar na resposta
- [2023-caso-de-uso-deletar-comentario-da-pergunta](references/2023-caso-de-uso-deletar-comentario-da-pergunta.md) — deletar comentario da pergunta
- [2023-caso-de-uso-deletar-comentario-da-resposta](references/2023-caso-de-uso-deletar-comentario-da-resposta.md) — deletar comentario da resposta
- [2023-caso-de-uso-listar-comentarios-da-pergunta](references/2023-caso-de-uso-listar-comentarios-da-pergunta.md) — listar comentarios da pergunta
- [2023-caso-de-uso-listar-comentarios-da-resposta](references/2023-caso-de-uso-listar-comentarios-da-resposta.md) — listar comentarios da resposta
- [2023-listando-comentarios-com-autor](references/2023-listando-comentarios-com-autor.md) — listando comentarios com dados do autor
- [2023-caso-de-uso-listar-respostas-da-pergunta](references/2023-caso-de-uso-listar-respostas-da-pergunta.md) — listar respostas da pergunta

#### 4.3 Anexos e Upload

- [2023-caso-de-uso-upload-do-anexo](references/2023-caso-de-uso-upload-do-anexo.md) — upload de anexo (use case)
- [2023-perguntas-com-anexos](references/2023-perguntas-com-anexos.md) — perguntas com anexos
- [2023-criando-pergunta-com-anexos](references/2023-criando-pergunta-com-anexos.md) — criando pergunta com anexos
- [2023-criando-pergunta-com-anexos-2024](references/2023-criando-pergunta-com-anexos-2024.md) — criando pergunta com anexos (2024)
- [2023-editando-pergunta-com-anexos](references/2023-editando-pergunta-com-anexos.md) — editando pergunta com anexos
- [2023-editando-perguntas-com-anexos](references/2023-editando-perguntas-com-anexos.md) — editando perguntas com anexos (variacao)
- [2023-excluindo-anexos-da-pergunta](references/2023-excluindo-anexos-da-pergunta.md) — excluindo anexos da pergunta
- [2023-anexos-nas-respostas](references/2023-anexos-nas-respostas.md) — anexos nas respostas
- [2023-respostas-com-anexos](references/2023-respostas-com-anexos.md) — respostas com anexos
- [2023-persistindo-anexos-no-banco](references/2023-persistindo-anexos-no-banco.md) — persistindo anexos no banco

#### 4.4 Notificacoes

- [2023-caso-de-uso-envio-de-notificacao](references/2023-caso-de-uso-envio-de-notificacao.md) — envio de notificacao
- [2023-caso-de-uso-ler-notificacao](references/2023-caso-de-uso-ler-notificacao.md) — ler notificacao

#### 4.5 Autenticacao e cadastro (Use Cases)

- [2023-caso-de-uso-de-autenticacao](references/2023-caso-de-uso-de-autenticacao.md) — autenticacao
- [2023-caso-de-uso-de-registro](references/2023-caso-de-uso-de-registro.md) — registro de usuario
- [2023-casos-de-uso-autenticacao-e-cadastro](references/2023-casos-de-uso-autenticacao-e-cadastro.md) — autenticacao + cadastro juntos
- [2023-caso-de-uso-de-perfil](references/2023-caso-de-uso-de-perfil.md) — perfil do usuario

#### 4.6 Academias e Check-ins (GymPass)

- [2023-caso-de-uso-de-criacao-de-academia](references/2023-caso-de-uso-de-criacao-de-academia.md) — criacao de academia
- [2023-caso-de-uso-de-academias-proximas](references/2023-caso-de-uso-de-academias-proximas.md) — busca por proximidade
- [2023-caso-de-uso-de-busca-de-academias](references/2023-caso-de-uso-de-busca-de-academias.md) — busca de academias
- [2023-caso-de-uso-de-check-in](references/2023-caso-de-uso-de-check-in.md) — check-in
- [2023-caso-de-uso-de-validar-de-check-in](references/2023-caso-de-uso-de-validar-de-check-in.md) — validar check-in
- [2023-caso-de-uso-de-historico](references/2023-caso-de-uso-de-historico.md) — historico de check-ins
- [2023-caso-de-uso-de-metricas](references/2023-caso-de-uso-de-metricas.md) — metricas e contagem
- [2023-validando-data-do-check-in](references/2023-validando-data-do-check-in.md) — validando data do check-in
- [2023-validando-distancia-do-check-in](references/2023-validando-distancia-do-check-in.md) — validando distancia do check-in
- [2023-validando-horario-do-check-in](references/2023-validando-horario-do-check-in.md) — validando horario do check-in

---

### 5. Voce esta trabalhando com Repository / Prisma / Database?

#### 5.1 Repository Pattern

- [2023-repository-pattern](references/2023-repository-pattern.md) — conceito de Repository Pattern
- [2023-interface-do-repositorio](references/2023-interface-do-repositorio.md) — interface do repositorio (DIP)
- [2023-implementando-repositorios](references/2023-implementando-repositorios.md) — implementando repositorios
- [2023-implementando-questions-repository](references/2023-implementando-questions-repository.md) — implementando questions repository
- [2023-repositorio-de-academias](references/2023-repositorio-de-academias.md) — repositorio de academias
- [2023-estrategias-de-acesso-ao-banco](references/2023-estrategias-de-acesso-ao-banco.md) — estrategias de acesso ao banco
- [2023-inversao-de-dependencias-1](references/2023-inversao-de-dependencias-1.md) — inversao de dependencias (DIP)

#### 5.2 Prisma ORM

- [2023-fundamentos-do-prisma-orm](references/2023-fundamentos-do-prisma-orm.md) — fundamentos do Prisma ORM
- [2023-setup-do-prisma](references/2023-setup-do-prisma.md) — setup do Prisma
- [2023-criando-servico-do-prisma](references/2023-criando-servico-do-prisma.md) — PrismaService
- [2023-criando-schema-do-prisma](references/2023-criando-schema-do-prisma.md) — schema design
- [2023-criando-schema-do-prisma-2024](references/2023-criando-schema-do-prisma-2024.md) — schema design (2024)
- [2023-finalizando-schema-do-prisma-1](references/2023-finalizando-schema-do-prisma-1.md) — finalizando schema
- [2023-relacionamentos-entre-tabelas](references/2023-relacionamentos-entre-tabelas.md) — relacionamentos entre tabelas
- [2023-mapeando-relacionamentos](references/2023-mapeando-relacionamentos.md) — mapeando relacionamentos Prisma

#### 5.3 Mappers e Repositorios Prisma

- [2023-conversa-entre-camadas-mappers](references/2023-conversa-entre-camadas-mappers.md) — mappers (Prisma <-> Domain)
- [2023-criando-mappers-do-prisma](references/2023-criando-mappers-do-prisma.md) — criando mappers do Prisma
- [2023-implementando-repositorios-do-prisma](references/2023-implementando-repositorios-do-prisma.md) — repositorios do Prisma
- [2023-repositorios-do-prisma](references/2023-repositorios-do-prisma.md) — repositorios Prisma (pratica)

#### 5.4 Docker + PostgreSQL

- [2023-fundamentos-do-docker](references/2023-fundamentos-do-docker.md) — fundamentos de Docker
- [2023-postgre-sql-com-docker](references/2023-postgre-sql-com-docker.md) — PostgreSQL com Docker
- [2023-setup-docker-compose](references/2023-setup-docker-compose.md) — setup Docker Compose
- [2023-utilizando-o-docker-compose](references/2023-utilizando-o-docker-compose.md) — usando Docker Compose

> Cross-ref: Para Docker avancado, K8s e CI/CD, consulte [rs-devops](../rs-devops/SKILL.md)

---

### 6. Voce esta implementando Autenticacao / Seguranca?

#### 6.1 JWT e Autenticacao

- [2023-principios-da-autenticacao-jwt](references/2023-principios-da-autenticacao-jwt.md) — principios de JWT
- [2023-gerando-token-jwt-1](references/2023-gerando-token-jwt-1.md) — gerando token JWT
- [2023-criacao-de-um-usuario](references/2023-criacao-de-um-usuario.md) — criacao de usuario

#### 6.2 Senha e Criptografia

- [2023-gerando-hash-da-senha-2](references/2023-gerando-hash-da-senha-2.md) — hash da senha (bcrypt)
- [2023-hash-da-senha-e-validacao](references/2023-hash-da-senha-e-validacao.md) — hash e validacao da senha
- [2023-gateways-de-criptografia](references/2023-gateways-de-criptografia.md) — gateways de criptografia (abstracoes)
- [2023-implementacao-da-criptografia](references/2023-implementacao-da-criptografia.md) — implementacao da criptografia
- [2023-stubs-de-criptografia](references/2023-stubs-de-criptografia.md) — stubs de criptografia (testes)

> Cross-ref: Para seguranca web avancada (XSS, CSRF, injection), consulte [rs-seguranca-para](../rs-seguranca-para/SKILL.md)

---

### 7. Voce esta trabalhando com Domain Events?

- [2023-estrutura-de-eventos-de-dominio](references/2023-estrutura-de-eventos-de-dominio.md) — estrutura de eventos de dominio
- [2023-fluxo-de-eventos-de-dominio](references/2023-fluxo-de-eventos-de-dominio.md) — fluxo completo de eventos
- [2023-disparando-eventos-de-dominio](references/2023-disparando-eventos-de-dominio.md) — disparando eventos
- [2023-registrando-eventos-de-dominio](references/2023-registrando-eventos-de-dominio.md) — registrando eventos no NestJS
- [2023-ouvindo-um-evento-de-dominio](references/2023-ouvindo-um-evento-de-dominio.md) — subscribers (ouvindo eventos)
- [2023-enviando-notificacao-no-subscriber](references/2023-enviando-notificacao-no-subscriber.md) — notificacao via subscriber
- [2023-evento-resposta-criada](references/2023-evento-resposta-criada.md) — evento RespostaCriada

---

### 8. Voce esta escrevendo testes?

#### 8.1 Setup e configuracao

- [2023-entendo-testes-automatizados](references/2023-entendo-testes-automatizados.md) — conceitos de testes automatizados
- [2023-configurando-vitest](references/2023-configurando-vitest.md) — configurando Vitest
- [2023-configurando-vitest-com-swc](references/2023-configurando-vitest-com-swc.md) — Vitest com SWC (performance)
- [2023-utilizando-ui-do-vitest](references/2023-utilizando-ui-do-vitest.md) — UI do Vitest
- [2023-gerando-coverage-de-testes](references/2023-gerando-coverage-de-testes.md) — coverage de testes
- [2023-categorizando-os-testes](references/2023-categorizando-os-testes.md) — categorizando testes (unit/E2E)

#### 8.2 Testes unitarios

- [2023-primeiro-teste-unitario](references/2023-primeiro-teste-unitario.md) — primeiro teste unitario
- [2023-criando-primeiro-teste-1](references/2023-criando-primeiro-teste-1.md) — criando primeiro teste (Vitest)
- [2023-tdd-and-mocking](references/2023-tdd-and-mocking.md) — TDD e mocking
- [2023-in-memory-databases](references/2023-in-memory-databases.md) — in-memory repositories para testes
- [2023-factories-de-testes](references/2023-factories-de-testes.md) — factories de testes
- [2023-utilizando-factory-pattern](references/2023-utilizando-factory-pattern.md) — factory pattern nos testes
- [2023-factories-dos-casos-de-uso](references/2023-factories-dos-casos-de-uso.md) — factories dos casos de uso (DI)
- [2023-gerando-dados-ficticios](references/2023-gerando-dados-ficticios.md) — gerando dados ficticios (faker)
- [2023-refatorando-instancias-nos-testes](references/2023-refatorando-instancias-nos-testes.md) — refatorando instancias nos testes
- [2023-refatorando-os-testes-unitarios](references/2023-refatorando-os-testes-unitarios.md) — refatorando testes unitarios
- [2023-refatorando-testes-unitarios](references/2023-refatorando-testes-unitarios.md) — refatorando testes unitarios (variacao)

##### Testes unitarios especificos
- [2023-testando-criacao-de-transacao](references/2023-testando-criacao-de-transacao.md) — testando criacao de transacao
- [2023-testando-listagem-de-transacoes](references/2023-testando-listagem-de-transacoes.md) — testando listagem de transacoes
- [2023-testando-caso-de-uso-de-upload](references/2023-testando-caso-de-uso-de-upload.md) — testando use case de upload
- [2023-testando-eventos-de-dominio](references/2023-testando-eventos-de-dominio.md) — testando eventos de dominio
- [2023-testando-retorno-dos-detalhes-da-pergunta](references/2023-testando-retorno-dos-detalhes-da-pergunta.md) — testando retorno de detalhes
- [2023-teste-de-edicao-da-pergunta](references/2023-teste-de-edicao-da-pergunta.md) — teste de edicao de pergunta
- [2023-testes-do-cadastro-e-autenticacao](references/2023-testes-do-cadastro-e-autenticacao.md) — testes de cadastro e autenticacao
- [2023-testes-de-rbac](references/2023-testes-de-rbac.md) — testes de RBAC
- [2023-finalizando-testes-da-aplicacao](references/2023-finalizando-testes-da-aplicacao.md) — finalizando testes da aplicacao
- [2023-testando-classes-de-erro](references/2023-testando-classes-de-erro.md) — testando classes de erro

#### 8.3 Testes E2E

- [2023-aprendendo-sobre-test-environment](references/2023-aprendendo-sobre-test-environment.md) — conceitos de test environment
- [2023-criando-test-environment-2024](references/2023-criando-test-environment-2024.md) — criando test environment (Prisma)
- [2023-configurando-banco-de-testes](references/2023-configurando-banco-de-testes.md) — configurando banco de testes
- [2023-banco-de-dados-isolado-nos-testes](references/2023-banco-de-dados-isolado-nos-testes.md) — banco isolado nos testes
- [2023-utilizando-factories-nos-testes-e-2-e](references/2023-utilizando-factories-nos-testes-e-2-e.md) — factories nos testes E2E

##### Testes E2E especificos
- [2023-teste-e-2-e-do-registro](references/2023-teste-e-2-e-do-registro.md) — E2E de registro
- [2023-teste-e-2-e-da-autenticacao](references/2023-teste-e-2-e-da-autenticacao.md) — E2E de autenticacao
- [2023-teste-e-2-e-do-perfil](references/2023-teste-e-2-e-do-perfil.md) — E2E de perfil
- [2023-testes-e-2-e-de-perguntas](references/2023-testes-e-2-e-de-perguntas.md) — E2E de perguntas
- [2023-testes-e-2-e-de-usuarios](references/2023-testes-e-2-e-de-usuarios.md) — E2E de usuarios
- [2023-testes-e-2-e-de-rotas-de-academias](references/2023-testes-e-2-e-de-rotas-de-academias.md) — E2E de rotas de academias
- [2023-testes-e-2-e-de-rotas-de-check-ins](references/2023-testes-e-2-e-de-rotas-de-check-ins.md) — E2E de rotas de check-ins
- [2023-testes-e-2-e-de-eventos-de-dominio](references/2023-testes-e-2-e-de-eventos-de-dominio.md) — E2E de eventos de dominio
- [2023-testes-e-controller-de-autenticacao](references/2023-testes-e-controller-de-autenticacao.md) — testes do controller de autenticacao
- [2023-testando-controller-de-upload](references/2023-testando-controller-de-upload.md) — testando controller de upload
- [2023-testando-persistencia-em-cache](references/2023-testando-persistencia-em-cache.md) — testando persistencia em cache
- [2023-refatorando-testes-e-2-e](references/2023-refatorando-testes-e-2-e.md) — refatorando testes E2E

#### 8.4 CI/CD para testes

- [2023-executando-testes-unitarios-no-ci](references/2023-executando-testes-unitarios-no-ci.md) — testes unitarios no CI
- [2023-executando-testes-e-2-e-no-ci](references/2023-executando-testes-e-2-e-no-ci.md) — testes E2E no CI (GitHub Actions)

> Cross-ref: Para testes avancados (Playwright, React Testing Library), consulte [rs-testes-e](../rs-testes-e/SKILL.md)

---

### 9. Voce esta fazendo deploy?

- [2023-preparando-para-deploy](references/2023-preparando-para-deploy.md) — preparando para deploy (tsup, build)
- [2023-deploy-do-app-no-render](references/2023-deploy-do-app-no-render.md) — deploy no Render.com

> Cross-ref: Para Docker, K8s, Terraform e CI/CD avancado, consulte [rs-devops](../rs-devops/SKILL.md)

---

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 1 (DDD)** → Siga o ramo 3 "Modelando dominio"
- **Fase 2 (SOLID/Architecture)** → Siga 3.1 (Clean Architecture) + 2.2 (NestJS camadas)
- **Fase 3 (Implementacao)** → Siga o ramo relevante: 4 (Use Cases), 5 (Repository/Prisma), 2.1 (Fastify), 2.2 (NestJS)
- **Fase 4 (Validacao)** → Siga o ramo 8 "Testes"

## Cross-References — Delegacao para outros routers

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| SOLID/DDD patterns avancados | [rs-clean-code](../rs-clean-code/SKILL.md) | Naming, condicionais, SOLID profundo |
| Next.js / React SSR | [rs-next-js](../rs-next-js/SKILL.md) | App Router, Server Components |
| Tailwind CSS | [rs-masterizando](../rs-masterizando/SKILL.md) | Tailwind CSS profundo |
| State management | [rs-redux-zustand](../rs-redux-zustand/SKILL.md) | Redux/Zustand |
| Docker/K8s/Terraform/CI-CD | [rs-devops](../rs-devops/SKILL.md) | DevOps e infraestrutura |
| Seguranca web (XSS/CSRF) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Seguranca avancada |
| Testes avancados (Playwright) | [rs-testes-e](../rs-testes-e/SKILL.md) | E2E frontend, RTL |
| SaaS multi-tenant | [rs-saa-s](../rs-saa-s/SKILL.md) | RBAC, orgs, monorepo |
