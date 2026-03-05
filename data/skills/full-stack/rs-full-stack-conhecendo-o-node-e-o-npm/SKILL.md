---
name: rs-full-stack-conhecendo-node-npm
description: "Guides Node.js and npm setup and version verification when user asks to 'install node', 'setup npm', 'check node version', 'configure node environment', or 'start a new project from scratch'. Applies rules: always use LTS version, verify installation with version commands, understand LTS vs Current distinction. Make sure to use this skill whenever setting up a new development environment or onboarding someone to Node.js. Not for package management workflows, dependency resolution, or npm scripts configuration."
---

# Conhecendo o Node e o NPM

> Ao configurar um ambiente Node.js, sempre instale a versao LTS e verifique a instalacao com comandos de versao antes de prosseguir.

## Rules

1. **Sempre use a versao LTS** — nunca Current para projetos reais, porque LTS ja passou pela fase de testes da comunidade e teve seus problemas resolvidos
2. **Verifique a instalacao antes de prosseguir** — rode `node --version` e `npm --version` apos instalar, porque assumir que a instalacao funcionou causa erros silenciosos depois
3. **Baixe do site oficial** — use `nodejs.org` diretamente, porque mirrors e fontes alternativas podem ter versoes desatualizadas ou modificadas

## Steps

### Step 1: Download do Node.js

Acesse `nodejs.org` e clique no botao **LTS** (recomendado para a maioria dos usuarios).

```bash
# Ou via gerenciador de versoes (recomendado para devs)
nvm install --lts
nvm use --lts
```

### Step 2: Instalacao

Execute o instalador baixado. No Windows/Mac, siga o wizard (next, next, next). O npm ja vem incluido com o Node.

### Step 3: Verificacao

```bash
# Verificar versao do npm (gerenciador de pacotes)
npm --version

# Verificar versao do Node
node --version
```

Ambos os comandos devem retornar um numero de versao. A numeracao exata nao importa — o importante e que ambos respondam.

## Output format

Apos setup, o terminal deve retornar algo como:

```
$ npm --version
10.2.0

$ node --version
v20.11.0
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto pessoal/estudo | LTS |
| Projeto em producao | LTS, sempre |
| Quer testar features novas do Node | Current, mas nunca em producao |
| Precisa de multiplas versoes | Use `nvm` para gerenciar |
| Comando `node` nao encontrado apos instalar | Reinicie o terminal ou verifique o PATH |

## LTS vs Current

| Versao | Para que serve | Usar em producao? |
|--------|---------------|-------------------|
| **LTS** | Estavel, testada pela comunidade, problemas resolvidos | Sim |
| **Current** | Ultimas novidades, pode ter bugs, fase de testes | Nao |

A Current tem numeracao maior porque inclui todas as funcionalidades novas. Essas features sao disponibilizadas para a comunidade testar e reportar problemas. Depois de estabilizada, a versao vira LTS.

## Error handling

- Se `node --version` retorna erro: Node nao esta no PATH. Reinstale ou configure o PATH manualmente
- Se `npm --version` retorna erro mas `node` funciona: npm pode ter falhado na instalacao. Reinstale o Node
- Se precisa de versao especifica: use `nvm install <version>` em vez de instalar manualmente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre LTS vs Current, estrategia de releases do Node
- [code-examples.md](references/code-examples.md) — Comandos de verificacao e cenarios de instalacao expandidos