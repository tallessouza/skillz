---
name: rs-node-js-2023-versoes-exatas-npm
description: "Enforces exact NPM dependency versions by configuring .npmrc with save-exact=true in JavaScript/TypeScript projects. Use when user asks to 'create a project', 'setup npm', 'configure dependencies', 'init node project', or 'add .npmrc'. Ensures all package.json versions are pinned without caret/tilde, enabling automated dependency updates via Renovate bot. Make sure to use this skill whenever initializing a new JS/TS project or reviewing dependency management. Not for yarn/pnpm-specific config, lockfile issues, or dependency resolution conflicts."
---

# Versoes Exatas do NPM

> Fixe versoes exatas de dependencias no package.json para permitir atualizacoes automatizadas e controladas via bots como Renovate.

## Rules

1. **Crie `.npmrc` na raiz do projeto com `save-exact=true`** — porque versoes com `^` ou `~` permitem atualizacoes implicitas que podem quebrar o projeto silenciosamente
2. **Nunca use caret (`^`) ou tilde (`~`) em versoes do package.json** — porque a atualizacao de dependencias deve ser explicita, testada e aprovada via pull request
3. **Reinstale dependencias apos criar o `.npmrc`** — porque dependencias instaladas antes da configuracao mantem o prefixo de range
4. **Use bots como Renovate para atualizar dependencias** — porque atualizar tudo manualmente em um dia causa breaking changes em cascata
5. **Mantenha testes automatizados robustos** — porque o bot depende dos testes para validar se a atualizacao e segura

## Steps

### Step 1: Criar `.npmrc`

```bash
echo "save-exact=true" > .npmrc
```

### Step 2: Reinstalar dependencias

```bash
# Remove node_modules e lockfile para reinstalar com versoes exatas
rm -rf node_modules package-lock.json
npm install
```

### Step 3: Verificar package.json

Confirme que nenhuma versao tem `^` ou `~`:

```json
{
  "dependencies": {
    "@fastify/cookie": "9.3.1",
    "fastify": "4.26.0"
  },
  "devDependencies": {
    "typescript": "5.3.3",
    "tsx": "4.7.0"
  }
}
```

## Example

**Before (versoes com range — perigoso):**
```json
{
  "dependencies": {
    "fastify": "^4.26.0",
    "zod": "~3.22.4"
  }
}
```

**After (versoes exatas — controlado):**
```json
{
  "dependencies": {
    "fastify": "4.26.0",
    "zod": "3.22.4"
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto JS/TS | Criar `.npmrc` com `save-exact=true` antes de qualquer `npm install` |
| Projeto existente com `^`/`~` | Reinstalar tudo apos adicionar `.npmrc` |
| CI/CD configurado | Adicionar Renovate bot para PRs automaticas de atualizacao |
| Dependencia precisa atualizar | Atualizar uma por vez, rodar testes, aprovar PR |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Atualizar todas dependencias de uma vez | Atualizar uma por vez via bot com testes |
| Confiar no `^` para receber patches automaticos | Fixar versao e deixar bot testar antes |
| Ignorar breaking changes | Ler changelog antes de aprovar PR do bot |
| Configurar `save-exact` apenas globalmente | Criar `.npmrc` no projeto para garantir para todo time |

## Verification

- Rode `npm install <qualquer-pacote>` e confira no `package.json` que a versao nao tem `^` ou `~`
- O arquivo `.npmrc` esta commitado no repositorio (nao no `.gitignore`)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-usando-versoes-exatas-do-npm/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-usando-versoes-exatas-do-npm/references/code-examples.md)
