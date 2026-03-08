# Deep Explanation: API Node.js Pura — Fundamentos sem Dependências

## Por que construir sem frameworks?

O instrutor enfatiza que o valor principal desta etapa é **ver como as coisas funcionam nos bastidores**. Quando um desenvolvedor usa Express ou Fastify desde o início, ele perde a compreensão de:

1. **Como o body chega** — o body de uma requisição HTTP não chega de uma vez. Ele vem em chunks via stream. Frameworks abstraem isso com middleware como `express.json()`, mas por baixo, alguém escreveu código que coleta esses chunks, concatena, e faz `JSON.parse()`.

2. **Como rotas funcionam** — um router de framework é essencialmente um mapa de `{método + padrão de URL → função handler}`. Construir isso manualmente revela que roteamento é pattern matching, não mágica.

3. **Como respostas são montadas** — `res.json()` no Express é apenas um wrapper sobre `res.writeHead(200, {'Content-Type': 'application/json'})` + `res.end(JSON.stringify(data))`.

## O projeto: API de Tickets de Suporte

O projeto escolhido foi uma API de tickets de suporte, que é um CRUD clássico com complexidade suficiente para exercitar todos os fundamentos:

- **Requisições:** lidar com diferentes métodos HTTP (GET, POST, PUT, DELETE)
- **Body da requisição:** receber dados JSON no corpo da requisição para criar/atualizar tickets
- **Parâmetros de URL:** extrair IDs e filtros da URL para buscar/deletar tickets específicos
- **Respostas:** enviar dados estruturados com status codes apropriados

## A analogia do instrutor

O instrutor posiciona este módulo como a construção de uma **base sólida**. A ideia é: antes de usar ferramentas que fazem muito por você, entenda o que elas fazem. Isso não significa que você deve sempre codar sem frameworks — significa que quando algo der errado em produção, você saberá debugar porque entende a camada abaixo.

## Valor para o desenvolvedor

- **Fundamentos sólidos** — saber o que acontece "debaixo do capô" dos frameworks
- **Capacidade de debug** — quando Express/Fastify se comporta de forma inesperada, você sabe onde olhar
- **Independência** — para microserviços muito simples, às vezes não precisa de framework nenhum
- **Entrevistas** — demonstrar que entende HTTP e Node.js, não apenas APIs de frameworks