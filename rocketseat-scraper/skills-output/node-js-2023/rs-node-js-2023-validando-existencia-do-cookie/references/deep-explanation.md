# Deep Explanation: Validando Existencia do Cookie com PreHandler

## Por que preHandler e nao middleware global?

O instrutor faz uma escolha deliberada: ao inves de usar um middleware global no Fastify (que interceptaria TODAS as rotas), ele aplica o preHandler individualmente nas rotas que precisam. Isso porque a rota de criacao de transacao NAO precisa de validacao — ela e quem CRIA o cookie. Apenas as rotas de leitura (listar todas, buscar uma, resumo) precisam validar.

## O nome "preHandler" vs "middleware"

O instrutor reconhece que o termo oficial do Fastify e "preHandler", mas prefere chamar de "middleware" ou "interceptador" porque e mais intuitivo. O "pre" vem de "previous" — executa ANTES do handler. O handler e a funcao principal da rota que lida com a logica de negocio.

## Comportamento padrao do preHandler

Ponto crucial: se o middleware NAO faz return, o Fastify entende que esta tudo bem e continua executando o handler normalmente. So quando voce faz um `return reply.status(401).send(...)` e que a cadeia para. Isso e diferente de frameworks como Express onde voce precisa chamar `next()` explicitamente.

## Por que TypeScript nao infere tipos no middleware

Quando voce escreve `app.get('/', async (request, reply) => {...})`, o TypeScript infere os tipos de request e reply a partir do tipo de `app` (FastifyInstance). Mas quando voce cria uma funcao separada sem nenhuma referencia ao Fastify, o TypeScript nao tem como saber o que sao request e reply. Por isso a tipagem manual com `FastifyRequest` e `FastifyReply` e obrigatoria.

## Filtro por sessionId — segregacao de dados

O instrutor enfatiza que TODA query de leitura deve incluir `.where('session_id', sessionId)`. Isso garante que um usuario nunca veja dados de outro. E um padrao de segregacao de dados por sessao — analogo a multi-tenancy em aplicacoes SaaS.

## Where com objeto vs where encadeado

O Knex permite dois estilos:
- Encadeado: `.where('id', id).where('session_id', sid)` — gera `WHERE id = ? AND session_id = ?`
- Objeto: `.where({ id, session_id: sessionId })` — gera o mesmo SQL

O instrutor prefere o objeto porque e mais limpo e permite usar short syntax do JavaScript quando chave e valor tem o mesmo nome.

## Fluxo completo de uma requisicao protegida

1. Request chega na rota `GET /transactions`
2. Fastify ve que tem `preHandler` configurado
3. Executa `checkSessionIdExists(request, reply)`
4. Se nao tem cookie → retorna 401, handler NUNCA executa
5. Se tem cookie → funcao termina sem return → handler executa normalmente
6. Handler pega sessionId do cookie e filtra a query

## Teste manual demonstrado na aula

O instrutor mostra no Insomnia:
1. Deleta o cookie manualmente → GET /transactions retorna 401
2. Cria nova transacao (POST) → novo cookie e criado automaticamente
3. GET /transactions agora funciona → lista apenas transacoes daquela sessao
4. Cria credito de 8000 e debito de 4000
5. GET /transactions/summary retorna 4000 (soma correta filtrada por sessao)