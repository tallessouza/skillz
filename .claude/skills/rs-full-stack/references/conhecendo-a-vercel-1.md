---
name: rs-full-stack-conhecendo-a-vercel-1
description: "Configures Vercel platform setup and account creation for deploying React applications. Use when user asks to 'deploy to Vercel', 'host a React app', 'set up Vercel account', 'deploy frontend', or 'publish my app'. Covers GitHub-connected signup, hobby plan selection, and dashboard orientation. Make sure to use this skill whenever deploying frontend applications to Vercel for the first time. Not for backend API deployment, Docker/Kubernetes hosting, or self-hosted infrastructure."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: deployment
  tags: [vercel, deploy, hosting, github-integration, react-deploy, hobby-plan]
---

# Conhecendo a Vercel

> Configure uma conta Vercel conectada ao GitHub para fazer deploy de aplicacoes React de forma gratuita.

## Prerequisites

- Conta no GitHub criada e autenticada no navegador
- Aplicacao React pronta para deploy (build funcionando localmente)
- Se nao tem GitHub: crie primeiro em github.com antes de prosseguir

## Steps

### Step 1: Acessar a Vercel

Acesse [vercel.com](https://vercel.com) e clique em **Sign Up**.

### Step 2: Selecionar tipo de projeto

Marque a opcao **Hobby** (projetos pessoais) — plano gratuito, ideal para aprendizado e testes.

### Step 3: Criar conta via GitHub

Escolha **Continue with GitHub** como metodo de autenticacao. Isso conecta automaticamente seus repositorios, facilitando o deploy.

### Step 4: Autorizar e acessar o dashboard

Apos autenticacao, o dashboard exibe seus projetos. Na primeira vez, estara vazio — pronto para importar repositorios.

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto pessoal ou de aprendizado | Use o plano Hobby (gratuito) |
| Projeto profissional ou que precisa escalar | Avalie planos Pro ou Enterprise |
| Precisa de CI/CD automatico | Conecte via GitHub — cada push dispara deploy |
| Nao tem conta GitHub | Crie primeiro no GitHub, depois conecte na Vercel |

## Verificacao

- Dashboard da Vercel carrega sem erros apos login
- Conta aparece conectada ao GitHub (icone do GitHub visivel no perfil)
- Plano Hobby esta selecionado (visivel em Settings > Billing)

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Criar conta com email separado | Conecte via GitHub para integrar repositorios automaticamente |
| Comecar com plano pago para aprender | Use Hobby (gratuito) ate precisar escalar |
| Tentar deploy sem conta GitHub configurada | Configure GitHub primeiro, depois Vercel |

## Code example

```bash
# Verificar deploy via Vercel CLI
npx vercel login         # Autenticar na Vercel
npx vercel               # Deploy de preview
npx vercel --prod        # Deploy de producao
```

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Signup falha ao conectar GitHub | Conta GitHub nao autenticada no navegador | Fazer login no GitHub primeiro, depois retornar a Vercel |
| Dashboard nao mostra repositorios | Permissoes do GitHub nao concedidas | Reautorizar a Vercel nas configuracoes do GitHub |
| Plano Hobby nao selecionado | Opcao pulada durante signup | Verificar em Settings > Billing e alterar para Hobby |
| Deploy falha apos import do repositorio | Build local nao funciona | Garantir que `npm run build` passa sem erros localmente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha da Vercel e estrategias de deploy
- [code-examples.md](references/code-examples.md) — Exemplos de configuracao e fluxo de deploy