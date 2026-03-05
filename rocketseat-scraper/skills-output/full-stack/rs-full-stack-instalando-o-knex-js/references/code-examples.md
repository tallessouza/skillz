# Code Examples: Instalando o Knex.js

## Instalacao basica (curso — SQLite)

```bash
# Comando exato usado na aula
npm i knex@3.1.0 sqlite3@5.1.7
```

Resultado esperado no `package.json`:
```json
{
  "dependencies": {
    "knex": "^3.1.0",
    "sqlite3": "^5.1.7"
  }
}
```

## Instalacao para outros bancos

### PostgreSQL
```bash
npm i knex@3.1.0 pg
```

### MySQL
```bash
npm i knex@3.1.0 mysql2
```

### MSSQL
```bash
npm i knex@3.1.0 tedious
```

## Verificacao pos-instalacao

```bash
# Verificar que ambos os pacotes foram instalados
npm ls knex
npm ls sqlite3
```

## Erro comum: instalar apenas o Knex

```bash
# ERRADO — vai falhar ao tentar conectar
npm i knex

# CORRETO — instala query builder + driver
npm i knex sqlite3
```

Sem o driver, ao tentar criar uma conexao o Knex lanca:
```
Error: Cannot find module 'sqlite3'
```

## Fluxo completo no terminal (como mostrado na aula)

```bash
# Terminal 1: aplicacao rodando (manter aberto)
npm run dev

# Terminal 2: instalacao (novo terminal)
npm i knex@3.1.0 sqlite3@5.1.7

# Apos instalacao, fechar Terminal 2 e voltar ao Terminal 1
```

O instrutor manteve a aplicacao rodando em um terminal enquanto fez a instalacao em outro — boa pratica para nao perder o servidor de desenvolvimento.