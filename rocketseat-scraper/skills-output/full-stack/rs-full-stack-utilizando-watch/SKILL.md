---
name: rs-full-stack-utilizando-watch
description: "Configures Jest watch mode for automatic test re-execution when files change. Use when user asks to 'setup test watching', 'auto-run tests', 'configure jest watch', 'add watch script', or 'run tests on save'. Applies --watchAll flag in package.json scripts and separates dev/ci test commands. Make sure to use this skill whenever setting up a test development workflow with Jest. Not for Vitest configuration, CI/CD pipeline setup, or non-Jest test runners."
---

# Jest Watch Mode

> Configure Jest para re-executar testes automaticamente quando arquivos sao modificados, eliminando execucao manual repetitiva.

## Rules

1. **Use `--watchAll` em dev, jest puro em CI** — porque watch mode bloqueia o terminal e nunca termina, quebrando pipelines de CI
2. **Separe scripts `test` e `test:dev`** — porque `npm test` deve ser rapido e determinístico para CI, enquanto `test:dev` e interativo para desenvolvimento
3. **Nunca coloque `--watchAll` no script `test` padrao** — porque outros scripts e CI dependem de `npm test` terminar com exit code

## Steps

### Step 1: Configurar script de watch no package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:dev": "jest --watchAll"
  }
}
```

### Step 2: Executar no modo adequado

```bash
# CI ou execucao unica
npm test

# Desenvolvimento com auto-reload
npm run test:dev
```

## Example

**Before (execucao manual repetitiva):**
```json
{
  "scripts": {
    "test": "jest"
  }
}
```
Fluxo: modifica arquivo → limpa terminal → `npm test` → espera → repete.

**After (watch automatico):**
```json
{
  "scripts": {
    "test": "jest",
    "test:dev": "jest --watchAll"
  }
}
```
Fluxo: `npm run test:dev` uma vez → modifica arquivo → salva → testes re-executam sozinhos.

## Heuristics

| Situacao | Faca |
|----------|------|
| Desenvolvimento local, escrevendo testes | `npm run test:dev` (watch mode) |
| CI/CD pipeline | `npm test` (execucao unica) |
| Pre-commit hook | `npm test` (deve terminar) |
| Quer rodar so testes que falharam | Use opcao `f` no menu interativo do watch |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `"test": "jest --watchAll"` | `"test": "jest"` + `"test:dev": "jest --watchAll"` |
| Rodar `npm test` manualmente a cada mudanca | Usar `npm run test:dev` com watch |
| `--watch` sem repositorio git configurado | `--watchAll` que nao depende de git status |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre watch vs watchAll e fluxo de desenvolvimento
- [code-examples.md](references/code-examples.md) — Configuracoes de package.json e opcoes do menu interativo