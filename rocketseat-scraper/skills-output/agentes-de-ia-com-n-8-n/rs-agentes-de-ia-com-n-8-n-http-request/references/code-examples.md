# Code Examples: HTTP Request no n8n

## 1. Testando a API no Postman

### Requisição simples sem autenticação

```
GET https://economia.awesomeapi.com.br/json/last/USD-BRL
```

**Resposta (status 200):**
```json
{
  "USDBRL": {
    "code": "USD",
    "codein": "BRL",
    "name": "Dólar Americano/Real Brasileiro",
    "high": "5.37",
    "low": "5.30",
    "varBid": "0.02",
    "pctChange": "0.38",
    "bid": "5.35",
    "ask": "5.36",
    "timestamp": "1234567890",
    "create_date": "2026-02-28 10:00:00"
  }
}
```

## 2. Curl gerado pelo Postman (sem auth)

```bash
curl --request GET \
  --url 'https://economia.awesomeapi.com.br/json/last/USD-BRL'
```

## 3. Curl com API Key (versão cloud)

```bash
curl --request GET \
  --url 'https://economia.awesomeapi.com.br/json/last/USD-BRL?token=SUA_API_KEY_AQUI'
```

**Atenção:** Ao copiar o curl da Awesome API, remova:
- O `$` antes de variáveis
- Placeholders como `API_KEY_TOKEN`
- Substitua pelo token real antes de importar

## 4. Configuração resultante no n8n

Após o Import Curl, o node HTTP Request fica configurado assim:

```
Method: GET
URL: https://economia.awesomeapi.com.br/json/last/USD-BRL
Query Parameters:
  - Name: token
  - Value: {sua-api-key-real}
Authentication: None (token vai como query parameter)
```

## 5. Fluxo de teste no n8n

### Testar node isolado
```
1. Clicar duas vezes no node HTTP Request
2. Clicar em "Execute Step" (ou play no topo)
3. Verificar output no painel direito
4. Confirmar que retornou os dados da cotação
```

### Resultado esperado no output do node
```json
{
  "USDBRL": {
    "code": "USD",
    "codein": "BRL",
    "high": "5.37",
    "low": "5.30",
    "bid": "5.35",
    "ask": "5.36"
  }
}
```

## 6. Awesome API — Endpoints úteis

### Par de moedas único
```
GET https://economia.awesomeapi.com.br/json/last/USD-BRL
```

### Múltiplos pares
```
GET https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL
```

### Com autenticação (necessário no n8n cloud)
```
GET https://economia.awesomeapi.com.br/json/last/USD-BRL?token=SUA_KEY
```

## 7. Processo completo passo a passo

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Ler docs da │────▶│ Testar no    │────▶│ Copiar curl do  │
│ API         │     │ Postman      │     │ Postman (Code)  │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                                   ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Conectar ao │◀────│ Test Step no │◀────│ Import Curl no  │
│ workflow    │     │ node isolado │     │ n8n             │
└─────────────┘     └──────────────┘     └─────────────────┘
```