# Code Examples: Instalando e Configurando o Prisma

## Instalação do Prisma

### Comando de instalação com versão fixa
```bash
npm i prisma@5.19.1 -D
```

### Inicialização com provider PostgreSQL
```bash
npx prisma init --datasource-provider postgresql
```

### Outros providers disponíveis (para referência)
```bash
# SQLite (padrão se não especificar)
npx prisma init --datasource-provider sqlite

# MySQL
npx prisma init --datasource-provider mysql

# SQL Server
npx prisma init --datasource-provider sqlserver

# MongoDB
npx prisma init --datasource-provider mongodb
```

## Arquivo schema.prisma gerado

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Configuração da DATABASE_URL

### Formato genérico
```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"
```

### Exemplo do projeto (rocketlog)
```env
DATABASE_URL="postgresql://postguis:postguis@localhost:5432/rocketlog"
```

### Variações comuns
```env
# PostgreSQL local sem senha
DATABASE_URL="postgresql://postgres@localhost:5432/mydb"

# PostgreSQL com porta customizada
DATABASE_URL="postgresql://postgres:senha@localhost:5433/mydb"

# PostgreSQL remoto (ex: Railway, Render)
DATABASE_URL="postgresql://user:pass@host.railway.app:5432/railway"

# Com parâmetros de conexão
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb?schema=public&connection_limit=5"
```

## Script de dev com --env-file

### package.json configurado
```json
{
  "scripts": {
    "dev": "tsx watch --env-file .env src/server.ts"
  }
}
```

### Variação com tsc (como mencionado na aula)
```json
{
  "scripts": {
    "dev": "tsc watch --env-file .env"
  }
}
```

### Variação com múltiplos arquivos env
```json
{
  "scripts": {
    "dev": "tsx watch --env-file .env --env-file .env.local src/server.ts"
  }
}
```

## Arquivo .env

### Versão completa (gitignored)
```env
DATABASE_URL="postgresql://postguis:postguis@localhost:5432/rocketlog"
```

## Arquivo .env-example

### Opção 1: Apenas chaves (recomendado para dados sensíveis)
```env
DATABASE_URL=
```

### Opção 2: Com valor genérico como referência
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
```

### Opção 3: Com instruções em comentário
```env
# Connection string do PostgreSQL
# Formato: postgresql://USUARIO:SENHA@HOST:PORTA/BANCO
DATABASE_URL=
```

## .gitignore relevante

```gitignore
node_modules
.env
```

O `.env-example` **não** aparece no `.gitignore` — ele é commitado intencionalmente.

## Docker Compose de referência (contexto do projeto)

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postguis
      POSTGRES_PASSWORD: postguis
      POSTGRES_DB: rocketlog
    ports:
      - "5432:5432"
```

A `DATABASE_URL` no `.env` deve espelhar exatamente essas configurações.