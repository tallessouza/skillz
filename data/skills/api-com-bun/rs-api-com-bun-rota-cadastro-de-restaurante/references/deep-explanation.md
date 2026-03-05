# Deep Explanation: Rotas no Elysia com Drizzle ORM

## Modelo mental do Elysia: não existe req/res

O Elysia não segue o padrão Express/Fastify de `(request, response)`. Em vez disso, o handler recebe um único objeto de contexto que pode ser desestruturado. A "resposta" é controlada pelo `set` — um objeto que permite definir status, headers, cookies e redirects.

Isso significa que o instrutor (Diego) destaca: "aqui no Elysia a gente não tem request e response, é apenas esses dados aqui e o set que vai ser utilizado para response". O `set` é o mecanismo unificado de resposta.

## O que cada propriedade do contexto faz

- **body**: corpo da requisição (JSON parseado automaticamente)
- **cookie**: cookies da request, com getters/setters
- **headers**: cabeçalhos HTTP da requisição
- **params**: parâmetros de rota dinâmica (`:id` na URL vira `params.id`)
- **path**: o caminho da requisição (ex: `/restaurants`)
- **query**: search parameters (o que vem depois de `?` na URL)
- **request**: objeto Request nativo do web standard — usado para informações de baixo nível como IP
- **set**: mecanismo de resposta — permite definir `set.status`, `set.headers`, `set.redirect`, `set.cookie`
- **store**: estado compartilhado entre middlewares do Elysia — funciona como o "contexto" entre requisições

## Store e Middlewares no Elysia

O instrutor explica que o `store` é análogo ao que Express/Fastify fazem com middlewares que adicionam dados ao request (ex: `req.user`). No Elysia, middlewares podem:
1. **Bloquear** uma requisição (ex: autenticação falhou → rejeita)
2. **Enriquecer o contexto** via store (ex: autenticação passou → adiciona user ID ao store)

As rotas subsequentes acessam `store` para ler essas informações compartilhadas.

## Por que returning() e desestruturação de array

O Drizzle ORM sempre retorna um array no `insert().returning()`, mesmo quando inserimos um único registro. Isso é por design — a API é consistente independente de inserir 1 ou N registros.

Por isso o padrão é `const [manager] = await db.insert(...)` — desestruturação imediata do primeiro elemento.

O `returning()` aceita um objeto seletivo: `.returning({ id: users.id })` retorna apenas o campo id, evitando expor dados desnecessários e sendo mais eficiente.

## Padrão de cadastro multi-entidade

Nesta aplicação, o formulário do frontend cadastra restaurante E gerente numa única submissão. A rota precisa:
1. Inserir o manager primeiro (tabela `users` com `role: 'manager'`)
2. Capturar o ID do manager via `returning()`
3. Inserir o restaurante com o `managerId` do passo anterior

Essa ordem é obrigatória pela foreign key — o restaurante referencia o manager.

## Status 204: No Content

Diego usa `set.status = 204` porque a rota cria recursos mas não precisa retornar dados na resposta. O 204 significa "sucesso, sem corpo de resposta". É idiomático para operações de criação onde o cliente não precisa do recurso criado de volta.

O Elysia permite usar tanto números (`204`) quanto textos descritivos (`'No Content'`) no set.status — o instrutor prefere números por familiaridade.

## Tipagem temporária com `as any`

O `body` no Elysia começa como `unknown`. O instrutor usa `as any` temporariamente para não bloquear o desenvolvimento, sinalizando que a tipagem será feita na próxima aula com o sistema de schema do Elysia. Isso é uma decisão pedagógica — na prática, a tipagem deve ser adicionada logo em seguida.