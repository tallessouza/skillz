---
name: rs-node-js-2023-introducao-nestjs
description: "Guides NestJS project setup integrating DDD, SOLID, and Clean Architecture patterns. Use when user asks to 'start a NestJS project', 'migrate to NestJS', 'integrate DDD with Nest', or 'setup Nest with Prisma and caching'. Provides the learning roadmap and architectural strategy for building NestJS apps that respect domain boundaries. Make sure to use this skill whenever starting a new NestJS project that needs clean architecture. Not for React, frontend frameworks, or NestJS microservices deployment."
---

# NestJS com DDD, SOLID e Clean Architecture

> Construa projetos NestJS migrando código desacoplado de framework para dentro do Nest, integrando banco de dados, caching e mensageria sem perder os princípios de DDD e arquitetura limpa.

## Key concept

NestJS serve como camada de infraestrutura para código de domínio já existente. A estratégia correta é construir o domínio primeiro (desacoplado de framework), depois migrar para o Nest — nunca o contrário.

A abordagem se divide em duas fases:
1. **Fundamentos do Nest** — controllers, Prisma, variáveis ambiente, banco de dados (tudo do zero)
2. **Integração com domínio** — unir o código Nest com a codebase DDD/SOLID/Clean Architecture já construída

## Decision framework

| Quando você encontrar | Aplique |
|----------------------|---------|
| Projeto novo com NestJS | Fase 1: fundamentos primeiro, domínio depois |
| Codebase existente sem framework | Migre para Nest como camada de infra, mantenha domínio intacto |
| Código de domínio acoplado ao Nest | Extraia domínio para camada independente, use Nest apenas como adapter |
| Necessidade de caching/mensageria | Integre via módulos Nest na camada de infraestrutura, nunca no domínio |

## How to think about it

### O Nest como Adapter, não como Dono do Domínio

O NestJS é um framework de infraestrutura. Ele cuida de HTTP, injeção de dependência, módulos. O código de negócio (entidades, use cases, value objects) deve existir independente do Nest. Quando você migra para o Nest, está criando adapters — controllers chamam use cases, repositories implementam interfaces do domínio.

### Fundamentos Antes de Integração

Não tente integrar DDD com Nest antes de entender como o Nest funciona isoladamente. Crie controllers básicos, conecte banco de dados com Prisma, configure variáveis ambiente. Só depois una com o domínio existente.

## Roadmap de construção

1. **Controllers** — rotas HTTP básicas no Nest
2. **Prisma** — conexão com banco de dados
3. **Variáveis ambiente** — configuração segura
4. **Migração do domínio** — trazer entidades, use cases, repositories
5. **Caching** — sistema de cache integrado
6. **Mensageria** — comunicação assíncrona

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| NestJS substitui a arquitetura DDD | Nest é infraestrutura; DDD é design de domínio. Coexistem em camadas diferentes |
| Preciso reescrever tudo para usar Nest | Código desacoplado de framework migra naturalmente — Nest se adapta ao domínio |
| Devo começar pelo DDD dentro do Nest | Aprenda os fundamentos do Nest isoladamente primeiro, depois integre |

## When to apply

- Iniciando projeto NestJS que precisa de arquitetura limpa
- Migrando aplicação Node.js pura para NestJS
- Integrando banco de dados, cache e mensageria respeitando camadas de domínio

## Limitations

- Este modelo assume que já existe conhecimento prévio de DDD e SOLID
- Projetos muito simples (CRUD básico) podem não precisar dessa separação de camadas
- A migração exige que o código original esteja genuinamente desacoplado de framework

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
