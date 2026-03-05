# Deep Explanation: Relacionamentos no Drizzle ORM

## As duas camadas de relacionamento

O Drizzle separa de forma intencional o que é **banco de dados** do que é **aplicação**:

1. **`references()`** — cria a foreign key constraint no banco. Gera migrations SQL reais (`ALTER TABLE ADD CONSTRAINT`). O banco de dados vai enforçar integridade referencial.

2. **`relations()`** — ensina o Drizzle ORM a fazer joins no código TypeScript. Não gera nenhuma migration. É puramente para a camada de aplicação.

O instrutor enfatiza: "esse relations que a gente criou aqui dentro, ele não serve para o banco de dados e sim para o Drizzle conseguir se encontrar na hora que a gente vai fazendo operações que envolvam joins entre tabelas."

## Por que o Drizzle não infere automaticamente?

Diferente do Prisma que tem um schema declarativo único, o Drizzle mantém as duas preocupações separadas. Isso dá controle granular: você pode ter foreign keys no banco sem expor relations no código (e vice-versa em cenários avançados).

## A armadilha dos cascades

O instrutor dá um aviso importante sobre cascades:

> "Como esses cascades operam a nível do banco de dados, isso pode gerar problemas no futuro caso você vá fazer importações, atualizações em massa — o banco de dados vai começar a tentar fazer muitas coisas de forma automatizada e isso pode travar."

O default do PostgreSQL é `NO ACTION`, que é o mais seguro mas pode deixar registros órfãos. A recomendação é:
- **`set null`** para campos nullable — mantém o registro, limpa a referência
- **`cascade`** apenas onde a regra de negócio realmente exige deleção em cadeia
- **`restrict`** quando a deleção do pai deve ser bloqueada se houver filhos

## Naming: snake_case vs camelCase

O Drizzle mapeia automaticamente entre as convenções:
- `managerId` (nome JS, usado no código) → `manager_id` (nome da coluna SQL)
- Isso é feito passando o nome da coluna como primeiro argumento: `text('manager_id')`

## Quando criar relation nos dois lados?

O instrutor é pragmático: "criar o relacionamento dos dois lados é obrigatório? Não." 

A regra é simples: se existe uma operação na aplicação que precisa trazer dados daquela direção do relacionamento, crie. Se não existe, não crie. "A gente adiciona caso seja necessário."

Exemplo concreto do instrutor:
- Listar restaurantes e trazer dados do gerente → precisa de `restaurantsRelations` com `one(users)`
- Listar usuários e trazer restaurantes que gerencia → só crie `usersRelations` se tiver essa operação

## O fluxo de migrations

Cada alteração no schema gera uma migration separada:
1. `bun generate` após adicionar o campo `managerId` → migration cria coluna + foreign key
2. `bun generate` após alterar cascade options → migration faz DROP da constraint antiga e cria nova (não é ALTER)
3. `bun generate` após adicionar `relations()` → nenhuma migration gerada (relations é só código)

## one vs many

Dentro de `relations()`, a desestruturação `({ one, many })` define a cardinalidade:
- `one(users)` — este restaurante tem UM gerente
- `many(restaurants)` — este usuário gerencia VÁRIOS restaurantes

A cardinalidade é definida do ponto de vista da tabela atual, não da tabela referenciada.