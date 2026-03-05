---
name: rs-full-stack-publicando-no-github
description: "Guides publishing projects to GitHub using Visual Studio Code's built-in Git integration. Use when user asks to 'publish to github', 'push project to github', 'upload code to github', 'publish repository from vscode', or 'create github repo from vscode'. Covers authentication, public vs private repos, and naming conflicts. Make sure to use this skill whenever a beginner asks how to get their project on GitHub using VS Code. Not for Git CLI workflows, GitHub Actions, CI/CD pipelines, or advanced Git operations like branching and merging."
---

# Publicando no GitHub pelo VS Code

> Publique projetos no GitHub diretamente pelo Visual Studio Code sem precisar abrir a interface web do GitHub.

## Prerequisites

- Conta no GitHub criada e verificada
- Visual Studio Code instalado
- Projeto aberto no VS Code com pelo menos um commit

## Steps

### Step 1: Iniciar publicacao

Clique em **Publish Branch** na barra lateral do Source Control (ícone de ramificação) do VS Code.

### Step 2: Autorizar o VS Code no GitHub

O VS Code abre o navegador para autenticação. Clique em **Allow** para conceder permissões. Verifique que a conta exibida é a correta — se não for, faça logout e login na conta desejada.

### Step 3: Escolher visibilidade

O VS Code pergunta: **Public** ou **Private**?

| Opção | Quem acessa |
|-------|-------------|
| Public | Qualquer pessoa na internet |
| Private | Somente você e colaboradores convidados |

### Step 4: Confirmar nome do repositório

O VS Code usa o **nome da pasta do projeto** como nome do repositório. Se já existir um repositório com esse nome na sua conta, a publicação será bloqueada.

### Step 5: Verificar no GitHub

Após publicar, o VS Code oferece abrir o repositório no navegador. Confirme que todos os commits e arquivos estão lá.

## Error handling

- Se o nome do repositório já existe: feche o VS Code, renomeie a pasta do projeto no sistema de arquivos, reabra o VS Code e tente novamente
- Se a autenticação falhar: verifique suas credenciais no GitHub e tente o fluxo de Allow novamente
- Se a conta exibida estiver errada: faça logout da conta atual no prompt de autenticação e faça login na conta correta

## Heuristics

| Situação | Faça |
|----------|------|
| Projeto pessoal de estudo | Private — mantenha organizado |
| Portfolio ou projeto open source | Public — visibilidade para recrutadores |
| Nome genérico como "projeto" | Renomeie a pasta antes de publicar para algo descritivo como `projetoreceitas-fullstack` |
| Primeiro uso do VS Code com GitHub | Prepare a conta GitHub antes, porque o fluxo de autorização só acontece uma vez |

## Verification

- Abra o repositório no GitHub pelo link oferecido pelo VS Code
- Confirme que todos os commits aparecem na aba "Commits"
- Confirme que todos os arquivos do projeto estão presentes
- Benefício: projeto seguro na nuvem — mesmo se apagar o computador, o código está acessível

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre autenticação, nomes de repositório e visibilidade
- [code-examples.md](references/code-examples.md) — Fluxos visuais passo a passo e cenários alternativos