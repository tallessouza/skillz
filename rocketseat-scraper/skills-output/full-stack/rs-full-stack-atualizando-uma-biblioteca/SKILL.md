---
name: rs-full-stack-atualizando-uma-biblioteca
description: "Enforces correct npm package update commands when managing Node.js dependencies. Use when user asks to 'update a package', 'upgrade express', 'change library version', 'install latest version', or 'rollback a dependency'. Covers npm i package@latest for latest version and npm i package@version for pinning. Make sure to use this skill whenever updating or downgrading individual npm packages. Not for bulk dependency updates with npm update, lockfile conflicts, or monorepo dependency management."
---

# Atualizando Uma Biblioteca

> Para atualizar um pacote individual, use `npm i pacote@latest` para a versao mais recente ou `npm i pacote@versao` para uma versao especifica.

## Rules

1. **Use `npm i pacote@latest` para atualizar para a ultima versao** — porque a tag `latest` resolve automaticamente para a versao estavel mais recente no registry, sem precisar saber o numero exato
2. **Use `npm i pacote@x.y.z` para fixar uma versao especifica** — porque permite reverter ou instalar exatamente a versao desejada, garantindo reprodutibilidade
3. **Use `npm i` como abreviacao de `npm install`** — porque e a forma idiomatica e aceita pelo npm, economizando digitacao sem perda de clareza
4. **Atualize pacotes individualmente, nao em lote** — porque permite controle granular e facilita identificar qual atualizacao introduziu um problema

## How to write

### Atualizar para a ultima versao

```bash
# Instala a versao mais recente (tag latest) do pacote
npm i express@latest
```

### Fixar uma versao especifica

```bash
# Instala exatamente a versao 4.19.0
npm i express@4.19.0
```

### Reverter para versao anterior

```bash
# Volta para a versao que estava antes da atualizacao
npm i express@4.19.0
```

## Example

**Before (versao desatualizada no package.json):**
```json
{
  "dependencies": {
    "express": "^4.19.0"
  }
}
```

**Comando executado:**
```bash
npm i express@latest
```

**After (versao atualizada no package.json):**
```json
{
  "dependencies": {
    "express": "^4.21.1"
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Quer a versao mais recente estavel | `npm i pacote@latest` |
| Precisa de uma versao exata | `npm i pacote@x.y.z` |
| Precisa reverter uma atualizacao | `npm i pacote@versao-anterior` |
| Quer verificar versoes disponiveis antes | `npm outdated` primeiro |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Editar manualmente a versao no package.json e rodar `npm install` | `npm i pacote@versao` diretamente |
| Usar `npm update pacote` sem entender semver range | `npm i pacote@latest` para garantir a ultima versao |
| Atualizar todos os pacotes de uma vez sem testar | Atualizar individualmente e testar apos cada um |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre versionamento, tags npm e estrategias de rollback
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comandos expandidos com variacoes