---
name: rs-devops-criando-primeiro-repositorio
description: "Configures GitHub repository structure for CI/CD pipelines with naming conventions, gitignore validation, and clean first commits. Use when user asks to 'create a repo for CI/CD', 'setup GitHub repository', 'initialize project for pipeline', or 'prepare repo for GitHub Actions'. Enforces semantic naming conventions, pre-add gitignore validation, SSH authentication, and conventional commits from the start. Make sure to use this skill whenever setting up a new repository intended for CI/CD workflows. Not for GitHub Actions configuration, Dockerfile creation, or pipeline definition."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-repository-setup
  tags: [github, repository, ci-cd, gitignore, ssh, conventional-commits]
---

# Criando Repositorio para CI/CD

> Antes de configurar qualquer pipeline, o repositorio precisa estar corretamente estruturado, nomeado e publicado no GitHub.

## Rules

1. **Nomeie repositorios com convencao semantica** — `{org}.{modulo}.{tipo}` (ex: `skillz.ci.api`), porque facilita identificar o contexto do projeto no GitHub
2. **Valide o .gitignore ANTES do primeiro git add** — execute `git status` antes de adicionar arquivos, porque subir cache, node_modules ou credenciais no primeiro commit e dificil de reverter
3. **Adicione descricao ao repositorio** — sempre preencha o campo description no GitHub, porque repositorios sem descricao se tornam indistinguiveis em listas
4. **Configure SSH antes de trabalhar com repositorios** — use SSH ao inves de HTTPS para evitar autenticacao repetida, porque reduz friccao no fluxo diario
5. **Primeiro commit deve ser atomico e limpo** — apenas arquivos essenciais (codigo, Dockerfile, docker-compose, .gitignore), porque o historico começa aqui
6. **Use conventional commits desde o inicio** — `chore: first commit` com mensagem sucinta em ingles, porque estabelece o padrao para todo o time

## Prerequisites

- Git instalado e configurado (`git config user.name` e `user.email`)
- Conta GitHub com SSH key configurada (ou HTTPS como alternativa)
- Opcional: GitHub CLI (`gh`) para criar repo via terminal

## Steps

### Step 1: Criar repositorio no GitHub

```bash
# Via interface: github.com/new
# Via CLI:
gh repo create {org}.{modulo}.{tipo} --private --description "Projeto para testes de CI e CD"
```

Convencao de nome: `{organizacao}.{modulo}.{tipo}`
- modulo: `ci`, `k8s`, `iac`
- tipo: `api`, `web`, `infra`

Nao adicione README, .gitignore ou license pelo GitHub se o projeto local ja possui esses arquivos.

### Step 2: Validar .gitignore antes do add

```bash
# Verificar o que sera adicionado
git status

# Se houver pastas indesejadas (cache, node_modules, .env):
echo "/cache" >> .gitignore
# Remover do tracking se ja foi adicionado
git rm -r --cached .cache/
```

### Step 3: Primeiro commit e push

```bash
git init
git add .
git status  # Validar novamente
git commit -m "chore: first commit"
git branch -M main
git remote add origin git@github.com:{user}/{repo}.git
git push -u origin main
```

### Step 4: Verificar no GitHub

Acesse o repositorio e confirme:
- Codigo esta la
- Aba "Actions" esta disponivel (sera usada para pipelines)
- Nenhum arquivo indesejado foi comitado

## Output format

Repositorio no GitHub com:
- Nome seguindo convencao `{org}.{modulo}.{tipo}`
- Descricao preenchida
- Branch `main` com primeiro commit limpo
- Aba Actions pronta para configuracao de pipeline

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto ja tem Dockerfile e docker-compose | Inclua no primeiro commit — fazem parte da base |
| Projeto nao tem .gitignore | Crie antes de qualquer `git add` |
| Repo sera compartilhado | Comece como privado, abra depois se necessario |
| Usando tecnologia diferente (Java, Python) | Mesmo fluxo, apenas adapte o .gitignore para a stack |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `git add .` sem `git status` antes | Sempre valide com `git status` primeiro |
| Criar repo com README do GitHub quando ja tem local | Crie repo vazio, push do local |
| Subir pasta cache/node_modules no primeiro commit | Valide .gitignore antes do add |
| Repo sem descricao | Sempre preencha description |
| Nome generico como `my-api` ou `test-project` | Use convencao semantica `org.modulo.tipo` |

## Troubleshooting

### Push rejeitado com erro "failed to push some refs"
**Symptom:** `git push` falha porque o repositorio remoto tem commits que nao existem localmente (README, .gitignore criados pelo GitHub).
**Cause:** O repositorio foi criado no GitHub com README ou .gitignore, gerando um commit inicial que conflita com o historico local.
**Fix:** Crie o repositorio no GitHub sem nenhum arquivo inicial (sem README, sem .gitignore, sem license) e faca push do projeto local.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
