# Code Examples: TypeScript & ESLint para Electron + Vite

## Setup completo passo a passo

### 1. Deletar tsconfigs extras

```bash
rm tsconfig.node.json tsconfig.web.json
```

### 2. Substituir conteudo do tsconfig.json

O tsconfig e baseado no que vem em projetos Vite+React padrao, com adicao da secao `paths`:

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
    "noFallthroughCasesInSwitch": true,
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

**Secao `paths` explicada:**
- `~/*` → mapeia para a raiz do projeto (qualquer arquivo na raiz)
- `@renderer/*` → mapeia para `src/renderer/*`
- `@main/*` → mapeia para `src/main/*`
- `@preload/*` → mapeia para `src/preload/*`

### 3. Limpar dependencias de ESLint

```bash
# Remover dependencias desnecessarias do package.json:
# - @typescript-eslint/eslint-plugin
# - @typescript-eslint/parser
# - eslint-config-prettier
# - eslint-plugin-prettier
# - eslint-plugin-react
# - prettier

npm install

# Instalar config da Skillz
npm install -D @skillz/eslint-config
```

### 4. Criar .eslintrc.json

```json
{
  "extends": ["@skillz/eslint-config/react"]
}
```

**Nota:** usar extensao `.json` (nao `.js` ou `.cjs`) porque traz autocomplete no VSCode quando a extensao do ESLint esta instalada.

### 5. Criar .eslintignore

```
out
build
```

### 6. Rodar lint para fix automatico

```bash
npm run lint
```

Isso executa o ESLint com `--fix` em todos os arquivos, aplicando as regras automaticamente (ponto-e-virgula, etc).

## Demonstracao de importacao com alias

### Estrutura de exemplo do Diego

```
src/renderer/
├── components/
│   └── sidebar/
│       └── navigation/
│           └── index.tsx
└── lib/
    └── api.ts
```

### lib/api.ts
```typescript
export const api = {}
```

### Importacao relativa (funciona mas fragil)
```typescript
// src/renderer/components/sidebar/navigation/index.tsx
import { api } from '../../../../lib/api'
```

### Importacao com alias (resiliente a mudancas)
```typescript
// src/renderer/components/sidebar/navigation/index.tsx
import { api } from '@renderer/src/lib/api'
```

### Quando NAO usar alias
```typescript
// Arquivo de styles na mesma pasta — use relativo
import { container } from './styles'
```

## Troubleshooting

### ESLint nao mostra erros apos configuracao
```
Ctrl+Shift+P → "Developer: Reload Window"
```
Reiniciar o servidor do ESLint no VSCode.

### Warning de versao do TypeScript
```
You're currently running a version of TypeScript which is not officially supported by typescript-eslint.
```
Pode ser ignorado — e apenas um aviso de compatibilidade, nao afeta funcionamento.

### `Window is not defined` no lint
Significa que o ESLint esta verificando arquivos de build. Verifique se `.eslintignore` inclui `out` e `build`.