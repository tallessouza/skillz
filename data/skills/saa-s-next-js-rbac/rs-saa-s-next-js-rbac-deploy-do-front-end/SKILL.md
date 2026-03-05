---
name: rs-saas-nextjs-rbac-deploy-frontend
description: "Guides Next.js frontend deployment on Vercel with TurboRepo monorepo setup. Use when user asks to 'deploy Next.js on Vercel', 'configure Vercel for monorepo', 'fix TurboRepo build errors', 'set environment variables on Vercel', or 'deploy turborepo project'. Covers root directory config, env vars, turbo.json envMode, and ESLint/TypeScript build fixes. Make sure to use this skill whenever deploying a Next.js app from a TurboRepo monorepo to Vercel. Not for backend deployment, Docker, or self-hosted infrastructure."
---

# Deploy do Front-end Next.js na Vercel (TurboRepo)

> Configure e deploye um projeto Next.js hospedado em um monorepo TurboRepo na Vercel, resolvendo os problemas mais comuns de build.

## Prerequisites

- Projeto Next.js dentro de um monorepo TurboRepo (ex: `apps/web`)
- Conta na Vercel conectada ao repositório Git
- PNPM como package manager (detectado automaticamente pela Vercel)

## Steps

### Step 1: Criar projeto na Vercel

1. Add New Project → selecionar o repositório
2. Framework Preset: **Next.js** (Vercel detecta TurboRepo automaticamente)
3. Root Directory: apontar para o app específico (ex: `apps/web`) → Continue
4. Build Command, Output Directory e Install Command: manter defaults

### Step 2: Configurar variáveis de ambiente

Copiar todas as variáveis do `.env` para a Vercel. Regra importante:

```
# Apenas variáveis com prefixo NEXT_PUBLIC_ ficam visíveis no navegador
NEXT_PUBLIC_API_URL=https://...   # ← visível no client
DATABASE_URL=postgresql://...      # ← server-only, segura
JWT_SECRET=...                     # ← server-only, segura
```

### Step 3: Resolver erros de build

Antes do deploy, validar localmente:

```bash
# Fix automático de ESLint
pnpm eslint --fix "src/**/*.{ts,tsx}"

# Type checking sem emitir arquivos
pnpm tsc --noEmit
```

Corrigir variáveis não utilizadas e erros de tipo manualmente se necessário.

### Step 4: Configurar TurboRepo envMode

O TurboRepo exige saber quais variáveis ambiente afetam o cache. Duas opções:

**Opção A — Listar variáveis explicitamente no `turbo.json`:**
```json
{
  "pipeline": {
    "build": {
      "env": ["DATABASE_URL", "NEXT_PUBLIC_API_URL", "JWT_SECRET"]
    }
  }
}
```

**Opção B — Modo loose (reseta cache em qualquer mudança de env):**

Na Vercel → Settings → Build Command:
```
turbo run build --env-mode=loose
```

Opção B é mais simples, mas menos eficiente em cache.

### Step 5: Deploy

Fazer push para a branch principal. A Vercel detecta mudanças apenas nos arquivos do app configurado (filtro de monorepo automático).

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto pequeno, poucas variáveis | Opção B (`--env-mode=loose`) |
| Projeto grande, muitas variáveis | Opção A (listar no `turbo.json`) |
| Time com múltiplos devs | Usar Doppler ou Infisical para gestão de env vars |
| Build falha com ESLint | Rodar `eslint --fix` localmente antes do push |
| Build falha com TypeScript | Rodar `tsc --noEmit` localmente antes do push |
| Variáveis mudaram mas deploy não atualizou | Verificar se `turbo.json` lista as variáveis ou usar `--env-mode=loose` |

## Error handling

- Se build falha por ESLint: corrigir localmente, commitar, push novamente
- Se build falha por TypeScript: rodar `tsc --noEmit`, corrigir erros de tipo
- Se deploy ignora mudanças de env: configurar `--env-mode=loose` ou listar variáveis no `turbo.json`
- Se backend não re-deploya quando só frontend mudou: comportamento esperado — filtro de monorepo funciona corretamente

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Colocar secrets com prefixo `NEXT_PUBLIC_` | Usar sem prefixo para manter server-only |
| Compartilhar `.env` por Slack/email entre devs | Usar Doppler ou Infisical |
| Ignorar erros de ESLint/TS localmente | Corrigir antes do push — Vercel vai falhar igual |
| Usar mesmo `.env` para front e back em produção | Separar variáveis por serviço |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
