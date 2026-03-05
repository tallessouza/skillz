# Code Examples: Criando uma Trigger Webhook no n8n

## Exemplo 1: Configuracao basica do webhook

### No n8n:
1. Workflow vazio → clique no primeiro step
2. Selecione "On Webhook Call"
3. Metodo: **POST**
4. Path: **cotacao**

### URLs geradas:
```
Teste:    https://seu-n8n.com/webhook-test/cotacao
Producao: https://seu-n8n.com/webhook/cotacao
```

## Exemplo 2: Teste com Postman

### Configuracao no Postman:
- **Metodo:** POST
- **URL:** URL de producao do webhook
- **Body:** raw → JSON

### Payload enviado:
```json
{
  "moeda": "USD"
}
```

### Resposta recebida:
```json
{
  "message": "Workflow was executed"
}
```
- **Status:** 200 OK

## Exemplo 3: Teste equivalente com curl

```bash
# Teste simples — verificar se webhook responde
curl -X POST https://seu-n8n.com/webhook/cotacao \
  -H "Content-Type: application/json" \
  -d '{"moeda": "USD"}'
```

## Exemplo 4: Variacoes de payload

### Payload com multiplos campos:
```json
{
  "moeda": "USD",
  "valor": 1000,
  "operacao": "compra"
}
```

### Payload com objeto aninhado:
```json
{
  "moeda": "EUR",
  "config": {
    "formato": "decimal",
    "casas": 2
  }
}
```

## Exemplo 5: Outros tipos de trigger mencionados

### Schedule trigger (tempo):
- Frequencia: uma vez por dia
- Horario: meia-noite
- Uso: rotinas automaticas como backup, relatorios diarios

### App event trigger (Notion):
- App: Notion
- Evento: pagina adicionada a um database
- Uso: reagir a novos itens criados pelo usuario

### Manual trigger:
- Ativado por clique no n8n
- Uso: testes manuais, execucoes sob demanda

## Checklist de verificacao

```
[ ] Webhook adicionado como primeiro node
[ ] Metodo HTTP configurado (POST para receber dados)
[ ] Path nomeado pelo dominio (ex: /cotacao)
[ ] Workflow salvo
[ ] Workflow ativo (toggle ligado)
[ ] Teste com Postman retorna Status 200
[ ] Mensagem "Workflow was executed" confirmada
```