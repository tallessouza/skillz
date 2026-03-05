# Deep Explanation: Middleware para Obter o Body da Requisição

## Por que o body não vem pronto no Node.js?

Diferente de frameworks como Express ou Fastify, o Node.js puro não parseia o body automaticamente. O objeto `request` (IncomingMessage) é uma **Readable Stream**. Isso significa que os dados chegam em pedaços (chunks) ao longo do tempo, não de uma vez só.

Essa é uma decisão de design do Node.js — não assumir o formato do body permite que o servidor lide com qualquer tipo de dado (JSON, XML, binário, form-data) sem overhead desnecessário.

## O padrão de coleta de chunks

### for-await vs event listeners

O jeito clássico (e verboso) era:
```javascript
request.on('data', (chunk) => { ... })
request.on('end', () => { ... })
```

O `for await` é a versão moderna e limpa:
```javascript
for await (const chunk of request) {
  buffers.push(chunk)
}
```

Funciona porque `IncomingMessage` implementa o protocolo async iterable. O loop termina automaticamente quando o stream emite `end`.

### Por que Buffer e não string?

Cada chunk é um `Buffer` (dados binários). Concatenar strings com `+=` funciona para texto simples, mas:
- Perde informação de encoding em dados multibyte (emoji, acentos)
- Não funciona para dados binários (upload de arquivos)
- `Buffer.concat` é mais eficiente — faz uma única alocação de memória

### O fluxo completo

```
Cliente envia POST com body JSON
         ↓
Node.js recebe em chunks (Buffer[])
         ↓
for-await coleta cada chunk → array de buffers
         ↓
Buffer.concat → um único Buffer
         ↓
.toString() → string UTF-8
         ↓
JSON.parse → objeto JavaScript
         ↓
request.body = objeto (injetado no request)
         ↓
Disponível em todas as rotas/handlers
```

## O conceito de Middleware

O instrutor introduz o conceito de **middleware** — uma função que roda **entre** a requisição chegar e o handler processar. O middleware:

1. Intercepta request/response
2. Faz processamento (parsing, autenticação, logging)
3. Modifica os objetos (injeta `request.body`)
4. Passa o controle adiante

No Node.js puro, middleware é simplesmente uma função async que você chama com `await` antes do seu código de roteamento. Não há um sistema de `app.use()` como no Express — você controla a ordem de execução manualmente.

## Por que try-catch no JSON.parse?

`JSON.parse` lança `SyntaxError` se receber string inválida. Sem try-catch, o servidor inteiro crasharia. O padrão defensivo é:

```javascript
try {
  request.body = JSON.parse(Buffer.concat(buffers).toString())
} catch {
  request.body = null
}
```

Atribuir `null` ao body no catch permite que os handlers verifiquem facilmente se houve body válido.

## Por que setHeader no middleware?

O instrutor adiciona `response.setHeader('Content-Type', 'application/json')` no middleware porque essa API sempre retorna JSON. Centralizar isso evita repetição em cada rota.

## Organização de arquivos

O instrutor cria a estrutura:
```
src/
├── middlewares/
│   └── jsonHandler.js
└── server.js
```

E separa as importações no server.js:
1. Primeiro: bibliotecas do Node (`import http from 'node:http'`)
2. Depois: arquivos próprios (`import { jsonHandler } from './middlewares/jsonHandler.js'`)

**Nota importante:** sempre incluir a extensão `.js` nos imports — em ESM (ES Modules) do Node.js, a extensão é obrigatória.

## Testando com Insomnia

O instrutor demonstra o teste:
1. Cria uma collection "support-tickets" no Insomnia
2. Cria uma requisição POST para `http://localhost:3333/tickets`
3. Seleciona body type JSON
4. Envia `{ "name": "Rodrigo Gonçalves" }`
5. Verifica no console.log que `request.body` contém o objeto parseado

A requisição fica "pendente" porque o servidor ainda não envia resposta (não há `response.end()`), mas o `console.log` confirma que o body foi parseado corretamente.