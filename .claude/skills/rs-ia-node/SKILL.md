---
name: rs-ia-node
description: "Enforces AI-powered Node.js application best practices when building intelligent marketplaces, integrating OpenAI/Gemini APIs, implementing function calling, generating embeddings, processing batches, structuring LLM outputs with JSON mode or Structured Outputs, designing chat sessions, or building e-commerce carts with AI suggestions. Make sure to use this skill whenever implementing LLM-driven features in Node.js, creating semantic search with embeddings, chaining prompts, or integrating multiple AI providers. Not for frontend-only work, pure DevOps, or non-AI backend services."
---

# IA com Node.js — Fluxo de Decisões

> Cada decisão de IA segue: escolha a técnica mais simples que resolve o problema real. Escale complexidade só quando necessário.

> **Caminho rápido para API com IA:**
> Setup OpenAI SDK → Structured Outputs + Zod → Function Calling → Embeddings + pgvector → Multi-provider
> [setup-projeto](references/marketplace-inteligente-setup-do-projeto-2028.md) → [structured-outputs](references/marketplace-inteligente-estruturando-dados-com-structured-outputs.md) → [function-calling-intro](references/marketplace-inteligente-introducao-a-function-calling.md) → [embedding-api](references/marketplace-inteligente-utilizando-a-embedding-api.md) → [multi-provider](references/marketplace-inteligente-refatorando-para-integrar-outros-providers.md)

## Como o LLM vai interagir com a aplicação?

### Geração de texto (resposta direta)
Quando escolher: chatbots simples, geração de conteúdo, resumos, traduções
- [setup-projeto](references/marketplace-inteligente-setup-do-projeto-2028.md) — Inicialização do OpenAI SDK, client creation, primeira chat completion
- [parametros-api](references/marketplace-inteligente-explorando-parametros-da-api.md) — Roles (system/developer/user), max_tokens, temperature, extração de resposta
- [gerando-texto-api](references/marketplace-inteligente-gerando-texto-em-uma-api.md) — Express + OpenAI endpoint, separação developer/user messages
- [responses-api](references/marketplace-inteligente-responses-api.md) — Responses API (stateful), previous_response_id, Zod parseResponse
- [visao-geral-api](references/marketplace-inteligente-visao-geral-da-api.md) — Framework de decisão: quando usar qual API (Chat, Structured, Embeddings, Batch)

#### Preciso de resposta estruturada (JSON)?

##### JSON Mode (simples)
Quando escolher: output JSON sem schema rígido, compatibilidade máxima
- [intro-estruturacao](references/marketplace-inteligente-introducao-a-estruturacao-de-dados.md) — Framework para escolher JSON Mode vs Structured Outputs
- [json-mode](references/marketplace-inteligente-estruturando-dados-com-json-mode.md) — response_format + validação Zod pós-resposta

##### Structured Outputs (type-safe)
Quando escolher: schema TypeScript-first, validação automática, zero parsing manual
- [structured-outputs](references/marketplace-inteligente-estruturando-dados-com-structured-outputs.md) — client.beta.chat.completions.parse() + zodResponseFormat

#### Preciso encadear prompts?

##### Chain of Thought
Quando escolher: raciocínio complexo, quebrar problema em passos, few-shot examples
- [chain-of-thought](references/marketplace-inteligente-encadeamento-de-prompts-chain-of-thought.md) — Passos numerados de raciocínio, exemplos few-shot

##### Multi-step Prompts
Quando escolher: pipeline sequencial onde output de um passo alimenta o próximo
- [multi-step](references/marketplace-inteligente-multi-step-prompts.md) — Estágios sequenciais, output → input entre etapas

##### Chunking (dados grandes)
Quando escolher: dataset grande demais para uma chamada, processamento paralelo
- [chunking](references/marketplace-inteligente-tecnicas-de-divisao-chunking.md) — Dividir em chunks, Promise.all paralelo, merge de resultados

### Function Calling (ação dinâmica)
Quando escolher: LLM precisa buscar dados em tempo real, executar ações, acessar APIs
- [intro-function-calling](references/marketplace-inteligente-introducao-a-function-calling.md) — Conceito: model decide quando chamar tools, SDK executa, resultado volta
- [function-calling-p1](references/marketplace-inteligente-integrando-function-calling-com-a-aplicacao-parte-1.md) — Schema de tools, interceptar tool_calls, dispatch dinâmico com function map
- [function-calling-p2](references/marketplace-inteligente-integrando-function-calling-com-a-aplicacao-parte-2.md) — Message loop com role 'tool', histórico completo, extração da completion
- [function-calling-recursao](references/marketplace-inteligente-otimizando-function-calling-com-recursao.md) — Recursão até finish_reason != 'tool_calls' (substituir loop sequencial)

