---
name: rs-full-stack-o-que-e-github
description: "Introduces GitHub as a cloud hosting platform for Git repositories and clarifies how it differs from Git. Use when user asks 'what is GitHub', 'GitHub vs Git', 'where to host code', 'how to share my code', or 'how to collaborate on projects'. Make sure to use this skill whenever there is confusion between Git and GitHub. Not for Git commands, branching strategies, or GitHub CLI usage."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: git-github
  tags: [github, git, repositorio-remoto, colaboracao, beginner]
---

# O Que É GitHub

> GitHub é uma plataforma online para hospedar repositórios Git na nuvem, permitindo colaboração e visibilidade do trabalho.

## Key concepts

Git é a ferramenta de versionamento local. GitHub é o serviço de nuvem que hospeda repositórios Git. A confusão acontece porque os nomes são parecidos, mas são coisas distintas: Git funciona na sua máquina, GitHub funciona na internet.

O fluxo é: repositório Git local na máquina → linkado com GitHub na nuvem → acessível por qualquer pessoa.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Código apenas na máquina local | Subir para o GitHub — porque ninguém consegue se conectar na sua máquina |
| Precisa trabalhar em equipe | GitHub permite colaboração no mesmo projeto |
| Quer mostrar trabalho/portfólio | Perfil público do GitHub funciona como portfólio |
| Quer usar projeto de terceiro | Buscar no GitHub e trazer para máquina local |

## How to think about it

### Git vs GitHub
Git é o motor do carro — funciona sozinho, localmente. GitHub é a garagem compartilhada na nuvem — permite que outros vejam e trabalhem no mesmo carro. Sem Git, GitHub não faz sentido. Sem GitHub, Git funciona mas fica isolado.

### Alternativas ao GitHub
GitHub não é a única opção. GitLab e Bitbucket oferecem funcionalidades similares. GitHub é o mais popular e comum no mercado.

### Conectando repositorio local ao GitHub

```bash
# Criar repositorio local
git init
git add .
git commit -m "feat: initial commit"

# Conectar com GitHub e enviar
git remote add origin https://github.com/usuario/meu-projeto.git
git push -u origin main
```

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| GitHub e Git são a mesma coisa | Git é ferramenta local de versionamento, GitHub é plataforma online |
| Precisa de GitHub para usar Git | Git funciona 100% sozinho na máquina local |
| Código só precisa estar na máquina | Sem GitHub, colaboração e visibilidade ficam limitadas |

## When to apply

- Ao iniciar qualquer projeto novo — já conectar com GitHub desde o início
- Todo código feito deve ir para o GitHub — funciona como backup e portfólio
- Quando precisar trabalhar em equipe em um mesmo codebase
- Para construir presença profissional como desenvolvedor

## Limitations

- GitHub é apenas hospedagem — não substitui conhecimento de Git
- Repositórios públicos expõem todo o código (usar privado quando necessário)
- Depende de conexão com internet para sincronizar

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `git push` retorna erro de permissao | Repositorio nao vinculado ou sem autenticacao | Configure `git remote add origin URL` e autentique via SSH ou token |
| Repositorio nao aparece no perfil | Repositorio esta como privado | Altere para publico em Settings do repositorio |
| Conflito ao fazer `git pull` | Alteracoes locais conflitam com remotas | Resolva os conflitos manualmente e faca commit |
| GitHub mostra arquivos desatualizados | Push nao foi feito apos commits locais | Execute `git push` para sincronizar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre a relação Git/GitHub e analogias
- [code-examples.md](references/code-examples.md) — Fluxos de conexão local → GitHub