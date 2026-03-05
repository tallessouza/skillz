# Code Examples: Analisando Dados de Execução no n8n

## Exemplo 1: Payload POST via Postman

O instrutor enviou uma requisição POST pelo Postman para o webhook do n8n. O payload enviado:

```json
{
  "moeda": "USD"
}
```

### Resultado no n8n (visualização ao clicar no nó webhook):

```json
{
  "headers": {
    "content-type": "application/json",
    "user-agent": "PostmanRuntime/...",
    // ... vários outros headers HTTP
  },
  "params": {},
  "query": {},
  "body": {
    "moeda": "USD"
  }
}
```

**Observação:** Como foi POST, os dados estão em `body`. Se fosse GET, estariam em `query`.

## Exemplo 2: Diferença GET vs POST

### Requisição GET
```
GET https://seu-n8n.com/webhook/cotacao?moeda=USD&formato=json
```

No n8n, os dados apareceriam em:
```json
{
  "query": {
    "moeda": "USD",
    "formato": "json"
  },
  "body": {}
}
```

### Requisição POST
```
POST https://seu-n8n.com/webhook/cotacao
Content-Type: application/json

{
  "moeda": "USD",
  "formato": "json"
}
```

No n8n, os dados apareceriam em:
```json
{
  "query": {},
  "body": {
    "moeda": "USD",
    "formato": "json"
  }
}
```

## Exemplo 3: Fluxo completo de debug

### Cenário: automação de cotação falha em produção

```
1. Usuário envia POST para Production URL com {"moeda": "EUR"}
2. Automação executa mas retorna erro

No n8n:
3. Aba Executions → última execução aparece com indicação de erro
4. Clicar na execução → ver quais nós falharam (nó vermelho)
5. Clicar duas vezes no nó com erro → ver dados de input e output
6. Identificar: o nó esperava "currency" mas recebeu "moeda"

Para corrigir:
7. Clicar "Copy to Editor" → dados de produção carregados no dev
8. Agora no editor, o webhook mostra os dados reais:
   body.moeda = "EUR"
9. Modificar o nó seguinte para usar body.moeda
10. Testar no editor com os dados importados
11. Salvar e ativar a automação corrigida
```

## Exemplo 4: Configuração do webhook visualizada nos logs

Ao abrir os detalhes do nó webhook nos logs de execução, o instrutor mostrou:

```
Webhook Configuration:
- HTTP Method: POST
- Path: /cotacao
- Response Mode: Last Node
```

Esses detalhes confirmam que o webhook está configurado corretamente e recebendo no método esperado.