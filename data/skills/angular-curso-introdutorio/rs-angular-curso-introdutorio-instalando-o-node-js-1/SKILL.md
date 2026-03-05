---
name: rs-angular-intro-instalando-node-js
description: "Guides Node.js and Angular CLI installation and environment setup when user asks to 'setup Angular', 'install Node', 'configure Angular environment', 'start Angular project', or 'prepare dev environment for Angular'. Follows LTS-first approach with verification steps. Make sure to use this skill whenever setting up a new Angular development environment from scratch. Not for runtime debugging, Angular component creation, or Node.js API development."
---

# Instalando Node.js e Angular CLI

> Instale Node.js LTS primeiro, verifique a instalacao, depois instale Angular CLI globalmente via npm.

## Prerequisites

- Sistema operacional Windows, macOS ou Linux
- Acesso a terminal (cmd, PowerShell, ou terminal nativo)
- Conexao com a internet

## Steps

### Step 1: Instalar Node.js (versao LTS)

Acessar [nodejs.org](https://nodejs.org) e baixar a versao **LTS** (Long Term Support).

```bash
# Motivo: LTS é a versao mais estavel e com suporte prolongado
# Nunca instalar a versao Current para projetos Angular — risco de incompatibilidade
```

No Windows: executar o .msi baixado, aceitar defaults, Next ate finalizar.

### Step 2: Verificar instalacao do Node.js

```bash
node --version
# Deve exibir a versao instalada, ex: v22.14.0
```

Se o comando nao for reconhecido: reiniciar o terminal ou verificar se o Node foi adicionado ao PATH.

### Step 3: Instalar Angular CLI globalmente

```bash
npm install -g @angular/cli
```

### Step 4: Verificar instalacao do Angular CLI

```bash
ng version
# Deve exibir a versao do Angular CLI instalada

ng help
# Lista todos os comandos disponiveis do Angular CLI
```

## Output format

Apos completar todos os steps, o ambiente deve responder a:

| Comando | Resultado esperado |
|---------|-------------------|
| `node --version` | Versao LTS do Node (ex: v22.14.0) |
| `ng version` | Versao do Angular CLI (ex: 19.2.4) |
| `ng help` | Lista de comandos disponíveis |

## Error handling

- Se `node --version` falhar: reinstalar Node.js e verificar variavel PATH do sistema
- Se `npm install -g` falhar com permissao: no Linux/macOS usar `sudo npm install -g @angular/cli`, no Windows abrir terminal como Administrador
- Se `ng` nao for reconhecido apos instalacao: fechar e reabrir o terminal

## Verification

Executar os tres comandos em sequencia — se todos retornarem versoes validas, o ambiente esta pronto:

```bash
node --version && npm --version && ng version
```

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
