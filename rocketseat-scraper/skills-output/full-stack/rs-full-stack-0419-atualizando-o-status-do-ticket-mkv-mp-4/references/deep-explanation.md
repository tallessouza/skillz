# Deep Explanation: Atualizando Status Reutilizando Metodos Existentes

## Principio central: DRY aplicado a camada de dados

O instrutor demonstra um insight importante: quando voce ja tem um metodo generico `database.update(table, id, data)`, criar metodos especificos como `closeTicket()`, `reopenTicket()`, `changeStatus()` viola o principio DRY. O metodo generico aceita qualquer campo para atualizar — status e apenas mais um campo.

Isso e um padrao recorrente em APIs simples: a camada de persistencia oferece operacoes CRUD genericas (select, insert, update, delete), e a camada de rotas/handlers define a semantica de negocio. Nao e necessario que cada operacao de negocio tenha um metodo correspondente no database.

## Fluxo completo demonstrado

1. **Receber requisicao** com ID do ticket nos parametros da URL
2. **Chamar `database.update`** passando tabela, ID e objeto com campos a atualizar
3. **Retornar resposta** sem body (o padrao HTTP 200 ja comunica sucesso)

O instrutor enfatiza que "a gente nao precisa criar nenhum metodo novo dentro do nosso banco de dados, porque la a gente ja tem o metodo de atualizar". Essa e a decisao arquitetural chave: reconhecer que o metodo generico e suficiente.

## Verificacao pos-update

O instrutor demonstra a verificacao usando filtros:
- Filtrar por `?status=open` — ticket atualizado nao aparece mais
- Filtrar por `?status=closed` — ticket aparece na lista de fechados

Essa verificacao e importante porque confirma que:
1. O update realmente persistiu
2. O filtro existente funciona com os novos valores
3. A API e consistente (criar com open, fechar com closed, filtrar por ambos)

## Quando CRIAR metodo novo vs REUTILIZAR

**Reutilize** quando:
- A operacao e simplesmente mudar valores de campos existentes
- O metodo generico ja faz persistencia e validacao
- Nao ha logica de negocio complexa (validacoes, side effects)

**Crie metodo novo** quando:
- Ha logica de negocio alem do update (enviar email, notificar, cascata)
- Precisa de validacao especifica (nao pode fechar ticket sem resolver)
- Multiplas tabelas sao afetadas na mesma operacao

## Status codes HTTP para updates

| Code | Quando usar |
|------|-------------|
| 200 OK | Update com body de resposta |
| 204 No Content | Update sem body (mais semantico para PATCH/PUT) |
| 404 Not Found | ID nao existe |
| 422 Unprocessable | Status invalido |

O instrutor usa 200 (padrao do Node) com body vazio, que funciona mas 204 seria mais semanticamente correto.