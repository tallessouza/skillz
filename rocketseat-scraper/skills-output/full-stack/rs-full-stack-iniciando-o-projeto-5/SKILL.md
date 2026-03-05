---
name: rs-full-stack-iniciando-o-projeto-5
description: "Applies project scaffolding conventions when starting a new HTML/CSS project. Use when user asks to 'create a project', 'start a new site', 'scaffold HTML/CSS', 'init a web project', or 'setup project structure'. Enforces CSS organization with separate files, global resets, git init with .gitignore, and initial commit. Make sure to use this skill whenever creating a new frontend project from scratch. Not for React/Next.js projects, backend setup, or existing project refactoring."
---

# Iniciando Projeto HTML/CSS

> Ao criar um projeto web, organize arquivos desde o primeiro minuto: estrutura de pastas, CSS modular, git inicializado e commit inicial.

## Prerequisites

- Editor de codigo (VS Code recomendado)
- Git instalado
- Terminal disponivel

## Steps

### Step 1: Criar estrutura de pastas e arquivos

```
projeto-nome/
├── index.html
├── .gitignore
└── styles/
    ├── index.css
    └── global.css
```

### Step 2: Configurar HTML base

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles/index.css">
  <title>Nome do Projeto</title>
</head>
<body>
</body>
</html>
```

O HTML sempre referencia apenas `styles/index.css` — nunca importa outros CSS diretamente.

### Step 3: Configurar CSS modular

**`styles/index.css`** — ponto de entrada que importa todos os outros:

```css
@import url("global.css");
```

Cada novo arquivo CSS criado sera importado aqui, porque mantém o HTML limpo e o CSS organizado.

**`styles/global.css`** — reset e configuracoes globais:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### Step 4: Configurar .gitignore

```gitignore
.DS_Store
```

Sempre criar `.gitignore` no inicio, porque adicionar arquivos depois que ja foram commitados exige `git rm --cached`.

### Step 5: Git init e commit inicial

```bash
git init .
git add .
git commit -m "initial commit"
```

## Output format

Projeto com estrutura limpa, CSS modular via imports, git inicializado com primeiro commit.

## Error handling

- Se `git init` falhar: verificar se git esta instalado (`git --version`)
- Se CSS nao carrega: verificar o path `styles/index.css` no `<link>` do HTML

## Verification

- Abrir `index.html` no navegador — pagina sem margins/paddings do navegador
- `git log` mostra o initial commit
- `git status` limpo (sem arquivos untracked indesejados)

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo arquivo CSS necessario | Crie em `styles/`, importe no `index.css` |
| Arquivo/pasta que nao deve ir pro git | Adicione ao `.gitignore` antes do primeiro commit |
| Projeto pequeno (1 pagina) | Ainda use a estrutura `styles/` — custa nada e escala |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| CSS inline no HTML | Arquivo separado em `styles/` |
| Multiplos `<link>` no HTML | Um `index.css` que importa os demais |
| Commit sem `.gitignore` | Sempre criar `.gitignore` antes do primeiro commit |
| Esquecer o reset global | `* { margin: 0; padding: 0; box-sizing: border-box; }` |
| `box-sizing: content-box` (padrao) | `box-sizing: border-box` — calculo pela borda e mais intuitivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre CSS modular e organizacao de projeto
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes