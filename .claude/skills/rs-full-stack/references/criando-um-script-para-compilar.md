---
name: rs-full-stack-criando-script-compilar
description: "Enforces npm script creation patterns in package.json for build automation. Use when user asks to 'create a build script', 'automate compilation', 'add npm scripts', 'configure babel', or 'setup package.json scripts'. Applies correct script structure, Babel CLI usage, and output directory conventions. Make sure to use this skill whenever creating or modifying npm scripts in package.json. Not for webpack/vite/esbuild configuration or CI/CD pipeline setup."
---

# Scripts Personalizados no package.json

> Automatize execucao de pacotes criando scripts no package.json ao inves de digitar comandos longos repetidamente.

## Rules

1. **Crie scripts na propriedade "scripts" do package.json** — antes de devDependencies, porque scripts sao a interface de uso do projeto
2. **Nomeie scripts pelo que fazem** — `build`, `dev`, `test`, nao `script1` ou `run-babel`, porque o nome e o contrato publico do projeto
3. **Use o nome do pacote diretamente no script** — `babel` nao `./node_modules/.bin/babel`, porque o package.json resolve automaticamente de node_modules
4. **Especifique paths com prefixo `./`** — `--out-dir ./dist` nao `--out-dir dist`, porque torna explicito que e relativo a raiz do projeto
5. **Execute com `npm run <nome>`** — esse e o padrao universal para rodar scripts do package.json

## How to write

### Script de build com Babel

```json
{
  "scripts": {
    "build": "babel main.js --out-dir ./dist"
  },
  "devDependencies": {
    "@babel/cli": "^7.x",
    "@babel/core": "^7.x"
  }
}
```

### Executar o script

```bash
npm run build
```

## Example

**Before (comando manual no terminal):**
```bash
./node_modules/.bin/babel main.js --out-dir ./dist
```

**After (script no package.json):**
```json
{
  "scripts": {
    "build": "babel main.js --out-dir ./dist"
  }
}
```
```bash
npm run build
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Comando longo executado repetidamente | Crie um script no package.json |
| Pacote instalado como devDependency | Use o nome do pacote direto no script (sem path para node_modules) |
| Output vai para pasta separada | Use `--out-dir ./pasta` com prefixo `./` |
| Multiplos scripts relacionados | Nomeie semanticamente: `build`, `build:watch`, `build:prod` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `./node_modules/.bin/babel ...` no terminal | `"build": "babel ..."` no package.json |
| Script chamado `script1` ou `s1` | Script chamado `build`, `dev`, `test` |
| Digitar comando longo toda vez | `npm run build` |
| Colocar scripts depois de devDependencies | Colocar scripts antes de devDependencies |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que scripts existem e como o npm resolve pacotes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-um-script-para-compilar/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-um-script-para-compilar/references/code-examples.md)
