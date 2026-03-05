---
name: rs-agentes-ia-n8n-trigger-webhook
description: "Guides webhook trigger setup in n8n workflows. Use when user asks to 'create a webhook', 'set up n8n trigger', 'receive external data in n8n', 'configure endpoint in n8n', or 'start an n8n automation'. Covers trigger types, webhook URL config, HTTP methods, endpoint naming, and testing with Postman. Make sure to use this skill whenever building the first step of any n8n workflow or configuring external data reception. Not for processing nodes, conditional logic, or n8n credential/authentication setup."
---

# Criando uma Trigger Webhook no n8n

> Toda automacao comeca com uma trigger — o webhook e a porta de entrada que recebe dados externos para iniciar o fluxo.

## Rules

1. **Toda automacao comeca com uma trigger** — o primeiro step de qualquer workflow e sempre uma trigger, porque toda automacao depende de um gatilho externo ou temporal
2. **Webhook = carteiro** — um webhook e um endpoint que fica esperando receber dados de sistemas externos, recebe e repassa para o fluxo processar
3. **Nomeie o endpoint pelo dominio** — use `/cotacao`, `/pedido`, `/contato` em vez de nomes aleatorios, porque o path e a identidade do webhook
4. **Use POST para receber dados** — GET para consultas simples, POST quando o sistema externo envia um body com dados estruturados
5. **Ative e salve antes de testar** — a URL de producao so funciona quando o workflow esta salvo E ativo; a URL de teste funciona durante edicao
6. **Teste isolado antes de conectar** — valide a trigger com Postman/curl antes de adicionar nodes de processamento, porque debugar um fluxo inteiro e mais dificil

## Tipos de trigger

| Tipo | Quando usar | Exemplo |
|------|------------|---------|
| **Webhook** | Sistema externo envia dados | Front-end chama endpoint, integracoes |
| **Schedule (tempo)** | Execucao periodica | Todo dia meia-noite, a cada 5 min |
| **App Event** | Evento em aplicativo | Pagina adicionada no Notion |
| **Manual** | Teste ou execucao sob demanda | Clicar botao no n8n |

## How to configure

### Step 1: Adicionar trigger webhook

1. No workflow vazio, clique no primeiro step (trigger)
2. Selecione **On Webhook Call**
3. Configure o metodo HTTP (POST para receber dados)
4. Defina o path do endpoint (ex: `cotacao`)

### Step 2: Entender as URLs

```
URL de teste:    https://seu-n8n.com/webhook-test/cotacao
URL de producao: https://seu-n8n.com/webhook/cotacao
```

- **Teste**: funciona durante edicao, sem precisar ativar o workflow
- **Producao**: exige workflow salvo e ativo

### Step 3: Testar com Postman

```bash
# Ou via curl:
curl -X POST https://seu-n8n.com/webhook/cotacao \
  -H "Content-Type: application/json" \
  -d '{"moeda": "USD"}'
```

Resposta esperada:
```json
{
  "message": "Workflow was executed"
}
# Status: 200 OK
```

## Example

**Antes (workflow sem sentido):**
- Blocos desconectados
- Trigger de tempo ligada ao ActiveCampaign sem logica
- Nenhum dado fluindo

**Depois (webhook configurado):**
1. Trigger webhook com path `/cotacao` e metodo POST
2. Workflow ativo e salvo
3. Postman envia `{"moeda": "USD"}` → Status 200
4. Dados recebidos prontos para o proximo node processar

## Heuristics

| Situacao | Faca |
|----------|------|
| Front-end precisa chamar o n8n | Webhook com POST |
| Rotina diaria/horaria | Schedule trigger |
| Reagir a evento em SaaS (Notion, Stripe) | App event trigger |
| Apenas testando o fluxo | Manual trigger ou URL de teste |
| Webhook nao responde | Verificar se workflow esta ativo E salvo |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deixar path aleatorio no webhook | Nomear pelo dominio: `/cotacao`, `/lead` |
| Testar direto em producao sem validar | Usar URL de teste ou Postman primeiro |
| Criar workflow sem trigger | Sempre comecar pela trigger |
| Usar GET quando envia body com dados | Usar POST para envio de dados |
| Conectar nodes sem testar a trigger | Validar trigger isolada, depois conectar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