#### Preciso de contexto de documentos estáticos?

##### File Search API (RAG simplificado)
Quando escolher: base de conhecimento fixa, documentos pré-carregados, sem embedding custom
- [file-search](references/marketplace-inteligente-file-search-api.md) — Upload de arquivos, VectorStore, File Search API

### Busca Semântica (embeddings)
Quando escolher: similaridade entre textos, recomendação de produtos, busca por significado
- [intro-embeddings](references/marketplace-inteligente-introducao-aos-embeddings.md) — Estratégia: pré-gerar na criação, gerar na query, comparar com cosine similarity
- [embedding-api](references/marketplace-inteligente-utilizando-a-embedding-api.md) — client.embeddings.create(), text-embedding-3-small, bulk pre-processing
- [cosine-similarity](references/marketplace-inteligente-calculando-similaridade-de-embeddings.md) — Pipeline: gerar → comparar → filtrar → ordenar → top-K

#### Preciso processar embeddings em lote?

##### Batch API
Quando escolher: >100 embeddings, custo importa (50% desconto), pode esperar resultado async
- [batch-intro](references/marketplace-inteligente-introducao-e-criacao-de-batches.md) — Conceito de Batch API, criação de batches
- [batch-embedding-p1](references/marketplace-inteligente-batch-embedding-parte-1.md) — JSONlines file, custom_id, upload, webhook validation, result parsing
- [batch-embedding-p2](references/marketplace-inteligente-batch-embedding-parte-2.md) — Bootstrap embedding, webhook handler, pgvector storage, distance ordering
- [batch-status](references/marketplace-inteligente-verificando-status-de-batches.md) — Verificação de status de batches em andamento
- [batch-processing](references/marketplace-inteligente-processando-batches-criados.md) — Processamento de resultados de batches criados

### Chat Sessions (conversacional)
Quando escolher: interação multi-turno, histórico de conversa, ações detectadas por contexto
- [chat-sessions](references/marketplace-inteligente-introducao-ao-modulo-e-chat-sessions.md) — Módulo NestJS TDD-first: e2e test, schema, service, controller com raw SQL
- [chat-mensagens-p1](references/marketplace-inteligente-adicionando-mensagens-ao-chat-parte-1.md) — Métodos público/privado, message_type flag, LLM action detection
- [chat-mensagens-p2](references/marketplace-inteligente-adicionando-mensagens-ao-chat-parte-2.md) — Fluxo completo de mensagens no chat
- [llm-service-p1](references/marketplace-inteligente-setup-open-ai-e-respondendo-mensagens-parte-1.md) — Injectable LLMService, responses.parse() + zodTextFormat, discriminated unions
- [llm-service-p2](references/marketplace-inteligente-setup-open-ai-e-respondendo-mensagens-parte-2.md) — Continuação: respostas e integração OpenAI com NestJS
- [confirmando-acao](references/marketplace-inteligente-confirmando-acao.md) — Confirmação de ações detectadas pelo LLM

## Preciso de múltiplos providers de IA?

### Arquitetura multi-provider
Quando escolher: não quer vendor lock-in, precisa comparar modelos, quer fallback entre providers
- [multi-provider](references/marketplace-inteligente-refatorando-para-integrar-outros-providers.md) — Abstract provider class, module encapsulation, factory-based selection, env config

### Gemini (Google)
Quando escolher: alternativa ao OpenAI, precisa de provider Google, custos diferentes
- [gemini-setup](references/marketplace-inteligente-gemini-api-key.md) — API Key via Google AI Studio, Google Cloud project setup
- [gemini-text](references/marketplace-inteligente-implementando-gemini-parte-1.md) — @google/genai SDK, parse JSON de markdown, stateful history, role mapping
- [gemini-embeddings](references/marketplace-inteligente-implementando-gemini-parte-2.md) — NUNCA misturar embeddings entre modelos, embedContent com arrays, interface abstrata

## Estou integrando IA com e-commerce?

### Catálogo de produtos
Quando escolher: marketplace com busca inteligente, catálogo com embeddings
- [catalogo-backend](references/marketplace-inteligente-listagem-do-catalogo-no-backend.md) — dump.sql, pgVector extension, shared PostgreSQL service, ConfigService, e2e tests
- [catalogo-backend-p2](references/marketplace-inteligente-listagem-do-catalogo-no-backend-part-2.md) — Continuação: listagem e integração com pgvector
- [catalogo-frontend](references/marketplace-inteligente-listagem-do-catalogo-no-frontend.md) — UI de catálogo no frontend

