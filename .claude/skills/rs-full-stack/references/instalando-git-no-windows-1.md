---
name: rs-full-stack-instalando-git-windows
description: "Configures Git installation and credential setup on Windows with Git Bash as recommended terminal. Use when user asks to 'install git', 'setup git on windows', 'configure git credentials', 'git bash setup', or 'git global config'. Follows Git SCM official process with Git Bash as recommended terminal. Make sure to use this skill whenever setting up a new Windows development environment. Not for Linux/Mac git installation, GitHub account creation, or SSH key setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: git-windows
  tags: [git, windows, gitbash, configuration, setup]
---

# Instalando e Configurando Git no Windows

> Instale o Git via Git SCM e configure credenciais globais usando Git Bash.

## Prerequisites

- Windows (32-bit ou 64-bit)
- Acesso a internet para download
- E-mail que sera usado no GitHub (ou e-mail ja cadastrado no GitHub)
- Se nao souber a arquitetura: System Information → verificar se e 32 ou 64-bit

## Steps

### Step 1: Download do Git

1. Acessar `git-scm.com/download`
2. Selecionar a versao correta (64-bit na maioria dos casos modernos)
3. Iniciar o download

### Step 2: Instalacao

1. Executar o instalador
2. Autorizar permissoes do sistema
3. Clicar "Next" em todas as telas — nenhuma configuracao adicional e necessaria, porque os defaults sao seguros e funcionais
4. Finalizar a instalacao

### Step 3: Abrir Git Bash

```bash
# Procurar no menu iniciar por "Git Bash"
# NAO usar Git GUI nem Git CMD — usar Git Bash
```

Sempre usar Git Bash como terminal no Windows, porque ele ja vem com git integrado — cmd e PowerShell exigiriam configuracao adicional.

### Step 4: Verificar instalacao

```bash
git -v
```

### Step 5: Configurar credenciais globais

```bash
git config --global user.name "SeuNome"
git config --global user.email "seu@email.com"
```

O e-mail DEVE ser o mesmo do GitHub, porque o Git local usa esse e-mail para conectar commits ao perfil do GitHub.

## Output format

Apos completar todos os steps:
- `git -v` retorna a versao instalada
- `git config --global user.name` retorna o nome configurado
- `git config --global user.email` retorna o e-mail configurado

## Error handling

- Se `git -v` nao funcionar no Git Bash: reinstalar seguindo os mesmos passos
- Se nao souber se e 32 ou 64-bit: abrir System Information (Informacoes do Sistema) e verificar
- Se esqueceu de clicar "Launch" no final: buscar "Git Bash" no menu iniciar

## Verification

```bash
git -v              # Deve retornar versao do git
git config --list   # Deve mostrar user.name e user.email configurados
```

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `git -v` nao funciona no Git Bash | Instalacao incompleta ou corrompida | Reinstalar seguindo os mesmos passos |
| Nao sabe se sistema e 32 ou 64-bit | Informacao do sistema nao verificada | Abrir System Information e verificar tipo do sistema |
| Git Bash nao aparece no menu | Instalacao nao concluida | Executar o instalador novamente e finalizar |
| Commits nao vinculam ao GitHub | Email global diferente do GitHub | Configurar com `git config --global user.email` usando email do GitHub |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolhas de terminal e conexao Git-GitHub
- [code-examples.md](references/code-examples.md) — Todos os comandos com variacoes e troubleshooting