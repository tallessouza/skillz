---
name: rs-full-stack-git-clone-remoto
description: "Applies git clone workflow when bringing remote repositories to local machine. Use when user asks to 'clone a repo', 'download from GitHub', 'bring project to my machine', 'start working on existing project', or 'setup project locally'. Covers git clone, folder naming, and verifying the cloned repo. Make sure to use this skill whenever user needs to work with a remote repository locally for the first time. Not for git pull, git fetch, pushing changes, or SSH key configuration."
---

# Trazendo Repositório Remoto para Máquina Local

> Para trabalhar localmente em um projeto remoto, use `git clone` com a URL do repositório — o nome da pasta local não afeta o versionamento.

## Prerequisites

- Git instalado e configurado na máquina
- Acesso ao repositório no GitHub (público ou autenticado)
- Terminal aberto no diretório onde deseja clonar

## Steps

### Step 1: Obter a URL do repositório

No GitHub, clique no botão verde **Code** e copie a URL HTTPS do repositório.

```bash
# A URL segue o formato:
https://github.com/{usuario}/{repositorio}.git
```

### Step 2: Navegar até o diretório desejado

```bash
cd ~/Desktop  # ou qualquer diretório de destino
```

### Step 3: Clonar o repositório

```bash
git clone https://github.com/{usuario}/{repositorio}.git
```

O Git cria uma pasta com o nome do repositório no GitHub.

### Step 4: (Opcional) Renomear a pasta

```bash
mv nome-no-github meu-nome-local
```

Renomear a pasta não afeta o repositório Git, porque o Git rastreia o conteúdo interno (`.git/` e arquivos), não o nome da pasta externa.

### Step 5: Entrar e verificar

```bash
cd meu-nome-local
git status
```

## Output format

Repositório completo clonado localmente, com histórico de commits intacto e remote `origin` configurado automaticamente.

## Error handling

- Se `git clone` falhar com erro de autenticação → verificar credenciais ou usar token de acesso pessoal
- Se o diretório já existir com o mesmo nome → renomear o existente ou clonar com nome diferente: `git clone <url> nome-diferente`

## Heuristics

| Situação | Ação |
|----------|------|
| Mudou de máquina | `git clone` do repositório remoto |
| Precisa de cópia local temporária | `git clone` no diretório desejado |
| Quer nome de pasta diferente do repo | Renomeie sem medo — não afeta o Git |
| Já tem o repo localmente | Use `git pull` em vez de `git clone` |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Download do ZIP pelo GitHub | `git clone` — mantém histórico e remote |
| Criar pasta manualmente e copiar arquivos | `git clone` — traz tudo automaticamente |
| Evitar renomear pasta com medo de quebrar | Renomeie tranquilamente — Git olha o conteúdo interno |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que o nome da pasta não importa e como o Git rastreia internamente
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variações e cenários

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-trazendo-um-repositorio-remoto-para-minha-maquina/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-trazendo-um-repositorio-remoto-para-minha-maquina/references/code-examples.md)
