# Deep Explanation: OpenAI Batch API

## O que e a Batch API

A Batch API da OpenAI permite processar requisicoes em massa (em lote). Em vez de fazer uma requisicao por vez — por exemplo, embedar 10 mil produtos individualmente — voce cria um unico arquivo que sintetiza todas essas requisicoes, envia para a OpenAI, e ela processa tudo de forma assincrona.

## Por que usar

### Vantagens
- **50% de desconto no preco do modelo** — se o modelo custa $10/1M tokens, com Batch API fica $5/1M tokens (confirmar na documentacao atual, pois pode mudar)
- **Rate limits mais altos** — a OpenAI aumenta os limites de requisicoes por minuto/dia quando voce usa Batch API, porque o processamento nao e em tempo real

### Desvantagens
- **Resposta nao e instantanea** — processamento assincrono, pode levar ate 24 horas (normalmente mais rapido)
- **Nao serve para interacao em tempo real** — apenas para processamento em background

## O formato JSON Lines (JSONL)

JSON Lines e diferente de JSON normal:
- **JSON normal**: um array com objetos separados por virgulas
- **JSON Lines**: cada linha e um objeto JSON independente, separado por quebra de linha (`\n`)

Cada objeto no JSONL representa uma requisicao completa e contem:
- `custom_id`: identificador para voce saber a qual item do seu dominio o resultado pertence
- `method`: metodo HTTP (sempre "POST" para embeddings)
- `url`: endpoint da API (ex: `/v1/embeddings`)
- `body`: corpo da requisicao com `input`, `model`, e opcionalmente `encoding_format`

## Fluxo completo em 3 passos

1. **Criar o arquivo JSONL** — montar o conteudo com todas as requisicoes
2. **Subir o arquivo para a OpenAI** — usando `client.files.create` com `purpose: "batch"`
3. **Criar o batch** — usando `client.batches.create` passando o `input_file_id`, o `endpoint` e `completion_window: "24h"`

Apos isso, a OpenAI processa assincronamente. Como nao existe sistema de webhooks, voce precisa fazer polling para verificar o status do batch.

## Endpoints suportados pela Batch API

A Batch API so aceita estes endpoints:
- `/v1/chat/completions` — para gerar texto
- `/v1/completions` — versao antiga (depreciada)
- `/v1/embeddings` — para gerar embeddings
- `/v1/responses` — para a Response API

## Sobre o custom_id

Como o processamento e assincrono e os resultados podem voltar em qualquer ordem, o `custom_id` e essencial para mapear cada resultado de volta ao item original. No exemplo da aula, o instrutor usou o indice do array como custom_id porque a base de dados de exemplo nao tinha IDs. Em producao, use o ID real do registro no banco de dados.

## Completion window

O unico valor aceito hoje para `completion_window` e `"24h"`. Isso significa que a OpenAI se compromete a processar o batch em ate 24 horas, mas normalmente e mais rapido.