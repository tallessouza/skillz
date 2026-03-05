---
name: rs-n8n-entrada-processamento-saida
description: "Applies the Input-Processing-Output mental model when designing n8n workflows. Use when user asks to 'create a workflow', 'build an automation', 'connect nodes in n8n', 'design a flow', or 'automate a process with n8n'. Ensures every workflow and every individual node follows the Entry-Processing-Exit pattern. Make sure to use this skill whenever designing or reviewing n8n automations. Not for coding, database queries, or non-n8n automation tools."
---

# Entrada - Processamento - Saída

> Todo fluxo no n8n segue a mesma estrutura: dado entra, dado é transformado, dado é enviado — como um carteiro que recebe cartas, identifica o destino e entrega.

## Modelo Mental: O Carteiro

O n8n é um carteiro. Sem carta chegando, ele nao faz nada. Quando uma carta chega, ele identifica o destino, processa e entrega. Essa analogia se aplica em dois niveis:

1. **Nivel macro (workflow inteiro):** Trigger → Nodes de processamento → App de destino
2. **Nivel micro (cada node individual):** Input do node → Transformacao interna → Output do node

## Regras

1. **Todo workflow comeca com um trigger** — sem trigger, nada acontece, porque o carteiro so age quando recebe uma carta
2. **Toda entrada precisa estar conectada a uma saida** — a carta precisa chegar ao destino, nunca deixe nodes desconectados
3. **O processamento transforma o dado entre entrada e saida** — é o "carimbo do carteiro", porque so o orquestrador sabe como adaptar o dado para o destino
4. **Cada node individual tambem tem entrada-processamento-saida** — nao é so o workflow, cada bloco isolado segue a mesma arquitetura
5. **Sem evento de entrada, o workflow fica inerte** — nao tente forcar execucao sem trigger, o carteiro sem carta nao faz nada

## Arquitetura dos Tres Blocos

| Bloco | Categoria n8n | Exemplos |
|-------|--------------|----------|
| **Entrada** | Triggers | Webhooks, app triggers, formularios, schedule, outros sistemas |
| **Processamento** | Flow/Logic + Transform | IF, Switch, Loop, Set, Code, manipulacao de dados, merge |
| **Saida** | Apps/Actions | Enviar email, gravar no banco, postar mensagem, atualizar CRM |

## Como Projetar um Workflow

```
1. Definir o TRIGGER (o que dispara?)
   → Webhook? Schedule? Evento de app?

2. Mapear o PROCESSAMENTO (o que transformar?)
   → Filtrar dados? Formatar? Condicionar?

3. Conectar a SAIDA (para onde vai?)
   → Qual app de destino? Qual acao?
```

## Example

**Antes (workflow sem estrutura clara):**
```
Node HTTP Request → Node Slack
```
Problema: sem trigger, executa manualmente. Dado chega cru no Slack sem formatacao.

**Depois (com entrada-processamento-saida):**
```
[Trigger: Webhook] → [Set: formata mensagem] → [Slack: envia mensagem]
```
O webhook é a carta chegando. O Set é o carimbo do carteiro. O Slack é o destino.

## Heuristics

| Situacao | Faca |
|----------|------|
| Workflow nao executa sozinho | Verifique se tem trigger configurado |
| Dado chega errado no destino | Adicione node de processamento entre entrada e saida |
| Workflow complexo, dificil de entender | Identifique os 3 blocos (E-P-S) em cada trecho |
| Node recebe dado inesperado | Verifique o output do node anterior (cada node tem sua propria E-P-S) |
| Multiplos destinos para mesma entrada | Um trigger → processamento com branch → multiplas saidas |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Workflow sem trigger (execucao manual como padrao) | Defina um trigger explicito (webhook, schedule, app event) |
| Conectar trigger direto ao app de destino sem processamento | Adicione ao menos um node de transformacao/validacao |
| Ignorar que cada node tem E-P-S proprio | Verifique input e output de cada node individualmente |
| Criar workflow monolitico sem separacao clara | Organize visualmente em blocos: entrada, processamento, saida |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
