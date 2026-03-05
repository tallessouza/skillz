# Deep Explanation: Rota Atualizar Projeto

## Estrategia de produtividade do instrutor

O instrutor demonstra uma tecnica pratica importante: **reutilizar rotas existentes como ponto de partida**. Ele deliberadamente escolheu copiar a rota de delete project (e nao create) porque ela ja tinha o `id` do projeto na URL como parametro. Essa decisao pragmatica economiza tempo e reduz erros, pois a estrutura de busca do projeto e verificacao de permissoes ja esta pronta.

A "indecisao" visivel no video nao e inseguranca — e o instrutor avaliando qual rota existente tem a estrutura mais proxima do que ele precisa. Isso reforca o principio REUSE > ADAPT > CREATE.

## Padrao de permissao RBAC

O fluxo segue um padrao consistente em toda a aplicacao SaaS:

1. **Buscar o recurso** — `findUnique` pelo ID
2. **Construir o ability** — a partir do usuario autenticado
3. **Verificar permissao especifica** — `ability.can('update', project)`
4. **Executar a acao** — somente se autorizado
5. **Retornar resposta adequada** — 204 para updates

Esse padrao se repete em todas as rotas (create, read, update, delete), mudando apenas a acao (`'update'`, `'delete'`, etc.) e a mensagem de erro.

## Por que 204 e nao 200?

O HTTP 204 (No Content) e semanticamente correto para updates porque:
- O cliente ja sabe os dados que enviou
- Nao ha necessidade de retornar o objeto atualizado
- Reduz payload de resposta
- Segue REST conventions

## Campos atualizaveis

A rota aceita apenas `name` e `description` — os campos que fazem sentido o usuario editar. Campos como `ownerId`, `organizationId`, `createdAt` sao imutaveis por essa rota, protegendo a integridade dos dados.