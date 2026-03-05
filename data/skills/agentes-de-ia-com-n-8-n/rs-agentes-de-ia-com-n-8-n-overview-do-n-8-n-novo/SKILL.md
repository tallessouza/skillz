---
name: rs-agentes-ia-n8n-overview-do-n8n
description: "Guides n8n workspace setup and interface navigation when starting with n8n automations. Use when user asks to 'create n8n workflow', 'start with n8n', 'setup n8n', 'navigate n8n interface', or 'connect n8n nodes'. Covers cloud account creation, node categories, trigger types, and block connection logic. Make sure to use this skill whenever the user is beginning their first n8n project or exploring the n8n interface. Not for advanced workflow building, self-hosting infrastructure, or specific node configuration."
---

# Overview do N8N

> Toda automacao no n8n e uma cadeia de blocos (nos) conectados: trigger → processamento → saida.

## Conceito central

O n8n funciona como um canvas visual onde blocos (nos) se conectam formando workflows. Cada bloco tem entrada e saida. A logica e sempre: um evento dispara (trigger), dados fluem pelos blocos, cada bloco processa e passa adiante.

## Setup rapido (Cloud)

### Criar conta
1. Acessar n8n.io → Get Started → criar conta gratuita
2. Trial de 14 dias na versao Cloud (sem instalacao)
3. Preencher onboarding (telas podem mudar, nao se apegar ao layout)
4. Workspace pronto → comecar a criar workflows

### Alternativa: Self-hosted
- Community Edition gratuita no GitHub
- Documentacao com passo a passo de deploy
- Usar Cloud para aprendizado, self-hosted para producao

## Anatomia da interface

| Elemento | Onde | Funcao |
|----------|------|--------|
| Menu lateral | Esquerda | Projetos, perfis, configuracoes, templates, variaveis |
| Canvas central | Centro | Workspace visual para conectar blocos |
| Botao "+" | Centro ou lateral | Adicionar novos nos ao workflow |
| Open Notes Panel | Seta lateral | Painel completo com todos os nos disponiveis |

## Categorias de nos

| Categoria | O que contem | Quando usar |
|-----------|-------------|-------------|
| **Triggers** | Gatilhos iniciais (manual, schedule, webhook, chat) | Sempre o primeiro bloco do workflow |
| **App Nodes** | Milhares de integracoes nativas (ActiveCampaign, etc.) | Conectar com servicos externos |
| **AI** | Agentes, chains, modelos (OpenAI, Anthropic, Gemini) | Adicionar inteligencia artificial ao fluxo |
| **Data Transformation** | Codigo, variaveis, remocao de duplicados | Manipular dados entre blocos |
| **Flow** | Condicionais, loops, merge, switch, wait | Controlar o fluxo de execucao |
| **Core** | HTTP Request, formularios, Human in the Loop | Chamar APIs externas, aprovar etapas manualmente |

## Logica de construcao

```
[Trigger] → [Bloco A] → [Bloco B] → [Bloco N]
   ↑            ↑            ↑
 Disparo    Processar    Processar
             entrada       entrada
              gerar         gerar
              saida         saida
```

### Regra fundamental
Cada bloco tem **processamento de entrada** e **processamento de saida**. Conectar blocos sem configurar credenciais e campos nao funciona — a conexao visual e so o inicio.

## Tipos de trigger

| Trigger | Disparo |
|---------|---------|
| Manual | Clique do usuario |
| Schedule | De tempos em tempos (cron) |
| Webhook | Chamada HTTP externa |
| Chat | Mensagem recebida |

## Human in the Loop

Automacoes podem pausar e aguardar aprovacao humana antes de continuar. Usar quando:
- Decisao critica precisa de validacao
- Conteudo gerado por IA precisa de revisao
- Acao irreversivel (envio de email em massa, delete)

## Heuristics

| Situacao | Faca |
|----------|------|
| Aprendendo n8n | Use Cloud (trial 14 dias), nao perca tempo com infra |
| Precisa chamar API sem integracao nativa | Use o no HTTP Request (categoria Core) |
| Quer IA no workflow | Categoria AI → agentes, chains, modelos prontos |
| Fluxo precisa de condicional | Categoria Flow → Switch, IF |
| Dados precisam de limpeza | Categoria Data Transformation |

## Anti-patterns

| Nao faca | Faca instead |
|----------|--------------|
| Conectar blocos sem configurar campos | Configure credenciais e campos antes de testar |
| Comecar pela instalacao local | Use Cloud para aprender, self-host depois |
| Tentar construir tudo de uma vez | Comece com trigger + 1 bloco, teste, expanda |
| Ignorar categorias de nos | Navegue pelas categorias para descobrir blocos uteis |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
