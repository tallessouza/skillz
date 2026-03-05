---
name: rs-implementation-workflow
description: "Orchestrates the development workflow from domain modeling to implementation. Activates when user asks to 'implement a feature', 'create an API', 'build a service', 'start a new module', or any feature development task. Forces a structured approach: first model the domain (DDD), then define architecture (SOLID/Clean Architecture), then implement with clean code patterns. Make sure to use this skill whenever starting any non-trivial implementation. Not for bug fixes, config changes, or documentation."
---

# Implementation Workflow — Domain to Code

> Nunca comece pela implementação. Primeiro modele o domínio, depois estruture a arquitetura, então escreva código limpo.

## Workflow obrigatório

### Fase 1: Modelagem de Domínio (DDD)

**Roteamento:**
- Clean Code DDD → abra [rs-clean-code](../rs-clean-code/SKILL.md) → ramo "Modelando domínio (DDD)"
  - [principios-de-ddd.md](../rs-clean-code/references/principios-de-ddd.md) — conceitos fundamentais
  - [exemplo-pratico-de-ddd.md](../rs-clean-code/references/exemplo-pratico-de-ddd.md) — aplicação prática
- Node.js DDD → abra [rs-node-js](../rs-node-js/SKILL.md) → ramo "Modelando domínio (DDD)"
  - [2023-design-de-software-e-ddd.md](../rs-node-js/references/2023-design-de-software-e-ddd.md) — fundamentos
  - [2023-entidades-e-casos-de-uso.md](../rs-node-js/references/2023-entidades-e-casos-de-uso.md) — entidades e use cases
  - [2023-classe-base-de-entidades.md](../rs-node-js/references/2023-classe-base-de-entidades.md) — classe base
  - [2023-aggregates-and-watched-lists.md](../rs-node-js/references/2023-aggregates-and-watched-lists.md) — aggregates

**Pergunte ANTES de codar:**
1. Qual é o domínio? (problema que o software resolve)
2. Quais são os subdomínios? (áreas distintas)
3. Quais são as entidades? (substantivos do negócio)
4. Quais são os value objects? (dados sem identidade própria)
5. Quais são os casos de uso? (verbos/ações)
6. Nomes contextuais: `Comprador` no checkout, `Destinatário` na logística, nunca `User`

**Output:** lista de entidades, VOs e use cases nomeados pelo contexto.

---

### Fase 2: Arquitetura (SOLID + Clean Architecture)

**Roteamento:**
- SOLID → abra [rs-clean-code](../rs-clean-code/SKILL.md) → ramo "Estruturando arquitetura (SOLID)"
  - [principios-de-solid.md](../rs-clean-code/references/principios-de-solid.md) — princípios
  - [exemplo-pratico-de-solid.md](../rs-clean-code/references/exemplo-pratico-de-solid.md) — aplicação
  - [unindo-ddd-ao-solid.md](../rs-clean-code/references/unindo-ddd-ao-solid.md) — DIP na prática
- Clean Architecture → abra [rs-node-js](../rs-node-js/SKILL.md) → ramo "Modelando domínio" (camadas)
  - [2023-fundamentos-de-clean-architecture.md](../rs-node-js/references/2023-fundamentos-de-clean-architecture.md) — conceitos
  - [2023-refatorando-as-pastas.md](../rs-node-js/references/2023-refatorando-as-pastas.md) — estrutura de pastas
  - [2023-entendendo-as-camadas.md](../rs-node-js/references/2023-entendendo-as-camadas.md) — camadas NestJS

**Defina:**
1. **SRP** — descreva o que cada classe faz. Se usar "e", separe
2. **OCP** — extensão por composição, nunca if/else
3. **DIP** — injete dependências, nunca importe diretamente
4. **Camadas** — Domain → Application → Infrastructure
5. **Contratos** — interfaces entre camadas

**Output:** estrutura de pastas, interfaces principais, grafo de dependências.

---

### Fase 3: Implementação (Clean Code + Stack)

**Roteamento por stack:**

| Fazendo o quê? | Rota |
|-----------------|------|
| Naming, condicionais, funções | [rs-clean-code](../rs-clean-code/SKILL.md) → ramo "Escrevendo código" |
| React components | [rs-clean-code](../rs-clean-code/SKILL.md) → ramo "Escrevendo React components" |
| Use cases Node.js | [rs-node-js](../rs-node-js/SKILL.md) → ramo "Implementando Use Cases" |
| Repository / Prisma | [rs-node-js](../rs-node-js/SKILL.md) → ramo "Repository / Prisma / Database" |
| NestJS controllers | [rs-node-js](../rs-node-js/SKILL.md) → ramo "Construindo com NestJS" |
| Fastify API | [rs-node-js](../rs-node-js/SKILL.md) → ramo "Construindo API com Fastify" |
| Domain Events | [rs-node-js](../rs-node-js/SKILL.md) → ramo "Implementando Domain Events" |
| Next.js | [rs-next-js](../rs-next-js/SKILL.md) |
| API com Bun | [rs-api-com](../rs-api-com/SKILL.md) |
| State management | [rs-redux-zustand](../rs-redux-zustand/SKILL.md) |
| Tailwind | [rs-masterizando](../rs-masterizando/SKILL.md) |
| IA com Node | [rs-ia-node](../rs-ia-node/SKILL.md) |

---

### Fase 4: Validação

**Roteamento:**
- Testes → [rs-node-js](../rs-node-js/SKILL.md) → ramo "Escrevendo testes" OU [rs-testes-e](../rs-testes-e/SKILL.md)
- Segurança → [rs-seguranca-para](../rs-seguranca-para/SKILL.md)
- DevOps → [rs-devops](../rs-devops/SKILL.md)
- CodeRabbit → pre-commit automático

---

## Quando pular fases

| Situação | Pode pular |
|----------|-----------|
| Bug fix simples (1-3 linhas) | Fases 1-2, vá direto para 3 |
| Adicionar campo a entidade existente | Fase 1, comece na 2 |
| Novo módulo/feature | Nenhuma — siga todas |
| Refactoring | Fase 1, comece na 2 |
| CRUD simples | Fase 1 rápida, fase 2 rápida |
