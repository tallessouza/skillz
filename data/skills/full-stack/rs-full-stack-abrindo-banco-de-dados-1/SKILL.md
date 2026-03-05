---
name: rs-full-stack-abrindo-banco-de-dados-1
description: "Guides connecting to SQLite databases using BeeKeeper Studio GUI client. Use when user asks to 'open database', 'view SQLite file', 'connect BeeKeeper', 'inspect database tables', or 'browse database'. Applies steps for creating, saving, and reusing database connections. Make sure to use this skill whenever setting up database visualization for SQLite projects. Not for database migrations, query writing, or schema design."
---

# Abrindo Banco de Dados com BeeKeeper Studio

> Conecte-se ao banco SQLite via BeeKeeper Studio para visualizar e inspecionar tabelas durante o desenvolvimento.

## Prerequisites

- BeeKeeper Studio instalado
- Arquivo `.db` SQLite ja criado pelo projeto (ex: `src/database/database.db`)

## Steps

### Step 1: Criar nova conexao

1. Abrir BeeKeeper Studio
2. Clicar em **New Connection**
3. Selecionar **SQLite** como tipo de banco

### Step 2: Selecionar arquivo do banco

1. Clicar em **Choose File**
2. Navegar ate o diretorio do projeto: `src/database/`
3. Selecionar o arquivo `.db`
4. Clicar em **Open**

### Step 3: Salvar conexao para reutilizacao

1. Dar um nome descritivo a conexao (ex: `Restaurant`)
2. Clicar em **Save** — a conexao fica salva para reconexoes futuras
3. Clicar em **Connect**

### Step 4: Inspecionar tabelas

1. No painel lateral, expandir a tabela clicando na seta
2. Verificar as colunas e tipos configurados

## Output format

Conexao salva e reutilizavel no BeeKeeper Studio, com acesso visual as tabelas e colunas do banco SQLite.

## Error handling

- Se o arquivo `.db` nao aparece: verificar se as migrations ja foram executadas, porque o arquivo so existe apos a primeira migration
- Se a conexao falha: verificar se o servidor da API nao esta travando o arquivo (fechar o servidor antes de conectar, se necessario)

## Verification

- A tabela esperada aparece no painel lateral do BeeKeeper
- As colunas correspondem ao schema definido nas migrations

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ferramentas de visualizacao de banco
- [code-examples.md](references/code-examples.md) — Exemplos de navegacao e uso do BeeKeeper