# Deep Explanation: Utilizando Middleware no Node.js

## Por que middleware existe

O problema central e duplicacao de codigo. Toda vez que uma rota precisa ler o corpo da requisicao HTTP, o mesmo codigo de coleta de chunks precisa ser repetido. Isso viola DRY e dificulta manutencao — se a logica de parsing muda, voce precisa atualizar N lugares.

O middleware resolve isso interceptando a requisicao ANTES de chegar nas rotas. Ele modifica o objeto `request` (ou `response`) e deixa o fluxo seguir.

## Analogia do instrutor

O middleware e como um "porteiro" que intercepta toda requisicao que chega. Ele processa (remonta o body), adiciona informacao (injeta `request.body`), e deixa seguir. Ele nunca "responde pela aplicacao" — nao chama `response.end()`.

## Como o body HTTP funciona por baixo

Requisicoes HTTP com body (POST, PUT, PATCH) enviam os dados em pedacos (chunks). O Node.js nao monta automaticamente — voce precisa:

1. **Coletar chunks** em um array usando `for await`
2. **Concatenar** com `Buffer.concat()`
3. **Converter para string** com `.toString()`
4. **Parsear JSON** com `JSON.parse()`

Esse processo de 4 etapas e exatamente o que frameworks como Express fazem internamente com `express.json()`.

## Middleware nao finaliza o ciclo

Ponto critico: o middleware NUNCA chama `response.end()`. Ele apenas:
- Adiciona propriedades na request (`request.body`)
- Configura headers na response (`response.setHeader`)
- Depois o fluxo continua para as rotas

Se o middleware chamasse `response.end()`, a requisicao seria finalizada antes de chegar nas rotas.

## Content-Type header

Quando voce define `response.setHeader('Content-Type', 'application/json')`, o cliente (browser, Insomnia, etc.) sabe que a resposta e JSON e formata adequadamente. Sem esse header, o conteudo aparece como texto simples sem formatacao.

## response.end() aceita apenas texto

Um erro comum demonstrado na aula: tentar passar um objeto ou numero diretamente para `response.end()`. Exemplos:
- `response.end(request.body)` → ERRO (objeto)
- `response.end(request.body.price)` → ERRO (numero)
- `response.end(JSON.stringify(request.body))` → OK (string JSON)
- `response.end(request.body.name)` → OK (ja e string)
- `response.end(request.body.price.toString())` → OK (convertido)

## Try/catch no parsing

Nem toda requisicao tem body (GET, DELETE normalmente nao tem). Se `Buffer.concat(buffers).toString()` resultar em string vazia, `JSON.parse("")` lanca excecao. Por isso o try/catch com fallback para `request.body = null`.

## Organizacao de arquivos

O padrao ensinado e criar `src/middlewares/` como pasta dedicada. Cada middleware e um arquivo separado com funcao exportada. Nomes descritivos: `json-body-handler.js` ao inves de apenas `json.js`.

## Relacao com Express

O `jsonBodyHandler` criado manualmente e equivalente ao `express.json()`. Entender como funciona por baixo ajuda a:
- Debugar problemas de body parsing
- Criar middlewares customizados quando necessario
- Entender o que frameworks abstraem