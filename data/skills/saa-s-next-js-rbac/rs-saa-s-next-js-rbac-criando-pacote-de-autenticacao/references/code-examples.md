# Code Examples: Criando Pacote de Autenticacao

## Estrutura completa de arquivos

```
packages/
  auth/
    package.json
    tsconfig.json
    src/
      index.ts
  config/
    typescript-config/
      package.json
      base.json
      node.json
      react.json
      library.json      # NOVO - criado nesta aula
    eslint-config/
      library.js
      next.js
      node.js
    prettier/
      index.js
```

## package.json do pacote auth (completo)

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

## tsconfig.json do pacote auth

```json
{
  "extends": "@saas/tsconfig/library.json",
  "include": ["src/**/*.ts"]
}
```

## library.json (config TypeScript para bibliotecas)

Baseado no template `vite-react` do repositorio `ts-config-bases`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## package.json do @saas/tsconfig (atualizado)

```json
{
  "name": "@saas/tsconfig",
  "version": "0.0.0",
  "private": true,
  "files": [
    "base.json",
    "node.json",
    "react.json",
    "library.json"
  ]
}
```

## Erro comum: include sem glob

```json
// ERRADO - TypeScript nao encontra os arquivos
{
  "include": ["src"]
}

// CORRETO - glob pattern recursivo
{
  "include": ["src/**/*.ts"]
}
```

Mensagem de erro: `No inputs were found in config file. Specified include paths were 'src' and exclude paths were...`

## Comandos executados na aula

```bash
# Navegar ate o pacote
cd packages/auth

# Instalar dependencias (resolve workspace:*)
pnpm install

# Verificar que ESLint funciona (apos reload do VSCode)
# Criar um arquivo com erro proposital para testar:
# const test = 'oi';  -> ESLint deve acusar variavel nao utilizada
```

## Como outro projeto importa o pacote

```typescript
// No frontend ou backend, apos adicionar @saas/auth como dependencia:
import { /* permissoes */ } from '@saas/auth'
```

Para adicionar como dependencia em outro projeto:

```json
// packages/api/package.json ou apps/web/package.json
{
  "dependencies": {
    "@saas/auth": "workspace:*"
  }
}
```