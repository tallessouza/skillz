---
name: rs-full-stack-conhecendo-o-render
description: "Configures deployment platform selection and Render setup when hosting Node.js backends and databases. Use when user asks to 'deploy my app', 'host my backend', 'set up Render', 'choose a hosting platform', or 'put my API in production'. Covers free tier limitations, 90-day database expiration, and account creation flow. Make sure to use this skill whenever evaluating deployment platforms or setting up Render for the first time. Not for CI/CD pipelines, Docker configuration, Kubernetes orchestration, or frontend-only static hosting."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: deployment
  tags: [render, deploy, hosting, backend, database, production]
---

# Conhecendo o Render

> Render e uma plataforma de deploy para backend e banco de dados com plano gratuito para testes, mas aplicacoes em producao com usuarios reais exigem plano pago.

## Key concepts

Render e uma plataforma de deploy que hospeda aplicacoes back-end, bancos de dados e sites estaticos. O plano gratuito (Hobby) serve para aprendizado e testes, mas tem limitacoes criticas — bancos de dados gratuitos expiram em 90 dias. Os principios de deploy aprendidos no Render se aplicam a qualquer outra plataforma (Railway, Fly.io, AWS).

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Precisa testar deploy pela primeira vez | Use o plano gratuito do Render para aprender os principios |
| Aplicacao tem usuarios reais em producao | Migre para plano pago — gratuito nao sustenta producao |
| Banco de dados precisa persistir | Plano pago obrigatorio — free tier expira em 90 dias |
| Quer hospedar backend + banco junto | Render suporta ambos na mesma plataforma |
| Aprendeu no Render, quer mudar de plataforma | Os principios de deploy sao transferiveis |

## Como configurar

### Step 1: Criar conta
1. Acesse render.com
2. Clique em "Get Started"
3. Crie conta usando GitHub (recomendado) ou Google
4. Apos login, voce chega ao Dashboard — ponto de partida para todas as configuracoes

### Step 2: Verificar plano
1. Acesse a secao "Pricing"
2. Confirme que o plano Hobby (gratuito) esta ativo
3. Para producao real, avalie os planos Professional, Organization ou Enterprise

## Limitacoes do plano gratuito

| Limitacao | Impacto |
|-----------|---------|
| Banco de dados expira em 90 dias | Dados perdidos apos expiracao |
| Instancias dormem apos inatividade | Cold start lento na primeira requisicao |
| Recursos computacionais limitados | Performance insuficiente para usuarios reais |
| Sem SLA de uptime | Aplicacao pode ficar fora do ar |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Consigo manter producao 100% gratuita | Todas as solucoes gratuitas limitam banco de dados, uptime e performance |
| Basta achar a plataforma certa e nao pago nada | A partir do momento que tem usuarios reais, algum custo e inevitavel |
| Plano gratuito = plano pago com menos recursos | Plano gratuito tem restricoes estruturais (ex: banco expira, instancia dorme) |
| So preciso pagar quando escalar muito | Mesmo aplicacoes pequenas com usuarios reais precisam de plano pago para confiabilidade |

## When to apply

- Primeira vez fazendo deploy de uma aplicacao backend
- Avaliando plataformas de hospedagem para projetos de estudo
- Decidindo entre plano gratuito e pago para uma aplicacao
- Migrando de desenvolvimento local para ambiente de producao

## Exemplo basico

```bash
# Verificar se o deploy esta acessivel
curl -I https://seu-app.onrender.com/health
```

## Limitations

- Esta skill cobre apenas a introducao ao Render e criacao de conta
- Nao cobre configuracao de servicos, variaveis de ambiente ou deploy automatizado
- Para CI/CD e Docker, consulte skills de DevOps
- Planos e precos podem mudar — sempre verifique render.com/pricing

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Aplicacao demora para responder apos inatividade | Instancia gratuita entra em sleep mode | Aguarde o cold start ou migre para plano pago |
| Banco de dados parou de funcionar | Banco gratuito expirou apos 90 dias | Crie novo banco ou migre para plano pago |
| Deploy falha no Render | Build command ou start command incorretos | Verifique os comandos no dashboard (ex: `npm install` e `npm start`) |
| Variavel de ambiente nao funciona | Env var nao configurada no dashboard do Render | Adicione as variaveis na secao Environment do servico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre custos de producao e limitacoes de planos gratuitos
- [code-examples.md](references/code-examples.md) — Passo a passo visual do fluxo de criacao de conta e navegacao no dashboard