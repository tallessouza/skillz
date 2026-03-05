# Code Examples: Entrada - Processamento - Saída

## Exemplo 1: Workflow Basico (Analogia Visual)

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   ENTRADA   │────▶│  PROCESSAMENTO   │────▶│    SAÍDA     │
│  (Trigger)  │     │  (Transformação)  │     │   (Action)   │
└─────────────┘     └──────────────────┘     └─────────────┘
     Carta              Carimbo do             Entrega no
    chegando             carteiro               destino
```

## Exemplo 2: Webhook → Formatar → Slack

```
[Webhook Trigger]
    │
    │ input: { "name": "João", "event": "compra", "value": 150 }
    ▼
[Set Node - Processamento]
    │ transforma: message = "Nova compra: João - R$150"
    ▼
[Slack - Saída]
    │ envia mensagem formatada para canal #vendas
```

## Exemplo 3: Schedule → Consultar API → Filtrar → Email

```
[Schedule Trigger] ─── Entrada (dispara todo dia 9h)
    │
    ▼
[HTTP Request] ─── Processamento (busca dados da API)
    │
    ▼
[IF Node] ─── Processamento (filtra: valor > 1000?)
    │
    ├── TRUE ──▶ [Gmail: Envia alerta] ─── Saída
    │
    └── FALSE ──▶ (nada acontece)
```

## Exemplo 4: E-P-S em Cada Node (Nivel Micro)

```
Node: "Set" (individualmente)
┌────────────────────────────────────────────┐
│ ENTRADA: recebe { name: "joao", age: 25 } │
│ PROCESSAMENTO: fullName = name.toUpper()   │
│ SAÍDA: passa { fullName: "JOAO", age: 25 } │
└────────────────────────────────────────────┘

Node: "IF" (individualmente)  
┌────────────────────────────────────────────┐
│ ENTRADA: recebe { fullName: "JOAO", age: 25 } │
│ PROCESSAMENTO: age >= 18?                       │
│ SAÍDA TRUE: passa dado adiante                  │
│ SAÍDA FALSE: rota alternativa                   │
└─────────────────────────────────────────────────┘
```

## Exemplo 5: Multiplos Destinos (Uma Entrada, Varias Saidas)

```
[Form Trigger] ─── Entrada
    │
    ▼
[Set: formata dados] ─── Processamento
    │
    ├──▶ [Google Sheets: registra] ─── Saída 1
    ├──▶ [Slack: notifica time] ─── Saída 2
    └──▶ [Gmail: envia confirmação] ─── Saída 3
```

## Exemplo 6: Sem Trigger = Nada Acontece

```
❌ ERRADO (sem trigger):
[HTTP Request] → [Slack]
→ So executa manualmente. Em producao, fica inerte.

✅ CORRETO (com trigger):
[Webhook Trigger] → [HTTP Request] → [Slack]
→ Executa automaticamente quando webhook é chamado.
```

## Checklist de Design de Workflow

```
□ Tem trigger definido? (a carta precisa chegar)
□ Cada conexao entre nodes esta explicita?
□ Existe processamento entre entrada e saida? (o carimbo do carteiro)
□ Cada node individual: sei qual é seu input e output?
□ Testei o workflow com dados reais?
```