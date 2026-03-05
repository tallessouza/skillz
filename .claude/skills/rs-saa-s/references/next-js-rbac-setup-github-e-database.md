---
name: rs-saas-nextjs-rbac-setup-github-db
description: "Guides setup of GitHub repository and Neon Postgres database for Next.js SaaS deployment. Use when user asks to 'deploy nextjs app', 'setup github repo for deploy', 'create neon database', 'configure postgres for saas', or 'prepare project for deployment'. Follows gh CLI repo creation and Neon free-tier DB provisioning. Make sure to use this skill whenever setting up deployment infrastructure for a Next.js SaaS project. Not for application code, authentication, RBAC implementation, or Vercel/hosting configuration."
---

# Setup GitHub e Database para Deploy

> Antes de fazer deploy, crie o repositorio no GitHub via CLI e provisione o banco Postgres no Neon.

## Prerequisites

- GitHub CLI (`gh`) instalado e autenticado
- Git inicializado no projeto
- Conta no Neon (neon.tech) — plano gratuito ate 500MB

## Steps

### Step 1: Criar repositorio no GitHub via CLI

```bash
gh repo create
```

Selecionar: **Push an existing local repository to GitHub**

```
? What would you like to do? Push an existing local repository to GitHub
? Path to local repository: .
? Repository name: next-saas-rbac
? Repository owner: {seu-usuario}
? Description:
? Visibility: Private
? Add a remote? Yes
? What should the new remote be called? origin
? Would you like to push commits from the current branch to "origin"? Yes
```

Verificar no browser:

```bash
gh repo view -w
```

### Step 2: Provisionar Postgres no Neon

1. Acessar [neon.tech](https://neon.tech) e criar conta
2. Clicar em **New Project**
3. Configurar:
   - **Name:** nome do projeto (ex: `next-saas`)
   - **Postgres version:** mais recente (16+)
   - **Region:** mais proxima dos usuarios (ex: US East Ohio)
   - **Compute size:** menor valor disponivel
   - **Suspend after inactivity:** 5 minutos
4. Copiar a **connection string** gerada

### Step 3: Configurar variavel de ambiente

```bash
# .env (local) ou variavel no provider de deploy
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## Output format

Ao final deste workflow:
- Repositorio privado no GitHub com codigo pushado
- Banco Postgres provisionado no Neon com connection string disponivel
- Projeto pronto para deploy do back-end

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto ja tem Git mas nao tem remote | Usar `gh repo create` com "push existing" |
| Aplicacao com uso moderado/intermitente | Ativar suspend after inactivity (5min) para economizar |
| Aplicacao com uso continuo/producao | Desativar auto-suspend para evitar latencia de cold start |
| Banco abaixo de 500MB | Plano gratuito do Neon e suficiente |
| Precisa de outra regiao | Escolher regiao mais proxima dos usuarios finais |

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Criar repo manualmente no browser | Usar `gh repo create` via CLI |
| Deixar repo publico durante desenvolvimento | Criar como private, tornar publico depois |
| Hardcodar connection string no codigo | Usar variavel de ambiente `DATABASE_URL` |
| Ignorar auto-suspend em projetos pessoais | Ativar para economizar no plano gratuito |
| Criar banco sem verificar regiao | Escolher regiao proxima ao servidor de deploy |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-setup-github-e-database/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-setup-github-e-database/references/code-examples.md)
