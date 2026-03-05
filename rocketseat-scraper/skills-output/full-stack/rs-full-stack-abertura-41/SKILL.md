---
name: rs-full-stack-abertura-41
description: "Guides initial setup decisions for a delivery API project using Docker, Postgres, Prisma, and Zod. Use when user asks to 'create a delivery API', 'start a new API project', 'build an order tracking system', or 'setup a full-stack project with Prisma and Docker'. Make sure to use this skill whenever starting a new Node.js API project that involves delivery, orders, or shipment tracking. Not for frontend components, authentication flows, or deployment pipelines."
---

# API de Entregas — Visao Geral do Projeto

> Ao iniciar uma API de entregas, defina a stack e a arquitetura antes de escrever qualquer codigo.

## Key concept

Este projeto eh uma API completa para um aplicativo de delivery/entregas de encomendas, construida do zero. A stack combina ferramentas que cobrem todo o ciclo: containerizacao (Docker), banco relacional (Postgres), ORM type-safe (Prisma), e validacao de entrada (Zod).

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Precisa de ambiente reproduzivel | Docker para containerizar banco e aplicacao |
| Precisa de persistencia relacional (pedidos, entregas, usuarios) | Postgres como banco principal |
| Precisa de acesso type-safe ao banco | Prisma como ORM |
| Precisa validar dados de entrada na API | Zod para schemas de validacao |
| Precisa de um projeto portfolio-ready | Seguir essa arquitetura completa |

## Stack do projeto

| Camada | Ferramenta | Funcao |
|--------|-----------|--------|
| Container | Docker | Ambiente isolado e reproduzivel |
| Banco de dados | PostgreSQL | Persistencia relacional |
| ORM | Prisma | Acesso type-safe ao banco, migrations |
| Validacao | Zod | Validacao de dados de entrada |

## Quando aplicar

- Inicio de qualquer API REST que envolva entregas, pedidos ou logistica
- Projetos full-stack que precisam de uma API robusta como backend
- Projetos de portfolio que demonstrem dominio de stack moderna

## Limitations

- Esta eh a visao geral — detalhes de implementacao (rotas, models, controllers) sao cobertos nas aulas seguintes
- Nao cobre autenticacao, deploy ou frontend

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a escolha da stack e contexto do projeto
- [code-examples.md](references/code-examples.md) — Exemplos iniciais de configuracao da stack