---
name: rs-full-stack-atualizacao-baseada-na-minor
description: "Enforces correct npm dependency update practices when managing Node.js project versions using the caret (^) prefix for minor-compatible updates. Use when user asks to 'update dependencies', 'upgrade packages', 'install npm packages', 'manage versions', or 'update express'. Applies semver caret rules: ^major.minor.patch allows updates within the same major version. Make sure to use this skill whenever updating or installing existing dependencies in package.json. Not for major version upgrades, lock file conflicts, or yarn/pnpm-specific workflows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [npm, semver, dependencies, package-management, nodejs]
---

# Atualização de Dependências Baseada na Minor

> Ao atualizar dependências, use o acento circunflexo (^) para permitir atualizações compatíveis que trazem correções e melhorias sem quebrar a aplicação.

## Rules

1. **O acento circunflexo (^) permite atualizações compatíveis com a minor** — `^3.19.0` aceita qualquer versão `3.x.x` até a mais recente, porque mantém compatibilidade sem breaking changes
2. **`npm i <pacote>` sem versão atualiza para a mais recente compatível** — quando a dependência já existe no projeto com `^`, o npm resolve a versão mais atual dentro do range permitido
3. **Atualizações minor trazem correções de bug e novas funcionalidades** — incrementos de minor e patch são seguros por convenção semver, porque seguem o contrato de não quebrar APIs existentes
4. **Confirme a versão instalada no package.json após atualizar** — sempre verifique se a versão resultante é a esperada dentro do range definido

## How to update

### Verificar versões disponíveis no range

```bash
# Listar todas as versões compatíveis com o range definido
npm view express versions --json
```

### Atualizar dependência existente

```bash
# Se package.json tem "express": "^3.19.0"
# Este comando atualiza para a versão mais recente compatível (ex: 3.21.2)
npm i express
```

### Confirmar a versão instalada

```json
// package.json — antes
{ "express": "^3.19.0" }

// package.json — depois do npm i express
{ "express": "^3.21.2" }
```

## Example

**Before (dependência desatualizada):**
```json
{
  "dependencies": {
    "express": "^3.19.0"
  }
}
```

**After (executar `npm i express`):**
```json
{
  "dependencies": {
    "express": "^3.21.2"
  }
}
```

A versão 3.21.2 é a mais recente dentro do range `^3.x.x`, trazendo correções de bugs e melhorias sem quebrar a aplicação.

## Heuristics

| Situação | Ação |
|----------|------|
| Dependência já instalada com `^` | `npm i <pacote>` atualiza para a mais recente compatível |
| Precisa fixar versão exata | Remova o `^` do package.json |
| Quer ver o range de versões válidas | `npm view <pacote> versions --json` |
| Atualização trouxe problema | Volte a versão específica com `npm i <pacote>@<versão>` |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Atualizar manualmente editando package.json sem rodar `npm i` | Use `npm i <pacote>` para atualizar e sincronizar node_modules |
| Remover `^` sem motivo | Mantenha `^` para receber correções de bug automaticamente |
| Ignorar a versão resultante após `npm i` | Confirme no package.json que a versão está no range esperado |
| Confundir `^` (caret) com `~` (tilde) | `^` atualiza minor+patch, `~` atualiza apenas patch |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npm i` nao atualiza a dependencia | Versao ja esta no range maximo permitido pelo `^` | Verifique com `npm view <pacote> versions` se ha versao mais recente no range |
| Atualizacao quebrou a aplicacao | Breaking change inesperada dentro de minor (raro) | Volte a versao anterior com `npm i <pacote>@<versao-anterior>` |
| `^` e `~` confundem | Simbolos semver diferentes | `^` atualiza minor+patch, `~` atualiza apenas patch |
| package-lock.json conflita apos atualizacao | Lock file desatualizado em relacao ao package.json | Delete `node_modules` e `package-lock.json`, rode `npm i` novamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre semver, caret vs tilde, e estratégias de atualização
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comandos npm expandidos com variações