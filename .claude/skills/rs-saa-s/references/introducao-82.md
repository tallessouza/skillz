---
name: rs-saas-nextjs-rbac-introducao
description: "Provides architectural overview of a full-stack SaaS project with multi-tenancy, RBAC/ABAC permissions, and monorepo setup. Use when user asks to 'build a SaaS', 'setup multi-tenant app', 'plan a full-stack project with permissions', or 'create a monorepo with Next.js and Node'. Make sure to use this skill whenever planning SaaS architecture or multi-tenant systems. Not for implementing specific features, writing code, or deploying applications."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: fundamentos
  tags: [saas, fastify, api, routes, nextjs, server-actions]
---

# Arquitetura SaaS Full-Stack — Visao Geral

> Ao planejar um SaaS, defina primeiro a estrategia de multi-tenancy e permissionamento antes de escrever qualquer codigo.

## Key concept

Um SaaS (Software as a Service) e um produto vendido para multiplas empresas que compartilham a mesma aplicacao. A diferenca fundamental de um software interno e que o SaaS precisa operar com **multiplos tenants** — cada empresa e um tenant isolado usando o mesmo sistema.

Isso impoe tres decisoes arquiteturais que devem ser tomadas antes de qualquer codigo:

1. **Multi-tenancy** — como isolar dados entre empresas
2. **Permissionamento** — quem pode fazer o que dentro de cada tenant (RBAC, ABAC)
3. **Estrutura do projeto** — como organizar front-end, back-end e pacotes compartilhados

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Produto usado por uma unica empresa | Software interno — multi-tenancy nao e necessario |
| Produto vendido para varias empresas | SaaS — defina estrategia de tenant isolation |
| Permissoes baseadas em cargo (admin, member) | RBAC (Role-Based Access Control) |
| Permissoes baseadas em atributos contextuais (dono do recurso, horario) | ABAC (Attribute-Based Access Control) |
| Front-end + back-end + pacotes compartilhados | Monorepo com TurboRepo |

## Stack de referencia

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Back-end | Node.js + Fastify | Performance, ecossistema |
| Front-end | Next.js 14+ | Server Components, Server Actions |
| Monorepo | TurboRepo | Cache de builds, tasks paralelas |
| Permissoes | RBAC + ABAC (pacote dedicado) | Regras reutilizaveis entre front e back |

## Ordem de desenvolvimento recomendada

1. **Permissionamento** — definir roles, permissions e policies primeiro (pacote isolado)
2. **Back-end** — API com autenticacao, autorizacao e multi-tenancy
3. **Front-end** — UI consumindo a API com permissoes aplicadas

Essa ordem importa porque o permissionamento e compartilhado entre front e back via monorepo — construi-lo primeiro evita retrabalho.

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa isolar dados entre clientes | Implemente tenant isolation no banco (schema separado ou coluna tenant_id) |
| Permissoes sao simples (admin/user) | Comece com RBAC puro |
| Permissoes dependem de contexto (dono, horario, plano) | Combine RBAC + ABAC |
| Front e back compartilham logica de permissao | Extraia para pacote no monorepo |
| Projeto tem multiplos apps/pacotes | Use TurboRepo para cache e orquestracao |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| SaaS e qualquer app web | SaaS especificamente opera com multiplos tenants usando a mesma base de codigo |
| RBAC resolve tudo | RBAC cobre roles fixos; permissoes contextuais precisam de ABAC |
| Monorepo e complicado demais | TurboRepo simplifica com cache inteligente — o ganho em compartilhamento de codigo compensa |
| Permissoes sao coisa do back-end | Permissoes precisam existir no front (UX) e no back (seguranca) — pacote compartilhado resolve |

## Limitations

- Este overview nao cobre implementacao — cada topico (RBAC, ABAC, multi-tenancy, monorepo) tem suas proprias aulas detalhadas
- A stack especifica (Fastify, Next.js 14) pode mudar — os principios arquiteturais permanecem

## Troubleshooting

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Deploy falha com erro de build
**Symptom:** Build funciona localmente mas falha no deploy
**Cause:** Variaveis de ambiente nao configuradas na plataforma de deploy
**Fix:** Configure todas as variaveis de ambiente necessarias no dashboard da plataforma

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
