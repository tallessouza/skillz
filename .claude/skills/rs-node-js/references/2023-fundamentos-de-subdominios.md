---
name: rs-node-js-2023-fundamentos-subdominios
description: "Applies DDD subdomain classification (core, supporting, generic) when designing system architecture or splitting monoliths. Use when user asks to 'design domains', 'split application', 'identify bounded contexts', 'classify subdomains', or 'plan microservices'. Guides prioritization of development effort based on business value. Make sure to use this skill whenever structuring a new backend project or discussing domain separation. Not for code-level patterns, entity design, or value objects."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-subdomains
  tags: [ddd, subdomains, core, supporting, generic, bounded-context, domain-events]
---

# Fundamentos de Subdomínios (DDD)

> Divida o domínio do problema em subdomínios classificados por valor de negócio, focando esforço no core e terceirizando o genérico.

## Key concepts

Subdomínios são divisões do **problema de negócio**, não do código. Tudo que o software toca — incluindo fornecedores externos e processos fora da empresa — pode ser um subdomínio. Um setor da empresa pode conter vários subdomínios, e coisas fora da empresa também podem ser subdomínios.

## Os três tipos

### 1. Core Subdomain
- **O que dá dinheiro.** Se parar, o negócio para.
- Dificilmente terceirizável — é o diferencial competitivo.
- Merece o maior investimento de tempo e qualidade de código.

### 2. Supporting Subdomain
- Dá suporte para o core funcionar.
- Não é essencial por si só, mas os core domains dependem dele.
- Pode ser desenvolvido internamente com menos prioridade.

### 3. Generic Subdomain
- Necessário, mas facilmente substituível por solução pronta.
- Candidato natural para terceirização ou uso de SaaS.

## Framework de decisão

| Pergunta | Core | Supporting | Generic |
|----------|------|------------|---------|
| Se parar, o negócio morre? | Sim | Indiretamente | Não |
| Pode terceirizar facilmente? | Não | Talvez | Sim |
| É diferencial competitivo? | Sim | Não | Não |
| Outro core depende dele? | — | Sim | Não |

## Exemplo: E-commerce

```
CORE:        compra, catálogo, pagamento, entrega
SUPPORTING:  estoque (suporta catálogo e compra), faturamento
GENERIC:     notificações, chat de atendimento, promoções
```

## Regra de independência entre subdomínios

1. **Sem chamada direta entre subdomínios** — deletar o código de um subdomínio não pode quebrar outro
2. **Num monolito, usar domain events** para comunicação — não precisa de mensageria externa
3. **Desacoplamento de código, não de infraestrutura** — mesma codebase, mesmo deploy, mas sem dependência direta de funções

### Como comunicar (monolito)

```typescript
// ERRADO: chamada direta entre subdomínios
// No subdomínio de compra:
import { gerarNotaFiscal } from '../faturamento/services'
gerarNotaFiscal(compra) // ← dependência direta, proibido

// CORRETO: domain event
// No subdomínio de compra:
compra.addDomainEvent(new CompraRealizada(compra))
// O subdomínio de faturamento escuta esse evento e age
```

## Heurísticas

| Situação | Faça |
|----------|------|
| Classificando subdomínios | Converse com o cliente — ele define o que é core |
| Mesmo domínio pode ser core ou generic | Depende do contexto do negócio (notificação é generic em e-commerce, supporting em fórum) |
| Dúvida se é core ou supporting | Pergunte: "se esse domínio parar, o core para também?" |
| Planejando sprint/esforço | Foque tempo no core, terceirize generic |
| Monolito com subdomínios | Use domain events, não mensageria |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Classificar subdomínios pela estrutura técnica | Classificar pelo valor de negócio |
| Import direto entre subdomínios | Comunicar via domain events |
| Tratar todos os domínios com mesmo nível de esforço | Priorizar core, terceirizar generic |
| Assumir que subdomínio = microserviço | Subdomínios funcionam em monolitos também |
| Definir classificação sozinho como dev | Validar com o stakeholder do negócio |

## Troubleshooting

### Subdominio A quebra quando subdominio B e removido
**Symptom:** Remover codigo de um subdominio causa erros de compilacao em outro
**Cause:** Existe import direto entre subdominios em vez de comunicacao via domain events
**Fix:** Substitua imports diretos por domain events: o subdominio A emite o evento, o subdominio B escuta e reage

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
