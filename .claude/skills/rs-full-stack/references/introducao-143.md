---
name: rs-full-stack-introducao-143
description: "Introduces frontend deployment concepts when preparing to deploy a web application to production. Use when user asks to 'deploy frontend', 'put app in production', 'host my website', 'publish my app', or needs to understand the deployment workflow with GitHub branches. Covers the full cycle: local app to production server, GitHub integration, branch strategy for safe deployments. Make sure to use this skill whenever planning a frontend deployment strategy. Not for backend deployment, Docker orchestration, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: frontend-deployment
  tags: [deploy, frontend, github, branches, production]
---

# Deploy Front-end — Introdução

> Colocar uma aplicação front-end em produção significa transferir o projeto local para um servidor web acessível publicamente, integrado com GitHub e branches para controle seguro de atualizações.

## Key concepts

Deploy front-end é o processo de pegar um projeto que roda localmente na máquina do desenvolvedor e disponibilizá-lo em um servidor na web, acessível para qualquer pessoa de qualquer lugar. Esse processo também é chamado de "colocar a aplicação em produção".

## Decision framework

| Quando você encontrar | Aplique |
|----------------------|---------|
| Projeto front-end rodando apenas localmente | Planejar deploy para servidor web |
| Necessidade de manter produção atualizada | Integrar com GitHub usando branch `main` para builds |
| Necessidade de testar antes de ir para produção | Usar branches separadas para visualizar e testar mudanças |
| Alteração pronta para produção | Merge na branch `main` para gerar nova build |

## How to think about it

### Fluxo local → produção

O projeto front-end roda localmente durante o desenvolvimento. Para que outras pessoas acessem, ele precisa estar em um servidor web público. O deploy é a ponte entre o ambiente local e o ambiente de produção.

### Branch strategy para deploy seguro

A branch `main` é a fonte da verdade para produção — toda nova build é gerada a partir dela. Branches separadas permitem desenvolver e testar alterações isoladamente antes de levá-las para produção, evitando que código não testado afete os usuários.

```
feature-branch → testar mudanças → merge na main → nova build → produção
```

## Common misconceptions

| As pessoas pensam | Realidade |
|-------------------|-----------|
| Deploy é só copiar arquivos para um servidor | Deploy moderno envolve build, integração com GitHub e estratégia de branches |
| Qualquer push gera deploy | Apenas a branch `main` (ou a configurada) gera builds de produção |
| Testar localmente é suficiente | Branches separadas permitem preview de mudanças antes de afetar produção |

## When to apply

- Quando o projeto front-end está funcional localmente e precisa ser acessível publicamente
- Quando é necessário definir uma estratégia de branches para deploy contínuo
- Quando se quer garantir que alterações sejam testadas antes de ir para produção

## Limitations

- Esta introdução cobre apenas o conceito e o fluxo geral — configurações específicas de plataforma (Vercel, Netlify, Render) são abordadas nas aulas seguintes
- Não cobre deploy de backend ou banco de dados
- Não aborda CI/CD pipelines complexos

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Deploy não atualiza após push na main | Build cache da plataforma de deploy | Force um redeploy manual ou limpe o cache da plataforma (Vercel, Netlify) |
| Site em produção mostra versão antiga | Browser cache servindo arquivos antigos | Faça hard refresh (Ctrl+Shift+R) ou configure cache headers corretos |
| Build falha no servidor mas funciona localmente | Dependências de desenvolvimento não instaladas no ambiente de produção | Verifique se dependências de build estão em `dependencies`, não em `devDependencies` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre deploy front-end e estratégia de branches
- [code-examples.md](references/code-examples.md) — Exemplos práticos do fluxo de branches para deploy