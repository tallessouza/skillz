# Code Examples: ESLint, Prettier e Lefthook

## 1. Instalacao completa

```bash
# Next.js ja inclui ESLint, entao instalamos apenas:
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier lefthook
```

## 2. Arquivo .prettierrc

```json
{
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

Opcoes comuns adicionais:
```json
{
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80,
  "semi": true,
  "trailingComma": "all",
  "arrowParens": "always"
}
```

## 3. eslint.config.mjs (Next.js com Prettier)

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended"
  ),
];

export default eslintConfig;
```

## 4. lefthook.yml

```yaml
pre-commit:
  commands:
    check:
      run: pnpm format

pre-push:
  commands:
    validate:
      run: pnpm validate:typecheck
```

### Versao expandida com testes:

```yaml
pre-commit:
  commands:
    format:
      run: pnpm format
    lint:
      run: pnpm lint

pre-push:
  commands:
    typecheck:
      run: pnpm validate:typecheck
    test:
      run: pnpm test
```

## 5. Scripts do package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --check .",
    "format:fix": "prettier --write .",
    "validate:typecheck": "tsc --noEmit",
    "prepare": "lefthook install"
  }
}
```

## 6. .vscode/settings.json

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 7. Registrando os hooks (obrigatorio)

```bash
pnpx lefthook install
# Output esperado:
# sync hooks: pre-commit, pre-push
```

## 8. Demonstracao do instrutor — typecheck barrando push

O instrutor criou um componente com erro de tipagem proposital:

```typescript
// Componente com erro de tipo
type Props = {
  title: string;
};

function Component({ title }: Props) {
  console.log(title);
  return <div>Componente</div>;
}

// Uso incorreto — passando number onde espera string
<Component title={42} />
```

Ao tentar `git push`, o Lefthook executou `tsc --noEmit` que detectou o erro de tipo e rejeitou o push. O codigo quebrado nunca chegou ao repositorio.

## 9. .prettierignore (recomendado)

```
node_modules
.next
out
dist
coverage
```

## 10. .eslintignore ou ignores no config (recomendado)

```
node_modules/
.next/
out/
dist/
```