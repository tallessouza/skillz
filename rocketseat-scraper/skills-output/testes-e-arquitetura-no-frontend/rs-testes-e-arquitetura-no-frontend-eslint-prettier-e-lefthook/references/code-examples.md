# Code Examples: ESLint, Prettier e Lefthook

## Instalacao completa

```bash
# ESLint ja vem com Next.js, instale apenas integracao + Prettier + Lefthook
npm install -D prettier eslint-config-prettier eslint-plugin-prettier lefthook

# Registre os hooks no git
npx lefthook install
```

## .prettierrc (configuracao do instrutor)

```json
{
  "tabWidth": 2,
  "singleQuote": true,
  "semi": false,
  "trailingComma": "all"
}
```

Significado de cada opcao:
- `tabWidth: 2` — indentacao com 2 espacos
- `singleQuote: true` — aspas simples em vez de duplas
- `semi: false` — sem ponto e virgula no final das linhas
- `trailingComma: "all"` — virgula apos ultimo item em objetos/arrays

## .prettierignore

```
.vscode
.DS_Store
*.env
node_modules
package-lock.json
```

## lefthook.yml completo

```yaml
pre-commit:
  commands:
    format:
      glob: "*.{js,ts,jsx,tsx,json,css,md}"
      run: npx prettier --write {staged_files}
      stage_fixed: true

pre-push:
  commands:
    typecheck:
      run: npm run typecheck
    lint:
      run: npm run lint
    test:
      run: npm test
```

## .vscode/settings.json

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## Scripts no package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit --skipLibCheck"
  }
}
```

## Testando os hooks

```bash
# Testar pre-commit (deve formatar e commitar)
git add .
git commit -m "test: verificar hooks"

# Testar pre-push (deve rodar typecheck + lint + testes)
git push

# Se algum falhar, o output mostra qual comando quebrou
# Exemplo de falha no typecheck:
# ❌ typecheck: error TS2454: Variable 'x' is used before being assigned
```

## Exemplo de falha detectada pelo hook

```typescript
// Este codigo seria bloqueado no pre-push pelo lint
const unusedVariable = 'hello'
// ESLint: 'unusedVariable' is declared but never used

// Dev precisa remover a variavel para conseguir fazer push
```

## Variacao: Lefthook com lint no pre-commit

```yaml
# Se o time preferir lint tambem no pre-commit (projetos pequenos)
pre-commit:
  commands:
    format:
      glob: "*.{js,ts,jsx,tsx,json,css,md}"
      run: npx prettier --write {staged_files}
      stage_fixed: true
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: npx eslint {staged_files}

pre-push:
  commands:
    typecheck:
      run: npm run typecheck
    test:
      run: npm test
```

**Atencao:** So faca isso se o lint for rapido no seu projeto. Em projetos grandes, mantenha lint apenas no pre-push.