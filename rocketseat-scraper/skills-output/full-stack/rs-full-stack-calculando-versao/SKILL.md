---
name: rs-full-stack-calculando-versao
description: "Applies semantic versioning knowledge when managing Node.js dependencies, checking compatibility ranges, or updating packages. Use when user asks to 'update a dependency', 'check compatible versions', 'upgrade express', 'fix version conflicts', or 'understand semver ranges'. Guides usage of semver.npmjs.com calculator and version range syntax (X notation, tilde, caret). Make sure to use this skill whenever dealing with package.json version ranges or dependency upgrades. Not for publishing packages, creating libraries, or CI/CD pipeline configuration."
---

# Calculando Versão com Semver

> Use a calculadora semver.npmjs.com para identificar versões compatíveis antes de atualizar qualquer dependência.

## Conceito central

Atualizar dependências sem verificar compatibilidade causa quebras. A ferramenta semver.npmjs.com permite listar todas as versões compatíveis com um range específico, facilitando atualizações seguras.

## Como usar

### Passo 1: Identificar a versão atual

```json
// package.json
{
  "dependencies": {
    "express": "3.19.0"
  }
}
```

### Passo 2: Acessar semver.npmjs.com

Abrir `semver.npmjs.com`, digitar o nome do pacote (ex: `express`) e definir o range de versão.

### Passo 3: Definir o range adequado

| Range | Significado | O que retorna |
|-------|-------------|---------------|
| `3.19.0` | Versão exata | Apenas a 3.19.0 |
| `3.19.x` | Patches da 3.19 | Correções de bug: 3.19.0, 3.19.1, 3.19.2 |
| `3.x` | Minor + patches da v3 | Novas funcionalidades + correções compatíveis com major 3 |

## Regras de decisão

1. **Para atualizações conservadoras** — use `MAJOR.MINOR.x` (só patches/bugfixes), porque mantém a mesma API sem surpresas
2. **Para atualizações moderadas** — use `MAJOR.x` (minor + patches), porque traz funcionalidades novas mantendo compatibilidade
3. **Nunca mude o major sem análise** — `3.x` → `4.x` pode conter breaking changes que exigem refatoração

## Relação com versionamento semântico

| Posição | Nome | Quando incrementa |
|---------|------|-------------------|
| 1º número (3.x.x) | Major | Breaking changes |
| 2º número (x.19.x) | Minor | Novas funcionalidades (retrocompatível) |
| 3º número (x.x.0) | Patch | Correções de bug |

## Heuristics

| Situação | Ação |
|----------|------|
| Dependência com vulnerabilidade conhecida | Use `MAJOR.MINOR.x` para patch seguro |
| Precisa de feature nova da lib | Use `MAJOR.x` e verifique changelog |
| Projeto legado sem testes | Use versão exata, atualize incrementalmente |
| Muitas versões compatíveis listadas | Prefira a mais recente dentro do range |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|--------------|
| Atualizar major sem verificar breaking changes | Consultar changelog e semver calculator |
| Usar `*` como range em produção | Definir range explícito (`3.x` ou `~3.19.0`) |
| Atualizar todas as deps de uma vez | Atualizar uma por uma, testando entre cada |
| Ignorar o semver calculator e "chutar" versão | Sempre verificar compatibilidade antes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre versionamento semântico e estratégias de atualização
- [code-examples.md](references/code-examples.md) — Exemplos práticos de ranges no package.json e uso do calculator