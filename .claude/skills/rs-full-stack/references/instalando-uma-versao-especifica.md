---
name: rs-full-stack-instalando-versao-especifica
description: "Applies specific npm package version installation using the @ syntax when user asks to 'install a package', 'add a dependency', 'npm install', 'setup project dependencies', or 'pin package version'. Ensures version pinning with npm install package@version syntax. Make sure to use this skill whenever installing npm packages in a learning or tutorial context. Not for yarn, pnpm, or general Node.js runtime configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: npm-versioning
  tags: [npm, versioning, packages, installation, dependencies]
---

# Instalando Versao Especifica de Pacotes NPM

> Ao instalar pacotes NPM, sempre especifique a versao exata com `@versao` para garantir reprodutibilidade.

## Rules

1. **Use a sintaxe `@versao`** — `npm install pacote@1.2.3` nao `npm install pacote`, porque pacotes atualizam frequentemente (as vezes duas versoes no mesmo dia) e APIs mudam entre versoes
2. **Consulte o npmjs.com para versoes** — acesse a aba "Versions" em `npmjs.com/package/{nome}` para ver historico completo, porque la mostra data de publicacao e volume de downloads por versao
3. **Versoes podem ter rotulos** — algumas versoes incluem sufixos como `-alpha`, `-beta`, `-rc.1`, e isso e normal — inclua o rotulo completo na instalacao
4. **Verifique o package.json apos instalar** — confirme que a versao correta aparece no campo de dependencias, porque o npm confirma a mudanca ali

## Steps

### Step 1: Identificar a versao desejada

Consulte npmjs.com ou a documentacao do projeto para encontrar a versao exata.

```bash
# Ver todas as versoes disponiveis de um pacote
npm view json-server versions
```

### Step 2: Instalar com versao especifica

```bash
# Sintaxe: npm install <pacote>@<versao>
npm install json-server@1.0.0-alpha.23
```

### Step 3: Verificar a instalacao

```bash
# Confirmar versao no package.json
cat package.json | grep json-server
```

## Example

**Before (instalacao generica — risco de incompatibilidade):**
```bash
npm install json-server
# Instala a versao mais recente, que pode ter breaking changes
```

**After (com versao pinada):**
```bash
npm install json-server@1.0.0-alpha.23
# Instala exatamente a versao esperada
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Seguindo tutorial ou curso | Instale a mesma versao do instrutor |
| Projeto em producao | Pine versoes exatas no package.json |
| Explorando pacote novo | Use `npm view pacote versions` antes de instalar |
| Versao com rotulo (alpha/beta) | Inclua o rotulo completo: `pacote@1.0.0-alpha.1` |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `npm install pacote` em tutorial | `npm install pacote@versao-do-instrutor` |
| Ignorar diferenca de versao quando algo quebra | Verificar e alinhar versao primeiro |
| Assumir que versao mais nova funciona igual | Testar com a versao documentada |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Versao instalada difere da especificada | Cache do npm desatualizado | Limpar cache com `npm cache clean --force` e reinstalar |
| Versao com rotulo nao encontrada | Rotulo incorreto ou versao removida do registry | Verificar versoes disponiveis com `npm view pacote versions` |
| Pacote quebra apos atualizar versao | Breaking changes entre versoes | Reinstalar a versao original: `npm i pacote@versao-anterior` |
| package.json mostra `^` antes da versao | npm adiciona range por padrao | Usar `--save-exact` ou editar manualmente para versao exata |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre versionamento e por que pacotes quebram entre versoes
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de instalacao com npm, verificacao e troubleshooting