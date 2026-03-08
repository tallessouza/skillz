---
name: rs-full-stack-abertura-41
description: "Structures initial setup decisions for a delivery API project using Docker, Postgres, Prisma, and Zod. Use when user asks to 'create a delivery API', 'start a new API project', 'build an order tracking system', or 'setup a full-stack project with Prisma and Docker'. Make sure to use this skill whenever starting a new Node.js API project that involves delivery, orders, or shipment tracking. Not for frontend components, authentication flows, or deployment pipelines."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, docker, prisma, zod, postgres, api-setup]
---

# API de Entregas — Visao Geral do Projeto

> Ao iniciar uma API de entregas, defina a stack e a arquitetura antes de escrever qualquer codigo.

## Key concepts

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

## Setup inicial

```bash
# Subir banco Postgres com Docker
docker-compose up -d

# Inicializar Prisma e gerar schema
npx prisma init
npx prisma migrate dev --name init
```

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

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Docker nao sobe o Postgres | Porta 5432 ja em uso | Mude a porta no docker-compose ou mate o processo existente |
| Prisma nao conecta ao banco | Container do banco nao esta rodando | Verifique com `docker ps` e inicie com `docker-compose up -d` |
| Zod nao valida os dados | Schema de validacao nao aplicado na rota | Adicione `schema.parse(req.body)` no controller |
| Ambiente nao reproduzivel | Dependencias fora do Docker | Containerize tanto a aplicacao quanto o banco |