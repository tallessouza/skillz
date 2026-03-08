---
name: rs-full-stack-deploy-da-aplicacao-1
description: "Configures Node.js backend deployment to Render when connecting GitHub repos, configuring build commands, setting environment variables, and deploying web services. Use when user asks to 'deploy backend', 'host Node app', 'deploy to Render', 'configure production environment', or 'set up web service'. Make sure to use this skill whenever deploying a Node.js API to Render with Prisma and JWT. Not for frontend deployment, Docker/Kubernetes orchestration, or AWS/GCP/Azure infrastructure."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: deployment
  tags: [deploy, Render, Node.js, Prisma, environment-variables, production]
---

# Deploy de Aplicação Backend no Render

> Faça deploy de uma aplicação Node.js no Render conectando GitHub, configurando build commands, variáveis de ambiente e Prisma migrations em produção.

## Prerequisites

- Repositório no GitHub com o projeto Node.js
- Conta no Render (plano free disponível)
- Banco de dados já criado no Render (ver skill de deploy de banco)
- Scripts `build` e `start` configurados no `package.json`
- Prisma configurado com migrations

## Steps

### Step 1: Conectar GitHub ao Render

1. No Dashboard do Render, selecionar **Web Services**
2. Permitir integração com GitHub (se ainda não feito)
3. Buscar e selecionar o repositório do projeto
4. Clicar em **Connect**

### Step 2: Configurar o serviço

```
Name:           {projeto}-api
Language:       Node (auto-detectado)
Branch:         main
Root Directory: (vazio — usar raiz do projeto)
Instance Type:  Free
```

### Step 3: Definir Build Command

```bash
npm install && npm run build && npx prisma migrate deploy
```

Três operações encadeadas com `&&`:
1. `npm install` — instala dependências (node_modules não está no GitHub)
2. `npm run build` — gera a build (pasta build está no .gitignore)
3. `npx prisma migrate deploy` — cria tabelas no banco de produção

### Step 4: Definir Start Command

```bash
npm start
```

O script `start` no `package.json` deve apontar para o arquivo de entrada da build:

```json
{
  "scripts": {
    "build": "...",
    "start": "node build/server.js"
  }
}
```

### Step 5: Configurar variáveis de ambiente

| Variável | Valor | Observação |
|----------|-------|------------|
| `PORT` | `3000` | Porta padrão em produção |
| `DATABASE_URL` | Internal Database URL do Render | Usar URL **interna** porque app e banco estão no mesmo Render |
| `JWT_SECRET` | Hash MD5 de uma palavra-chave | Nunca usar valores simples como nomes próprios |

Para gerar um JWT_SECRET seguro:
```bash
echo -n "sua-palavra-secreta" | md5sum | awk '{print $1}'
```

### Step 6: Deploy

1. Clicar em **Deploy Web Service**
2. Acompanhar logs em tempo real
3. Aguardar mensagem: `server is running on port 3000`

## Output format

Aplicação online no Render com URL pública, banco de dados conectado via URL interna, e tabelas criadas via Prisma migrate deploy.

## Error handling

- Se build falhar: verificar se scripts `build` e `start` existem no `package.json`
- Se migration falhar: verificar se `DATABASE_URL` aponta para o banco correto
- Se app não inicia: verificar se `PORT` está definida nas variáveis de ambiente
- Se conexão com banco falhar: confirmar uso da **Internal Database URL** (não a externa)

## Heuristics

| Situação | Ação |
|----------|------|
| App e banco no mesmo Render | Usar Internal Database URL |
| App e banco em provedores diferentes | Usar External Database URL |
| JWT_SECRET em produção | Gerar hash MD5 ou UUID, nunca texto simples |
| node_modules ou build no repo | Adicionar ao `.gitignore` — são gerados no deploy |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Commitar node_modules no GitHub | `npm install` no build command |
| Commitar pasta build | `npm run build` no build command |
| Usar `prisma migrate dev` em produção | Usar `prisma migrate deploy` |
| JWT_SECRET como texto simples ("rodrigo") | Gerar hash MD5 ou string aleatória |
| Usar External Database URL para app no mesmo Render | Usar Internal Database URL |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Build falha no Render | Scripts `build` ou `start` ausentes no `package.json` | Verifique que ambos existem e funcionam localmente |
| Migration falha em producao | `DATABASE_URL` incorreta ou banco nao acessivel | Use a Internal Database URL do Render |
| App nao inicia apos deploy | `PORT` nao definida nas env vars | Adicione `PORT=3000` nas variaveis de ambiente |
| Conexao com banco recusada | Usando External URL para app no mesmo Render | Troque para Internal Database URL |
| `prisma migrate dev` em producao causa erro | Comando errado para producao | Use `prisma migrate deploy` no build command |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre URLs internas vs externas, segurança de secrets e fluxo de deploy
- [code-examples.md](references/code-examples.md) — Configurações completas de package.json, .env e .gitignore para deploy