### Carrinho inteligente
Quando escolher: sugestões de carrinho via IA, agrupamento por loja, confirmação de ação
- [cart-schema](references/marketplace-inteligente-setup-do-carrinho.md) — Schema com store isolation, active flag, unique product-cart constraints, CASCADE
- [cart-crud](references/marketplace-inteligente-criar-e-buscar-carrinho.md) — TDD: e2e test first → module/service/controller → verify
- [cart-crud-p2](references/marketplace-inteligente-criar-e-buscar-carrinho-part-2.md) — Operações adicionais de carrinho
- [cart-crud-p3](references/marketplace-inteligente-criar-e-buscar-carrinho-part-3.md) — Finalização de operações de carrinho
- [cart-updates-p1](references/marketplace-inteligente-atualizacoes-no-carrinho-part-1.md) — Atualizações no carrinho (parte 1)
- [cart-updates-p2](references/marketplace-inteligente-atualizacoes-no-carrinho-part-2.md) — Atualizações no carrinho (parte 2)
- [cart-sugestoes](references/marketplace-inteligente-gerando-sugestoes-de-carrinhos.md) — Prompt com scoring examples, Zod schema, group by store, link to message
- [cart-escolha](references/marketplace-inteligente-escolhendo-o-carrinho-sugerido.md) — Seleção do carrinho sugerido pelo LLM
- [cart-frontend](references/marketplace-inteligente-integrando-carrinho-com-frontend.md) — Integração carrinho + frontend

### Frontend + Backend integration
Quando escolher: conectar API de IA com frontend Next.js
- [frontend-fixes](references/marketplace-inteligente-frontend-e-correcoes-no-backend.md) — Validar rotas, nomes consistentes, SQL aggregation, IDs em payloads, search params state

## Decisões transversais

### Como escolher a API certa?
- [visao-geral-api](references/marketplace-inteligente-visao-geral-da-api.md) — Decision framework: Chat vs Structured vs Embeddings vs Batch vs File Search vs Function Calling

### Como garantir type-safety nas respostas?
- [structured-outputs](references/marketplace-inteligente-estruturando-dados-com-structured-outputs.md) — Zod + zodResponseFormat = tipagem end-to-end
- [json-mode](references/marketplace-inteligente-estruturando-dados-com-json-mode.md) — JSON Mode + Zod validation pós-resposta

### Como reduzir custo de API?
- [batch-embedding-p1](references/marketplace-inteligente-batch-embedding-parte-1.md) — Batch API = 50% desconto em embeddings bulk
- [chunking](references/marketplace-inteligente-tecnicas-de-divisao-chunking.md) — Processar em paralelo com chunks menores

### Como evitar vendor lock-in?
- [multi-provider](references/marketplace-inteligente-refatorando-para-integrar-outros-providers.md) — Abstract class + factory pattern + env config

### Projeto e contexto geral
- [apresentacao-projeto](references/marketplace-inteligente-apresentacao-do-projeto-9.md) — Visão geral do projeto Marketplace Inteligente
- [desafio](references/marketplace-inteligente-desafio-30.md) — Desafio prático do módulo
- [conclusao](references/marketplace-inteligente-conclusao-26.md) — Conclusão e próximos passos

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 3 (Implementação)** → Siga o ramo relevante por feature AI

## Cross-References — Decision Coverage

Quando este router não cobre uma decisão, delegue para:

| Decisão | Delegue para | Motivo |
|---------|-------------|--------|
| D3_DATA_LAYER (Prisma/Knex) | [rs-node-js](../rs-node-js/SKILL.md) | ORM, persistência |
| D3_AUTH (JWT/OAuth) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Auth + segurança |
| D3_TESTING (Jest/Playwright) | [rs-testes-e](../rs-testes-e/SKILL.md) | Testes |
| D3_DEPLOY (Docker/CI) | [rs-devops](../rs-devops/SKILL.md) | Deploy, CI/CD |
| DX_SECURITY (XSS/CSRF) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Segurança web |
| DX_STATE (Redux/Zustand) | [rs-redux-zustand](../rs-redux-zustand/SKILL.md) | State management frontend |
| DX_FRONTEND (Next.js) | [rs-next-js](../rs-next-js/SKILL.md) | SSR, App Router |
