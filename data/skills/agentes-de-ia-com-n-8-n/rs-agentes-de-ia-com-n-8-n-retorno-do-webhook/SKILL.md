---
name: rs-agentes-ia-n8n-retorno-do-webhook
description: "Applies n8n webhook response patterns when building webhook flows in n8n. Use when user asks to 'create a webhook', 'return data from webhook', 'respond to webhook in n8n', 'build an API endpoint in n8n', or 'configure webhook response'. Ensures correct use of Respond to Webhook node, proper webhook respond mode configuration, and understanding of webhook vs automation vs AI agent layers. Make sure to use this skill whenever creating n8n workflows that receive and respond to HTTP requests. Not for general n8n automation triggers, scheduled workflows, or app-to-app integrations without webhooks."
---

# Retorno do Webhook no n8n

> Ao construir webhooks no n8n, configure sempre o par Webhook + Respond to Webhook para garantir que a requisicao receba resposta com os dados processados.

## Rules

1. **Sempre use o no Respond to Webhook para retornar dados** — nao basta processar, o webhook precisa devolver a resposta ao chamador, porque sem esse no a requisicao fica pendurada ou retorna vazio
2. **Configure o Webhook para usar Respond to Webhook node** — no no Webhook, mude a opcao "Respond" para "Using Respond to Webhook Node", porque um lado precisa do outro para funcionar
3. **Entenda as 3 camadas de complexidade** — webhook (endpoint HTTP), automacao (app-to-app), agente de IA (usa webhooks + inteligencia), porque cada uma tem proposito diferente
4. **Respond to Webhook retorna o ultimo item por padrao** — ele pega o conteudo que chega do no anterior e devolve ao chamador, com opcao de retornar primeiro item ou todos os itens
5. **Teste sempre com uma ferramenta HTTP** — use Postman, Insomnia ou curl para validar que o webhook recebe e retorna corretamente, porque erros de configuracao so aparecem no teste real

## How to write

### Flow completo de webhook com resposta

```
[Webhook] → [Edit Fields] → [HTTP Request] → [Respond to Webhook]
```

Configuracao do Webhook (no inicial):
- Method: POST (ou GET conforme necessidade)
- Respond: **Using Respond to Webhook Node** (obrigatorio)

Configuracao do Respond to Webhook (no final):
- Respond With: First Incoming Item (padrao) ou All Incoming Items
- Nenhuma configuracao adicional necessaria na maioria dos casos

## Example

**Before (erro comum — webhook sem resposta):**
```
[Webhook (respond: immediately)] → [Edit Fields] → [HTTP Request]
// Problema: retorna apenas confirmacao de recebimento, sem dados processados
// O Postman recebe: { "message": "Workflow was started" }
```

**After (com Respond to Webhook):**
```
[Webhook (respond: Using Respond to Webhook Node)] → [Edit Fields] → [HTTP Request] → [Respond to Webhook]
// O Postman recebe: dados completos da API externa processados
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa retornar dados processados ao chamador | Use Respond to Webhook como ultimo no |
| Webhook so precisa confirmar recebimento | Mantenha respond: immediately (padrao) |
| Multiplos itens processados | Configure Respond to Webhook para "All Incoming Items" |
| Webhook funciona no teste mas nao retorna dados | Verifique se Respond esta setado como "Using Respond to Webhook Node" |
| Construindo um "backend" com n8n | Webhook + processamento + Respond to Webhook e o padrao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deixar webhook com "respond immediately" quando precisa retornar dados | Mude para "Using Respond to Webhook Node" |
| Esquecer o no Respond to Webhook no final do fluxo | Sempre adicione como ultimo no quando o chamador precisa da resposta |
| Tentar retornar dados sem o par Webhook ↔ Respond to Webhook | Configure ambos os nos — um depende do outro |
| Chamar de "automacao" quando e um webhook/endpoint | Webhook = endpoint HTTP, automacao = app-to-app (ex: formulario → CRM) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
