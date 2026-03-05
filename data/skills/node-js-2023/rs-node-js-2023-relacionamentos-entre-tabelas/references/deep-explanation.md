# Deep Explanation: Relacionamentos entre Tabelas no Prisma

## Tipos de Relacionamento — Quando usar cada um

### 1:1 (Um para Um)
Um dado de uma tabela se relaciona com apenas um dado de outra. O instrutor destaca que nesse caso os dados **poderiam estar na mesma tabela** — a separacao e puramente semantica, para organizar melhor o schema.

### 1:N (Um para Muitos)
O caso mais comum. Exemplo concreto da aula: um usuario pode fazer varios check-ins. O usuario e o "um", os check-ins sao os "muitos". A foreign key (`user_id`) fica sempre no lado "muitos" (CheckIn).

### N:N (Muitos para Muitos)
O instrutor usa uma analogia interessante: imagine um **grupo de academia** onde 4 pessoas fazem check-in juntas. Nesse caso, um check-in estaria associado a varios usuarios, e cada usuario teria varios check-ins. Requer tabela intermediaria (pivot table).

## A Magica da Extensao do Prisma

O instrutor mostra que ao usar a extensao do Prisma no VSCode com `format-on-save`:

1. Voce escreve apenas `user User` no model CheckIn
2. Ao salvar, a extensao automaticamente:
   - Adiciona `@relation(fields: [userId], references: [id])`
   - Cria o campo `userId String`
   - Cria o relacionamento inverso `checkIns CheckIn[]` no model User

Isso elimina muito trabalho manual e erros.

## O que gera coluna vs o que nao gera

Ponto fundamental enfatizado varias vezes na aula:

- **Gera coluna no banco:** Campos com tipos primitivos "azulzinhos" — `String`, `DateTime`, `Int`, `Boolean`, `Decimal`
- **NAO gera coluna:** Campos com tipos de Model — `User`, `Gym`, `CheckIn[]`

Os campos de Model existem apenas para o Prisma Client entender os relacionamentos e permitir queries relacionais no JavaScript. Ao rodar a migration, apenas as foreign keys e colunas primitivas sao criadas.

## Convencao de nomes — a decisao consciente

O instrutor faz uma escolha deliberada:

- **Foreign keys (colunas reais):** `user_id`, `gym_id` — snake_case porque sao colunas SQL
- **Campos de relacionamento (so Prisma):** `user`, `gym`, `checkIns` — camelCase porque serao acessados no JavaScript

Ele troca manualmente o `userId` gerado automaticamente pela extensao para `user_id` com underscore, porque e uma coluna de banco de dados.

## Verificacao com Prisma Studio

Apos rodar `npx prisma migrate dev --name create_relationships`, o instrutor mostra no Prisma Studio que:

- A tabela CheckIn tem colunas `user_id` e `gym_id` (colunas reais)
- Tambem mostra os relacionamentos `user` e `gym` (porque o Studio le o schema)
- Na tabela User, ao clicar em um usuario, e possivel ver todos os check-ins associados
- Ao criar um check-in, e possivel selecionar o usuario e a academia via interface visual

## Migration gerada

O SQL gerado pela migration:
1. Adiciona colunas `gym_id` e `user_id` na tabela `check_ins`
2. Adiciona duas `FOREIGN KEY` constraints
3. NAO cria nenhuma coluna nas tabelas `users` ou `gyms` — os campos de array (`checkIns CheckIn[]`) sao apenas metadados do Prisma