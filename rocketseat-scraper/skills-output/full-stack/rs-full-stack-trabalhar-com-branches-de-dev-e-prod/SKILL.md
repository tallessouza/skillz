---
name: rs-full-stack-branches-dev-prod
description: "Enforces Git branching workflow for dev-to-prod deployments with Vercel preview environments. Use when user asks to 'deploy to production', 'push to main', 'create a branch for feature', 'set up preview deployment', or 'configure Vercel branches'. Applies rules: never commit directly to main for new features, always use secondary branches with preview URLs, test in preview before merge. Make sure to use this skill whenever deploying frontend apps to Vercel or discussing branch strategies for production safety. Not for backend deployments, Docker/Kubernetes workflows, or CI/CD pipeline configuration."
---

# Branches de Dev e Prod com Vercel

> Nunca envie codigo novo diretamente para a branch principal — sempre use uma branch secundaria com preview antes de impactar producao.

## Rules

1. **Nunca mande features direto para main** — crie uma branch secundaria primeiro, porque um erro nao testado em main afeta imediatamente todos os usuarios em producao
2. **Use preview deployments como etapa intermediaria** — a Vercel gera automaticamente uma URL de pre-visualizacao para cada branch, porque isso simula producao sem expor usuarios finais
3. **Teste no ambiente de preview antes do merge** — valide a funcionalidade na URL de preview, porque o ambiente e praticamente identico ao de producao
4. **Corrija na branch secundaria, nao em main** — se identificar problema no preview, corrija e faca novo commit na mesma branch, porque isso isola o erro do ambiente de producao
5. **Faca merge para main somente apos validacao** — apos confirmar que tudo funciona no preview, faca merge para main, porque isso garante que a build de producao sera estavel

## Prerequisites

- Projeto hospedado na Vercel conectado ao repositorio Git
- Branch `main` configurada como branch de producao na Vercel

## Steps

### Step 1: Desenvolver localmente

Trabalhe no ambiente de dev (localhost). Teste a funcionalidade na sua maquina antes de qualquer commit.

### Step 2: Criar branch secundaria

```bash
git checkout -b feat/nova-funcionalidade
```

Nomeie a branch de forma descritiva — `feat/`, `fix/`, `refactor/` seguido do que esta sendo feito.

### Step 3: Commit e push para a branch secundaria

```bash
git add .
git commit -m "feat: descricao da alteracao"
git push origin feat/nova-funcionalidade
```

A Vercel detecta automaticamente o push e gera uma build de preview com URL unica.

### Step 4: Testar no preview

Acesse a URL de preview gerada pela Vercel. Valide:
- Funcionalidade funciona como esperado
- Nenhum erro visual ou de console
- Comportamento identico ao esperado em producao

### Step 5: Corrigir se necessario

Se encontrar problemas, corrija localmente e faca novo commit na mesma branch:

```bash
git add .
git commit -m "fix: corrige detalhe na funcionalidade"
git push origin feat/nova-funcionalidade
```

A Vercel gera nova build de preview automaticamente. Repita ate validar.

### Step 6: Merge para main

Apos validacao completa no preview:

```bash
git checkout main
git merge feat/nova-funcionalidade
git push origin main
```

A Vercel detecta o novo commit em main e gera a build de producao.

## Fluxo visual

```
[Dev local] → commit → [Branch secundaria] → preview URL → testar
                                                              │
                                            OK? ──────────── merge → [main] → build → [Producao]
                                             │
                                            NOK? → corrigir → novo commit → preview → testar novamente
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Bug fix simples e urgente | Ainda use branch secundaria — preview e rapido |
| Feature grande com varios commits | Branch secundaria com multiplos commits, preview final antes do merge |
| Precisa que colega valide | Compartilhe a URL de preview — nao precisa de acesso ao codigo |
| Multiplas features simultaneas | Uma branch por feature, cada uma com seu preview independente |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `git push origin main` direto apos desenvolver | Push para branch secundaria, testar no preview, depois merge |
| Testar apenas em localhost e mandar para producao | Testar em localhost E no preview antes do merge |
| Corrigir bugs direto em main | Corrigir em branch secundaria, validar no preview, depois merge |
| Ignorar a URL de preview gerada pela Vercel | Abrir e testar toda URL de preview antes de aprovar |

## Verification

- Apos merge, verifique o deploy na aba Deployments da Vercel
- Confirme que o deploy com tag "Current" reflete suas alteracoes
- Acesse a URL de producao e valide o comportamento final

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ambientes dev/prod e fluxo seguro de deploy
- [code-examples.md](references/code-examples.md) — Exemplos completos de comandos Git e fluxos de branch