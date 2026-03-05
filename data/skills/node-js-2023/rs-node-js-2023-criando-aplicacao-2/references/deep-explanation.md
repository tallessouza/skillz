# Deep Explanation: Criando Aplicacao Node.js com Fastify

## Por que Fastify e nao Express?

O instrutor escolhe Fastify como framework base para a API REST. O Fastify fornece todos os metodos HTTP como metodos de primeira classe na instancia da app: `app.get()`, `app.post()`, `app.put()`, `app.patch()`, `app.delete()` — todos disponiveis via autocomplete.

## O padrao de criacao do Fastify

A funcao `fastify()` retorna uma instancia da aplicacao. A partir dessa instancia, tudo e feito:
- Rotas: `app.get('/path', handler)`
- Escuta: `app.listen({ port })`

O handler de rota recebe request e reply como parametros, mas se voce simplesmente retornar um valor, o Fastify entende:
- String retornada → resposta text/plain
- Objeto retornado → resposta application/json automaticamente

## O problema do TypeScript no Node.js

Node.js foi construido para JavaScript puro. Quando usamos TypeScript, o compilador nao conhece os tipos nativos do Node (Buffer, process, etc.). Por isso, `@types/node` e obrigatorio.

Sem ele, o `tsc` gera erros como:
```
Cannot find name 'Buffer'. Do you need to install type definitions for Node?
Try npm install @types/node
```

O codigo ate pode ser gerado mesmo com erros (dependendo da config), mas os erros indicam que o ambiente nao esta corretamente tipado.

## TSX: o que faz por baixo

O TSX combina dois passos em um:
1. Converte TypeScript → JavaScript (em memoria, sem gerar arquivo)
2. Executa o JavaScript resultante com Node

Vantagens:
- Nao suja o diretorio com arquivos `.js`
- Processo unico, sem pipeline manual
- Modo `watch` reinicia automaticamente ao detectar alteracoes

## Por que NAO usar TSX em producao

O instrutor demonstrou com `time`:
- `time node src/server.js` → ~999ms
- `time tsx src/server.ts` → ~1.2s+

A diferenca parece pequena, mas em producao:
- Cada restart conta (deploys, crashes, scaling)
- Debug e mais facil com JavaScript puro
- Stack traces apontam para o codigo real executado

O processo correto em producao: `tsc` para compilar, `node` para executar o JavaScript resultante.

## O `app.listen` retorna uma Promise

O `listen` do Fastify e assincrono. O instrutor usa `.then()` para saber quando o servidor esta de fato ouvindo:

```typescript
app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
```

Isso garante que o log so aparece quando a porta esta realmente aberta.

## Scripts npm nao precisam de npx

Dentro de `"scripts"` no package.json, o npm automaticamente adiciona `node_modules/.bin` ao PATH. Entao `"dev": "tsx watch src/server.ts"` funciona sem `npx`.