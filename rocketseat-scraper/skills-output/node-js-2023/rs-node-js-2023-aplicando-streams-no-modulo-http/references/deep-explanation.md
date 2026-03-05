# Deep Explanation: Streams no Modulo HTTP

## Por que req e res sao Streams

O instrutor enfatiza: "Tudo no Node sao Streams. Todas as portas de entrada e saida no Node sao Streams." Isso significa que ao criar um servidor HTTP com `http.createServer((req, res) => {})`:

- **req** (request) e uma ReadableStream — voce le dados que chegam da requisicao
- **res** (response) e uma WritableStream — voce escreve dados que serao enviados como resposta

Isso e identico ao padrao que se usa com streams standalone. A diferenca e que voce nao precisa criar as streams manualmente — o Node ja fornece elas prontas dentro do handler HTTP.

## A conexao que nao fecha

O ponto mais importante da aula, nas palavras do instrutor: "Esse arquivo abriu uma conexao com o nosso back-end, com o nosso servidor HTTP, e ele nao fechou essa conexao. Ele abriu a conexao e esta enviando dados aos poucos."

Isso e o fundamento da arquitetura do Node.js. O cliente abre um canal de dados com o servidor e mantem esse canal aberto enquanto a stream estiver ativa. O servidor pode:

1. Receber dados incrementalmente (chunk a chunk)
2. Processar cada chunk assim que chega
3. Enviar respostas parciais de volta

O instrutor destaca que **isso e o que fez o Node ser o que e hoje** — a capacidade de manter conexoes abertas e processar dados incrementalmente, sem precisar esperar o payload completo.

## Fetch API como cliente de streams

Desde o Node 18, a Fetch API e nativa. Ela permite:

- Fazer requisicoes entre aplicacoes (frontend→backend, backend→backend)
- Enviar uma ReadableStream como body da requisicao
- Apenas metodos POST e PUT suportam body (GET e para buscar, nao enviar)

### Detalhe importante: `duplex: 'half'`

Em versoes mais recentes do Node, e necessario adicionar `duplex: 'half'` ao objeto de configuracao do fetch quando se envia uma stream como body. Sem isso, o Node lanca erro.

## O padrao pipe completo

O encadeamento `req.pipe(transform).pipe(res)` segue o mesmo padrao de qualquer pipe de streams:

```
ReadableStream → TransformStream → WritableStream
     req       →    transform    →      res
```

E exatamente o mesmo conceito das streams standalone, mas usando as streams internas do servidor HTTP.

## Contexto da aula

O instrutor criou dois arquivos separados para demonstrar:

1. `stream-http-server.js` — servidor HTTP na porta 3334 que recebe dados via stream e aplica uma TransformStream
2. `fake-upload-to-http-stream.js` — cliente que simula um frontend enviando dados grandes aos poucos via fetch

O servidor usa a `InverseNumberStream` (TransformStream que multiplica por -1) para demonstrar processamento em transito. O console.log dentro do transform mostra os dados chegando incrementalmente.

## Por que porta diferente

O instrutor usa porta 3334 (em vez de 3333 do servidor anterior) para que ambos possam rodar simultaneamente sem conflito.