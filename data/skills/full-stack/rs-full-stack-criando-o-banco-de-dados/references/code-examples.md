# Code Examples: Criando o Banco de Dados SQLite

## Exemplo 1: Criacao via terminal (Linux/Mac)

```bash
# Navegar ate a pasta do projeto
cd ~/projetos/meu-app

# Criar pasta dedicada
mkdir database

# Criar arquivo vazio
touch database/database.db

# Verificar
ls -la database/
# -rw-r--r-- 1 user user 0 Mar  1 10:00 database.db
```

## Exemplo 2: Criacao via terminal (Windows PowerShell)

```powershell
# Criar pasta
New-Item -Path "database" -ItemType Directory

# Criar arquivo vazio
New-Item -Path "database\database.db" -ItemType File

# Verificar
Get-ChildItem database\
```

## Exemplo 3: Criacao programatica em Node.js

```javascript
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DB_DIR = 'database'
const DB_FILE = 'database.db'
const dbPath = join(DB_DIR, DB_FILE)

// Criar pasta se nao existir
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true })
}

// Criar arquivo vazio se nao existir
if (!existsSync(dbPath)) {
  writeFileSync(dbPath, '')
  console.log(`Banco criado em: ${dbPath}`)
} else {
  console.log(`Banco ja existe em: ${dbPath}`)
}
```

## Exemplo 4: Usando better-sqlite3 (criacao automatica)

```javascript
import Database from 'better-sqlite3'

// O arquivo e criado automaticamente se nao existir
const db = new Database('database/database.db')

// Verificar que funciona
const result = db.pragma('journal_mode', { simple: true })
console.log('Journal mode:', result) // 'delete' ou 'wal'

db.close()
```

## Exemplo 5: Usando Knex.js com SQLite

```javascript
import Knex from 'knex'

const knex = Knex({
  client: 'better-sqlite3',
  connection: {
    filename: './database/database.db'
  },
  useNullAsDefault: true
})

// Testar conexao
await knex.raw('SELECT 1')
console.log('Banco conectado com sucesso')

await knex.destroy()
```

## Exemplo 6: Gitignore para pasta database

```gitignore
# Ignorar arquivos de banco de dados (dados locais)
database/*.db
database/*.sqlite
database/*.sqlite3

# Mas manter a pasta (com .gitkeep)
!database/.gitkeep
```

## Variacoes de nomes comuns

```bash
# Por projeto
touch database/meu-app.db

# Por ambiente
touch database/dev.db
touch database/test.db
touch database/production.db

# Nome generico (usado no curso)
touch database/database.db
```