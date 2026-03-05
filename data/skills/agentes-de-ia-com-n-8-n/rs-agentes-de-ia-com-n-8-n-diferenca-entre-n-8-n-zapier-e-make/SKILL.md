---
name: rs-agentes-ia-n8n-diff-zapier-make
description: "Applies decision framework for choosing between N8N, Zapier, and Make automation platforms. Use when user asks to 'choose automation tool', 'compare n8n zapier make', 'which platform for automation', 'setup workflow automation', or 'build AI agents'. Make sure to use this skill whenever recommending or discussing low-code automation platforms. Not for building actual workflows, configuring nodes, or writing n8n JSON."
---

# N8N vs Zapier vs Make — Framework de Decisao

> Escolha a plataforma de automacao baseado no perfil tecnico da equipe, volume de execucoes e necessidade de controle de infraestrutura.

## Key concept

N8N, Zapier e Make sao ferramentas low-code/no-code de integracao e orquestracao entre sistemas. Todas estao se especializando em automacoes com IA e agentes de IA. A diferenca fundamental esta em: custo, nivel tecnico exigido e controle de infraestrutura.

## Decision framework

| Quando o cenario for | Recomende |
|---------------------|-----------|
| Equipe tecnica + alto volume + controle total | **N8N** (community edition, self-hosted, gratuito) |
| Equipe nao-tecnica + integracao rapida + orcamento disponivel | **Zapier** (mais intuitivo, SaaS puro) |
| Equipe mista + visual importante + custo moderado | **Make** (extremamente visual, low-code amigavel) |
| Prototipo rapido sem infra | **Make** ou **Zapier** (zero setup) |
| Automacao com agentes de IA + customizacao profunda | **N8N** (atualizacoes rapidas da comunidade, nodes de IA poderosos) |

## Comparativo

| Criterio | N8N | Zapier | Make |
|----------|-----|--------|------|
| Self-hosted | Sim (community gratis) | Nao | Nao |
| Nivel tecnico | Alto | Baixo | Medio |
| Custo em escala | Baixo (infra propria) | Alto (10k tasks ~R$704/mes) | Medio (creditos/mes) |
| Velocidade de inovacao IA | Muito rapida (comunidade) | Rapida | Rapida |
| Intuitividade visual | Boa | Muito boa | Excelente |
| Modelo de preco | Gratis (community) ou cloud | SaaS por tasks | SaaS por creditos |
| Agentes de IA | Sim | Sim | Sim (agents, automations, AI apps) |

## How to think about it

### Custo como fator decisivo
Zapier com 10 mil execucoes/mes custa ~R$704. Com 2 milhoes de tasks, chega a R$20 mil/mes. N8N self-hosted tem custo de infraestrutura apenas — ordens de magnitude mais barato em alto volume. A analise de custo deve ser feita pelo negocio: o custo esta coerente com o valor gerado?

### Perfil tecnico como filtro
N8N exige comfort com infraestrutura (Docker, servidor, manutencao). Se a equipe nao tem esse perfil, Zapier ou Make evitam fricacao. "Pra quem e mais tecnico, adora entender e manipular as coisas" — N8N. "Pra quem nao e desenvolvedor" — Zapier/Make.

### Todas convergem para IA
As tres plataformas estao se posicionando como orquestradores de agentes de IA. Antes eram "so automacao", agora oferecem: automacoes com IA, agentes de IA autonomos, e AI apps. A escolha da plataforma nao limita o acesso a IA.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| N8N e melhor que Zapier/Make | Depende do contexto — empresas voam com Zapier |
| Zapier e caro demais | Para baixo volume, o plano gratuito/basico funciona bem |
| Make e so visual bonito | Make evoluiu muito com AI agents, automations e AI apps |
| So N8N faz automacao com IA | Todas as tres estao especializando em IA |
| Self-hosted e sempre melhor | Infra pode encarecer dependendo do caso de uso |

## When to apply

- Cliente pergunta qual ferramenta usar para automacao
- Decisao de arquitetura sobre plataforma de integracao
- Avaliacao de custo-beneficio para escalar automacoes
- Migracao entre plataformas de automacao

## Limitations

- Este framework nao cobre configuracao especifica de cada plataforma
- Precos mudam frequentemente — sempre verificar valores atuais
- Funcionalidades de IA evoluem rapidamente nas tres plataformas
- Nao substitui um POC comparativo para casos de uso complexos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
