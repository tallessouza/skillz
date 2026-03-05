---
name: rs-angular-instalando-node-js-npm
description: "Guides Node.js and NPM installation and version verification for Angular development. Use when user asks to 'install node', 'setup node', 'install npm', 'configure node for angular', or 'verify node installation'. Covers downloading from nodejs.org, choosing LTS versions, running the installer, and verifying with terminal commands. Make sure to use this skill whenever setting up a new Angular development environment. Not for nvm/fnm version managers, Docker-based Node setups, or Angular CLI installation."
---

# Instalacao do Node.js e NPM

> Instale o Node.js pela versao LTS oficial e verifique a instalacao pelo terminal antes de prosseguir com qualquer setup Angular.

## Prerequisites

- Acesso ao site [nodejs.org](https://nodejs.org)
- Permissao de administrador na maquina (para o instalador)
- Terminal disponivel (CMD, PowerShell, Terminal do Mac, ou terminal Linux)

## Steps

### Step 1: Baixar o Node.js

1. Acessar [nodejs.org](https://nodejs.org)
2. Escolher a versao **LTS** (recomendada para estabilidade)
3. Ou clicar em "Download" no menu para selecionar uma versao especifica compativel com o Angular do projeto

```
Prioridade: LTS > outras versoes disponiveis
Para Angular moderno: Node 22.x funciona bem
```

### Step 2: Executar o instalador

1. Executar o arquivo `.msi` (Windows) ou `.pkg` (Mac) baixado
2. Seguir os passos do wizard: Next → Accept → Next → Next → Install
3. O NPM sera instalado automaticamente junto com o Node — nao precisa instalar separado

### Step 3: Fechar todos os terminais

Apos a instalacao, **feche todos os terminais abertos** antes de verificar, porque o PATH so atualiza em terminais novos.

Se os comandos nao funcionarem mesmo com terminal novo: **reiniciar a maquina**.

### Step 4: Verificar a instalacao

```bash
node --version
# Esperado: v22.x.x (ou a versao que voce instalou)

npm --version
# Esperado: 10.x.x (versao compativel com o Node instalado)
```

## Output format

Instalacao bem-sucedida quando ambos os comandos retornam versoes:

```
$ node --version
v22.16.0

$ npm --version
10.9.2
```

## Error handling

- Se `node --version` retornar "command not found": fechar o terminal e abrir um novo
- Se ainda nao funcionar: reiniciar a maquina para o PATH atualizar
- Se precisar de versao especifica: usar o dropdown de versoes no site, nao a LTS da pagina principal

## Verification

- `node --version` retorna versao compativel com o Angular do projeto
- `npm --version` retorna versao correspondente ao Node instalado
- Ambos os comandos funcionam de qualquer diretorio no terminal

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
