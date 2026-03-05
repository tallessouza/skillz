---
name: rs-full-stack-instalando-git-no-mac-1
description: "Guides Git installation on macOS using Homebrew, Xcode, or git-scm.com. Use when user asks to 'install git on mac', 'setup git macos', 'configure git mac', or 'homebrew git install'. Covers installation, version check, and global user/email config. Make sure to use this skill whenever helping with Git setup on macOS. Not for Git usage, branching, commits, or Linux/Windows installation."
---

# Instalando Git no Mac

> Instale o Git no macOS via Homebrew e configure identidade global antes de qualquer operacao.

## Prerequisites

- macOS com acesso ao Terminal
- Conexao com a internet
- Email da conta do GitHub (ou o email que sera usado no GitHub)

## Steps

### Step 1: Escolher metodo de instalacao

| Metodo | Quando usar | Tradeoff |
|--------|-------------|----------|
| **Homebrew** (recomendado) | Uso geral de desenvolvimento | Leve, gerenciador de pacotes reutilizavel |
| Xcode | Ja precisa do Xcode para iOS/macOS dev | Muito pesado apenas para Git |
| git-scm.com | Sem Homebrew, sem necessidade de Xcode | Instalacao manual, sem gerenciador |

### Step 2: Instalar Homebrew (se ainda nao tem)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Aguardar 1-3 minutos. Aceitar prompts com `Y`.

### Step 3: Instalar Git via Homebrew

```bash
brew install git
```

Aguardar 3-5 minutos. Aceitar com `Y` quando solicitado.

### Step 4: Verificar instalacao

```bash
git version
```

Se retornar um numero de versao, a instalacao foi bem-sucedida.

### Step 5: Configurar identidade global

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

## Verification

```bash
git version
git config --global user.name
git config --global user.email
```

Todos os tres comandos devem retornar valores corretos.

## Error handling

- Se `git` abre prompt do Xcode automaticamente: cancele e use Homebrew
- Se `brew` nao encontrado apos instalacao: reinicie o Terminal ou adicione ao PATH
- Se `git version` nao retorna nada: reinstale com `brew reinstall git`

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario so precisa de Git | Homebrew, nunca Xcode |
| Usuario ja tem Xcode | Git provavelmente ja esta instalado, verifique com `git version` |
| Email do GitHub ainda nao existe | Oriente a usar o mesmo email quando criar a conta |
| Email configurado difere do GitHub | Corrigir com `git config --global user.email` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar Xcode apenas para Git | Usar Homebrew |
| Configurar email diferente do GitHub | Usar o mesmo email do GitHub |
| Pular configuracao de user.name/email | Sempre configurar antes do primeiro commit |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha de metodo e vinculo email/GitHub
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-instalando-git-no-mac-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-instalando-git-no-mac-1/references/code-examples.md)
