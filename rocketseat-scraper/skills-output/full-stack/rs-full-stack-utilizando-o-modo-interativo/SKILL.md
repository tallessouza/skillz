---
name: rs-full-stack-utilizando-o-modo-interativo
description: "Applies npm-check-updates interactive mode workflow when selectively updating Node.js dependencies. Use when user asks to 'update packages interactively', 'choose which dependencies to update', 'selectively update npm packages', 'use ncu interactive', or 'update specific dependencies'. Ensures correct flags, navigation keys, and automatic npm install behavior. Make sure to use this skill whenever managing dependency updates with granular control. Not for bulk updates without selection, npm audit fixes, or non-Node.js package managers."
---

# npm-check-updates — Modo Interativo

> Atualizar dependencias seletivamente usando o modo interativo do npm-check-updates, escolhendo exatamente quais pacotes atualizar.

## Prerequisites

- Node.js e npm instalados
- Projeto com `package.json` existente
- `npx` disponivel (incluso no npm 5.2+)
- Dependencias desatualizadas no projeto (verificar com `npm outdated`)

## Steps

### Step 1: Verificar dependencias desatualizadas

```bash
npm outdated
```

Confirmar que existem pacotes com versoes newer disponiveis antes de prosseguir.

### Step 2: Executar ncu em modo interativo

```bash
npx npm-check-updates --interactive --format group
```

Flags:
- `--interactive` — ativa o modo interativo com selecao visual
- `--format group` — agrupa pacotes por tipo de atualizacao (major, minor, patch)

### Step 3: Navegar e selecionar pacotes

| Tecla | Acao |
|-------|------|
| Seta cima/baixo | Navegar entre pacotes |
| Barra de espaco | Marcar/desmarcar pacote individual |
| `a` | Marcar/desmarcar todos de uma vez |
| Enter | Confirmar selecao e iniciar atualizacao |

### Step 4: Confirmar atualizacao

Apos Enter, o ncu mostra a versao atual e a versao destino de cada pacote selecionado. Confirmar para prosseguir — o `npm install` e executado automaticamente pelo modo interativo.

### Step 5: Verificar resultado

```bash
npm outdated
```

Ou executar novamente o modo interativo para confirmar que nao restam pacotes pendentes:

```bash
npx npm-check-updates --interactive --format group
```

## Output format

O modo interativo exibe:
```
? Choose which packages to update

 Minor
  ❯ ◉ express  4.19.0  →  4.21.0
    ◉ jsonwebtoken  9.0.0  →  9.0.2

 Major
    ◯ some-pkg  1.0.0  →  2.0.0
```

Apos confirmacao:
```
express  4.19.0  →  4.21.0
Run npm install to install new versions? Yes
```

## Error handling

- Se nenhum pacote desatualizado existir, o modo interativo informa que todas as dependencias estao atualizadas
- Se desmarcar todos os pacotes e dar Enter, nenhuma atualizacao e aplicada

## Verification

- `npm outdated` deve retornar vazio para os pacotes atualizados
- `package.json` deve refletir as novas versoes
- `node_modules` ja esta atualizado porque o modo interativo executa `npm install` automaticamente

## Heuristics

| Situacao | Faca |
|----------|------|
| Quer atualizar tudo sem escolher | Use `npx npm-check-updates -u` (modo nao-interativo) |
| Quer escolher pacote a pacote | Use `--interactive --format group` |
| Precisa atualizar apenas minor/patch | Use modo interativo e desmarque os major |
| Muitos pacotes desatualizados | Use `a` para desmarcar tudo, depois selecione individualmente |

## Anti-patterns

| Nao faca | Faca instead |
|----------|--------------|
| Atualizar tudo cegamente com `ncu -u` | Use modo interativo para revisar cada pacote |
| Rodar `npm install` manualmente apos modo interativo | O modo interativo ja executa `npm install` automaticamente |
| Editar `package.json` manualmente para atualizar versoes | Use ncu interativo para gerenciar versoes de forma segura |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar modo interativo vs automatico
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com cenarios de atualizacao seletiva