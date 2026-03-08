# Deep Explanation: Criando o Modelo das Tabelas

## Por que simplificar a URL do banco

Quando o Prisma é inicializado com `npx prisma init`, ele cria automaticamente uma variável `DATABASE_URL` no `.env` e referencia com `env("DATABASE_URL")` no schema. Para projetos de estudo ou protótipos com SQLite, isso adiciona complexidade desnecessária. Colocar `"file:./dev.db"` diretamente no schema elimina a dependência do `.env` e permite focar na modelagem.

Em produção, **sempre** use variáveis de ambiente — a simplificação é válida apenas para desenvolvimento local.

## Enums como contratos de tipo

O instrutor cria duas enums: `UserRule` (perfis de usuário) e `Category` (categorias de solicitação de reembolso). A decisão de usar enums ao invés de strings ou tabelas separadas reflete:

- **Type-safety:** O Prisma gera tipos TypeScript correspondentes, impossibilitando valores inválidos em tempo de compilação
- **Simplicidade:** Para conjuntos pequenos e estáveis (EMPLOYEE/MANAGER, categorias fixas), enums evitam JOINs desnecessários
- **Trade-off:** Se as categorias precisarem ser dinâmicas (adicionadas via UI), uma tabela separada seria mais adequada

## Padrão de ID com UUID

A escolha de `String @id @default(uuid())` ao invés de autoincrement:

- **Distribuído:** UUIDs podem ser gerados em qualquer lugar sem coordenação com o banco
- **Segurança:** Não expõe a quantidade de registros (ao contrário de IDs sequenciais)
- **Trade-off:** UUIDs são maiores (36 chars) e podem impactar performance em índices — para SQLite em desenvolvimento, irrelevante

## Mapeamento camelCase → snake_case

O Prisma usa camelCase nos modelos TypeScript (`createdAt`, `userId`), mas o padrão de bancos SQL é snake_case (`created_at`, `user_id`). O instrutor usa:

- `@map("created_at")` em campos individuais
- `@@map("users")` para o nome da tabela

Isso mantém as convenções corretas em ambos os mundos: TypeScript idiomático no código, SQL idiomático no banco.

## Relacionamento 1:N (User → Refound)

A relação é bidirecional no schema:

1. **Lado "muitos" (Refound):** Declara `userId String` (FK) e `user User @relation(fields: [userId], references: [id])`
2. **Lado "um" (User):** Declara `refounds Refound[]`

O Prisma **exige** que ambos os lados existam. Se você declarar apenas um lado, o editor mostra erro. A declaração `fields: [userId], references: [id]` é explícita — diz que o campo `userId` no Refound aponta para o campo `id` no User.

## Campo `updatedAt` opcional com `@updatedAt`

O instrutor usa `DateTime? @updatedAt` — o `?` torna o campo nullable porque na criação inicial o registro ainda não foi atualizado. O decorator `@updatedAt` faz o Prisma atualizar automaticamente o timestamp em cada `update()`, sem necessidade de lógica manual.

## Default para enum (`@default(EMPLOYEE)`)

Todo usuário cadastrado começa como EMPLOYEE. Para promover a MANAGER, altera-se diretamente no banco (ou via endpoint admin futuro). Essa decisão de design segue o princípio do menor privilégio — ninguém começa com permissões elevadas.

## Workflow: migrate → studio

A sequência `npx prisma migrate dev --name create-tables` seguida de `npx prisma studio`:

1. **migrate dev:** Gera SQL a partir do schema, aplica no banco, cria pasta de migration com histórico
2. **studio:** Interface visual para inspecionar tabelas e dados — útil para validar que a estrutura está correta antes de escrever código

O `--name` é descritivo e aparece no nome da pasta de migration (ex: `20240115_create_tables`), facilitando o histórico.