# Deep Explanation: Listando Registros com Prisma

## Por que findMany sem argumentos?

O Prisma foi desenhado para que o caso mais comum (buscar todos os registros) seja o mais simples. `findMany()` sem argumentos equivale a `SELECT * FROM table` — retorna todos os registros do model.

Isso e intencional no design do Prisma: operacoes simples devem ter APIs simples. Filtros, ordenacao e paginacao sao adicionados como argumentos opcionais quando necessario.

## O padrao Controller Index

Na arquitetura REST, cada recurso tem operacoes CRUD mapeadas para metodos HTTP:

| Operacao | HTTP Method | Action | Prisma Method |
|----------|-------------|--------|---------------|
| Listar | GET | index | findMany |
| Buscar um | GET /:id | show | findUnique |
| Criar | POST | store/create | create |
| Atualizar | PUT/PATCH /:id | update | update |
| Deletar | DELETE /:id | destroy/delete | delete |

A action `index` e especificamente para listagem — retorna uma colecao (array) de recursos.

## Fluxo da requisicao

1. Cliente faz GET `http://localhost:3333/questions`
2. Router direciona para `questionsController.index`
3. Controller executa `prisma.questions.findMany()`
4. Prisma gera SQL: `SELECT * FROM questions`
5. Resultado (array de objetos) e retornado como JSON

## Por que await e obrigatorio

Toda query do Prisma retorna uma Promise. Sem `await`, voce retornaria a Promise em vez dos dados. O framework pode ate serializar isso como `{}` sem erro visivel, criando um bug silencioso.

## Testando no Insomnia

O instrutor demonstrou a validacao criando uma HTTP request GET no Insomnia apontando para `http://localhost:3333/questions`. Ao executar, as duas perguntas previamente criadas foram retornadas — confirmando que o endpoint funciona corretamente.