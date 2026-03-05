---
name: rs-agentes-ia-n8n-trigger-agente
description: "Applies correct trigger configuration when building AI agents in n8n. Use when user asks to 'create an n8n agent', 'configure chat trigger', 'connect webhook to agent', 'build AI workflow in n8n', or 'set up n8n AI engine'. Enforces the pattern: chat trigger for testing, webhook for production. Make sure to use this skill whenever building or reviewing n8n AI agent workflows. Not for n8n workflows without AI agents, nor for external chatbot platforms."
---

# Trigger para Agente de IA no n8n

> Use chat trigger para testar, webhook para produzir — nunca exponha o n8n diretamente ao usuario final.

## Rules

1. **Use o no AI Engine para agentes internos ao n8n** — construa o agente inteiro dentro do n8n sem ferramentas externas, porque simplifica o deploy e mantem tudo no mesmo runtime
2. **Chat trigger e somente para teste** — nunca use chat trigger em producao, porque usuarios finais nao podem acessar o n8n diretamente
3. **Webhook e o trigger de producao** — substitua chat trigger por webhook para receber requisicoes externas (WhatsApp, Telegram, etc.), porque permite qualquer integracao via URL
4. **Conecte o modelo antes de testar** — o agente exige um chat model conectado nos sub-nos, porque sem ele o erro "Chat model must be connected" bloqueia a execucao
5. **Configure o prompt no no do agente** — defina o system prompt diretamente no parametro do AI Engine, porque e ali que o contexto do assistente e injetado

## How to write

### Estrutura basica do workflow

```
[Chat Trigger] → [AI Agent (AI Engine)]
                       ├── Chat Model (obrigatorio)
                       ├── Tools (opcional)
                       └── Memory (opcional)
```

### Prompt do agente

```
Voce e um assistente especialista em {dominio}.
{instrucoes especificas do comportamento}
```

### Fluxo de producao com webhook

```
[Webhook (POST)] → [AI Agent] → [Respond to Webhook]
       ↑                                    │
       └──── WhatsApp/Telegram/App ←────────┘
```

## Example

**Before (erro comum — sem chat model):**
```
Chat Trigger → AI Agent (sem sub-nos conectados)
Resultado: "Chat model must be connected to be enabled"
```

**After (configuracao correta):**
```
Chat Trigger → AI Agent
                  └── OpenAI Chat Model (conectado)
                  └── Prompt: "Voce e um assistente especialista financeiro..."
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Testando o agente localmente | Use chat trigger + Open Chat |
| Integrando com WhatsApp/Telegram | Substitua por webhook |
| Erro "Chat model must be connected" | Conecte um chat model ao no do agente |
| Quer chat publico temporario | Ative "tornar chat publicamente disponivel" no trigger |
| Precisa devolver resposta ao servico externo | Use Respond to Webhook apos o agente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar chat trigger em producao | Webhook com URL apontada pelo servico externo |
| Tentar rodar agente sem chat model | Conectar OpenAI/Anthropic chat model antes de testar |
| Expor n8n diretamente ao usuario final | Webhook como intermediario |
| Usar trigger de clique para agente de chat | Chat trigger (teste) ou webhook (producao) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
