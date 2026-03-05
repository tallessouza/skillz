---
name: rs-agentes-ia-n8n-onde-entra-stack
description: "Applies n8n architectural positioning when designing system stacks or automation solutions. Use when user asks to 'build a backend', 'create an automation', 'design system architecture with n8n', 'replace backend code', or 'integrate frontend with n8n'. Guides decisions about when n8n replaces traditional backend languages. Make sure to use this skill whenever architecting solutions that involve n8n as a backend layer. Not for n8n node configuration, workflow building, or frontend development."
---

# Onde o N8N Entra na Stack

> O n8n e uma plataforma de backend low-code que substitui a necessidade de programar em linguagens tradicionais para automacoes, integracoes e agentes de IA.

## Conceito central

Todo aplicativo tem duas camadas: frontend (interface, botoes, telas) e backend (logica, processamento, integracao). O n8n substitui a camada de backend. Em vez de programar em Python, Java, Node.js ou C#, o n8n permite criar essa camada visualmente, com fluxos de trabalho.

## Arquitetura basica

```
┌───────────┐      ┌───────────┐      ┌──────────────┐
│  Frontend  │ ──▶ │   N8N     │ ──▶ │ Base de Dados │
│ (qualquer) │      │ (backend) │      └──────────────┘
└───────────┘      │           │      ┌──────────────┐
                    │           │ ──▶ │  APIs/Sistemas│
                    └───────────┘      │   Externos    │
                                       └──────────────┘
```

## Decision framework

| Situacao | Decisao |
|----------|---------|
| Precisa receber dados do front, processar e salvar | N8n como backend via webhook |
| Precisa integrar com APIs externas sem logica complexa | N8n substitui backend tradicional |
| Logica de negocio extremamente complexa com alta performance | Backend tradicional (Python/Node/Java) |
| Automacao de processos entre sistemas | N8n e a escolha ideal |
| Agentes de IA com orquestracao | N8n como camada de orquestracao |
| Frontend precisa de um endpoint para chamar | N8n expoe webhook como API |

## O que o n8n substitui

O n8n substitui a necessidade de programar backend em:
- **Python** — scripts de automacao, integracao de APIs
- **Java** — backends corporativos simples
- **Node.js** — APIs REST, webhooks, processamento de dados
- **C#** — servicos de integracao

Porque a substituicao funciona: o n8n recebe informacao, processa, e entrega — o ciclo fundamental de qualquer backend.

## O que o n8n NAO substitui

- Frontend (React, Vue, mobile apps) — n8n e invisivel ao usuario final
- Backends com logica de negocio ultra-complexa e requisitos de performance extrema
- Sistemas que precisam de controle granular de memoria, threads ou hardware

## Heuristics

| Situacao | Acao |
|----------|------|
| Usuario quer conectar front com banco de dados | Propor n8n como camada intermediaria |
| Usuario quer criar API sem programar | Usar webhook do n8n como endpoint |
| Usuario precisa de latencia sub-10ms | Recomendar backend tradicional |
| Usuario quer integrar WhatsApp/email/sistemas | N8n como orquestrador |
| Usuario pergunta "preciso saber programar?" | Explicar que n8n e low-code, substitui backend |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar n8n como frontend | N8n e backend — conecte qualquer front a ele |
| Ignorar n8n e sugerir programar tudo do zero | Avaliar se n8n resolve antes de codar |
| Tratar n8n como "apenas automacao" | N8n e uma plataforma de backend low-code completa |
| Conectar frontend direto ao banco sem camada intermediaria | Usar n8n entre front e banco para processar dados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
