---
name: rs-agentes-ia-n8n-chat-model
description: "Applies n8n Chat Model configuration patterns when building AI agents in n8n. Use when user asks to 'connect an LLM', 'configure chat model', 'switch AI model in n8n', 'set up OpenAI in n8n', or 'build an n8n agent'. Covers model selection, credential setup, cost-performance balancing, and the flexibility advantage of n8n's AI Agent node over OpenAI Assistants. Make sure to use this skill whenever configuring or recommending LLM connections in n8n workflows. Not for coding custom API integrations, prompt engineering, or n8n nodes unrelated to AI models."
---

# Chat Model no N8N

> Ao configurar agentes de IA no n8n, use o no AI Agent com Chat Model para maxima flexibilidade na troca de LLMs.

## Rules

1. **Use AI Agent, nao OpenAI Assistant** — o no AI Agent permite trocar qualquer LLM (OpenAI, Gemini, Anthropic, DeepSeek) sem retrabalho, porque o Assistant node te prende a um unico provider
2. **Balanceie custo vs performance** — teste multiplos modelos antes de decidir, porque cada LLM tem trade-offs diferentes de qualidade e preco por token
3. **Configure credenciais antes do modelo** — cada Chat Model exige uma credencial (API key) associada a um projeto/organizacao do provider
4. **Comece com modelos mais baratos** — use GPT-4o-mini ou equivalente primeiro, suba para modelos maiores apenas se a performance nao atender, porque tokens custam dinheiro
5. **Deixe parametros como padrao inicialmente** — temperature, max tokens, frequency penalty podem ser ajustados depois, porque o padrao funciona para a maioria dos casos iniciais

## Como configurar

### Adicionar Chat Model ao AI Agent

1. Dentro do no AI Agent, clique no campo **Chat Model**
2. Clique no botao **+** para ver todos os modelos disponiveis
3. Selecione o provider (OpenAI, Anthropic, Google Gemini, DeepSeek, etc.)
4. Configure a credencial (API key do provider)
5. Selecione o modelo especifico (ex: `gpt-4o-mini`)
6. Opcionalmente ajuste parametros em **Options**

### Trocar de modelo

1. Remova o Chat Model atual (desconecte a bolinha)
2. Adicione novo Chat Model de qualquer provider
3. Configure credencial + modelo
4. Teste — o agente funciona igual com qualquer LLM

## Parametros disponiveis

| Parametro | O que faz |
|-----------|-----------|
| Temperature | Controla criatividade (0 = deterministico, 1 = criativo) |
| Max Tokens | Limite de tokens na resposta |
| Frequency Penalty | Penaliza repeticao de palavras |
| Response Format | Formato da saida (text, JSON) |
| Timeout | Tempo maximo de espera |

## Example

**Antes (OpenAI Assistant — inflexivel):**
```
Chat Input → OpenAI Assistant Node → Output
```
Problema: preso ao GPT. Se performance ruim ou custo alto, sem alternativa.

**Depois (AI Agent + Chat Model — flexivel):**
```
Chat Input → AI Agent (prompt definido) → Chat Model (qualquer LLM) → Output
```
Vantagem: troca o Chat Model em segundos, zero codigo.

## Heuristics

| Situacao | Faca |
|----------|------|
| Comecando um agente novo | Use GPT-4o-mini como primeiro teste |
| Respostas ruins com modelo atual | Troque o Chat Model para outro provider |
| Custo alto demais | Teste modelos menores ou providers mais baratos (DeepSeek, Gemini) |
| Precisa de qualidade maxima | Use GPT-4o, Claude Sonnet, ou Gemini Pro |
| API do provider mudou | N8n absorve a mudanca — so atualize o n8n |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar OpenAI Assistant node para agentes flexiveis | Use AI Agent node + Chat Model |
| Fixar um unico modelo sem testar outros | Teste 2-3 modelos antes de decidir |
| Configurar todos os parametros avancados de inicio | Comece com padrao, ajuste depois |
| Codificar integracoes de API manualmente | Use os Chat Model nodes do n8n |
| Escolher modelo so por ser "o melhor" | Balanceie custo vs performance para seu caso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
