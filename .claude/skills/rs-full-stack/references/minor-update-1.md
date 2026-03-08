---
name: rs-full-stack-minor-update-1
description: "Applies npm minor version update workflow using npm-check-updates in interactive grouped mode. Use when user asks to 'update dependencies', 'upgrade packages', 'check outdated', 'minor update', or 'atualizar dependências'. Guides progressive dependency updates: interactive selection, grouped by semver level, verification after update. Make sure to use this skill whenever updating Node.js project dependencies incrementally. Not for major version migrations, breaking change upgrades, or lockfile-only operations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: nodejs-tooling
  tags: [npm, dependencies, semver, npm-check-updates, maintenance]
---

# Minor Update de Dependências Node.js

> Atualize dependências minor de forma progressiva e segura usando npm-check-updates no modo interativo agrupado.

## Prerequisites

- Node.js e npm instalados
- `npx` disponível (incluso no npm 5.2+)
- Projeto com `package.json` existente
- Ferramenta de teste da API (Insomnia, curl, etc.) para verificação pós-update

## Steps

### Step 1: Executar npm-check-updates no modo interativo agrupado

```bash
npx npm-check-updates --interactive --format group
```

- `--interactive` — permite selecionar quais pacotes atualizar
- `--format group` — agrupa por tipo de atualização (patch, minor, major), porque facilita atualização progressiva por nível de risco

### Step 2: Selecionar apenas atualizações minor

- Desmarcar atualizações **major** (breaking changes)
- Manter marcadas todas as **minor** (novas funcionalidades, sem breaking changes)
- Confirmar a seleção e aceitar a instalação automática

### Step 3: Verificar atualizações restantes

```bash
npx npm-check-updates
```

Executar sem `--interactive` para listar o que ainda precisa ser atualizado, porque confirma que as minor foram removidas da lista pendente.

### Step 4: Verificar a aplicação

1. Executar a aplicação normalmente
2. Verificar a aba Problems do editor — não deve haver erros novos
3. Navegar pelos arquivos principais do projeto para inspeção visual
4. Testar endpoints críticos da API (listar, criar, atualizar)

## Output format

Após o processo:
- `package.json` atualizado com novas versões minor
- `node_modules/` reinstalado com dependências atualizadas
- `package-lock.json` atualizado
- Aplicação funcionando sem erros

## Error handling

- Se a aplicação falhar após update: reverter com `git checkout package.json package-lock.json && npm install`
- Se um pacote específico causar problema: executar novamente o interativo e desmarcar apenas esse pacote
- Se `npx npm-check-updates` não for encontrado: instalar globalmente com `npm install -g npm-check-updates`

## Verification

- [ ] `npx npm-check-updates` não lista mais atualizações minor pendentes
- [ ] Aplicação inicia sem erros
- [ ] Endpoints principais respondem corretamente
- [ ] Nenhum erro novo na aba Problems do editor

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto com muitas dependências | Atualizar em grupos (minor primeiro, depois major uma a uma) |
| Dependência com highlight de cor diferente | Indica que traz funcionalidades novas além de bug fixes |
| Após atualização minor | Sempre rodar a aplicação e testar endpoints antes de commitar |
| Major restante na lista | Não atualizar junto com minor — tratar separadamente |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|--------------|
| `npm update` sem verificar o que muda | `npx npm-check-updates --interactive --format group` para controle granular |
| Atualizar major e minor juntos | Atualizar minor primeiro, testar, depois major uma a uma |
| Confiar apenas no editor para verificação | Testar a aplicação rodando e fazer requests reais |
| Pular verificação pós-update | Navegar pelos arquivos e testar endpoints críticos |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `npx npm-check-updates` nao encontrado | Pacote nao instalado globalmente | Execute com `npx` que baixa automaticamente ou instale: `npm i -g npm-check-updates` |
| Aplicacao quebra apos update | Dependencia com breaking change disfarçada de minor | Reverta: `git checkout package.json package-lock.json && npm install` |
| `--interactive` nao abre interface | Terminal nao suporta modo interativo | Use sem `--interactive` e aplique manualmente |
| Conflitos no `package-lock.json` | Multiplos devs atualizaram dependencias | Delete `node_modules` e `package-lock.json`, rode `npm install` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre atualização progressiva e semver
- [code-examples.md](references/code-examples.md) — Comandos completos e fluxo de verificação expandido