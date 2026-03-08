---
name: rs-full-stack-exibindo-pacotes-desatualizados
description: "Applies npm outdated workflow to check for outdated dependencies in Node.js projects. Use when user asks to 'check outdated packages', 'update dependencies', 'list outdated npm packages', 'verify package versions', or 'check for updates'. Explains current/wanted/latest columns and version compatibility. Make sure to use this skill whenever managing Node.js dependency versions or auditing project health. Not for installing packages, fixing vulnerabilities, or configuring package.json versioning ranges."
---

# Exibindo Pacotes Desatualizados

> Execute `npm outdated` para listar todas as dependências com versões mais recentes disponíveis antes de decidir o que atualizar.

## Prerequisites

- Node.js e npm instalados
- Projeto com `package.json` e `node_modules` existentes

## Steps

### Step 1: Listar pacotes desatualizados

```bash
npm outdated
```

Ou a forma abreviada:

```bash
npm out
```

### Step 2: Interpretar as colunas do resultado

| Coluna | Significado |
|--------|-------------|
| **Package** | Nome do pacote |
| **Current** | Versão instalada no projeto |
| **Wanted** | Versão mais recente compatível com o range do `package.json` |
| **Latest** | Última versão estável publicada no npm |
| **Location** | Onde o pacote está instalado |
| **Depended by** | Qual projeto depende desse pacote |

### Step 3: Avaliar o que atualizar

```
Current = Wanted = Latest  →  Pacote atualizado, nada a fazer
Current < Wanted           →  Atualização segura disponível (dentro do range)
Wanted < Latest            →  Nova major/minor disponível fora do range atual
```

## Output format

```
Package          Current  Wanted  Latest  Location          Depended by
express          4.19.0   4.21.1  4.21.1  node_modules/...  meu-projeto
jsonwebtoken     9.0.0    9.0.2   9.0.2   node_modules/...  meu-projeto
```

## Heuristics

| Situação | Ação |
|----------|------|
| Wanted = Latest | Atualização segura, compatível com range atual |
| Latest tem major diferente de Current | Verificar changelog antes de atualizar, porque pode ter breaking changes |
| Pacote tem versão "next" no npm | Não usar em produção, porque é versão de teste da comunidade |
| Precisa ver rapidamente | Usar `npm out` (abreviação de `npm outdated`) |

## Anti-patterns

| Não faça | Faça |
|----------|------|
| Atualizar tudo sem verificar | Rodar `npm outdated` primeiro para entender o estado |
| Usar versão "next" em produção | Usar sempre a "latest" (última estável) |
| Ignorar a coluna Wanted | Comparar Wanted vs Latest para entender o impacto da atualização |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre versionamento e significado de cada coluna
- [code-examples.md](references/code-examples.md) — Exemplos práticos de interpretação do npm outdated