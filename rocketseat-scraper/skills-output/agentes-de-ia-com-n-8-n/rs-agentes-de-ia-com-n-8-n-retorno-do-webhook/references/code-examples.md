# Code Examples: Retorno do Webhook no n8n

## Fluxo completo construido na aula

### Arquitetura do workflow

```
[Webhook] → [Edit Fields] → [HTTP Request] → [Respond to Webhook]
   |              |               |                    |
   |              |               |                    └─ Retorna dados ao chamador
   |              |               └─ Busca cotacao da moeda em API externa
   |              └─ Extrai campo "moeda" do body
   └─ Recebe POST com { "moeda": "USD-BRL" }
```

### Configuracao do no Webhook (primeiro no)

```json
// Configuracoes do Webhook node
{
  "httpMethod": "POST",
  "path": "cotacao",
  "respond": "Using Respond to Webhook Node"  // CRITICO: mudar do padrao
}
```

A opcao "respond" fica em: clicar no no Webhook → secao "Respond" na parte inferior → selecionar "Using Respond to Webhook Node".

### Configuracao do no Respond to Webhook (ultimo no)

```json
// Configuracoes do Respond to Webhook node
{
  "respondWith": "First Incoming Item"  // Padrao, retorna o primeiro item
}
```

Opcoes disponiveis:
- `First Incoming Item` — retorna apenas o primeiro
- `All Incoming Items` — retorna array com todos
- `Custom` — permite customizar headers, status code, body

### Teste com Postman/curl

```bash
# Requisicao de teste
curl -X POST https://seu-n8n.com/webhook/cotacao \
  -H "Content-Type: application/json" \
  -d '{"moeda": "USD-BRL"}'

# Resposta esperada (dados da API de cotacao)
{
  "USDBRL": {
    "code": "USD",
    "codein": "BRL",
    "name": "Dólar Americano/Real Brasileiro",
    "high": "5.1234",
    "low": "5.0567",
    "bid": "5.0890",
    "ask": "5.0910",
    ...
  }
}
```

### Verificacao no n8n (Executions)

Apos executar, vá em Executions para verificar:

1. **Webhook** — deve mostrar o campo `moeda` recebido
2. **Edit Fields** — deve mostrar o campo `moeda` mapeado
3. **HTTP Request** — deve mostrar a resposta da API externa com dados da cotacao
4. **Respond to Webhook** — deve mostrar os mesmos dados que foram retornados ao chamador

Todos os nos devem estar verdes (sucesso). Se algum estiver vermelho, clique nele para ver o erro.

### Variacao: retornar todos os itens

Se o workflow processa multiplos itens (ex: multiplas moedas), configure o Respond to Webhook:

```json
{
  "respondWith": "All Incoming Items"
}
```

Isso retornara um array com todos os resultados processados.