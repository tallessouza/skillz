---
name: rs-ia-node-marketplace-apresentacao
description: "Applies the Cart AI marketplace architecture when building Next.js projects with AI agents, product search, and cart comparison features. Use when user asks to 'build a marketplace', 'create a shopping cart with AI', 'compare prices across stores', or 'implement an AI agent for e-commerce'. Provides the entity diagram, tech stack decisions, and feature scope for the Cart AI project. Make sure to use this skill whenever implementing features of this specific Skillz marketplace project. Not for generic e-commerce tutorials, payment processing, or deployment configuration."
---

# Cart AI — Arquitetura do Projeto Marketplace Inteligente

> O sistema permite buscar produtos de varias lojas, criar carrinhos, e usar um agente de IA que sugere receitas e monta carrinhos automaticamente com comparacao de precos.

## Tech Stack

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Backend | Next.js | Fullstack, API routes integradas |
| Frontend | Next.js | SSR, componentes React |
| Banco de dados | PostgreSQL + extensao de embeddings | Calculos de embeddings no banco, nao localmente |
| IA | OpenAI API (Responses API + Embeddings API) | Agente conversacional + busca semantica de receitas |

## Diagrama de Entidades

```
Usuario
  ├── Carrinho (manual ou via agente)
  │     └── CartItem[] ──→ Produto
  │                          └── Loja
  ├── ChatSession[]
  │     └── Mensagem[]
  │           └── AcaoDoAgente? (ex: criar carrinho)
  │                 └── Carrinho
  └── Receitas (upload para estender conhecimento do modelo)
```

## Features Principais

### 1. Busca de produtos multi-loja
- Produtos cadastrados por diferentes lojas (padrao marketplace)
- Usuario busca e adiciona ao carrinho manualmente

### 2. Agente de IA conversacional
- Chat estilo OpenAI com multiplas sessoes
- Identifica automaticamente quando montar um carrinho
- Conhece receitas pelo conhecimento padrao do modelo
- Extensivel via upload de receitas proprias do usuario

### 3. Comparacao automatica de carrinhos
- Agente monta carrinho da mesma receita em varias lojas
- Rankeia por preco: mais barato → mais caro
- Indica quando uma loja nao tem todos os produtos
- Usuario clica para aplicar o carrinho escolhido

### 4. Gerenciamento de receitas
- Upload de receitas para estender base de conhecimento
- Pagina dedicada: listar, upar, apagar receitas
- Botao de upload tambem disponivel no chat

## Fluxo do Usuario

```
1. Usuario abre chat → pede "quero fazer feijoada"
2. Agente identifica intencao de receita
3. Agente busca produtos necessarios em todas as lojas
4. Agente monta carrinho por loja, compara precos
5. Apresenta ranking: loja X (R$Y), loja Z (R$W)
6. Usuario escolhe → "Aplicar carrinho"
7. Carrinho criado → tela de carrinho → finalizar compra
```

## Heuristics

| Situacao | Decisao |
|----------|---------|
| Calculos de embeddings | No PostgreSQL (extensao), nao localmente |
| API da OpenAI | Responses API para agente, Embeddings API para receitas |
| Mensagem do chat sem acao | `AcaoDoAgente` e nullable, nem toda mensagem dispara acao |
| Receitas do usuario vs modelo | Upload estende a base, nao substitui conhecimento padrao |
| Comparacao de lojas incompleta | Indicar quais lojas nao tem todos os produtos |

## Anti-patterns

| Evitar | Fazer em vez disso |
|--------|-------------------|
| Calcular embeddings no servidor Node | Usar extensao do PostgreSQL para embeddings |
| Forcar usuario a buscar produto por produto | Agente monta carrinho completo automaticamente |
| Uma unica sessao de chat | Multiplas sessoes (ChatSession), como na OpenAI |
| Ignorar lojas com produtos faltando | Rankear E informar incompletude |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
