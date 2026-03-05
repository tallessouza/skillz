---
name: rs-agentes-ia-n8n-o-que-e-n8n
description: "Applies n8n platform mental model when designing automations or discussing workflow tools. Use when user asks to 'connect systems', 'automate a process', 'build a workflow', 'integrate apps', or mentions 'n8n'. Clarifies n8n as an integration layer (not a backend replacement), explains input-processing-output pattern, and positions n8n within a dev stack. Make sure to use this skill whenever n8n architecture decisions arise. Not for building actual n8n workflows, writing n8n node code, or deploying n8n instances."
---

# O que e o N8N

> N8n e uma ferramenta de integracao que conecta sistemas distintos atraves de workflows visuais, seguindo sempre o padrao entrada-processamento-saida.

## Key concept

N8n (pronuncia-se "n-eight-n" em ingles) e uma plataforma de automacao de workflows — processos de trabalho. O nome remete a "nos" (nodes), conexoes entre pontos. A analogia central: **N conecta com N** — qualquer sistema com qualquer outro sistema.

N8n nao e apenas uma ferramenta de IA. Agentes de IA sao um caso de uso popular, mas o proposito central e **automacao de processos e integracao entre sistemas**, com ou sem IA.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Preciso conectar sistema A com sistema B | N8n como camada de integracao no meio |
| Preciso de um agente de IA com integracoes | N8n como orquestrador do agente + conexoes |
| Preciso de um backend completo com logica de negocio complexa | Linguagem de programacao — n8n nao substitui backend |
| Processo manual repetitivo (copiar dados, enviar emails) | Candidato perfeito para workflow n8n |
| Preciso de blocos visuais mas com trechos de codigo | N8n suporta blocos de codigo dentro do workflow |

## How to think about it

### Padrao fundamental: Entrada → Processamento → Saida

Todo workflow n8n segue este padrao. Exemplo: formulario (entrada) → agente de IA analisa (processamento) → envia no Slack (saida). Outro exemplo: novo cadastro no sistema (entrada) → bloco de codigo extrai e transforma dados (processamento) → devolve ao sistema de origem (saida).

### Posicionamento na stack

N8n e um **elemento de arquitetura** — ele fica no meio, conectando sistemas distintos. Nao e um substituto para backend, mas e um substituto para scripts de integracao e automacoes manuais. Equipes tecnicas se beneficiam mais porque precisam entender: integracoes, requisicoes HTTP, APIs, webhooks.

### Flexibilidade: blocos visuais + codigo

Apesar da interface visual com "bloquinhos", n8n permite blocos de codigo dentro do workflow. Isso o torna acessivel para quem nao e tecnico, mas poderoso para quem e.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| N8n e so para fazer agentes de IA | IA e um caso de uso popular, mas n8n e primariamente uma ferramenta de integracao e automacao |
| N8n substitui programacao backend | N8n substitui scripts de integracao, nao logica de negocio complexa |
| Precisa ser programador para usar | Interface visual com blocos, mas conhecimento de APIs/webhooks ajuda muito |
| N8n e so para coisas simples | Suporta workflows complexos com codigo, condicoes e multiplas integracoes |

## When to apply

- Ao decidir se uma integracao deve ser feita via codigo ou via n8n
- Ao arquitetar uma solucao que envolve multiplos sistemas
- Ao avaliar se n8n cabe na stack de um projeto
- Ao explicar para alguem o que e n8n e onde ele se encaixa

## Limitations

- Nao substitui backend com logica de negocio complexa
- Requer conhecimento tecnico minimo (APIs, webhooks, requisicoes)
- Nao e a melhor escolha para processamento de dados em larga escala com requisitos de performance criticos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
