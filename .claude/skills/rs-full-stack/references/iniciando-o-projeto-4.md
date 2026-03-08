---
name: rs-full-stack-iniciando-o-projeto-4
description: "Enforces correct HTML project initialization and immediate git versioning workflow. Use when user asks to 'start a project', 'create an HTML file', 'init a repo', 'setup a new website', or 'begin a frontend project'. Applies rules: always index.html, Emmet for structure, lang pt-br, git init immediately after first file. Make sure to use this skill whenever scaffolding a new HTML/frontend project from scratch. Not for React/Next.js/framework projects, nor for git branching or advanced workflows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: project-setup
  tags: [html, project-init, git, emmet, scaffolding]
---

# Iniciando Projeto HTML com Git

> Ao iniciar um projeto frontend, crie index.html com Emmet e versione com git imediatamente apos o primeiro arquivo.

## Rules

1. **Sempre use index.html como primeiro arquivo** — nunca use outro nome para o arquivo principal, porque servidores web e ferramentas assumem index.html como ponto de entrada padrao
2. **Use Emmet para gerar estrutura HTML** — digite `!` + Tab no VS Code, porque evita erros na estrutura basica e garante DOCTYPE, head e body corretos
3. **Ajuste lang para pt-br** — troque `lang="en"` por `lang="pt-br"`, porque afeta acessibilidade, SEO e comportamento do navegador
4. **Inicie git imediatamente apos o primeiro arquivo** — nao espere o projeto crescer, porque commits pequenos e frequentes permitem voltar a qualquer ponto com seguranca
5. **No Windows, use git bash como terminal** — nao use PowerShell ou CMD para comandos git, porque o git bash garante configuracao correta do git no Windows
6. **Primeiro commit deve ser minimo** — commite a estrutura basica antes de adicionar conteudo, porque estabelece o ponto zero limpo do projeto

## Steps

### Step 1: Criar pasta e arquivo inicial

```bash
mkdir projeto && cd projeto
```

Criar `index.html` no VS Code usando Emmet (`!` + Tab), ajustando:

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nome do Projeto</title>
</head>
<body>

</body>
</html>
```

### Step 2: Iniciar git e fazer primeiro commit

```bash
git init .
git add .
git commit -m "initial commit"
```

### Step 3: Continuar desenvolvimento

A partir daqui, cada mudanca significativa vira um commit. Nao e necessario publicar no GitHub imediatamente — o versionamento local ja protege o projeto.

## Output format

```
projeto/
├── .git/
└── index.html    # Estrutura HTML basica com lang="pt-br"
```

## Error handling

- Se git nao for reconhecido no Windows: abrir git bash ao inves do terminal padrao (seta ao lado do `+` no VS Code → Git Bash)
- Se Emmet nao funcionar: verificar que o arquivo tem extensao `.html` salva

## Verification

- `index.html` existe com `lang="pt-br"` e titulo preenchido
- `git log` mostra pelo menos um commit
- `git status` mostra working tree limpa apos o commit inicial

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo do zero | Crie index.html + git init antes de qualquer coisa |
| Windows sem git no terminal | Use git bash, nao PowerShell |
| Primeiro arquivo criado | Commit imediato, nao espere |
| Nao vai publicar no GitHub agora | Tudo bem, git local ja protege |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `home.html` ou `main.html` como pagina principal | `index.html` |
| Escrever HTML do zero manualmente | Emmet `!` + Tab |
| `lang="en"` em projeto pt-br | `lang="pt-br"` |
| Esperar projeto ficar grande para iniciar git | `git init .` apos primeiro arquivo |
| Usar PowerShell/CMD para git no Windows | Git Bash |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `git: command not found` | Git nao instalado | Instalar Git de https://git-scm.com |
| Emmet nao expande com `!` + Tab | Arquivo nao salvo com extensao `.html` | Salvar o arquivo como `.html` primeiro |
| `lang="en"` permanece apos Emmet | Emmet gera template padrao em ingles | Alterar manualmente para `lang="pt-br"` |
| Terminal nao reconhece `git init` no Windows | Usando PowerShell ou CMD | Trocar para Git Bash no VS Code |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que versionar cedo e convencoes de index.html
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de inicializacao com variacoes