# Deep Explanation: Instalando e Configurando o Prisma

## Por que usar um ORM como o Prisma?

O instrutor apresenta o Prisma como um **intermediario** entre o codigo TypeScript e o PostgreSQL. Os problemas que ele resolve ao evitar SQL puro:

1. **Sem autocomplete** — escrevendo SQL como string, o editor nao ajuda com nomes de colunas ou tabelas
2. **Erros de digitacao** — facil errar um nome de coluna dentro de uma string SQL e so descobrir em runtime
3. **Seguranca** — SQL injection e um risco real quando se concatena strings para montar queries
4. **Falta de tipos** — o codigo TypeScript nao sabe quais tipos de dados retornam do banco, perdendo toda a vantagem do type system

## A convencao do @@map

O instrutor enfatiza uma **boa pratica** importante: manter nomes diferentes no codigo e no banco.

- **No codigo TypeScript:** `Appointment` (PascalCase, singular) — segue convencoes do JavaScript/TypeScript
- **No banco de dados:** `appointments` (minusculo, plural) — segue convencoes de normalizacao de banco de dados

O `@@map("appointments")` faz essa ponte. Isso permite que cada camada siga suas proprias convencoes sem comprometer a outra.

## Estrutura do schema.prisma

O arquivo gerado pelo `prisma init` tem tres blocos:

### generator client
Configura como o Prisma Client sera gerado. O `provider = "prisma-client-js"` indica que queremos o client para JavaScript/TypeScript. O `output` define onde os arquivos gerados serao salvados — esse diretorio deve ir no `.gitignore`.

### datasource db
Configura a conexao com o banco. O `provider` indica o tipo de banco (postgresql, mysql, sqlite). A `url` usa `env()` para ler de variavel de ambiente — **nunca** hardcode credenciais no schema.

### model
Define as tabelas. Cada campo tem nome e tipo. Decorators como `@id`, `@default(uuid())` e `@@map()` configuram comportamentos especificos.

## Pratica de seguranca com .env

O instrutor mostra um padrao importante:
- `.env` contem os valores reais e esta no `.gitignore`
- `.env.example` e commitado mas sem valores sensiveis, servindo como documentacao das variaveis necessarias

## Connection string PostgreSQL

A estrutura da URL: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`

No exemplo do projeto com Docker local:
- User: `docker`
- Password: `docker`
- Host: `localhost`
- Port: `5432` (porta padrao do PostgreSQL)
- Database: `petshop`
- Schema: `public`

## Migrations

O comando `npx prisma migrate dev --name init` faz tres coisas:
1. Compara o schema atual com o estado do banco
2. Gera um arquivo SQL de migration
3. Aplica a migration no banco

A flag `--name init` nomeia a migration, criando um historico legivel de mudancas no banco.