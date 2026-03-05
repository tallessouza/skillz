# Deep Explanation: Utilizando Seed com Knex

## O que e Seed e por que usar

Seed e um recurso do Query Builder (Knex) que permite popular tabelas com multiplos registros de uma vez. Diferente de fazer INSERT individual via codigo, o seed e um arquivo executavel que roda sob demanda.

### Cenarios de uso

1. **Dados iniciais**: Sua aplicacao precisa de registros base para funcionar (ex: categorias, roles, permissoes). O seed garante que esses dados existam.
2. **Dados de exemplo**: Em desenvolvimento, voce quer ter registros na tabela para testar listagens, filtros, paginacao. O seed popula rapidamente.
3. **Insercao em massa**: Qualquer cenario onde voce precisa inserir varios registros de uma vez.

## Paralelo com Migrations

O instrutor faz um paralelo direto: assim como migrations tem uma pasta configurada no knexfile (`migrations.directory`), seeds tambem precisam de configuracao propria (`seeds.directory`). A estrutura espelha:

```
database/
├── migrations/    # Schema (estrutura)
└── seeds/         # Data (conteudo)
```

Migrations controlam ESTRUTURA (criar tabela, adicionar coluna). Seeds controlam DADOS (inserir registros).

## Template padrao do Knex

Quando voce roda `seed:make`, o Knex gera um template com `del()` + `insert()`. O `del()` (equivalente a DELETE FROM tabela) limpa todos os registros antes de inserir. O instrutor remove o `del()` porque no caso da aula nao queria limpar a tabela — isso e uma decisao por cenario:

- **Com `del()`**: Seed e idempotente — pode rodar N vezes e sempre tera os mesmos dados
- **Sem `del()`**: Seed acumula — cada execucao adiciona mais registros (cuidado com duplicatas)

## Por que nao incluir o ID

O instrutor remove explicitamente o campo `id` dos objetos do insert. A razao: quando a coluna id e auto-increment (configurada na migration com `increments`), o banco de dados gera o valor automaticamente. Incluir o id manualmente pode causar conflitos ou quebrar a sequencia do auto-increment.

## Comandos: make vs run

- `seed:make` = CRIAR o arquivo de seed (assim como `migrate:make` cria o arquivo de migration)
- `seed:run` = EXECUTAR todos os seeds (diferente de migrations que tem `latest`, seeds sempre rodam todos)

Diferenca importante: `migrate:latest` so roda migrations pendentes. `seed:run` roda TODOS os seeds toda vez. Por isso o `del()` no template padrao faz sentido — garante idempotencia.

## Ordem de execucao

Seeds rodam em ordem alfabetica do nome do arquivo. Se voce tem dependencias entre tabelas (ex: cursos antes de aulas), use prefixos numericos:

```
01-insert-courses.ts
02-insert-lessons.ts
```