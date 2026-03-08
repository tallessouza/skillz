# Code Examples: Conhecendo o Render

## Fluxo de criacao de conta no Render

### Passo 1: Acessar o site
```
URL: https://render.com
Acao: Clicar em "Get Started" ou "Sign Up"
```

### Passo 2: Escolher metodo de autenticacao
```
Opcoes disponíveis:
- GitHub (recomendado pelo instrutor)
- Google
- GitLab
- Email/senha
```

### Passo 3: Autorizar acesso (se GitHub)
```
GitHub OAuth Flow:
1. Render solicita permissao de leitura do perfil
2. Autorize o acesso
3. Render cria sua conta automaticamente
```

### Passo 4: Dashboard
```
Apos login, voce chega ao Dashboard com opcoes:
- Web Services (backend)
- Static Sites
- PostgreSQL (banco de dados)
- Cron Jobs
- Blueprints (infraestrutura como codigo)
```

## Verificando o plano gratuito

### Navegacao
```
Dashboard → Account Settings → Billing
ou
render.com/pricing → verificar plano Hobby
```

## Exemplo de configuracao tipica no Render (proximas aulas)

### Estrutura que sera deployada
```
projeto/
├── src/
│   ├── server.js          # Entry point do Express/Fastify
│   ├── routes/
│   ├── controllers/
│   └── database/
├── package.json           # Scripts de build e start
├── .env                   # Variaveis locais (NAO sobe pro Render)
└── knexfile.js            # Configuracao do banco
```

### Comandos tipicos configurados no Render
```bash
# Build Command (executado no deploy)
npm install

# Start Command (executado apos build)
node src/server.js
```

### Variaveis de ambiente no Render
```
# Configuradas no painel do Render, NAO no codigo
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NODE_ENV=production
PORT=10000
JWT_SECRET=sua-chave-secreta
```

## Comparacao de plataformas similares

| Plataforma | Free Tier | Banco gratuito | Deploy via Git |
|-----------|-----------|----------------|----------------|
| Render | Sim | 90 dias | Sim |
| Railway | Credits limitados | Com credits | Sim |
| Fly.io | Recursos limitados | Nao incluso | Sim (CLI) |
| Vercel | Frontend only (free) | Nao incluso | Sim |
| Heroku | Removido em 2022 | N/A | Sim |