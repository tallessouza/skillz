---
name: rs-full-stack-instalando-git-linux
description: "Guides Git installation and initial configuration on Linux (Ubuntu/Debian). Use when user asks to 'install git', 'setup git on linux', 'configure git', 'git config username email', or 'prepare git for github'. Covers apt-get install, version verification, and global user config. Make sure to use this skill whenever setting up a new Linux development environment with Git. Not for Git workflow commands (commit, push, branch), Windows/macOS installation, or GitHub account creation."
---

# Instalando e Configurando Git no Linux

> Instalar o Git e configurar nome/email globais antes de qualquer interacao com repositorios remotos.

## Prerequisites

- Sistema Ubuntu/Debian (para outros distros, consultar documentacao oficial)
- Acesso sudo no terminal
- Email que sera usado no GitHub (ou outro servico Git remoto)

## Steps

### Step 1: Instalar Git via apt-get

```bash
sudo apt-get install git
```

Confirmar com `Y` se solicitado.

### Step 2: Verificar instalacao

```bash
git --version
```

Deve retornar a versao instalada (ex: `git version 2.x.x`).

### Step 3: Configurar nome global

```bash
git config --global user.name "Seu Nome"
```

### Step 4: Configurar email global

```bash
git config --global user.email "seu-email@exemplo.com"
```

Usar o mesmo email cadastrado no GitHub, porque e atraves dessa configuracao que o Git vincula commits locais ao perfil remoto.

## Output format

Apos execucao, `git config --list` deve mostrar:

```
user.name=Seu Nome
user.email=seu-email@exemplo.com
```

## Error handling

- Se `apt-get` nao encontrar o pacote: atualizar com `sudo apt-get update` antes de instalar
- Se distro nao e Debian/Ubuntu: consultar [documentacao oficial](https://git-scm.com/download/linux) para o comando correto
- Se `git --version` retorna erro apos instalar: verificar se o PATH inclui `/usr/bin/`

## Verification

```bash
git --version && git config user.name && git config user.email
```

Os tres comandos devem retornar valores validos.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que configurar email e critico
- [code-examples.md](references/code-examples.md) — Comandos para todas as distros e cenarios alternativos