---
name: rs-agentes-ia-n8n-componentes-agente
description: "Applies N8N AI Agent node architecture when building AI agents in N8N workflows. Use when user asks to 'create an n8n agent', 'build AI workflow', 'configure AI agent node', 'setup n8n AI', or 'add intelligence to n8n workflow'. Covers AI Agent node structure (system message, user prompt, chat model, memory, tools), prompt layering, and why to build everything inside N8N. Make sure to use this skill whenever configuring AI Agent nodes in N8N. Not for n8n triggers, non-AI nodes, or external AI platform configuration."
---

# Componentes de Agente de IA no N8N

> Construa agentes de IA inteiramente dentro do N8N usando o no AI Agent, evitando dependencias externas que aumentam complexidade e manutencao.

## Key concept

O N8N possui uma categoria dedicada chamada **Advanced AI** que contem nos especializados para IA. O no principal e o **AI Agent**, que encapsula toda a logica do agente: prompt do sistema, prompt do usuario, modelo, memoria e ferramentas — tudo configurado internamente, sem plataformas externas.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Precisa de agente com memoria, tools e prompt complexo | Use o no **AI Agent** |
| Precisa apenas enviar mensagem simples para modelo | Use o no **OpenAI** (message to model) |
| Tentado a usar plataforma externa de agentes | Pare — construa dentro do N8N primeiro, porque menos sistemas = menos manutencao |
| Precisa de geracao de imagem, audio ou arquivos | Use o no **OpenAI** (tem acoes especificas para cada tipo) |

## Arquitetura do no AI Agent

### Tres camadas de funcionalidade

```
AI Agent Node
├── Chat Model    → Qual LLM usar
├── Memory        → Contexto de conversas anteriores
└── Tools         → Ferramentas que o agente pode usar
```

### Duas camadas de prompt

```
┌─────────────────────────────┐
│  System Message (prompt base) │  ← Configurado em Options > System Message
│  Define comportamento do agente│
├─────────────────────────────┤
│  User Message (prompt usuario) │  ← Vem do trigger via variavel chatInput
│  A pergunta/comando do usuario │
└─────────────────────────────┘
         │
         ▼
   Enviados juntos ao LLM escolhido
```

### Configuracao essencial

```
1. Trigger (obrigatorio) → envia mensagem ao AI Agent
2. AI Agent recebe em: {{ $json.chatInput }}
3. System Message fica em: Options > System Message
4. Chat Model: conectar modelo (OpenAI, etc)
5. Memory: opcional, para contexto de conversa
6. Tools: opcional, para acoes do agente
```

## How to think about it

### AI Agent vs OpenAI node

O **AI Agent** e um orquestrador completo — tem memoria, ferramentas e prompt do sistema. O **OpenAI** e um executor direto — envia mensagem e recebe resposta, sem orquestracao.

Pessoas que usam o no errado complicam mais do que ajudam. Use AI Agent quando precisa de um agente real com comportamento configuravel. Use OpenAI quando precisa de uma chamada simples ao modelo.

### Por que tudo dentro do N8N

Cada plataforma externa adicionada significa: mais uma integracao, mais uma configuracao, mais manutencao. O N8N como integrador ja tem capacidade de construir o agente internamente. Sistemas segregados sao bons por um lado, mas cada conexao extra e demanda de manutencao.

## Heuristics

| Situacao | Faca |
|----------|------|
| System message nao aparece no AI Agent | Esta escondido em Options > System Message |
| AI Agent sem trigger conectado | Nao funciona — precisa de trigger enviando chatInput |
| Precisa de assistente OpenAI | Use no OpenAI com acao "Create Assistant" |
| Quer mudar tema do N8N | Settings > Personal > Light/Dark mode |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Usar plataforma externa para prompt quando N8N resolve | Configure system message direto no AI Agent |
| Deixar AI Agent sem trigger | Sempre conecte um trigger que envie chatInput |
| Procurar campo "prompt" na tela principal do AI Agent | Va em Options > System Message |
| Usar OpenAI node quando precisa de memoria e tools | Use AI Agent node |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
