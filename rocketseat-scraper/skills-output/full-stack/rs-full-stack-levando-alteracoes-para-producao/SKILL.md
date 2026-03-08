---
name: rs-full-stack-levando-alteracoes-para-producao
description: "Follows the Git-to-Vercel deployment workflow when pushing frontend changes to production. Use when user asks to 'deploy to production', 'push changes to Vercel', 'update production app', 'ship frontend changes', or 'deploy after code changes'. Covers commit, push, automatic Vercel build trigger, and production verification. Make sure to use this skill whenever deploying frontend projects hosted on Vercel. Not for initial Vercel setup, custom CI/CD pipelines, or backend-only deployments."
---

# Levando Alterações para Produção

> Após qualquer alteração no código (feature, bugfix, visual), faça commit e push na branch main para acionar o deploy automático na Vercel.

## Prerequisites

- Projeto já configurado e conectado à Vercel (deploy inicial feito)
- Repositório Git com remote configurado no GitHub
- Branch main como branch de produção na Vercel
- Primeiro push já feito com `git push -u origin main` (flag `-u` memoriza o remote)

## Steps

### Step 1: Verificar alterações localmente

Confirme que a alteração funciona no ambiente local antes de enviar para produção.

```bash
# Rode o projeto local e teste visualmente/funcionalmente
npm run dev
```

### Step 2: Stage e commit

```bash
git add .
git commit -m "change button style"
```

Use mensagens descritivas no commit, porque a Vercel exibe essa mensagem no dashboard de deployments.

### Step 3: Push para a branch main

```bash
# Após o primeiro push com -u, basta:
git push
```

Não é necessário repetir `git push -u origin main` — a flag `-u` no primeiro push memoriza o remote e a branch.

### Step 4: Vercel detecta e faz build automaticamente

A Vercel observa a branch main. Ao detectar um novo commit:

1. Aparece automaticamente na lista de deployments
2. Executa `npm run build` internamente
3. Gera uma nova versão do projeto
4. Promove para produção quando a build passa

### Step 5: Verificar em produção

```bash
# Acesse a URL de produção e force refresh
# Ctrl+Shift+R (ou Cmd+Shift+R no Mac)
```

Confirme que a alteração está visível na URL de produção.

## Output format

No dashboard da Vercel, cada deploy mostra:
- A mensagem do commit (ex: "change button style")
- A branch de origem (main)
- O status (Building → Ready)
- A tag "Current" no deploy ativo em produção

## Error handling

- Se o build falhar na Vercel, acesse **Build Logs** no dashboard para ver o erro completo
- A versão anterior permanece em produção até o novo build passar com sucesso
- Se precisar reverter, faça `git revert` e push novamente — a Vercel fará um novo deploy

## Verification

- No dashboard Vercel: a tag "Current" deve estar no commit mais recente
- No GitHub: o histórico de commits mostra o novo commit
- Na URL de produção: a alteração está visível após refresh

## Heuristics

| Situação | Ação |
|----------|------|
| Alteração visual (cor, layout) | Commit + push, verificar visualmente em produção |
| Nova funcionalidade | Testar localmente, commit + push, verificar fluxo em produção |
| Bugfix | Testar fix localmente, commit + push, confirmar correção em produção |
| Build falhou na Vercel | Ler Build Logs, corrigir localmente, novo commit + push |

## Anti-patterns

| Evite | Faça em vez disso |
|-------|-------------------|
| Push sem testar localmente | Sempre verificar que funciona no `npm run dev` antes |
| Mensagens de commit genéricas como "fix" | Mensagens descritivas: "change button style", "fix login redirect" |
| Repetir `git push -u origin main` toda vez | Usar apenas `git push` após o primeiro push com `-u` |
| Verificar produção sem hard refresh | Usar Ctrl+Shift+R para garantir que o cache não mostra versão antiga |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o fluxo Git→Vercel e como o deploy contínuo funciona
- [code-examples.md](references/code-examples.md) — Todos os comandos Git e fluxos de deploy expandidos com variações