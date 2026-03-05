# Code Examples: Gestao de Variaveis no n8n

## Exemplo 1: Capturar variavel do Webhook

### Cenario
Um Webhook recebe um POST com `{ "moeda": "USD-BRL" }`. Precisamos extrair apenas `moeda` para usar no proximo node.

### Configuracao do Edit Fields (Set)

```json
{
  "node": "Edit Fields",
  "type": "n8n-nodes-base.set",
  "parameters": {
    "mode": "manual",
    "fields": {
      "values": [
        {
          "name": "moeda",
          "type": "string",
          "value": "={{ $json.body.moeda }}"
        }
      ]
    }
  }
}
```

### Output do Edit Fields
```json
{
  "moeda": "USD-BRL"
}
```

Apenas o campo necessario, limpo e nomeado.

## Exemplo 2: Referencia por nome do node

### Quando usar
Quando ha nodes intermediarios entre a origem do dado e onde voce precisa usa-lo.

```
[Webhook] → [Edit Fields] → [IF] → [HTTP Request]
```

Se no HTTP Request voce precisa do valor original do Webhook:

```
{{ $('Webhook').item.json.body.moeda }}
```

### Estrutura completa da referencia por nome

```
$('NomeDoNode')          // seleciona o node
  .item                   // acessa o item atual
  .json                   // acessa o output JSON
  .body                   // navega na estrutura
  .moeda                  // campo desejado
```

## Exemplo 3: Multiplas variaveis no Edit Fields

### Cenario
Webhook recebe: `{ "moeda": "USD-BRL", "valor": 100, "email": "user@test.com" }`

Voce precisa apenas de `moeda` e `email` para os proximos nodes.

```json
{
  "fields": {
    "values": [
      {
        "name": "moeda",
        "type": "string",
        "value": "={{ $json.body.moeda }}"
      },
      {
        "name": "email",
        "type": "string",
        "value": "={{ $json.body.email }}"
      }
    ]
  }
}
```

### Output
```json
{
  "moeda": "USD-BRL",
  "email": "user@test.com"
}
```

O campo `valor` foi descartado porque nao era necessario neste ponto do fluxo.

## Exemplo 4: Usando autocomplete para explorar

### Passo a passo no editor de expressao

1. Clique no campo de valor do Edit Fields
2. Mude para modo Expression (icone de engrenagem ou arraste um campo)
3. Digite `{{ ` para abrir o editor
4. Digite `$json.` — autocomplete mostra: `body`, `headers`, `params`, `executionMode`
5. Selecione `body.`
6. Autocomplete mostra os campos do body: `moeda`, `valor`, `email`
7. Selecione `moeda`
8. Resultado: `{{ $json.body.moeda }}` com preview do valor real

### Para nodes nao-adjacentes
1. Digite `{{ $('` 
2. Autocomplete lista todos os nodes: `Webhook`, `Edit Fields`, etc.
3. Selecione o node desejado
4. Continue com `.item.json.` e navegue pela estrutura

## Exemplo 5: Validacao com play isolado

### Por que testar isoladamente
Antes de conectar o Edit Fields ao proximo node, clique no botao play do proprio node. Isso executa apenas aquele node e mostra:

- **Input tab:** o que entrou (todos os dados do node anterior)
- **Output tab:** o que saiu (apenas as variaveis mapeadas)

Se o output mostra `{ "moeda": "USD-BRL" }`, a gestao de variaveis esta correta e voce pode prosseguir.