# Deep Explanation: Listagem do Catalogo no Backend - Part. 2

## Por que raw SQL ao inves de ORM?

Neste projeto de marketplace inteligente, o instrutor opta por raw SQL com o client `pg` diretamente. Isso da controle total sobre queries, especialmente importante quando se trabalha com embeddings (vetores) que ORMs tradicionais nao suportam bem. O tradeoff e que voce precisa tipar manualmente e gerenciar o lifecycle da conexao.

## O problema do result vs result.rows

O `client.query()` do pg retorna um objeto `QueryResult` que contem metadata alem dos dados. O campo `.rows` e o array de resultados. Retornar `result` diretamente quebra a API porque envia metadata desnecessaria ao cliente. O instrutor descobriu isso ao rodar o teste — esperava um array mas recebia o objeto completo.

## json_build_object: formatando no SQL

Ao inves de fazer o JOIN e depois mapear no codigo JavaScript para montar o objeto `store` aninhado, o instrutor usa `json_build_object` direto no PostgreSQL. Isso significa que o banco ja retorna o JSON no formato exato que a API precisa:

```json
{
  "id": 1,
  "name": "Feijao Preto",
  "price": 8.99,
  "embedding": "...",
  "store": { "id": 3, "name": "Mercado Central" }
}
```

O instrutor comenta: "A gente poderia fazer so o join e manipular no codigo, mas da pra fazer aqui diretamente." Isso reduz codigo de mapeamento no backend.

## A armadilha do array vazio de parametros

Quando o instrutor implementou a busca, inicialmente passava um array vazio `[]` quando nao havia search. O PostgreSQL retorna erro porque a query nao tem placeholders `$1` mas recebe um array de parametros. A solucao foi condicionar: se tem search, passa array com o valor; se nao tem, nao passa segundo argumento.

## Lifecycle de conexao e testes

O teste ficava "pendente" (nao encerrava) porque:
1. A conexao com o banco permanecia aberta
2. O app NestJS nao era fechado no afterAll

Solucao em duas partes:
- Implementar `onApplicationShutdown` no PostgresService para fechar a conexao
- Chamar `app.enableShutdownHooks()` E `app.close()` nos testes

O instrutor enfatiza: "tem que sempre habilitar, tanto pra execucao em producao como la no teste tambem."

## Alias de importacao falhando nos testes

O instrutor enfrentou erro `Cannot find module` porque o Copilot sugeriu importacao com `src/shared` ao inves do alias `@shared`. No ambiente de teste (vitest/jest), o resolver de alias pode nao estar configurado. A solucao pragmatica foi usar caminho relativo nos testes: "Nao e absolutamente ideal, mas tambem nao e um problema gigantesco."

## ILIKE para busca case-insensitive

A busca usa `ILIKE` (case-insensitive LIKE do PostgreSQL) com wildcards `%termo%` dos dois lados. Isso permite buscar "feijao" e encontrar "Feijao Preto". O instrutor reconhece que ha espaco para melhorias (paginacao, ordenacao, filtro por loja) mas foca no essencial.