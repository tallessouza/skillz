# Deep Explanation: Modelagem de Tabelas com Prisma

## Por que enums em vez de strings?

O instrutor destaca que ao definir campos como `role` (perfil do usuário) e `status` (status da entrega), usar strings livres é arriscado. Qualquer valor poderia ser inserido — "admin", "ADMIN", "Admin", "adimin" — sem nenhuma validação.

Com enums do Prisma, os valores são restritos no nível do schema:
- `UserRole`: CUSTOMER, SELLER
- `DeliveryStatus`: PROCESSING, SHIPPED, DELIVERED

O instrutor menciona: "você poderia adicionar aqui outras outros perfis né, outras roles aqui para o teu usuário" — a estrutura é extensível, basta adicionar valores ao enum.

### Default values em enums

O padrão `@default(CUSTOMER)` significa que todo usuário cadastrado começa como cliente. A mudança para SELLER acontece no admin da aplicação. Isso é uma decisão de negócio codificada no schema — o banco garante que nunca haverá um usuário sem role.

Mesma lógica para entregas: `@default(PROCESSING)` — todo pedido nasce como "processando".

## Mapeamento: camelCase no código, snake_case no banco

O Prisma usa camelCase por convenção JavaScript/TypeScript. Mas bancos SQL tradicionalmente usam snake_case. O instrutor demonstra o padrão dual:

```
Código Prisma    →    Banco de Dados
─────────────         ──────────────
userId                user_id         (@map)
createdAt             created_at      (@map)
updatedAt             updated_at      (@map)
User                  users           (@@map)
Delivery              deliveries      (@@map)
DeliveryLog           delivery_logs   (@@map)
```

Isso mantém idiomático dos dois lados: o TypeScript lê `user.createdAt` e o SQL lê `SELECT created_at FROM users`.

## Relacionamentos bidirecionais

O instrutor explica que ao criar uma relação, o Prisma **exige** que ambos os lados estejam declarados:

1. **Lado que tem a FK** (Delivery): `user User @relation(fields: [userId], references: [id])`
2. **Lado inverso** (User): `deliveries Delivery[]`

O `[]` indica que um usuário pode ter **muitos** pedidos (1:N). O instrutor destaca: "o usuário pode ter muitas entregas, ele pode ter feito vários pedidos, então eu coloco aqui como um array."

### Cadeia de relacionamentos

O schema forma uma cadeia: User → Delivery → DeliveryLog

- User tem muitos Deliveries (`deliveries Delivery[]`)
- Delivery pertence a um User (`user User @relation(...)`)
- Delivery tem muitos DeliveryLogs (`logs DeliveryLog[]`)
- DeliveryLog pertence a um Delivery (`delivery Delivery @relation(...)`)

## Timestamps: createdAt e updatedAt

O padrão de timestamps é repetido em todos os modelos:

```prisma
createdAt DateTime  @default(now()) @map("created_at")
updatedAt DateTime? @updatedAt      @map("updated_at")
```

Pontos importantes:
- `createdAt` usa `@default(now())` — preenchido automaticamente na criação
- `updatedAt` usa `@updatedAt` — o Prisma atualiza automaticamente a cada update
- `updatedAt` é **opcional** (`?`) — na hora do cadastro não precisa existir
- O instrutor copia esses campos entre modelos porque são idênticos ("é exatamente o mesmo")

## Organização do schema

O instrutor sugere uma ordem visual para os campos:
1. ID (chave primária)
2. Campos de dados (name, email, password, description)
3. Campos enum (role, status)
4. Relacionamentos (user, deliveries, logs)
5. Timestamps (createdAt, updatedAt)
6. @@map (última linha)

Essa organização facilita a leitura: "para ficar mais fácil da gente ir até visualizar."

## Modelo de log como audit trail

O DeliveryLog funciona como um registro de auditoria para cada pedido. Cada mudança de status ou evento relevante gera um log com description e timestamp. Isso permite rastrear o histórico completo de uma entrega.