---
name: rs-saas-nextjs-rbac-criando-pacote-auth
description: "Generates shared monorepo packages for cross-project code sharing (frontend + backend). Use when user asks to 'create a package', 'share code between projects', 'setup monorepo package', 'create auth package', or 'configure internal dependency'. Applies patterns: package.json with main/types pointing to source, internal workspace dependencies, tsconfig extending shared base, ESLint/Prettier via package.json. Make sure to use this skill whenever setting up a new package in a turborepo/pnpm monorepo. Not for application setup, API routes, or database configuration."
---

# Criando Pacote Compartilhado em Monorepo

> Tudo que e compartilhado entre mais de um projeto vira um pacote — permissoes, validacoes, tipos.

## Rules

1. **Pacote compartilhado, nao duplicado** — se frontend e backend precisam da mesma logica (ex: permissoes), crie um pacote no monorepo, porque duplicar codigo entre projetos causa divergencia silenciosa
2. **package.json aponta para source TypeScript** — use `main` e `types` apontando para `src/index.ts`, porque pacotes internos nao precisam de build separado
3. **ESLint e Prettier no package.json** — configure `eslintConfig` e `prettierConfig` direto no package.json para evitar proliferacao de arquivos de config em pacotes pequenos
4. **tsconfig extende base compartilhada** — use `extends` apontando para o pacote de config TypeScript do monorepo, porque manter configs duplicadas causa drift
5. **Use config "library" para pacotes cross-platform** — quando o pacote roda tanto em React quanto Node, use uma config TypeScript meio-termo (ex: vite-react do ts-config-bases), porque configs especificas de runtime quebram no outro ambiente
6. **Dependencias internas usam workspace protocol** — declare como `"workspace:*"` no devDependencies, porque o package manager resolve via symlink local

## Steps

### Step 1: Criar estrutura do pacote

```
packages/
  auth/
    package.json
    tsconfig.json
    src/
      index.ts
```

### Step 2: Configurar package.json

```json
{
  "name": "@saas/auth",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "devDependencies": {
    "@saas/prettier": "workspace:*",
    "@saas/eslint-config": "workspace:*",
    "@saas/tsconfig": "workspace:*"
  },
  "prettier": "@saas/prettier",
  "eslintConfig": {
    "extends": ["@saas/eslint-config/library"]
  }
}
```

### Step 3: Configurar tsconfig.json

```json
{
  "extends": "@saas/tsconfig/library.json",
  "include": ["src/**/*.ts"]
}
```

### Step 4: Instalar dependencias

```bash
cd packages/auth && pnpm install
```

### Step 5: Reload do editor

Apos configurar ESLint/Prettier, execute reload window no VSCode para os plugins lerem a nova configuracao.

## Heuristics

| Situacao | Acao |
|----------|------|
| Logica usada em 2+ projetos | Criar pacote em `packages/` |
| Pacote usado so no Node | tsconfig extends `node.json` |
| Pacote usado so no React | tsconfig extends `react.json` |
| Pacote usado em ambos | tsconfig extends `library.json` (meio-termo) |
| Config de lint/prettier minima | Inline no package.json |
| Config de lint/prettier complexa | Arquivo separado |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Duplicar logica de permissoes no front e back | Criar pacote compartilhado |
| Apontar main para arquivo buildado em pacote interno | Apontar main para `src/index.ts` direto |
| Criar `.eslintrc` e `.prettierrc` em pacote pequeno | Configurar inline no package.json |
| Usar versao fixa para dependencia interna | Usar `workspace:*` |
| Deixar `publish-config.access: public` em pacote privado | Remover publish-config, manter `private: true` |
| tsconfig include sem glob pattern | Usar `src/**/*.ts` para capturar todos os arquivos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
