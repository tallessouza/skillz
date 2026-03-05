---
name: rs-full-stack-resolucao-de-dependencias
description: "Applies semantic versioning and NPM dependency resolution conventions when managing packages in Node.js projects. Use when user asks to 'install a package', 'update dependencies', 'fix version', 'pin dependency', 'check package.json', or any NPM/dependency task. Enforces correct use of ~, ^, and @ symbols in package.json. Make sure to use this skill whenever reviewing or modifying package.json dependencies. Not for Yarn/pnpm-specific features, publishing packages, or CI/CD pipeline configuration."
---

# Resolucao de Dependencias

> Ao gerenciar dependencias, use versionamento semantico e os simbolos NPM (~, ^, @) com intencao explicita para garantir compatibilidade.

## Rules

1. **Entenda os tres numeros do semver** — `MAJOR.MINOR.PATCH` onde major = quebra de compatibilidade, minor = novas funcionalidades compativeis, patch = correcao de bugs, porque cada numero comunica o nivel de risco da atualizacao
2. **Use `~` para aceitar apenas patches** — `~4.17.20` permite `4.17.x` mas nunca `4.18.0`, porque limita atualizacoes a correcoes de bugs compativeis
3. **Use `^` para aceitar minor updates** — `^4.17.20` permite `4.x.x` mas nunca `5.0.0`, porque aceita novas funcionalidades sem quebras de compatibilidade
4. **Use `@` para fixar versao exata** — `npm install pacote@1.11.10` instala exatamente aquela versao, porque elimina qualquer ambiguidade
5. **Escolha o simbolo pela tolerancia ao risco** — projetos criticos usam `~` ou versao fixa, projetos em desenvolvimento ativo usam `^`, porque o simbolo define a politica de atualizacao automatica

## How to write

### package.json com dependencias bem versionadas

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "~4.17.21",
    "critical-lib": "2.3.1"
  }
}
```

### Instalacao com versao especifica

```bash
npm install dayjs@1.11.10
```

## Example

**Before (sem intencao clara):**
```json
{
  "dependencies": {
    "express": "*",
    "lodash": "latest",
    "dayjs": "1"
  }
}
```

**After (com convencoes semver aplicadas):**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "~4.17.21",
    "dayjs": "1.11.10"
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Biblioteca estavel e madura | Use `^` para receber patches e minor updates |
| Dependencia critica (pagamentos, auth) | Fixe versao exata sem simbolo |
| Precisa apenas de bugfixes | Use `~` |
| Instalando versao especifica via CLI | Use `npm install pacote@versao` |
| Versionando seu proprio pacote com bugfix | Incremente o PATCH |
| Adicionando funcionalidade compativel | Incremente o MINOR |
| Quebrando compatibilidade com versao anterior | Incremente o MAJOR |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `"express": "*"` | `"express": "^4.18.2"` |
| `"lodash": "latest"` | `"lodash": "~4.17.21"` |
| `"lib": ">=2.0.0"` | `"lib": "^2.0.0"` |
| Incrementar MAJOR para bugfix | Incrementar PATCH para bugfix |
| Incrementar PATCH para nova feature | Incrementar MINOR para nova feature |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre semver, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-resolucao-de-dependencias/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-resolucao-de-dependencias/references/code-examples.md)
