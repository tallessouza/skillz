---
name: rs-full-stack-atualizando-pacotes
description: "Enforces correct npm package update workflow using npm-check-updates. Use when user asks to 'update packages', 'upgrade dependencies', 'check outdated packages', 'update npm modules', or 'keep dependencies current'. Applies steps: audit with npx npm-check-updates, update with -u flag, run npm install to sync package-lock.json, verify with npm outdated. Make sure to use this skill whenever managing Node.js dependency versions or troubleshooting version mismatches. Not for installing new packages, removing packages, or configuring package.json scripts."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: dependencias
  tags: [npm, npm-check-updates, package-json, lockfile]
---

# Atualizando Pacotes Node.js

> Atualizar dependências exige três passos obrigatórios: verificar, atualizar e sincronizar o lockfile.

## Prerequisites

- Node.js e npm instalados
- Projeto com `package.json` existente
- Se `npx` disponível (vem com npm 5.2+)

## Steps

### Step 1: Verificar pacotes desatualizados

```bash
npx npm-check-updates
```

Lista todos os pacotes com versões novas disponíveis sem modificar nada. Mostra a versão atual e a recomendada.

### Step 2: Atualizar versões no package.json

```bash
npx npm-check-updates -u
```

A flag `-u` atualiza as versões no `package.json` para as últimas recomendadas. Este comando altera apenas o `package.json`, não instala nada.

### Step 3: Sincronizar o package-lock.json

```bash
npm install
```

Obrigatório após o step 2, porque `npm-check-updates -u` só altera o `package.json`. Sem rodar `npm install`, o `package-lock.json` fica desatualizado e `npm outdated` ainda mostrará versões antigas.

### Step 4: Verificar resultado

```bash
npm outdated
```

Se não retornar nada, todas as dependências estão atualizadas. Alternativamente:

```bash
npx npm-check-updates
```

Deve mostrar que todas as dependências batem com a última versão disponível.

## Heuristics

| Situação | Ação |
|----------|------|
| `npm outdated` mostra versão antiga após atualizar | Rodar `npm install` — o lockfile está desincronizado |
| Quer ver sem modificar nada | `npx npm-check-updates` (sem `-u`) |
| Quer atualizar tudo de uma vez | `npx npm-check-updates -u` + `npm install` |
| Quer atualizar um pacote específico | `npm install pacote@latest` |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Rodar `npx npm-check-updates -u` sem `npm install` depois | Sempre rodar `npm install` após atualizar para sincronizar o lockfile |
| Editar versões manualmente no `package.json` | Usar `npx npm-check-updates -u` para atualizar de forma consistente |
| Ignorar `npm outdated` mostrando versões antigas | Investigar se o lockfile está sincronizado |

## Error handling

- Se `npm-check-updates` não for encontrado: usar `npx npm-check-updates` (npx baixa automaticamente)
- Se `npm outdated` mostra discrepância após atualização: rodar `npm install` para sincronizar lockfile
- Se algum pacote causa breaking change: reverter a versão específica no `package.json` e rodar `npm install`

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npm outdated` mostra versoes antigas apos atualizar | Lockfile desincronizado | Execute `npm install` apos `npx npm-check-updates -u` |
| `npx npm-check-updates` nao encontrado | Ferramenta nao instalada | npx baixa automaticamente, verifique conexao com internet |
| Pacote causa breaking change apos update | Major version bump sem analise | Reverta versao no package.json e rode `npm install` |
| `npm install` falha com ERESOLVE | Conflito de peer dependencies | Resolva dependencia conflitante ou use `--legacy-peer-deps` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o papel do package-lock.json e por que a sincronização é crítica
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variações e cenários