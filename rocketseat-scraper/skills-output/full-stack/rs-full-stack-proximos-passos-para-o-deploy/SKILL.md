---
name: rs-full-stack-proximos-passos-para-o-deploy
description: "Guides Node.js application deployment on Render when connecting GitHub repositories, configuring environment variables, setting build commands, running migrations, and starting the app. Use when user asks to 'deploy node app', 'deploy to render', 'configure render deployment', 'connect github to render', or 'set up production environment'. Make sure to use this skill whenever deploying a Node.js API to Render with a remote database. Not for frontend deployment, Docker-based deploys, or non-Render hosting platforms."
---

# Deploy de Aplicação Node no Render

> Configure e execute o deploy de uma aplicação Node.js no Render conectando ao GitHub, definindo variáveis de ambiente, e executando build + migrations.

## Prerequisites

- Repositório no GitHub com o projeto Node.js
- Conta no Render (render.com)
- Banco de dados já deployado (PostgreSQL remoto no Render ou similar)
- Variáveis de ambiente do banco de dados remoto disponíveis

## Steps

### Step 1: Conectar Render ao GitHub

1. Acesse o dashboard do Render
2. Crie um novo Web Service
3. Conecte sua conta GitHub ao Render
4. Selecione o repositório correto da lista de repositórios disponíveis

### Step 2: Configurar variáveis de ambiente

Configure as variáveis de ambiente necessárias no painel do Render:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
PORT=3333
JWT_SECRET=your-production-secret
```

- Use a connection string do banco de dados remoto já deployado
- Nunca commite secrets no repositório

### Step 3: Configurar comandos de build

Configure os seguintes comandos no Render:

```bash
# Build Command — instala dependências e gera o build
npm install && npm run build

# Start Command — inicia a aplicação
npm start
```

### Step 4: Executar migrations no deploy

Adicione o comando de migration ao build command para criar as tabelas no banco de dados remoto:

```bash
# Build Command completo
npm install && npm run build && npx knex migrate:latest
```

### Step 5: Iniciar a aplicação

O Render executa automaticamente o Start Command configurado após o build. Verifique os logs para confirmar que a aplicação iniciou corretamente.

## Output format

Aplicação Node.js rodando em produção com:
- URL pública fornecida pelo Render (ex: `https://seu-app.onrender.com`)
- Banco de dados remoto conectado e com tabelas criadas
- Variáveis de ambiente configuradas

## Error handling

- Se o build falhar: verifique se todas as dependências estão no `package.json` (não apenas em devDependencies)
- Se a migration falhar: confirme que a `DATABASE_URL` aponta para o banco remoto correto
- Se a aplicação não iniciar: verifique se o `start` script no `package.json` aponta para o build gerado
- Se variáveis de ambiente estiverem faltando: o Render mostra erro nos logs — adicione as variáveis ausentes no painel

## Verification

- Acesse a URL pública fornecida pelo Render
- Teste um endpoint da API (ex: `curl https://seu-app.onrender.com/api/health`)
- Verifique nos logs do Render se não há erros de conexão com o banco

## Heuristics

| Situação | Ação |
|----------|------|
| Primeiro deploy | Garanta que migrations rodem no build command |
| Atualização de código | Push no GitHub dispara redeploy automático |
| Banco de dados mudou | Atualize DATABASE_URL nas variáveis de ambiente |
| Build demora muito | Verifique se não há dependências desnecessárias |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o fluxo de deploy e decisões de configuração
- [code-examples.md](references/code-examples.md) — Exemplos de configuração expandidos com variações