---
name: rs-agentes-ia-n8n-self-hosted-infra
description: "Guides N8N self-hosted infrastructure setup using Hostinger VPS with EasyPanel. Use when user asks to 'setup n8n', 'host n8n', 'deploy n8n self-hosted', 'create VPS for n8n', or 'install easypanel'. Covers VPS selection, OS configuration, and EasyPanel panel management. Make sure to use this skill whenever setting up N8N infrastructure or choosing hosting providers. Not for N8N workflow building, node configuration, or cloud-hosted N8N plans."
---

# Self-hosted Infra para N8N

> Escolha uma VPS com EasyPanel pre-instalado para ter N8N rodando com minimo de friccao operacional.

## Decisao de infraestrutura

### Onde hospedar N8N?

A documentacao oficial do N8N lista server setups para: DigitalOcean, Heroku, Hetzner, AWS, Azure, GCP e outros. Qualquer provedor de VPS funciona.

**Sugestao pratica:** Hostinger VPS com EasyPanel — porque a praticidade de gerenciamento supera diferencas pequenas de preco.

## Steps

### Step 1: Consultar documentacao oficial

1. Acessar GitHub do N8N → documentacao → hosting N8N → server setups
2. Verificar se o provedor escolhido tem guia oficial
3. Se nao tiver guia oficial, seguir o fluxo generico com EasyPanel

### Step 2: Escolher VPS

| Criterio | Recomendacao |
|----------|-------------|
| Plano minimo | KVM2 (2 vCPU, 8GB RAM) — estavel, sem problemas reportados |
| Sistema operacional | Linux com painel (OS with panel) |
| Painel | EasyPanel pre-instalado |
| Periodo | 12-24 meses para melhor custo-beneficio |

### Step 3: Configurar VPS na compra

1. Selecionar plano VPS (ex: KVM2)
2. Escolher periodo de pagamento
3. Na secao "Sistema Operacional" → selecionar **OS com painel**
4. Selecionar **EasyPanel** como painel
5. Confirmar e finalizar compra

### Step 4: Acessar painel de gerenciamento

1. Entrar no painel da Hostinger
2. Localizar o servidor na lista
3. Clicar em "Gerenciar" no servidor
4. Verificar metricas (CPU, memoria, atividade)
5. Clicar em "Gerenciar painel" para abrir o EasyPanel

### Step 5: Verificar EasyPanel

1. Acessar EasyPanel pelo link no painel da Hostinger
2. Confirmar que o painel esta acessivel e logado
3. O EasyPanel sera usado para instalar N8N e outros servicos

## Heuristics

| Situacao | Faca |
|----------|------|
| Empresa ja tem infra em AWS/GCP | Use o guia oficial do N8N para aquele provedor |
| Projeto novo, quer simplicidade | Hostinger + EasyPanel |
| Precisa escalar depois | Comece com KVM2, upgrade de plano quando necessario |
| Quer controle total via CLI | Instale OS puro sem painel (mais tecnico) |
| Painel tecnico dando problemas | Migre para EasyPanel — resolve problemas de manutencao |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Instalar N8N direto via CLI sem painel de gerenciamento | Usar EasyPanel para gerenciar instalacoes |
| Escolher o plano mais barato sem verificar requisitos | Validar CPU/RAM minimos para N8N |
| Prender-se a layout da documentacao | Buscar por "hosting N8N" ou "server setups" independente do layout |
| Instalar painel tecnico complexo para uso simples | EasyPanel para cenarios onde praticidade importa |

## Verificacao

- [ ] VPS acessivel via painel do provedor
- [ ] EasyPanel instalado e acessivel via browser
- [ ] Metricas de CPU e memoria visiveis
- [ ] Pronto para instalar N8N no proximo passo

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
