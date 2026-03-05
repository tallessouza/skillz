# Code Examples: Monorepo com TurboRepo

## Inicializando o projeto

```bash
# Criar monorepo com TurboRepo usando PNPM
pnpm dlx create-turbo@latest

# O CLI pergunta:
# - Nome do projeto (ex: next-saas-rbac)
# - Gerenciador de pacotes (pnpm recomendado)
```

## Estrutura gerada pelo create-turbo

```
next-saas-rbac/
├── apps/
│   ├── docs/          # Projeto Next.js (exemplo)
│   └── web/           # Projeto Next.js (exemplo)
├── packages/
│   ├── eslint-config/ # Config compartilhada
│   ├── typescript-config/ # Config compartilhada
│   └── ui/            # Componentes React compartilhados
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

## Reorganizando a estrutura

### 1. Atualizar pnpm-workspace.yaml

```yaml
# ANTES (gerado)
packages:
  - 'apps/*'
  - 'packages/*'

# DEPOIS (reorganizado)
packages:
  - 'apps/*'
  - 'packages/*'
  - 'config/*'
```

### 2. Mover configs para config/

```bash
# Mover eslint-config e typescript-config para config/
mv packages/eslint-config config/
mv packages/typescript-config config/
```

### 3. Limpar apps desnecessarios

```bash
# Deletar apps de exemplo
rm -rf apps/docs apps/web
# Deletar packages de exemplo
rm -rf packages/ui
# Deletar README
rm README.md
```

### 4. Renomear scope em todos os package.json

```json
// config/eslint-config/package.json
// ANTES:
{ "name": "@repo/eslint-config" }
// DEPOIS:
{ "name": "@saas/eslint-config" }

// config/typescript-config/package.json
// ANTES:
{ "name": "@repo/typescript-config" }
// DEPOIS:
{ "name": "@saas/typescript-config" }
```

### 5. Atualizar dependencias que referenciam o scope antigo

```json
// package.json da raiz
// ANTES:
{
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*"
  }
}
// DEPOIS:
{
  "devDependencies": {
    "@saas/eslint-config": "workspace:*",
    "@saas/typescript-config": "workspace:*"
  }
}
```

### 6. Atualizar referencias internas nos configs

```js
// config/eslint-config/.eslintrc.js (ou similar)
// ANTES:
module.exports = { extends: ["@repo/eslint-config"] }
// DEPOIS:
module.exports = { extends: ["@saas/eslint-config"] }
```

### 7. Reinstalar dependencias

```bash
pnpm install
```

## turbo.json completo explicado

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      // "^build" = primeiro executa build das dependencias
      // Se app/web depende de packages/auth, e packages/auth
      // tem comando build, executa packages/auth build primeiro
      "dependsOn": ["^build"],
      // Pastas geradas pelo build — usadas para cache
      // .next para Next.js, dist para compilacao TypeScript
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      // Executa lint das dependencias primeiro
      "dependsOn": ["^lint"]
    },
    "dev": {
      // Sem cache no dev — queremos ver mudancas em tempo real
      "cache": false,
      // Comando fica executando (nao termina sozinho)
      "persistent": true
    }
  }
}
```

## Estrutura final recomendada para SaaS

```
next-saas-rbac/
├── apps/
│   ├── api/                    # Backend: Node + Fastify + Prisma
│   │   └── package.json        # { "name": "@saas/api" }
│   └── web/                    # Frontend: Next.js 14
│       └── package.json        # { "name": "@saas/web" }
├── packages/
│   └── auth/                   # Pacote de autorizacao compartilhado
│       └── package.json        # { "name": "@saas/auth" }
├── config/
│   ├── eslint-config/
│   │   └── package.json        # { "name": "@saas/eslint-config" }
│   └── typescript-config/
│       └── package.json        # { "name": "@saas/typescript-config" }
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```