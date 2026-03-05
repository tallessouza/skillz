# Code Examples: Deploy Next.js + Prisma na Vercel

## Build script completo

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

Sem o `prisma generate`, o build falha porque o Next.js nao consegue resolver os imports da pasta `generated/` do Prisma.

## ESLint config com coverage ignorado

```javascript
// eslint.config.mjs
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["coverage/**"]
  }
]

export default eslintConfig
```

## Atualizacao de dependencias para corrigir vulnerabilidade

```bash
# Verificar versoes atuais
cat package.json | grep -E '"next"|"react"|"react-dom"'

# Atualizar para versoes seguras
pnpm install next@latest react@latest react-dom@latest

# Instalacao limpa completa (recomendado quando ha mudanca de versao major)
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Verificar versao instalada
pnpm list next react react-dom
```

## Fluxo completo de deploy

```bash
# 1. Comitar mudancas
git add .
git commit -m "feat: configure production build and fix vulnerabilities"

# 2. Push (pre-push hook roda lint + tests + typecheck)
git push origin feature-branch

# 3. Vercel detecta automaticamente o push e inicia deploy preview
# 4. URL de preview gerada automaticamente para testes
# 5. Merge para main → deploy de producao automatico
```

## Configuracao do banco na Vercel (passo a passo visual)

```
Vercel Dashboard
  → Projeto
    → Storage
      → Create Database
        → Prisma Postgres
          → Free plan
          → Nome: mesmo do docker-compose (ex: prompt-manager-db)
          → Create
      → Connect Projects
        → Prefixo: DATABASE (Vercel adiciona _URL automaticamente)
        → Connect
```

As variaveis de ambiente ficam disponiveis em:
```
Settings → Environment Variables
```

Nao e necessario adicionar manualmente — a conexao via Storage injeta automaticamente.