# Deep Explanation: Verificando Tabelas Criadas no Banco

## Por que verificar tabelas apos o deploy

O deploy de uma aplicacao Node.js com Prisma envolve uma etapa critica: a execucao das migrations no banco de producao. Essa etapa transforma os modelos definidos no `schema.prisma` em tabelas reais no banco de dados.

A verificacao pos-deploy e essencial porque:

1. **Migrations podem falhar silenciosamente** — O processo de build pode continuar mesmo se a migration encontrou um problema parcial
2. **Ambiente de producao difere do local** — Permissoes, versoes do banco, e configuracoes podem causar comportamentos inesperados
3. **Confianca no deploy** — Confirmar visualmente que as tabelas existem da seguranca para prosseguir com testes de integracao

## Fluxo de migrations no deploy

O instrutor destaca que as tabelas sao criadas "pelo nosso proprio projeto Node quando a migration foi executada no processo de build". Isso significa:

```
Deploy triggered
  → Build process starts
  → Dependencies installed
  → prisma migrate deploy (ou prisma db push)
  → Tables created/updated in production DB
  → Application starts
```

O comando `prisma migrate deploy` e diferente de `prisma migrate dev`:
- `migrate dev` — usado em desenvolvimento, pode criar novas migrations
- `migrate deploy` — usado em producao, apenas aplica migrations existentes

## Usando Beekeeper Studio para verificacao

O Beekeeper Studio e um cliente de banco de dados visual que permite:

1. **Salvar conexoes** — Manter conexoes de producao e desenvolvimento separadas
2. **Visualizar tabelas** — Ver todas as tabelas criadas no banco
3. **Inspecionar colunas** — Abrir cada tabela para ver colunas, tipos e constraints
4. **Comparar lado a lado** — Colocar o schema Prisma ao lado das tabelas reais

### Analogia do instrutor

O instrutor usa uma abordagem pratica: abrir o Beekeeper Studio ao lado do codigo do Prisma e comparar modelo por modelo. Essa comparacao visual e a forma mais intuitiva de validar que tudo foi criado corretamente.

## Mapeamento Prisma → Banco de dados

O Prisma converte modelos para tabelas seguindo convencoes:

| Prisma | Banco |
|--------|-------|
| `model User` | Tabela `users` (pluralizado, snake_case) ou conforme `@@map` |
| `String` | `VARCHAR` ou `TEXT` |
| `Int` | `INTEGER` |
| `DateTime` | `TIMESTAMP` |
| `@id @default(uuid())` | `PRIMARY KEY` com default UUID |
| `@relation` | Foreign key constraint |
| `@updatedAt` | Coluna com trigger de atualizacao automatica |

## Exemplo do projeto da aula

O instrutor verificou tres tabelas:

### Users
```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String
  password  String
  rule      String   // role/permissao do usuario
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Delivers (entregas)
```prisma
model Deliver {
  id          String   @id @default(uuid())
  userId      String
  description String
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### DeliverLogs (logs de entrega)
```prisma
model DeliverLog {
  id          String   @id @default(uuid())
  description String
  deliverId   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Cada modelo foi confirmado visualmente no Beekeeper Studio com todas as colunas correspondentes.

## Edge cases e cuidados

1. **Tabelas com `@@map`** — Se o modelo usa `@@map("nome_customizado")`, o nome no banco sera diferente do nome do modelo
2. **Enums** — Prisma cria tipos enum no PostgreSQL que tambem devem ser verificados
3. **Indices** — Alem de colunas, verificar se indices definidos com `@@index` foram criados
4. **Tabela `_prisma_migrations`** — Sempre verificar esta tabela para confirmar quais migrations foram aplicadas