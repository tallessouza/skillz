# Deep Explanation: Iniciando o Servidor Node.js

## Por que `node:` protocol?

O instrutor enfatiza: "Dois pontos para dizer aqui, deixar explícito, que o HTTP não é uma dependência de terceiro, que ela faz parte do próprio core do node e, portanto, a gente não precisa instalar nada."

O prefixo `node:` foi introduzido para resolver uma ambiguidade real: se alguém publicasse um pacote npm chamado `http`, o Node.js não saberia se você quer o módulo nativo ou o de terceiros. Com `node:http`, é inequívoco — sempre o core module.

Benefícios práticos:
- **Segurança:** previne ataques de supply chain onde um pacote malicioso tenta mascarar um módulo nativo
- **Legibilidade:** qualquer dev lendo o código sabe imediatamente que é nativo
- **Performance:** o resolver do Node.js pode pular a busca em `node_modules`

## Duas formas de criar o servidor

O instrutor mostrou deliberadamente duas abordagens para "aumentar o repertório":

### Forma 1: Variável intermediária (mais verbosa)

```javascript
const server = http.createServer((request, response) => {
  // handle
})

server.listen(3333)
```

Útil quando você precisa referenciar `server` depois (ex: para WebSocket upgrade, graceful shutdown).

### Forma 2: Encadeada com listener separado (preferida)

```javascript
function listener(request, response) {
  // handle
}

http.createServer(listener).listen(3333)
```

O instrutor preferiu esta forma porque:
1. A função `listener` é testável isoladamente
2. O `createServer` retorna o server, então `.listen()` encadeia naturalmente
3. Menos código, mesma funcionalidade

## O que `createServer` faz internamente

Quando você chama `http.createServer(listener)`:
1. Cria uma instância de `http.Server` (que herda de `net.Server`)
2. Registra `listener` como handler do evento `'request'`
3. Retorna a instância do server

Quando você chama `.listen(3333)`:
1. O server começa a escutar conexões TCP na porta 3333
2. Para cada conexão HTTP completa, dispara o evento `'request'`
3. O `listener` recebe `IncomingMessage` (request) e `ServerResponse` (response)

## Por que porta 3333?

Convenção comum em cursos e projetos Node.js brasileiros. Em produção, use `process.env.PORT` com fallback:

```javascript
const PORT = process.env.PORT || 3333
```

## Contexto da aula

Esta é uma aula de fundamentos — o instrutor está construindo uma API do zero sem frameworks. O objetivo é entender o que frameworks como Express/Fastify fazem por baixo dos panos. O conhecimento do `http` nativo é fundamental para debug e para entender o modelo request/response do Node.js.