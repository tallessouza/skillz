# Code Examples: Utilizando Seed com Knex

## Configuracao completa do knexfile

```typescript
// knexfile.ts
import { Knex } from "knex";

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./database/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./database/migrations",
    extension: "ts",
  },
  seeds: {
    directory: "./database/seeds",
    extension: "ts",
  },
};

export default config;
```

## Seed basico da aula (insert sem del)

```typescript
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("courses").insert([
    { name: "CSS" },
    { name: "JavaScript" },
    { name: "React" },
    { name: "Node.js" },
    { name: "Git" },
    { name: "GitHub" },
    { name: "TypeScript" },
    { name: "Express.js" },
    { name: "Banco de Dados" },
  ]);
}
```

## Seed idempotente (com del antes do insert)

```typescript
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Limpa a tabela antes de inserir — garante mesmo resultado toda vez
  await knex("courses").del();

  await knex("courses").insert([
    { name: "CSS" },
    { name: "JavaScript" },
    { name: "React" },
    { name: "Node.js" },
  ]);
}
```

## Seed com multiplas colunas

```typescript
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").insert([
    { name: "Alice", email: "alice@email.com", role: "admin" },
    { name: "Bob", email: "bob@email.com", role: "user" },
    { name: "Carol", email: "carol@email.com", role: "user" },
  ]);
}
```

## Seeds com ordem de dependencia

```
database/seeds/
├── 01-insert-courses.ts      # Primeiro: cursos
├── 02-insert-instructors.ts   # Segundo: instrutores
└── 03-insert-lessons.ts       # Terceiro: aulas (depende de cursos e instrutores)
```

```typescript
// 03-insert-lessons.ts
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("lessons").del();
  await knex("lessons").insert([
    { title: "Introducao ao CSS", course_id: 1, instructor_id: 1 },
    { title: "Flexbox", course_id: 1, instructor_id: 1 },
    { title: "Variaveis JS", course_id: 2, instructor_id: 2 },
  ]);
}
```

## Comandos de referencia

```bash
# Criar seed
npm run knex -- seed:make insert-courses

# Executar todos os seeds
npm run knex -- seed:run

# Executar seed especifico
npm run knex -- seed:run --specific=insert-courses.ts
```