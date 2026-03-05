---
name: rs-testes-arq-frontend-deploy
description: "Applies Next.js + Prisma deploy workflow to Vercel when user asks to 'deploy to Vercel', 'configure production build', 'setup Prisma for deploy', 'connect database on Vercel', or 'fix Next.js vulnerability'. Covers build script with Prisma generate/migrate, Vercel Postgres setup, preview deploys, and React Server Components security patches. Make sure to use this skill whenever deploying a Next.js app with Prisma to Vercel or troubleshooting blocked deploys due to vulnerabilities. Not for local development setup, Docker configuration, or non-Vercel hosting platforms."
---

# Deploy Next.js + Prisma na Vercel

> Configurar build scripts, banco de dados e seguranca para deploy de aplicacoes Next.js com Prisma na Vercel.

## Prerequisites

- Projeto Next.js com Prisma configurado
- Conta na Vercel linkada ao GitHub
- Repositorio no GitHub com o projeto

## Steps

### Step 1: Configurar build script no package.json

O `next build` sozinho nao funciona em producao porque o Prisma precisa gerar a pasta `generated` antes do build.

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

A ordem importa: `generate` cria os tipos, `migrate deploy` aplica migracoes pendentes, `next build` compila.

### Step 2: Verificar vulnerabilidades do React Server Components

Antes do deploy, verificar se a versao do Next.js/React esta livre da vulnerabilidade CVE de Remote Code Execution (RCE) nos React Server Components.

```bash
# Verificar versao atual
cat package.json | grep -E "next|react"
```

| Versao React afetada | Atualizar para |
|---------------------|----------------|
| 15.0.0 - 15.0.4 | >= 15.0.5 |
| 16.0.0 - 16.0.6 | >= 16.0.10 |

A Vercel bloqueia deploys com versoes vulneraveis — o deploy vai falhar com aviso de seguranca.

```bash
# Atualizar dependencias
pnpm install next@latest react@latest react-dom@latest

# Instalacao limpa (se necessario)
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Step 3: Configurar ESLint para ignorar coverage

Adicionar a pasta `coverage/` ao ignore do ESLint para evitar warnings no pre-push hook.

```javascript
// eslint.config.mjs
export default [
  // ... configs existentes
  {
    ignores: ["coverage/**"]
  }
]
```

### Step 4: Deploy na Vercel

1. Criar projeto na Vercel → Import do repositorio GitHub
2. Framework detectado automaticamente como Next.js
3. Nao alterar configuracoes default — deploy Next.js na Vercel funciona out of the box

### Step 5: Criar banco de dados na Vercel

1. Ir em **Storage** no projeto da Vercel
2. Selecionar **Prisma Postgres** → Create
3. Manter plano Free
4. Usar o mesmo nome do banco definido no docker-compose local
5. Em **Connect Projects**, usar o prefixo da variavel de ambiente (ex: `DATABASE`) — a Vercel adiciona o sufixo `_URL` automaticamente
6. As environment variables sao injetadas automaticamente no projeto

### Step 6: Subir branch e testar preview

```bash
git add .
git commit -m "feat: configure build for production deploy"
git push origin nome-da-branch
```

A Vercel cria automaticamente um **deploy preview** com URL customizada para cada branch/PR — usar para testar antes de ir para producao.

## Verification

- [ ] Build script inclui `prisma generate && prisma migrate deploy` antes de `next build`
- [ ] Versao do React/Next.js livre de vulnerabilidades conhecidas
- [ ] ESLint nao reporta warnings em arquivos de coverage
- [ ] Deploy preview funcional com banco de dados conectado
- [ ] CRUD completo funcionando no preview (criar, buscar, editar, deletar)

## Error handling

| Situacao | Solucao |
|----------|---------|
| Deploy bloqueado por vulnerabilidade | Atualizar Next.js/React para versao corrigida |
| Erro de Prisma no build | Verificar se `prisma generate` esta antes de `next build` no script |
| Banco nao conectado | Verificar em Storage se o banco esta listado e conectado ao projeto |
| ESLint warning no coverage | Adicionar `coverage/**` ao ignores do ESLint config |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-fazendo-o-deploy-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-fazendo-o-deploy-2/references/code-examples.md)
