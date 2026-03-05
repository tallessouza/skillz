# Code Examples: Trigger para Agente de IA no n8n

## Exemplo 1: Prompt basico do assistente financeiro

Prompt usado na aula:
```
Voce e um assistente especialista financeiro e que fala tudo sobre cambio.
```

Este e um prompt minimalista para fins de demonstracao. Em producao, expanda com:
```
Voce e um assistente especialista financeiro.
Suas responsabilidades:
- Fornecer cotacoes atualizadas de moedas
- Explicar tendencias de cambio
- Responder duvidas sobre conversao de moedas

Regras:
- Sempre cite a fonte da cotacao
- Se nao souber a cotacao atual, informe que precisa consultar uma API
- Responda em portugues brasileiro
```

## Exemplo 2: Configuracao visual do workflow (teste)

```
Nos no canvas:
1. Chat Trigger (inicio)
   - Configuracao: padrao, sem opcoes especiais
   - Salvar → Open Chat para testar

2. AI Agent (AI Engine)
   - Prompt: "Voce e um assistente especialista financeiro..."
   - Sub-nos conectados:
     └── Chat Model: OpenAI GPT (obrigatorio)
```

## Exemplo 3: Configuracao visual do workflow (producao)

```
Nos no canvas:
1. Webhook (POST)
   - URL: https://seu-n8n.com/webhook/agente-financeiro
   - Metodo: POST
   - Body esperado: { "message": "texto do usuario", "userId": "123" }

2. AI Agent (AI Engine)
   - Input: {{ $json.body.message }}
   - Prompt: system prompt completo
   - Sub-nos:
     └── Chat Model: OpenAI GPT
     └── Tools: API de cotacao
     └── Memory: Window Buffer (opcional)

3. Respond to Webhook
   - Body: {{ $json.output }}
```

## Exemplo 4: Integracao WhatsApp (fluxo conceitual)

```
WhatsApp (usuario envia mensagem)
    │
    ▼
API do WhatsApp (Evolution API / Z-API / oficial)
    │
    ▼ POST com mensagem
Webhook n8n (recebe)
    │
    ▼
AI Agent (processa com LLM)
    │
    ▼
Respond to Webhook (devolve resposta)
    │
    ▼
API do WhatsApp (envia resposta ao usuario)
```

## Erros comuns e resolucao

### Erro: "Chat model must be connected to be enabled"
```
Causa: No AI Agent sem chat model conectado
Solucao: Conectar um no de Chat Model (OpenAI, Anthropic, etc.) ao AI Agent
```

### Erro: Chat trigger nao responde
```
Causa: Workflow nao foi salvo antes de abrir o chat
Solucao: Salvar o workflow → depois clicar em Open Chat
```