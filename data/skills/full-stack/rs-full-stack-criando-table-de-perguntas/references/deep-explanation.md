# Deep Explanation: Criando Tabelas com Prisma

## Por que camelCase no model e snake_case no banco?

O Prisma impoe camelCase nas propriedades do schema. Se voce tentar usar `created_at` diretamente no model, o Prisma vai rejeitar com erro de validacao. Isso e uma decisao de design do Prisma: o schema e a interface da aplicacao, entao segue convencoes JavaScript/TypeScript.

Porem, bancos de dados relacionais tradicionalmente usam snake_case para nomes de colunas. O `@map()` resolve esse conflito: voce escreve codigo TypeScript idiomatico e o banco mantem suas convencoes SQL.

### A separacao de responsabilidades

- **Model** = como voce manipula no codigo → `createdAt`, `userId`
- **Banco** = como fica armazenado → `created_at`, `user_id`
- **@@map** = como a tabela se chama → model `Question` vira tabela `questions`

## O poder do @updatedAt

O decorator `@updatedAt` e especial no Prisma. Ele nao e apenas um valor default — ele e um **comportamento automatico**. Toda vez que qualquer campo do registro e modificado via Prisma Client, o campo marcado com `@updatedAt` e atualizado automaticamente para `new Date()`.

Isso significa:
- Voce nunca precisa setar manualmente
- Nunca esquece de atualizar
- Funciona em `update`, `updateMany`, `upsert`

Comparado ao `@default(now())` do `createdAt` que so roda na insercao, o `@updatedAt` roda em cada modificacao.

## @default(now()) vs @updatedAt

| Decorator | Quando executa | Uso |
|-----------|---------------|-----|
| `@default(now())` | Apenas na criacao do registro | `createdAt` |
| `@updatedAt` | Em cada update do registro | `updatedAt` |

## Workflow de migracao

Apos criar ou modificar um model:
1. `npx prisma migrate dev --name descricao-da-mudanca`
2. O Prisma gera SQL de migracao automaticamente
3. Aplica no banco de desenvolvimento
4. Se usar Prisma Studio, reinicie-o para ver as novas tabelas

O instrutor destacou que o Prisma Studio precisa ser reiniciado apos novas migracoes — ele nao detecta mudancas de schema automaticamente.

## Convencao de nomes para migrations

O nome da migration deve descrever a mudanca: `create-table-questions`, `add-column-email`, `rename-field-title`. Isso facilita o historico de evolucao do banco.