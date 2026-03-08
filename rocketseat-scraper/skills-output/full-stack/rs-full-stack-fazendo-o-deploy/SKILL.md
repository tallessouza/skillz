---
name: rs-full-stack-fazendo-o-deploy
description: "Guides frontend deployment to Vercel from a GitHub repository. Use when user asks to 'deploy to Vercel', 'publish frontend', 'put app online', 'deploy React app', or 'ship to production'. Covers project import from GitHub, framework auto-detection, root directory config, environment variables setup, and build settings. Make sure to use this skill whenever deploying any Vite/React/Next.js project to Vercel via GitHub integration. Not for backend deployment, Docker deployment, AWS/GCP infrastructure, or CI/CD pipeline configuration."
---

# Deploy Frontend na Vercel via GitHub

> Importe o repositório GitHub na Vercel, configure variáveis de ambiente, e faça deploy com um clique.

## Prerequisites

- Repositório no GitHub (público ou privado)
- Conta na Vercel vinculada ao GitHub
- Se a Vercel não lista seus repositórios: conceda autorização clicando no botão de permissão que aparece na tela de importação

## Steps

### Step 1: Criar novo projeto

Acesse o dashboard da Vercel → Overview → **Add New** → **Project**.

### Step 2: Importar repositório do GitHub

A Vercel lista os repositórios do seu GitHub. Use o campo de busca para encontrar o projeto específico. Repositórios privados aparecem com ícone de cadeado.

A Vercel auto-detecta o framework (Vite, React, Next.js, Angular, Astro, etc.) e exibe o ícone correspondente. Clique em **Import**.

### Step 3: Configurar o projeto

```
Project Name:        nome-do-projeto (pode alterar)
Framework Preset:    Auto-detectado (verificar se está correto)
Root Directory:      / (padrão, alterar se monorepo)
Build Command:       Auto (ou customizar se necessário)
Install Command:     Auto (ou customizar)
```

### Step 4: Configurar variáveis de ambiente

Em **Environment Variables**, adicione as variáveis que estariam no `.env` local:

```
KEY                  VALUE
VITE_API_URL         https://api.meudominio.com
VITE_PUBLIC_KEY      abc123
```

Essas variáveis ficam disponíveis no projeto em produção, substituindo o arquivo `.env`.

### Step 5: Deploy

Clique em **Deploy**. A Vercel redireciona para a página de build. Ao concluir, exibe a página de "Congratulations" com o projeto no ar.

## Output format

Após deploy bem-sucedido:
- URL de produção: `https://nome-do-projeto.vercel.app`
- Dashboard do projeto disponível para monitoramento

## Error handling

- Se repositórios não aparecem: conceda autorização da Vercel no GitHub (Settings → Applications → Vercel)
- Se framework não foi detectado: selecione manualmente no dropdown de Framework Preset
- Se build falha: verifique Build Command e Root Directory, especialmente em monorepos

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto com Vite/React | Vercel auto-detecta, nenhuma config extra |
| Monorepo com frontend em subpasta | Altere Root Directory para `apps/web` ou equivalente |
| Variáveis sensíveis (API keys) | Adicione via Environment Variables da Vercel, nunca no repositório |
| Build command customizado | Habilite override em Build Settings |
| Projeto privado no GitHub | Funciona normalmente, aparece com ícone de cadeado |

## Anti-patterns

| Evite | Faça ao invés |
|-------|---------------|
| Commitar `.env` com secrets no repo | Configurar variáveis de ambiente na Vercel |
| Alterar framework preset sem necessidade | Confiar na auto-detecção da Vercel |
| Configurar build commands manualmente quando auto-detect funciona | Deixar a Vercel gerenciar build automaticamente |
| Fazer deploy sem verificar Root Directory em monorepos | Confirmar que Root Directory aponta para o diretório correto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o fluxo de deploy e decisões de configuração
- [code-examples.md](references/code-examples.md) — Exemplos de configuração para diferentes cenários de deploy