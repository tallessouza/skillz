# Code Examples: Script de Execução Knex com TypeScript

## Setup completo do package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "knex": "node --import tsx ./node_modules/.bin/knex",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

## Comandos de Migration

### Criar uma migration
```bash
npm run knex -- migrate:make create-courses
# Cria: database/migrations/20240101120000_create-courses.ts
```

### Criar migration com nome descritivo
```bash
npm run knex -- migrate:make add-description-to-courses
npm run knex -- migrate:make create-users
npm run knex -- migrate:make add-user-id-to-courses
```

### Executar todas as migrations pendentes
```bash
npm run knex -- migrate:latest
```

### Reverter a ultima migration
```bash
npm run knex -- migrate:rollback
```

### Reverter todas as migrations
```bash
npm run knex -- migrate:rollback --all
```

### Ver status das migrations
```bash
npm run knex -- migrate:status
```

### Listar migrations executadas e pendentes
```bash
npm run knex -- migrate:list
```

## Comandos de Seed

### Criar um seed
```bash
npm run knex -- seed:make 01-courses
```

### Executar todos os seeds
```bash
npm run knex -- seed:run
```

### Executar seed especifico
```bash
npm run knex -- seed:run --specific=01-courses.ts
```

## Estrutura de pastas resultante

```
project/
├── database/
│   ├── migrations/
│   │   ├── 20240101120000_create-courses.ts
│   │   ├── 20240102080000_create-users.ts
│   │   └── 20240103090000_add-user-id-to-courses.ts
│   └── seeds/
│       └── 01-courses.ts
├── src/
│   ├── server.ts
│   └── database.ts
├── knexfile.ts
└── package.json
```

## Troubleshooting

### Erro: "Cannot find module tsx"
```bash
# Instalar tsx como dependencia de desenvolvimento
npm install tsx -D
```

### Erro: "No knexfile found"
```bash
# Verificar se knexfile.ts existe na raiz do projeto
ls knexfile.ts

# Ou especificar o caminho
npm run knex -- --knexfile ./src/knexfile.ts migrate:latest
```

### Erro: "migration directory does not exist"
```bash
# Verificar configuracao no knexfile.ts
# O diretorio de migrations deve estar configurado:
```

```typescript
// knexfile.ts
export default {
  client: 'sqlite3',
  connection: {
    filename: './database/app.db',
  },
  migrations: {
    directory: './database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './database/seeds',
    extension: 'ts',
  },
}
```