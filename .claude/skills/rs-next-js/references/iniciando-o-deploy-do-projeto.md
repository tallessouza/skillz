---
name: rs-next-js-iniciando-o-deploy-do-projeto
description: "Applies Vercel deployment workflow for Next.js projects with Postgres database. Use when user asks to 'deploy to Vercel', 'setup production database', 'fix Prisma build error', 'configure Vercel postgres', or 'deploy Next.js app'. Covers Vercel storage setup, Prisma generate in build script, and timezone awareness. Make sure to use this skill whenever deploying Next.js to Vercel or debugging Prisma-related build failures. Not for local development setup, Docker deployments, or non-Vercel hosting platforms."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: deploy
  tags: [vercel, deploy, prisma, postgres, build-script, timezone, next-js]
---

# Deploy Next.js na Vercel

> Ao fazer deploy de um projeto Next.js com Prisma na Vercel, configure o build script para gerar o client e rodar migrations, e trate fusos horarios no servidor.

## Prerequisites

- Conta gratuita na Vercel (sem cartao de credito)
- Projeto no GitHub (repositorio publico ou privado)
- Projeto Next.js com Prisma configurado

## Steps

### Step 1: Criar banco Postgres na Vercel

1. Acessar **Storage** no dashboard da Vercel
2. Criar database Postgres (plano free: 5 databases, 500MB)
3. Copiar a variavel `DATABASE_URL` gerada

### Step 2: Importar projeto

1. **Add New Project** no dashboard
2. Importar repositorio do GitHub
3. Adicionar `DATABASE_URL` nas Environment Variables
4. Deploy

### Step 3: Corrigir erro de Prisma no build

O Prisma client gerado (`/generated`) esta no `.gitignore` — nao existe no servidor. Ajustar o build script:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

- `prisma generate` — gera o client no servidor
- `prisma migrate deploy` — aplica migrations no banco de producao
- `next build` — build normal do Next.js

### Step 4: Verificar timezone

O servidor Vercel roda em UTC. Horarios enviados pelo usuario serao interpretados com +3h (ou offset do seu fuso). Isso quebra validacoes de horario.

## Error handling

- Se `Generated Prisma not found` → adicionar `prisma generate` antes de `next build` no script
- Se validacao de horario falha em producao mas funciona local → problema de timezone UTC no servidor
- Se primeiro deploy demora → normal, deploys subsequentes sao muito mais rapidos

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto usa Prisma | Sempre adicione `prisma generate` no build script |
| Validacao de horario no backend | Considere que servidor roda em UTC |
| Primeiro deploy | Acompanhe logs — primeiro e mais demorado |
| Correcao rapida | Push na branch → Vercel faz redeploy automatico |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Remover `/generated` do `.gitignore` | Adicionar `prisma generate` no build |
| Assumir timezone local no servidor | Tratar conversao UTC explicitamente |
| Push direto na main em producao | Criar branch e abrir PR |
| Configurar banco manualmente no servidor | Usar `prisma migrate deploy` no build |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-iniciando-o-deploy-do-projeto/references/deep-explanation.md) — O Prisma gera um client TypeScript dentro da pasta `/generated` (ou `node_modules/.prisma/client`). 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-iniciando-o-deploy-do-projeto/references/code-examples.md) — {
