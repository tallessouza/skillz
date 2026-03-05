---
name: rs-ia-node
description: "Enforces AI-powered Node.js application best practices when building intelligent marketplaces, integrating OpenAI/Gemini APIs, implementing function calling, generating embeddings, processing batches, structuring LLM outputs with JSON mode or Structured Outputs, designing chat sessions, or building e-commerce carts with AI suggestions. Make sure to use this skill whenever implementing LLM-driven features in Node.js, creating semantic search with embeddings, chaining prompts, or integrating multiple AI providers. Not for frontend-only work, pure DevOps, or non-AI backend services."
---

# IA com Node.js — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 49 skills organizadas em 7 domínios.

## Decision Tree

```
O que você está fazendo com IA?
│
├─ Setup / API fundamentals?
│  ├─ Setup projeto + OpenAI SDK → [marketplace-inteligente-setup-do-projeto-2028.md](references/marketplace-inteligente-setup-do-projeto-2028.md)
│  ├─ Parâmetros da API → [marketplace-inteligente-explorando-parametros-da-api.md](references/marketplace-inteligente-explorando-parametros-da-api.md)
│  ├─ Gerando texto em API → [marketplace-inteligente-gerando-texto-em-uma-api.md](references/marketplace-inteligente-gerando-texto-em-uma-api.md)
│  ├─ Gemini setup → [marketplace-inteligente-gemini-api-key.md](references/marketplace-inteligente-gemini-api-key.md)
│  └─ Responses API → [marketplace-inteligente-responses-api.md](references/marketplace-inteligente-responses-api.md)
│
├─ Prompt engineering / estruturação?
│  ├─ Chain of thought → [marketplace-inteligente-encadeamento-de-prompts-chain-of-thought.md](references/marketplace-inteligente-encadeamento-de-prompts-chain-of-thought.md)
│  ├─ JSON mode → [marketplace-inteligente-estruturando-dados-com-json-mode.md](references/marketplace-inteligente-estruturando-dados-com-json-mode.md)
│  ├─ Structured Outputs (Zod) → [marketplace-inteligente-estruturando-dados-com-structured-outputs.md](references/marketplace-inteligente-estruturando-dados-com-structured-outputs.md)
│  ├─ Multi-step prompts → [marketplace-inteligente-multi-step-prompts.md](references/marketplace-inteligente-multi-step-prompts.md)
│  └─ Chunking → [marketplace-inteligente-tecnicas-de-divisao-chunking.md](references/marketplace-inteligente-tecnicas-de-divisao-chunking.md)
│
├─ Function calling / tools?
│  ├─ Conceito → [marketplace-inteligente-introducao-a-function-calling.md](references/marketplace-inteligente-introducao-a-function-calling.md)
│  ├─ Integrando (parte 1) → [marketplace-inteligente-integrando-function-calling-com-a-aplicacao-parte-1.md](references/marketplace-inteligente-integrando-function-calling-com-a-aplicacao-parte-1.md)
│  ├─ Loop de mensagens → [marketplace-inteligente-integrando-function-calling-com-a-aplicacao-parte-2.md](references/marketplace-inteligente-integrando-function-calling-com-a-aplicacao-parte-2.md)
│  ├─ Recursão otimizada → [marketplace-inteligente-otimizando-function-calling-com-recursao.md](references/marketplace-inteligente-otimizando-function-calling-com-recursao.md)
│  └─ File Search API → [marketplace-inteligente-file-search-api.md](references/marketplace-inteligente-file-search-api.md)
│
├─ Embeddings / busca semântica?
│  ├─ Intro embeddings → [marketplace-inteligente-introducao-aos-embeddings.md](references/marketplace-inteligente-introducao-aos-embeddings.md)
│  ├─ Embedding API → [marketplace-inteligente-utilizando-a-embedding-api.md](references/marketplace-inteligente-utilizando-a-embedding-api.md)
│  ├─ Similaridade coseno → [marketplace-inteligente-calculando-similaridade-de-embeddings.md](references/marketplace-inteligente-calculando-similaridade-de-embeddings.md)
│  ├─ Batch embedding → [marketplace-inteligente-batch-embedding-parte-1.md](references/marketplace-inteligente-batch-embedding-parte-1.md)
│  └─ Batch API → [marketplace-inteligente-introducao-e-criacao-de-batches.md](references/marketplace-inteligente-introducao-e-criacao-de-batches.md)
│
├─ Chat sessions?
│  ├─ Módulo NestJS (TDD) → [marketplace-inteligente-introducao-ao-modulo-e-chat-sessions.md](references/marketplace-inteligente-introducao-ao-modulo-e-chat-sessions.md)
│  ├─ Mensagens + action detection → [marketplace-inteligente-adicionando-mensagens-ao-chat-parte-1.md](references/marketplace-inteligente-adicionando-mensagens-ao-chat-parte-1.md)
│  └─ OpenAI + Structured Outputs NestJS → [marketplace-inteligente-setup-open-ai-e-respondendo-mensagens-parte-1.md](references/marketplace-inteligente-setup-open-ai-e-respondendo-mensagens-parte-1.md)
│
├─ E-commerce / cart AI?
│  ├─ Schema carrinho → [marketplace-inteligente-setup-do-carrinho.md](references/marketplace-inteligente-setup-do-carrinho.md)
│  ├─ Criar/buscar carrinho → [marketplace-inteligente-criar-e-buscar-carrinho.md](references/marketplace-inteligente-criar-e-buscar-carrinho.md)
│  ├─ Sugestões IA → [marketplace-inteligente-gerando-sugestoes-de-carrinhos.md](references/marketplace-inteligente-gerando-sugestoes-de-carrinhos.md)
│  └─ Catálogo backend → [marketplace-inteligente-listagem-do-catalogo-no-backend.md](references/marketplace-inteligente-listagem-do-catalogo-no-backend.md)
│
└─ Multi-provider / frontend?
   ├─ Refatorando para multi-provider → [marketplace-inteligente-refatorando-para-integrar-outros-providers.md](references/marketplace-inteligente-refatorando-para-integrar-outros-providers.md)
   ├─ Gemini provider → [marketplace-inteligente-implementando-gemini-parte-1.md](references/marketplace-inteligente-implementando-gemini-parte-1.md)
   └─ Frontend integration → [marketplace-inteligente-frontend-e-correcoes-no-backend.md](references/marketplace-inteligente-frontend-e-correcoes-no-backend.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 3 (Implementação)** → Siga o ramo relevante por feature AI
