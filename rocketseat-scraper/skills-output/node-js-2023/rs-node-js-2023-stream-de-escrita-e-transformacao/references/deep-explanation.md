# Deep Explanation: Streams de Escrita e Transformacao

## O modelo mental dos tres tipos de stream

O instrutor apresenta uma analogia progressiva:

- **Readable**: produz dados (como uma torneira aberta)
- **Writable**: consome/processa dados (como um ralo — recebe e nao devolve)
- **Transform**: intermediaria — recebe de um lado, transforma e passa adiante (como um filtro de agua entre a torneira e o copo)

A chave e entender que **Writable nunca retorna dados**. Ela e o ponto final. Se voce precisa que dados sigam fluindo pelo pipe, precisa de uma Transform.

## Por que o callback existe?

O callback e o mecanismo de controle de fluxo (backpressure). Quando voce chama `callback()`, esta dizendo ao Node: "terminei de processar este chunk, pode me enviar o proximo."

Sem chamar o callback, a stream simplesmente para. O Node nao sabe se voce ainda esta processando ou se travou.

## O contrato do callback na Transform

Na Transform, o callback tem uma assinatura especifica:
- `callback(error)` — sinaliza erro, stream emite evento 'error'
- `callback(null, data)` — sinaliza sucesso, `data` e o chunk transformado que sera enviado adiante no pipe

O instrutor demonstra isso com validacao:

```javascript
_transform(chunk, encoding, callback) {
  const number = Number(chunk.toString())

  if (isNaN(number)) {
    return callback(new Error('number not valid'))
  }

  callback(null, Buffer.from(String(number * -1)))
}
```

## O erro classico: esquecer Buffer.from()

O instrutor demonstra ao vivo que enviar um numero diretamente no callback da Transform causa:

```
TypeError: The "chunk" argument must be of type string or an instance of Buffer
```

Isso acontece porque streams transitam dados como Buffer. O `this.push()` da Readable ja exige Buffer, e o callback da Transform tambem. E um contrato fundamental do sistema de streams do Node.

## Buffer como lingua franca das streams

O instrutor explica que Buffer e "simplesmente uma forma de transicionar dados entre streams". E o formato universal que o Node usa internamente. Nao importa se o dado original e numero, string ou objeto — entre streams, tudo vira Buffer.

Isso sera explicado em detalhes em aulas futuras, mas o conceito pratico e: sempre converta para Buffer ao enviar, sempre converta de Buffer ao receber.

## Duplex Stream (mencionada brevemente)

O instrutor menciona a Duplex stream como uma uniao de Readable + Writable. A analogia: um arquivo fisico no sistema — voce pode ler e escrever nele, mas nao "transformar" diretamente dentro dele.

Na pratica, Duplex streams sao raramente usadas diretamente. A grande maioria dos casos usa Readable, Transform e Writable.

## A revelacao: processamento durante leitura

O ponto mais enfatico do instrutor: "Eu nao preciso aguardar todo o arquivo ser finalizado, a leitura, para entao processar aqueles dados."

Isso e o poder real das streams — processar dados incrementalmente. Em vez de carregar um arquivo de 2GB na memoria, voce le chunk por chunk e processa cada um imediatamente. A stream de escrita ja esta trabalhando enquanto a stream de leitura ainda nem terminou.

## Os tres parametros compartilhados

Tanto `_write` quanto `_transform` recebem:
1. **chunk** — o pedaco de dado da stream anterior (chega como Buffer)
2. **encoding** — como a informacao esta codificada (nao usado na maioria dos casos basicos)
3. **callback** — funcao que sinaliza conclusao do processamento