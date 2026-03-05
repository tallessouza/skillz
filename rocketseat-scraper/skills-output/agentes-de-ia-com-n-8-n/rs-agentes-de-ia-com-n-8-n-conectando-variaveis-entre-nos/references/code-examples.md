# Code Examples: Conectando Variáveis entre Nós

## Exemplo 1: URL com variável mapeada

### Configuração do HTTP Request Node

**Campo URL antes (hardcoded):**
```
https://economia.awesomeapi.com.br/json/last/USD-BRL
```

**Campo URL com variável do nó anterior (drag-and-drop):**
```
https://economia.awesomeapi.com.br/json/last/{{ $json.moeda }}
```

**Campo URL referenciando nó específico pelo nome:**
```
https://economia.awesomeapi.com.br/json/last/{{ $('Webhook').item.json.body.moeda }}
```

## Exemplo 2: Formato simplificado da API

A API aceita formato simplificado, então ao invés de concatenar:
```
{{ $json.moeda }}-BRL
```

Basta usar diretamente:
```
{{ $json.moeda }}
```

A API interpreta automaticamente BRL como destino.

## Exemplo 3: Testando via Postman (modo produção)

### Request no Postman
```
POST https://seu-dominio.n8n.cloud/webhook/cotacao
Content-Type: application/json

{
  "moeda": "USD"
}
```

### Resposta sem configuração de saída
```
{
  "message": "Workflow was started"
}
```

> Nota: Para retornar os dados da cotação, é necessário configurar um nó "Respond to Webhook" no final do fluxo (próxima aula).

## Exemplo 4: Fluxo completo dos 3 nós

### Nó 1 — Webhook (entrada)
```
Trigger: POST /webhook/cotacao
Input: { "moeda": "USD" }
Output: { "body": { "moeda": "USD" }, "headers": {...}, "params": {...} }
```

### Nó 2 — Set Variable (processamento)
```
Input: body.moeda → "USD"
Configuração: variável "moeda" = {{ $json.body.moeda }}
Output: { "moeda": "USD" }
```

### Nó 3 — HTTP Request (saída)
```
Input: moeda → "USD"
URL: https://economia.awesomeapi.com.br/json/last/{{ $json.moeda }}
Output: { "USDBRL": { "code": "USD", "bid": "5.1234", ... } }
```

## Exemplo 5: Execute Previous Node

Quando você conecta dois nós e o painel de input está vazio:

1. Abra o nó destino (HTTP Request)
2. Observe que o painel esquerdo (INPUT) está vazio
3. Clique no botão **"Execute Previous Node"** (ícone de play no painel de input)
4. O n8n executa o nó anterior (Set Variable)
5. Agora o painel INPUT mostra `{ "moeda": "USD" }`
6. Arraste o campo `moeda` para o campo URL

## Exemplo 6: Renomeando nós

### Antes (nomes padrão)
```
Webhook → Set → HTTP Request
```

Expressão: `{{ $('Set').item.json.moeda }}`

### Depois (nomes descritivos)
```
Captura Requisição → Extrai Moeda → Consulta Cotação
```

Expressão: `{{ $('Extrai Moeda').item.json.moeda }}`

> Atenção: ao renomear, todas as expressões que referenciam o nó pelo nome antigo precisam ser atualizadas manualmente.