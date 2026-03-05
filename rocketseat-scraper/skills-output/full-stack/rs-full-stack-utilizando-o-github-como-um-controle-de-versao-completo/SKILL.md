---
name: rs-full-stack-github-dev-editor
description: "Applies github.dev browser-based editing workflow when user asks to 'edit on GitHub', 'commit without terminal', 'use github.dev', 'edit in browser', or 'quick fix on GitHub'. Guides through pressing dot shortcut, staging, committing, and pushing directly from the browser VS Code editor. Make sure to use this skill whenever the user needs to make changes without a local dev environment. Not for local Git CLI workflows, GitHub Actions, or GitHub API automation."
---

# GitHub como Editor de Código via github.dev

> Pressione `.` em qualquer repositório GitHub para abrir um editor VS Code completo no navegador, com stage, commit e push integrados.

## Prerequisites

- Conta GitHub autenticada no navegador
- Acesso ao repositório desejado
- Se indisponível: usar GitHub CLI ou clonar localmente como fallback

## Steps

### Step 1: Abrir o editor github.dev

Navegue até o repositório no GitHub e pressione a tecla `.` (ponto final) no teclado. A URL muda automaticamente:

```
github.com/{user}/{repo}  →  github.dev/{user}/{repo}
```

O editor VS Code abre no navegador com toda a estrutura do projeto.

### Step 2: Editar arquivos

Edite normalmente. O editor mostra indicadores visuais:

| Indicador | Significado |
|-----------|-------------|
| Linha verde | Linha nova adicionada |
| Linha amarela + `M` | Linha modificada |
| Seta vermelha | Linha deletada |
| `M` no arquivo | Arquivo modificado |
| Riscado no arquivo | Arquivo deletado |

### Step 3: Stage e commit

1. Abrir o painel de controle de versão (ícone de branch na barra lateral)
2. Para stage de um arquivo: clicar no `+` ao lado do arquivo
3. Para stage de todos: clicar no `+` ao lado de "Changes"
4. Escrever mensagem de commit descritiva
5. Clicar em "Commit & Push" — faz ambos simultaneamente

### Step 4: Deletar arquivos

1. Botão direito no arquivo → "Delete Permanently"
2. O arquivo aparece riscado no controle de versão
3. Para desfazer: clicar na seta de restore no painel de versão
4. Commit & Push para confirmar a deleção

### Step 5: Voltar ao GitHub

Alterar a URL manualmente de `github.dev` para `github.com` para ver os commits e alterações no repositório.

## Output format

Commits aparecem no histórico do repositório normalmente, como qualquer commit feito via terminal.

## Error handling

- Se o editor não abrir com `.`: acessar diretamente `github.dev/{user}/{repo}` na barra de endereço
- Se quiser desfazer uma deleção antes do commit: usar a seta de restore no painel de controle de versão
- Se cometer erro após push: será necessário fazer novo commit corrigindo, porque o push já foi para o remoto

## Heuristics

| Situação | Ação |
|----------|------|
| Correção rápida sem ambiente local | Usar github.dev |
| Em viagem sem computador próprio | Usar github.dev (com cuidado com credenciais) |
| Edição complexa com testes | Preferir ambiente local |
| Stage parcial (só alguns arquivos) | Clicar `+` arquivo por arquivo |
| Stage de tudo | Clicar `+` no header "Changes" |

## Anti-patterns

| Evitar | Fazer em vez disso |
|--------|-------------------|
| Mensagens genéricas como "update" | Mensagens descritivas: "deleted hello.txt", "update readme description" |
| Deletar e commit sem revisar | Verificar no painel de versão antes do push |
| Usar github.dev para trabalho extenso | Clonar e usar ambiente local completo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e contexto do github.dev
- [code-examples.md](references/code-examples.md) — Exemplos visuais e fluxos passo a passo expandidos