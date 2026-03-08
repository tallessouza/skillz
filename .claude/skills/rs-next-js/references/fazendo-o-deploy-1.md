---
name: rs-next-js-fazendo-o-deploy-1
description: "Guides Next.js application deployment to Vercel when user asks to 'deploy next app', 'publish to vercel', 'put my site online', 'deploy to production', or 'ship my next.js project'. Covers repository preparation, Vercel import, environment variables, build logs, and runtime logs verification. Make sure to use this skill whenever deploying a Next.js project to Vercel or discussing Vercel deployment workflow. Not for other hosting providers like AWS, Netlify, or Railway, and not for CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: deploy
  tags: [vercel, deploy, production, build, environment-variables, next-js]
---

# Deploy Next.js na Vercel

> Realize o deploy de uma aplicacao Next.js na Vercel seguindo o fluxo: merge na main, import no dashboard, verificacao via logs.

## Prerequisites

- Repositorio Git com o projeto Next.js commitado e pushado
- Conta na Vercel (login via GitHub recomendado)
- Branch principal (`main`) atualizada com o codigo a ser deployado
- Variaveis de ambiente configuradas, se necessario

## Steps

### Step 1: Preparar o repositorio

Garantir que todo o codigo esta na branch `main`, porque o deploy da Vercel monitora essa branch por padrao.

```bash
# Verificar branch atual
git branch --show-current

# Se estiver em outra branch, criar PR e fazer merge
git push origin feature-branch
# Criar PR no GitHub e fazer merge para main
gh pr create --base main --head feature-branch --title "Prepare for deploy"
gh pr merge --merge
```

### Step 2: Importar projeto na Vercel

1. Acessar [vercel.com](https://vercel.com) e fazer login via GitHub
2. Clicar em **Add New** → **Project**
3. Selecionar o repositorio (aparece o mais recente primeiro)
4. A Vercel detecta automaticamente que e Next.js — nao precisa alterar framework
5. Configurar variaveis de ambiente se necessario (secao Environment Variables)
6. Clicar em **Deploy**

### Step 3: Verificar o deploy

```
Dashboard Vercel → Projeto → Deployments → Build Logs
```

- **Build Logs:** verificar se o build completou sem erros
- **Preview URL:** acessar a URL de preview para validar visualmente
- **Production URL:** clicar em **Visit** para acessar a URL de producao
- **Runtime Logs:** monitorar requisicoes em tempo real (pequeno delay normal)

### Step 4: Verificar funcionalidades

- Navegar pelas paginas principais (home, blog, posts individuais)
- Confirmar que autenticacao funciona (se aplicavel)
- Verificar Analytics no dashboard da Vercel

## Output format

Apos deploy bem-sucedido:
- URL de producao: `https://{projeto}.vercel.app`
- URL de preview: gerada automaticamente por cada PR
- Build logs acessiveis no dashboard
- Runtime logs disponiveis em tempo real

## Error handling

- Se o build falhar: verificar Build Logs no dashboard da Vercel para identificar o erro
- Se variavel de ambiente estiver faltando: adicionar em Settings → Environment Variables e fazer redeploy
- Se a Vercel nao detectar o framework: selecionar "Next.js" manualmente no dropdown de Framework Preset
- Se o cache causar problemas: no dashboard, usar opcao de redeploy sem cache

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro deploy | Build demora mais, depois fica rapido por cache |
| Deploy automatico | Cada push na `main` dispara deploy automatico |
| Preview deploys | Cada PR aberta gera uma URL de preview automaticamente |
| Variaveis sensiveis | Configurar no dashboard, nunca no codigo |

## Verification

- [ ] URL de producao acessivel e funcionando
- [ ] Todas as paginas carregam corretamente
- [ ] Build Logs sem erros
- [ ] Runtime Logs registrando acessos

## Troubleshooting

### Build falha no deploy da Vercel
**Symptom:** Deploy falha com erros de TypeScript ou dependencias
**Cause:** Erros de tipo ignorados em desenvolvimento que sao estritamente validados no build de producao
**Fix:** Rodar `npm run build` localmente antes de fazer push. Corrigir todos os erros de tipo. Verificar que todas as variaveis de ambiente estao configuradas na Vercel

### API routes nao funcionam em producao
**Symptom:** Rotas de API funcionam localmente mas retornam 500 em producao
**Cause:** Variaveis de ambiente faltando no ambiente de producao ou paths absolutos incorretos
**Fix:** Configurar variaveis de ambiente no painel da Vercel. Usar paths relativos ou variaveis de ambiente para URLs

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-fazendo-o-deploy-1/references/deep-explanation.md) — A Vercel e a empresa que criou o Next.js, entao a integracao e nativa e otimizada. O instrutor desta
- [code-examples.md](../../../data/skills/next-js/rs-next-js-fazendo-o-deploy-1/references/code-examples.md) — git status
