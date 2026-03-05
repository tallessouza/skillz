---
name: rs-saas-nextjs-rbac-monorepo-turborepo
description: "Generates monorepo setup with TurboRepo and PNPM workspaces when user asks to 'create a monorepo', 'setup turborepo', 'initialize fullstack project', 'configure pnpm workspaces', or 'start a saas project'. Applies correct turbo.json pipeline config, workspace structure, and package naming conventions. Make sure to use this skill whenever scaffolding a new fullstack TypeScript project with shared packages. Not for single-app projects, deployment, or CI/CD pipeline configuration."
---

# Monorepo com TurboRepo

> Estruture projetos fullstack em monorepo com PNPM workspaces e TurboRepo para cache inteligente e execucao otimizada.

## Rules

1. **Separe apps de packages de config** — `apps/` para aplicacoes (backend, frontend), `packages/` para bibliotecas compartilhadas, `config/` para configuracoes (eslint, typescript), porque cada tipo tem ciclo de vida diferente
2. **Prefixe todos os pacotes com @scope** — `@saas/eslint-config`, `@saas/typescript-config`, porque workspaces exigem escopo unico para resolucao de dependencias
3. **Configure pipeline no turbo.json por comando** — `build`, `lint`, `dev` cada um com suas dependencias e regras de cache, porque o TurboRepo usa isso para determinar ordem de execucao e cache
4. **Desabilite cache no dev** — `"cache": false` e `"persistent": true` no comando dev, porque cache no modo desenvolvimento impede ver mudancas em tempo real
5. **Declare outputs no build** — `.next/**`, `dist/**` conforme o framework, porque o TurboRepo usa outputs para determinar se precisa re-executar
6. **Cada pasta dentro de apps/ e packages/ eh um projeto independente** — com seu proprio `package.json`, porque o workspace resolve dependencias por projeto

## How to write

### Estrutura de pastas

```
project-name/
├── apps/
│   ├── api/          # Backend (Node + Fastify)
│   └── web/          # Frontend (Next.js)
├── packages/
│   └── auth/         # Pacotes compartilhados
├── config/
│   ├── eslint-config/
│   └── typescript-config/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'config/*'
```

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Package naming

```json
{
  "name": "@saas/eslint-config",
  "version": "0.0.0",
  "private": true
}
```

## Example

**Before (sem monorepo):**
```
frontend-repo/
  package.json  # eslint, typescript duplicados
backend-repo/
  package.json  # eslint, typescript duplicados
```

**After (monorepo com TurboRepo):**
```
project/
  apps/
    web/package.json     # deps: @saas/eslint-config
    api/package.json     # deps: @saas/eslint-config
  config/
    eslint-config/package.json  # eslint centralizado
  turbo.json             # cache inteligente
  pnpm-workspace.yaml    # workspace declaration
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Time fullstack (front + back) | Usar monorepo, facilita compartilhar codigo |
| Times separados front/back | Considerar repos separados, evita conflito de issues/PRs |
| Dependencia duplicada (eslint, ts) | Extrair para config/ como pacote compartilhado |
| Comando longo (build, lint) | Adicionar ao turbo.json pipeline com cache |
| Comando de desenvolvimento | `cache: false` e `persistent: true` no turbo.json |
| Build gera pasta de output | Declarar em `outputs` para cache correto |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `"name": "eslint-config"` (sem scope) | `"name": "@saas/eslint-config"` |
| `"dev": { "cache": true }` | `"dev": { "cache": false, "persistent": true }` |
| Duplicar eslint config em cada app | Criar pacote em `config/eslint-config/` |
| Instalar deps no package.json raiz | Instalar no package.json de cada app/package |
| Manter apps e configs na mesma pasta | Separar em `apps/`, `packages/`, `config/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-criando-monorepo-com-turbo-repo/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-criando-monorepo-com-turbo-repo/references/code-examples.md)
