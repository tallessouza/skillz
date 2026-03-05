---
name: rs-full-stack-0104-ambiente-dev
description: "Guides Node.js development environment setup when user asks to 'setup node', 'install node', 'prepare dev environment', 'configure node project', or 'start node from scratch'. Ensures correct Node.js and npm installation with version management. Make sure to use this skill whenever setting up a new Node.js project or onboarding a developer. Not for runtime configuration, deployment, or Docker setups."
---

# Ambiente de Desenvolvimento Node.js

> Antes de escrever codigo Node.js, garantir que Node, npm e VS Code estao corretamente instalados e verificados.

## Prerequisites

- Sistema operacional: Windows, macOS ou Linux
- Acesso a terminal/linha de comando
- VS Code instalado (editor recomendado)

## Steps

### Step 1: Instalar o Node.js

Usar o instalador oficial ou um version manager:

```bash
# Opcao recomendada: nvm (Node Version Manager)
# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts

# Windows: usar nvm-windows ou instalador oficial
# https://nodejs.org/en/download
```

### Step 2: Verificar instalacao

```bash
node --version    # deve retornar v18+ ou v20+
npm --version     # deve retornar 9+ ou 10+
```

### Step 3: Verificar VS Code

```bash
code --version    # deve retornar versao instalada
```

## Output format

Ambiente pronto quando todos os comandos retornam versoes validas sem erros.

## Error handling

- Se `node` nao encontrado apos instalacao: reiniciar o terminal para carregar PATH atualizado
- Se versao antiga do Node: usar `nvm install --lts` para atualizar
- Se npm com problemas de permissao no Linux/macOS: nunca usar `sudo npm`, corrigir permissoes ou usar nvm

## Verification

```bash
# Teste rapido: executar um script inline
node -e "console.log('Node funcionando na versao', process.version)"
```

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio sobre escolha de versoes e version managers
- [code-examples.md](references/code-examples.md) — Passo a passo completo por sistema operacional