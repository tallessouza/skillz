# Code Examples: Abrindo Banco de Dados com BeeKeeper Studio

## Estrutura de pastas esperada

```
api-restaurant/
├── src/
│   ├── database/
│   │   ├── database.db      ← Este e o arquivo que voce seleciona no BeeKeeper
│   │   └── migrations/
│   └── ...
├── package.json
└── ...
```

## Verificando se o arquivo existe antes de abrir

```bash
# No terminal, verificar se o banco foi criado
ls -la src/database/*.db
```

Se nao existir, rodar as migrations primeiro:

```bash
npm run migrate
# ou
npx knex migrate:latest
```

## Passos visuais no BeeKeeper

### 1. Tela inicial
```
[New Connection]  [Import]  [Recent]
```
→ Clicar em **New Connection**

### 2. Selecao de tipo
```
[ PostgreSQL ] [ MySQL ] [ SQLite ] [ MariaDB ] ...
```
→ Selecionar **SQLite**

### 3. Escolher arquivo
```
Database File: [Choose File...]
Connection Name: [Restaurant]
[Test] [Save] [Connect]
```
→ Choose File → navegar ate `src/database/database.db`
→ Nomear como `Restaurant`
→ Save → Connect

### 4. Painel apos conexao
```
📁 Restaurant
  └── 📋 Tables
       └── products
            ├── id (INTEGER, PK)
            ├── name (TEXT)
            ├── description (TEXT)
            └── price_in_cents (INTEGER)
```

## Alternativa via terminal (sem GUI)

Se nao tiver BeeKeeper disponivel, pode usar o CLI do SQLite:

```bash
# Abrir o banco no terminal
sqlite3 src/database/database.db

# Listar tabelas
.tables

# Ver schema de uma tabela
.schema products

# Sair
.quit
```