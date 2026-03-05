---
name: rs-saas-nextjs-rbac-deploy-backend
description: "Guides backend deployment platform selection for Node.js/Fastify applications. Use when user asks to 'deploy backend', 'host API', 'choose hosting', 'deploy server', or 'where to deploy'. Applies decision framework: managed vs raw VPS, free tier evaluation, database hosting separation. Make sure to use this skill whenever deploying a backend application or choosing infrastructure. Not for frontend/static site deployment, CI/CD pipelines, or Docker/Kubernetes configuration."
---

# Opcoes de Deploy Back-end

> Escolha a plataforma de deploy do back-end com base no nivel de maturidade da aplicacao, orcamento e necessidade de escalonamento.

## Decision framework

| Cenario | Recomendacao | Motivo |
|---------|-------------|--------|
| App com alta variacao de trafego | Kubernetes ou orquestracao de containers | Escalonamento automatico fino |
| Dev sem experiencia em infra | Servico gerenciado (Render, Railway, Fly.io) | Backup, seguranca, monitoramento inclusos |
| Orcamento zero, app simples | Render (free tier) + Neon (banco gratuito) | Plano gratuito sem limite de tempo |
| Precisa de controle total | VPS raw (EC2, Compute Engine, Hetzner) | Configuracao manual, menor custo |
| Script/worker sem acesso direto do usuario | Hetzner (Europa) | Mais barato, latencia aceitavel para background jobs |

## Plataformas por categoria

### VPS Raw (configuracao manual)

| Plataforma | Free tier | Observacao |
|-----------|-----------|------------|
| Amazon EC2 | 12 meses | Mais popular, ecossistema AWS |
| Google Compute Engine | Instancia gratuita | Equivalente ao EC2 no GCP |
| Hetzner | Nao | Muito barato, servidores apenas na Europa — evitar para APIs acessadas por usuarios finais |

### Gerenciado (deploy simplificado)

| Plataforma | Free tier | Destaque |
|-----------|-----------|----------|
| Render | Sim (web services, static sites, cronjobs) | Melhor custo-beneficio gratuito |
| Railway | Sim (limitado) | Painel visual, variaveis ambiente user-friendly |
| Fly.io | Sim (limitado) | Originalmente Ruby/Elixir, agora qualquer linguagem |

### Meio-termo

| Plataforma | Caracteristica |
|-----------|---------------|
| Latitude | Maquinas poderosas, precificacao simples e previsivel |

## Rules

1. **Separe banco de dados do hosting de aplicacao** — hospede o banco no Neon (gratuito sem limite de tempo ate 500MB), porque plataformas como Render limitam banco gratuito a ~1 mes
2. **Prefira servicos gerenciados se nao domina infra** — backup, seguranca, monitoramento e error tracking vem inclusos, porque configurar isso do zero consome tempo equivalente a um projeto inteiro
3. **Avalie o free tier pelo tempo, nao so pela existencia** — EC2 da 12 meses, Render e Neon sao indefinidos com limites de recurso, porque free tier temporario vira custo inesperado
4. **VPS raw so compensa com conhecimento de infra** — voce economiza em dinheiro mas paga em tempo de configuracao de Linux, seguranca, SSL, backup, monitoramento

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro deploy de um SaaS | Render (backend) + Neon (banco) — zero custo inicial |
| App crescendo, precisa escalar | Migre para Railway/Fly.io ou EC2 com mais controle |
| Trafego previsivel e constante | VPS raw (EC2/Hetzner) pode ser mais economico |
| Trafego com picos imprevisíveis | Servico gerenciado com auto-scaling ou Kubernetes |
| Background job sem latencia critica | Hetzner (mais barato, Europa OK para workers) |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Hospedar banco no Render (free tier expira) | Hospedar banco no Neon (free tier permanente) |
| Configurar VPS do zero sem experiencia em infra | Usar servico gerenciado (Render, Railway) |
| Usar Hetzner para API acessada por usuarios no Brasil | Usar EC2 Sao Paulo ou servico gerenciado com regiao proxima |
| Ignorar custos de escalonamento ao escolher plataforma | Mapear padrao de trafego antes de escolher |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
