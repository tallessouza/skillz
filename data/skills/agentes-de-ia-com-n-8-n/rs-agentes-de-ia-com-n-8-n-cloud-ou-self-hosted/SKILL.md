---
name: rs-n8n-cloud-ou-self-hosted
description: "Applies n8n deployment decision framework when choosing between cloud and self-hosted. Use when user asks to 'deploy n8n', 'install n8n', 'setup n8n', 'host n8n', or discusses n8n infrastructure costs. Guides cost-benefit analysis considering volume, availability, and team skills. Make sure to use this skill whenever the user is planning n8n infrastructure or comparing hosting options. Not for n8n workflow building, node configuration, or automation logic."
---

# N8n: Cloud ou Self-hosted

> Antes de instalar o n8n, analise volume de execucoes, requisitos de disponibilidade e capacidade tecnica da equipe — so entao escolha entre cloud e self-hosted.

## Decision Framework

| Criterio | Self-hosted | Cloud |
|----------|-------------|-------|
| Custo mensal | VPS ~R$30 + gestao | A partir de R$150 (starter) |
| Execucoes | Ilimitadas | 2.500 (starter) a 40.000+ |
| Infraestrutura | Responsabilidade propria | Gerenciada pelo n8n |
| Variaveis globais | Nao disponivel (Community) | Disponivel |
| Escalabilidade | Manual (separar DB, workers) | Automatica |
| Conhecimento necessario | Linux, Docker, VPS, banco de dados | Minimo |

## Quando usar cada opcao

### Self-hosted

```
Volume baixo (execucoes esporadicas, 1-2x por dia)
+ Equipe com conhecimento de infra (Linux, Docker, VPS)
+ Processo NAO e critico (pode ter downtime ocasional)
= Self-hosted em VPS simples (~R$30/mes)
```

### Self-hosted com alta disponibilidade

```
Volume alto + nao pode parar (24/7)
+ Equipe de infra dedicada
+ Orcamento para AWS/infra robusta
= Self-hosted com DB separado, redundancia, monitoring
⚠ Custo de infra pode SUPERAR o cloud
```

### Cloud

```
Sem equipe de infra
OU processo critico que nao pode cair
OU volume dentro dos limites do plano
OU custo-beneficio melhor que manter infra propria
= Cloud (n8n gerencia tudo)
```

## Riscos do self-hosted

1. **VPS unica = ponto unico de falha** — se a VPS cair, todas as automacoes param, porque n8n, banco de dados e processamento estao na mesma maquina
2. **Escalar custa caro** — separar banco da aplicacao, usar AWS, configurar redundancia exige conhecimento e investimento
3. **Manutencao continua** — atualizacoes, backups, monitoramento sao responsabilidade da equipe

## Heuristics

| Situacao | Decisao |
|----------|---------|
| Aprendizado/desenvolvimento local | Self-hosted no proprio computador |
| MVP ou projeto pequeno, nao critico | Self-hosted em VPS barata |
| Producao critica (ex: vendas) sem equipe de infra | Cloud |
| Producao critica COM equipe de infra | Self-hosted com arquitetura robusta |
| Empresa sem conhecimento de Linux/Docker | Cloud sempre |
| Volume > 40.000 execucoes/mes | Self-hosted (cloud fica caro) ou plano Enterprise |

## Anti-patterns

| Erro comum | Correto |
|------------|---------|
| Escolher self-hosted so porque e gratis | Analisar custo total (infra + manutencao + risco) |
| Colocar producao critica em VPS unica sem redundancia | Separar DB da aplicacao, configurar monitoramento |
| Ignorar custo de infra ao escalar self-hosted | Comparar custo real de infra vs plano cloud equivalente |
| Ir pro cloud sem calcular volume de execucoes | Estimar execucoes mensais antes de escolher plano |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
