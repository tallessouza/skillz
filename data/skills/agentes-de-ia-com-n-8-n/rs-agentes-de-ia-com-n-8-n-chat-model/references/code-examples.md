# Code Examples: Chat Model no N8N

## Nota sobre exemplos

Esta aula e focada em configuracao visual no n8n (low-code), nao em codigo. Os "exemplos" sao configuracoes de nodes.

## Configuracao 1: OpenAI como Chat Model

```json
{
  "node": "Chat Model - OpenAI",
  "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
  "parameters": {
    "model": "gpt-4o-mini",
    "options": {}
  },
  "credentials": {
    "openAiApi": "OpenAI Account"
  }
}
```

## Configuracao 2: Anthropic como Chat Model

```json
{
  "node": "Chat Model - Anthropic",
  "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
  "parameters": {
    "model": "claude-sonnet-4-20250514",
    "options": {}
  },
  "credentials": {
    "anthropicApi": "Anthropic Account"
  }
}
```

## Configuracao 3: Google Gemini como Chat Model

```json
{
  "node": "Chat Model - Google Gemini",
  "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
  "parameters": {
    "model": "gemini-pro",
    "options": {}
  },
  "credentials": {
    "googleGeminiApi": "Google Gemini Account"
  }
}
```

## Arquitetura do fluxo completo

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Chat Input  │────▶│    AI Agent       │────▶│     Output      │
│ (temporario) │     │ (prompt definido) │     │                 │
└─────────────┘     └────────┬─────────┘     └─────────────────┘
                             │
                    ┌────────┴─────────┐
                    │   Chat Model     │
                    │ (qualquer LLM)   │
                    └──────────────────┘
```

## Comparacao: AI Agent vs OpenAI Assistant

```
FLEXIVEL (recomendado):
Chat Input → AI Agent → [Chat Model: OpenAI/Anthropic/Gemini/DeepSeek] → Output
                ↑
           Prompt definido no Agent
           Troca de modelo = trocar 1 node

INFLEXIVEL (evitar):
Chat Input → OpenAI Assistant → Output
                ↑
           Assistant criado na OpenAI
           Preso ao ecossistema GPT
```

## Opcoes de parametros disponiveis

```json
{
  "options": {
    "frequencyPenalty": 0,
    "maxTokens": 4096,
    "responseFormat": "text",
    "temperature": 0.7,
    "timeout": 60000
  }
}
```

O instrutor recomenda nao configurar esses parametros inicialmente — deixe o padrao e ajuste conforme necessidade apos testes.