# Deep Explanation: Criando Tabelas com Prisma

## Modelo = Tabela

No Prisma, a abstração principal é o **model**. Cada `model` definido no `schema.prisma` representa uma tabela no banco de dados. O instrutor enfatiza: "uma tabela no Prisma nada mais é do que um modelo". Essa é a tradução direta — você não escreve SQL, você define modelos e o Prisma gera o SQL.

## Anatomia de uma coluna

Cada linha dentro do model segue o padrão:

```
nome_coluna  Tipo  @decoradores
```

- **Nome:** identificador da coluna (`id`, `name`, `email`)
- **Tipo:** tipo Prisma (`String`, `Int`, `Boolean`, `DateTime`, etc.)
- **Decoradores:** modificadores que adicionam comportamento (`@id`, `@default`, `@unique`)

## Decoradores explicados

### `@id`
Marca o campo como chave primária da tabela. Toda tabela precisa de exatamente um `@id` (ou `@@id` composto). Sem isso, o Prisma rejeita o schema.

### `@default(uuid())`
Define o valor padrão do campo. O método `uuid()` gera automaticamente um UUID quando um novo registro é criado. O instrutor escolheu UUID porque "mistura letras com números" — é um identificador universalmente único que evita colisões mesmo entre sistemas distribuídos.

### `@unique`
Cria uma constraint de unicidade no banco. Para email, isso significa que o banco rejeita inserções duplicadas. É uma proteção no nível do banco, não apenas da aplicação.

### `@@map("nome")`
Define o nome real da tabela no banco de dados. O instrutor explica: "aqui é uma representação" (o model) e o `@@map` define "como eu quero que a tabela seja chamada lá dentro do banco". Convenção: model em PascalCase singular (`User`), tabela em snake_case plural (`users`).

## Migrations: como as mudanças chegam ao banco

O comando `npx prisma migrate dev`:

1. Compara o schema atual com o estado anterior
2. Gera um arquivo SQL com as diferenças
3. Aplica o SQL no banco de dados
4. Atualiza o Prisma Client

O Prisma cria uma pasta `migrations/` com subpastas nomeadas (timestamp + nome que você dá). Cada subpasta contém um `migration.sql` com o DDL gerado.

### Pré-requisitos para migration funcionar

- O banco de dados precisa estar rodando
- A `DATABASE_URL` no `.env` precisa estar correta (usuário, senha, porta, nome do banco)
- O instrutor verificou isso abrindo o Beekeeper Studio e conectando com as mesmas credenciais do `.env`

## SQL gerado

O Prisma gera SQL como:

```sql
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

O instrutor mostrou esse arquivo dentro de `migrations/` — ele é gerado automaticamente e serve como registro auditável de cada mudança no banco.

## Extensão Prisma no VS Code

O instrutor mencionou o syntax highlight da extensão Prisma — ela destaca palavras-chave como `model` em rosa. Isso confirma que o schema está sendo reconhecido corretamente. A extensão também fornece autocomplete para decoradores.

## Ferramentas de visualização

O instrutor usou Beekeeper Studio para verificar que a tabela foi criada corretamente no PostgreSQL. A conexão usou os mesmos dados do `.env`:
- Host: localhost
- Porta: configurada no docker-compose
- Usuário: postgres
- Senha: postgres
- Database: api