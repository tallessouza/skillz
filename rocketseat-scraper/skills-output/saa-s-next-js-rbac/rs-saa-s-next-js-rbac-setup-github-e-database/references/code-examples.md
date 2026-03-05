# Code Examples: Setup GitHub e Database

## Criando repositorio com GitHub CLI

### Comando completo interativo

```bash
gh repo create
```

O comando inicia um wizard interativo com as seguintes opcoes:

```
? What would you like to do?
  Create a new repository on GitHub from scratch
> Push an existing local repository to GitHub
  Clone a remote repository to your local machine
```

Selecionar "Push an existing local repository" quando o projeto ja tem `.git` inicializado.

### Fluxo completo de respostas

```
? Path to local repository: .
? Repository name: next-saas-rbac
? Repository owner: rocketseat-education
? Description:
? Visibility: Private
? Add a remote? Yes
? What should the new remote be called? origin
? Would you like to push commits from the current branch to "origin"? Yes
```

### Verificar repositorio no browser

```bash
gh repo view -w
```

Este comando abre o repositorio recem-criado no navegador padrao.

## Configuracao do Neon

### Interface do Neon — campos de criacao

| Campo | Valor usado na aula | Notas |
|-------|---------------------|-------|
| Project name | `next-saas` | Nome descritivo do projeto |
| Postgres version | 16 | Mais recente disponivel |
| Region | US East (Ohio) | Escolher proxima ao servidor de deploy |
| Compute size | Menor disponivel | Suficiente para desenvolvimento |
| Suspend after | 5 minutes | Economiza recursos quando ocioso |

### Connection string gerada

```
postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Usando a connection string no projeto

```bash
# No arquivo .env local
DATABASE_URL="postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Verificando conexao (opcional)

```bash
# Com psql
psql "$DATABASE_URL"

# Com Prisma (se o projeto usa)
npx prisma db push
npx prisma migrate deploy
```

## Alternativas ao Neon mencionadas

O instrutor menciona que "existem varias alternativas para hospedar Postgres". Algumas opcoes comuns:
- **Neon** (usado na aula) — serverless, auto-suspend, free tier 500MB
- **Supabase** — Postgres + extras (auth, storage), free tier disponivel
- **Railway** — simples, free tier limitado
- **Render** — managed Postgres, free tier disponivel
- **Amazon RDS** — producao, sem free tier permanente