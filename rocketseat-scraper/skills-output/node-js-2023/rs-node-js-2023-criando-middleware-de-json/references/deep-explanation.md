# Deep Explanation: Middleware de JSON no Node.js

## O que e um Middleware

O instrutor define middleware como um **interceptador** — uma funcao que intercepta a requisicao antes dela chegar ao handler principal. No ecossistema Node.js, middlewares sao facilmente reconheciveis porque **sempre recebem req e res como parametros**.

O middleware nao e apenas um conceito de frameworks como Express. No Node.js puro, qualquer funcao async que recebe req/res e transforma esses objetos antes do processamento principal e, conceitualmente, um middleware.

## Por que separar em arquivo

O instrutor motiva a separacao pelo crescimento natural da API: "Agora que a gente vai comecar a adicionar mais funcionalidades, e interessante comecar a separar um pouquinho mais o codigo para nao ficar tudo dentro do server.js."

A pasta `middlewares/` com um arquivo por middleware (ex: `json.js`) segue o principio de responsabilidade unica — cada interceptador cuida de uma transformacao especifica.

## Fluxo da requisicao com middleware

```
Requisicao HTTP chega
    │
    ▼
await json(req, res)     ← Middleware intercepta
    │
    ├── Consome body via stream (for await)
    ├── Faz JSON.parse e salva em req.body
    ├── Configura Content-Type da resposta
    │
    ▼
Handler principal executa  ← req.body ja disponivel
    │
    ▼
Resposta enviada (ja com Content-Type: application/json)
```

## Dual purpose do middleware de JSON

O instrutor destaca que o middleware lida com JSON em **duas direcoes**:

1. **Entrada:** Converte o corpo da requisicao (stream de bytes) em objeto JavaScript via JSON.parse
2. **Saida:** Configura `Content-Type: application/json` para que todas as respostas informem ao cliente que os dados serao JSON

Isso centraliza toda a logica de formatacao JSON em um unico lugar.

## Armadilha do ES Modules

O instrutor encontrou um erro ao vivo: `Cannot find module middleware/json imported. Module not found.` A causa foi a falta da extensao `.js` no import.

Quando se usa `"type": "module"` no package.json, o Node.js exige que imports relativos incluam a extensao do arquivo. Isso difere do CommonJS (`require`) onde a extensao era opcional.

## Por que await e obrigatorio

A funcao `json()` e async porque usa `for await` para consumir o readable stream do request. Sem o `await` na chamada, o handler principal executaria antes do body ser completamente lido, resultando em `req.body` undefined.

## Reconhecendo middlewares

Dica pratica do instrutor: "Os middlewares sao faceis de serem reconhecidos porque eles sempre vao receber como parametro o req e o res." Essa e a assinatura universal de um middleware no Node.js — seja em servidor puro, Express, ou qualquer framework.