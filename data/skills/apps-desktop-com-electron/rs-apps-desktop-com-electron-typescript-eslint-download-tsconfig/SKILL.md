---
name: rs-electron-typescript-eslint-setup
description: "Applies simplified TypeScript and ESLint configuration for Electron+Vite projects. Use when user asks to 'setup electron project', 'configure typescript for electron', 'setup eslint', 'simplify tsconfig', or 'configure import aliases'. Consolidates multiple tsconfig files into one, sets up path aliases (~ and @), and configures Skillz ESLint. Make sure to use this skill whenever setting up or simplifying TypeScript/ESLint in Electron+Vite projects. Not for React-only projects without Electron, nor for runtime code patterns."
---

# TypeScript & ESLint para Electron + Vite

> Consolide configuracao TypeScript em um unico tsconfig.json com aliases de importacao e use ESLint minimalista.

## Rules

1. **Um unico tsconfig.json** — delete `tsconfig.node.json` e `tsconfig.web.json`, porque multiplos arquivos causam problemas de resolucao de importacao entre main/renderer/preload quando nao se usa TSC para build
2. **Configure path aliases** — `~` para raiz, `@` para subpastas do projeto, porque importacoes absolutas sobrevivem a mudancas de localizacao de arquivos
3. **Use aliases apenas quando faz sentido** — arquivos na mesma pasta usam importacao relativa (`./styles`), porque digitar o caminho completo nao agrega valor
4. **ESLint minimalista** — use `@skillz/eslint-config` e remova prettier/plugins extras, porque ESLint complexo que reescreve o arquivo inteiro atrapalha mais do que ajuda
5. **Ignore pastas de build no ESLint** — crie `.eslintignore` com `out` e `build`, porque linting em arquivos compilados gera erros falsos

## How to write

### tsconfig.json (unico arquivo)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./*"],
      "@renderer/*": ["src/renderer/*"],
      "@main/*": ["src/main/*"],
      "@preload/*": ["src/preload/*"]
    }
  },
  "include": ["src/**/*"]
}
```

### .eslintrc.json

```json
{
  "extends": ["@skillz/eslint-config/react"]
}
```

### .eslintignore

```
out
build
```

## Example

**Before (importacao relativa fragil):**
```typescript
// src/renderer/components/sidebar/navigation/index.tsx
import { api } from '../../../../lib/api'
```

**After (importacao absoluta com alias):**
```typescript
// src/renderer/components/sidebar/navigation/index.tsx
import { api } from '@renderer/src/lib/api'
```

**Mas para arquivo na mesma pasta, mantenha relativo:**
```typescript
// src/renderer/components/sidebar/navigation/index.tsx
import { styles } from './styles'
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo importa de 3+ niveis acima (`../../../`) | Use alias `@renderer/...` |
| Arquivo importa da mesma pasta | Use relativo `./` |
| Arquivo importa de pasta irmã (1 nivel) | Relativo `../` e suficiente |
| Novo projeto Electron+Vite criado | Delete tsconfigs extras imediatamente |
| ESLint reclama de arquivos em `out/` | Adicione ao `.eslintignore` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| 3 tsconfig files (node, web, base) | 1 tsconfig.json unico |
| `import from '../../../../lib/api'` | `import from '@renderer/src/lib/api'` |
| Prettier + ESLint plugins separados | `@skillz/eslint-config` unico |
| Rodar ESLint na pasta `out/build` | `.eslintignore` com `out` e `build` |
| Alias para importar arquivo na mesma pasta | `./styles` relativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
