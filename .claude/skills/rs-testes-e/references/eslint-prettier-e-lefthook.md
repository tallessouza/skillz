---
name: rs-testes-e-eslint-prettier-e-lefthook
description: "Configures ESLint, Prettier, and Lefthook for code quality enforcement in Next.js/TypeScript projects. Use when user asks to 'setup linting', 'configure prettier', 'add git hooks', 'setup pre-commit', 'enforce code quality', or 'configure lefthook'. Applies rules: fast pre-commit (format only), thorough pre-push (typecheck + lint + tests), staged-files-only formatting. Make sure to use this skill whenever setting up code quality tooling in a frontend project. Not for CI/CD pipeline configuration, deployment, or testing framework setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: code-quality
  tags: [testing, next-js, react, ci, forms]
---

# ESLint, Prettier e Lefthook

> Configure validacoes rapidas no pre-commit e validacoes completas no pre-push para que o time nunca esquipe os hooks.

## Rules

1. **Pre-commit deve ser rapido** — apenas format e lint, porque hooks lentos fazem o time usar `--no-verify`
2. **Pre-push deve ser completo** — typecheck, lint e testes, porque so deve subir codigo testado e tipado
3. **Formate apenas arquivos staged** — use `{staged_files}` no Lefthook, porque formatar tudo eh desperdicio de tempo
4. **Instale Lefthook com `npx lefthook install`** — porque sem isso os hooks nao sao registrados no `.git/hooks`
5. **ESLint ja vem com Next.js** — nao instale separadamente, apenas adicione `eslint-config-prettier` e `eslint-plugin-prettier`
6. **Configure VSCode junto** — `.vscode/settings.json` com `formatOnSave` e `defaultFormatter`, porque sem isso o dev nao ve o Prettier agindo

## How to write

### Dependencias

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier lefthook
```

### .prettierrc

```json
{
  "tabWidth": 2,
  "singleQuote": true,
  "semi": false,
  "trailingComma": "all"
}
```

### lefthook.yml

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

### .vscode/settings.json

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

### Scripts no package.json

```json
{
  "scripts": {
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit --skipLibCheck"
  }
}
```

## Example

**Before (hooks bloqueiam o time):**
```yaml
pre-commit:
  commands:
    format:
      run: npx prettier --write .
    typecheck:
      run: tsc --noEmit
    lint:
      run: npm run lint
    test:
      run: npm test
```

**After (hooks rapidos no commit, completos no push):**
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto Next.js novo | Nao instale ESLint separado, ja vem incluido |
| Time reclamando de commit lento | Mova validacoes pesadas para pre-push |
| Dev usando `--no-verify` | Reduza o pre-commit ao minimo (so format) |
| Projeto sem `.vscode/settings.json` | Crie com formatOnSave para feedback imediato |
| CI ja roda testes | Pre-push com testes ainda vale como gate local |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Testes no pre-commit | Testes no pre-push |
| `prettier --write .` no hook | `prettier --write {staged_files}` |
| Instalar ESLint em projeto Next.js | Usar o ESLint que ja vem com Next.js |
| Hooks sem `npx lefthook install` | Rodar install apos adicionar lefthook.yml |
| Ignorar `.vscode/settings.json` | Criar e commitar para padronizar o time |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
