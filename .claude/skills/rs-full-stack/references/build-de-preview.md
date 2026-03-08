---
name: rs-full-stack-build-de-preview
description: "Enforces Git branching and Vercel preview build workflow when deploying frontend changes safely. Use when user asks to 'deploy to Vercel', 'create a preview build', 'push to production safely', 'test before deploying', or 'create a feature branch for deploy'. Applies pattern: commit on feature branch, push to remote, Vercel generates preview build, validate before merging to main. Make sure to use this skill whenever pushing frontend code that should be tested before production. Not for backend deployments, Docker/K8s deploys, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: deployment
  tags: [git, vercel, preview, branches, deployment, ci-cd]
---

# Build de Preview — Estratégia de Deploy Seguro com Branches

> Nunca envie código novo direto para a branch main em produção — use feature branches para gerar preview builds na Vercel e validar antes de promover.

## Prerequisites

- Repositório Git conectado à Vercel
- Branch `main` configurada como branch de produção na Vercel
- Projeto já em produção com pelo menos um deploy na main

## Steps

### Step 1: Commit na feature branch

```bash
# Confirme que está na feature branch (nunca na main)
git branch

# Adicione todas as alterações
git add .

# Commit com conventional commit (feat: para nova funcionalidade)
git commit -m "feat: shake feedback when user makes a wrong guess"
```

### Step 2: Push para o repositório remoto

```bash
# Push para a feature branch no remote (NÃO para main)
git push origin feature/shake_feedback
```

A Vercel detecta automaticamente o push e gera uma **preview build**, não uma build de produção.

### Step 3: Verificar no GitHub

1. Acesse o repositório no GitHub
2. Confirme que a nova branch aparece no seletor de branches
3. Verifique que o commit existe apenas na feature branch, não na main

### Step 4: Verificar na Vercel

1. Acesse o dashboard do projeto na Vercel
2. A nova build aparece com a tag **Preview** (não Production)
3. A build com tag **Current** continua sendo a versão em produção
4. Use a URL de preview para testar a funcionalidade

### Step 5: Validar antes de promover

1. Acesse a URL de produção — confirme que NÃO tem a mudança nova
2. Acesse a URL de preview — confirme que a funcionalidade funciona
3. Só após validação, faça merge da feature branch na main

## Output format

```
GitHub:
  main branch     → sem o commit novo (produção intacta)
  feature branch  → com o commit novo

Vercel:
  Production build → tag "Current", branch main (inalterada)
  Preview build    → tag "Preview", feature branch (nova funcionalidade)
```

## Error handling

- Se o push foi direto na main por engano → a Vercel gera build de produção imediatamente. Reverta com `git revert` e push novamente
- Se a preview build falhou → verifique os logs na Vercel, corrija na feature branch e faça novo push
- Se a branch não aparece no GitHub → confirme o nome exato com `git branch -a` e refaça o push

## Verification

- [ ] Build de produção na Vercel continua com tag "Current" e inalterada
- [ ] Nova build aparece com tag "Preview" na Vercel
- [ ] URL de produção NÃO mostra a funcionalidade nova
- [ ] URL de preview MOSTRA a funcionalidade nova
- [ ] Commit existe apenas na feature branch no GitHub

## Heuristics

| Situação | Ação |
|----------|------|
| Funcionalidade nova que precisa de teste | Feature branch → preview build |
| Hotfix urgente em produção | Pode ir direto na main (exceção) |
| Múltiplas features em paralelo | Uma feature branch por funcionalidade |
| Preview aprovado pelo time | Merge da feature branch na main |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| `git push origin main` com feature incompleta | `git push origin feature/nome` para gerar preview |
| Commit sem mensagem descritiva | `feat: shake feedback when user makes a wrong guess` |
| Testar só em produção | Validar na URL de preview antes do merge |
| Acumular muitos commits na feature branch sem push | Push frequente para gerar preview builds atualizados |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Preview build deployed to production** | Verify you pushed to the feature branch, not `main` — check with `git branch` before pushing. |
| **Branch not visible on GitHub** | Run `git branch -a` to confirm the branch exists remotely. If not, push with `git push origin branch-name`. |
| **Vercel preview build failed** | Check Vercel deployment logs for build errors — fix in the feature branch and push again to trigger a new preview. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre estratégia de branches para deploy e como a Vercel diferencia builds
- [code-examples.md](references/code-examples.md) — Fluxo completo de comandos Git com variações e cenários reais