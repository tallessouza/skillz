---
name: rs-agentes-ia-n8n-memoria-parte-1
description: "Applies memory configuration to n8n AI agents using Redis. Use when user asks to 'add memory to agent', 'configure Redis in n8n', 'make agent remember context', 'setup chat memory', or 'agent forgets previous messages'. Guides through the input-processing-output flow and Redis credential setup via EasyPanel. Make sure to use this skill whenever building conversational n8n agents that need context retention. Not for Postgres memory, Motorhead memory, or non-n8n agent architectures."
---

# Memória para Agentes de IA no n8n (Redis)

> Sem memória, um agente de IA é apenas uma chamada de API — adicionar Redis transforma-o num agente conversacional que retém contexto.

## Conceito fundamental

Um agente sem memória segue o ciclo: entrada → processamento → saída, mas cada interação é isolada. O agente não sabe o que foi dito antes. Memória conecta as interações, permitindo que o agente se comporte como uma pessoa numa conversa.

## Fluxo entrada-processamento-saída

```
Chat Input (user message)
    │
    ▼
AI Agent Node
    ├── System Message (prompt configurado)
    ├── User Message ($json.chatInput)
    └── Memory (Redis) ← retém histórico
    │
    ▼
OpenAI API (processa system + user + histórico)
    │
    ▼
Chat Output (resposta ao usuário)
```

O prompt enviado à API é composto de camadas:
1. **System message** — prompt configurado no agente
2. **User message** — vem do `$json.chatInput` (bloco anterior)
3. **Histórico** — mensagens anteriores recuperadas da memória

## Steps

### Step 1: Configurar o modelo de chat

1. Adicionar node **OpenAI Chat Model** ao agente
2. Selecionar credenciais OpenAI existentes
3. Escolher modelo (ex: `gpt-4.1-mini`)
4. Nenhuma configuração adicional necessária

### Step 2: Verificar o problema sem memória

Testar o agente enviando:
1. "Eu sou o Bruno"
2. "Qual a capital do Japão?" → responde corretamente
3. "Qual é meu nome?" → **não sabe** (sem memória)

Isso confirma que o agente está funcionando como chamada de API simples.

### Step 3: Criar servidor Redis no EasyPanel

1. Acessar EasyPanel → projeto atual
2. **Adicionar novo serviço** → selecionar **Redis**
3. Configurar nome e senha
4. Aguardar status ficar verde
5. Copiar credenciais exibidas: host interno, porta, senha, URL de conexão

### Step 4: Configurar memória Redis no n8n

1. No agente n8n, clicar no bloco **Memory**
2. Selecionar **Redis** entre as opções (Simple Memory, Motorhead, Postgres, Redis)
3. Criar nova credencial Redis com dados do EasyPanel:
   - **Password**: senha configurada no EasyPanel
   - **Host**: host interno (ex: `aula-aula`)
   - **Port**: porta padrão do Redis
4. Salvar credencial

## Opções de memória disponíveis no n8n

| Tipo | Quando usar |
|------|-------------|
| **Simple Memory** | Testes rápidos, sem persistência |
| **Redis** | Produção, rápido, leve, recomendado para agentes conversacionais |
| **Postgres** | Quando já usa Postgres no projeto |
| **Motorhead** | Alternativa gerenciada |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Deixar agente sem memória em produção | Sempre configurar uma estrutura de memória |
| Usar credenciais de produção em ambiente de teste | Criar servidor Redis separado para desenvolvimento |
| Ignorar o status vermelho do node de memória | Verificar e configurar credenciais antes de testar |

## Verificação

- Enviar "Eu sou [nome]" → perguntar "Qual meu nome?" → agente deve lembrar
- Verificar nos logs do agente que o histórico aparece no input

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
