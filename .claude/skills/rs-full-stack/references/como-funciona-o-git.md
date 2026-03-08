---
name: rs-full-stack-como-funciona-o-git
description: "Applies Git mental models and workflow knowledge when user asks to 'explain git', 'how does git work', 'what is a commit', 'what is a branch', 'git workflow', or 'version control'. Enforces correct understanding of commit, branch, stage area, local/remote repository concepts. Make sure to use this skill whenever explaining Git fundamentals or onboarding someone to version control. Not for advanced Git operations, rebasing strategies, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [git, version-control, commit, branch, fundamentals, workflow]
---

# Como Funciona o Git

> Git e um controle de versao que permite navegar no historico do projeto, criar linhas do tempo alternativas e colaborar com outras pessoas.

## Key concept

Git controla versoes do projeto criando pontos na historia (commits) ao longo de linhas do tempo (branches). Como o Doctor Strange da Marvel manipulando o tempo — voce cria pontos na historia e pode navegar entre eles, voltar ao passado, ou criar realidades alternativas.

O fluxo fundamental que representa 80% do uso diario: modificar arquivos → stage area → commit → push para remoto (ou pull do remoto).

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Precisa voltar a uma versao anterior | Navegue pelos commits na branch |
| Precisa desenvolver feature sem afetar producao | Crie uma branch alternativa |
| Arquivo modificado pronto para registrar | Coloque no Stage Area antes de commitar |
| Codigo precisa ser compartilhado ou preservado | Push para repositorio remoto (GitHub) |
| Precisa trazer alteracoes de outros | Pull do repositorio remoto |

## Vocabulario essencial

| Termo | Significado | Analogia |
|-------|------------|----------|
| **Commit** | Ponto na historia do projeto | Snapshot no tempo |
| **Branch** | Linha do tempo (ramificacao) | Realidade alternativa do Doctor Strange |
| **Main** | Branch principal | Linha do tempo principal |
| **Stage Area** | Area de preparo antes do commit | Sala de espera — confirma o que entra no commit |
| **Repository (Repo)** | Projeto com Git inicializado | Pasta do projeto com controle de versao |
| **Local Repository** | Repo na sua maquina | Seu universo local |
| **Remote Repository** | Repo na nuvem (GitHub) | Backup + colaboracao |

## How to think about it

### O fluxo dos 80%

```
Modificar arquivos
       │
       ▼
  Stage Area  ← "esses arquivos estao prontos"
       │
       ▼
    Commit     ← "ponto na historia criado"
       │
       ▼
  Push (remoto) ← "seguro na nuvem + acessivel por outros"
```

### Branches como Instagram sem Reels

A branch principal e o Instagram que os usuarios veem. Para criar o Reels, abra uma branch alternativa. Desenvolva, teste, e so quando estiver pronto, traga para a principal. Usuarios nunca veem codigo incompleto.

### Por que repositorio remoto?

1. **Seguranca** — se o computador estragar, o codigo sobrevive
2. **Colaboracao** — outras pessoas acessam e contribuem
3. **Empresas** — equipes inteiras trabalham no mesmo projeto simultaneamente

## Comandos no fluxo

| Etapa | Acao |
|-------|------|
| Iniciar Git no projeto | Comando para criar repo local |
| Verificar estado dos arquivos | Comando para checar mudancas |
| Preparar arquivos | Comando para colocar no Stage Area |
| Criar ponto na historia | Comando para fazer commit |
| Enviar para nuvem | Comando para push ao remoto |
| Trazer da nuvem | Comando para pull do remoto |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Salvar o arquivo = versionar | Salvar e local; commit cria o ponto na historia |
| Commit direto sem stage | Precisa passar pelo Stage Area antes |
| Repo local e suficiente | Sem remoto, se o PC quebrar perdeu tudo |
| Branch principal e para desenvolver | Desenvolva em branches alternativas, merge quando pronto |
| Git e GitHub sao a mesma coisa | Git e o controle de versao; GitHub e o servico de nuvem |

## Limitations

- Esta explicacao cobre o modelo mental e o fluxo basico (80% do uso diario)
- Nao cobre: merge conflicts, rebase, cherry-pick, git flow, trunk-based development
- Comandos especificos sao ensinados em aulas praticas separadas

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Confusao entre Git e GitHub | Conceitos diferentes misturados | Git = ferramenta local de versionamento; GitHub = servico de nuvem |
| Arquivo modificado mas nao aparece no commit | Arquivo nao passou pelo Stage Area | Execute `git add <arquivo>` antes de `git commit` |
| Branch errada ativa | Nao verificou a branch antes de trabalhar | Use `git branch` para ver branches e `git checkout <branch>` para trocar |
| Commit feito com mensagem errada | Mensagem nao pode ser editada apos commit simples | Use `git commit --amend -m "nova mensagem"` para o ultimo commit |
| Perda de trabalho ao trocar de branch | Mudancas nao commitadas foram perdidas | Sempre commite ou use `git stash` antes de trocar de branch |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes