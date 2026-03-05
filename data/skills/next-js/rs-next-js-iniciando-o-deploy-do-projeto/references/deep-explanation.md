# Deep Explanation: Deploy Next.js na Vercel

## Por que o Prisma falha no primeiro deploy

O Prisma gera um client TypeScript dentro da pasta `/generated` (ou `node_modules/.prisma/client`). Essa pasta e gerada localmente quando voce roda `npx prisma generate` ou `npx prisma migrate dev`. Porem, ela esta no `.gitignore` — e com razao, porque e codigo gerado.

Quando a Vercel clona seu repositorio, essa pasta nao existe. O Next.js tenta importar o Prisma client, nao encontra, e o build falha com `Generated Prisma not found`.

A solucao e simples: adicionar `prisma generate` como primeiro comando do build script. Assim, o client e gerado no servidor antes do build do Next.js.

## Por que adicionar `prisma migrate deploy`

Alem de gerar o client, voce precisa garantir que o banco de dados em producao tem as tabelas corretas. O comando `prisma migrate deploy` aplica todas as migrations pendentes no banco de producao. Diferente do `migrate dev`, ele nao cria novas migrations — apenas aplica as existentes.

A ordem correta no build: `prisma generate && prisma migrate deploy && next build`

## O problema do timezone (UTC)

O instrutor demonstrou um problema real: a aplicacao tinha regras de negocio que validavam horarios (agendamentos entre 9h e 12h da manha). Localmente, tudo funcionava porque o servidor Node.js usava o timezone da maquina do desenvolvedor (ex: America/Sao_Paulo, UTC-3).

Na Vercel, o servidor roda em UTC. Quando o usuario envia "9:00", o servidor interpreta como 9:00 UTC, que equivale a 12:00 no horario de Brasilia. Como 12:00 ja esta fora da regra (9-12 exclusivo), a validacao rejeita.

O teste do instrutor confirmou: ao agendar para 10:00, o sistema aceitou mas gravou 13:00 (10 + 3 = 13 UTC). Isso prova que o servidor esta adicionando o offset UTC ao horario.

**Licao fundamental:** nunca assuma timezone do servidor. Sempre trate conversoes explicitamente, preferencialmente usando UTC como base e convertendo apenas na apresentacao ao usuario.

## Vantagens da Vercel para Next.js

O instrutor destacou que a integracao Vercel + Next.js e praticamente "avancar, avancar, concluir". A Vercel detecta automaticamente que o projeto e Next.js e configura:

- Build command (`next build`)
- Output directory
- Serverless functions
- Edge network

O plano gratuito oferece maquinas com 2 CPUs e 8GB RAM para build, o que o instrutor considerou excelente para projetos de estudo e prototipagem.

## Fluxo de redeploy

Apos o primeiro deploy (que e mais demorado), qualquer push no repositorio GitHub dispara um redeploy automatico na Vercel. Esses deploys subsequentes sao muito mais rapidos porque a Vercel cacheia dependencias e camadas do build.

O instrutor recomendou nao fazer push direto na main em projetos reais — criar branch, abrir PR, e fazer merge. Para fins didaticos, ele fez push direto.