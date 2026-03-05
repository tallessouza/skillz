# Code Examples: Deploy do Front-end Next.js na Vercel

## Configuração do turbo.json — Opção A (explícita)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "env": [
        "DATABASE_URL",
        "NEXT_PUBLIC_API_URL",
        "JWT_SECRET",
        "GITHUB_OAUTH_CLIENT_ID",
        "GITHUB_OAUTH_CLIENT_SECRET",
        "GITHUB_OAUTH_CLIENT_REDIRECT_URI"
      ],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

## Configuração do turbo.json — Opção B (loose)

Build command na Vercel Settings:
```
turbo run build --env-mode=loose
```

Nenhuma alteração necessária no `turbo.json`.

## Fix de ESLint antes do deploy

```bash
# Na pasta do app (ex: apps/web)
cd apps/web

# Fix automático
pnpm eslint --fix "src/**/*.{ts,tsx}"

# Se ainda houver erros, corrigir manualmente
# Erros comuns: variáveis declaradas mas não utilizadas
```

## Type checking antes do deploy

```bash
# Na pasta do app
cd apps/web

# Verificar tipos sem gerar arquivos
pnpm tsc --noEmit
```

## Fluxo completo de correção e re-deploy

```bash
# 1. Corrigir ESLint
pnpm eslint --fix "src/**/*.{ts,tsx}"

# 2. Verificar TypeScript
pnpm tsc --noEmit

# 3. Commitar correções
git add .
git commit -m "fix: eslint and typescript issues"

# 4. Push triggera novo deploy na Vercel
git push origin main
```

## Estrutura de variáveis de ambiente na Vercel

```
# Server-only (NÃO expostas no browser)
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=minha-chave-secreta
GITHUB_OAUTH_CLIENT_SECRET=abc123

# Client-side (expostas no browser — apenas dados públicos)
NEXT_PUBLIC_API_URL=https://api.meuapp.com
NEXT_PUBLIC_APP_URL=https://meuapp.com
```

## Exemplo de configuração da Vercel para monorepo

```
Project Settings:
├── Framework Preset: Next.js
├── Root Directory: apps/web
├── Build Command: turbo run build --env-mode=loose
├── Output Directory: (default - .next)
├── Install Command: (auto-detected - pnpm install)
└── Environment Variables:
    ├── DATABASE_URL = postgresql://...
    ├── JWT_SECRET = ...
    ├── NEXT_PUBLIC_API_URL = https://...
    └── ... (todas as variáveis necessárias)
```