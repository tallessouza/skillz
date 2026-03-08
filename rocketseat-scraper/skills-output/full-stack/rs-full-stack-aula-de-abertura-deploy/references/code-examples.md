# Code Examples: Deploy de Aplicações Full-Stack

## Exemplo conceitual: Diferença entre local e produção

### Configuração local (desenvolvimento)

```javascript
// .env.development
DATABASE_URL="postgresql://user:password@localhost:5432/myapp_dev"
PORT=3333
NODE_ENV="development"
```

```javascript
// server.js — rodando localmente
const express = require('express')
const app = express()

const port = process.env.PORT || 3333

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
```

### Configuração de produção (deploy)

```javascript
// .env.production — variáveis configuradas no servidor
DATABASE_URL="postgresql://user:senha_segura@db-server.provider.com:5432/myapp_prod"
PORT=443
NODE_ENV="production"
```

```javascript
// server.js — mesmo código, comportamento diferente via env vars
const express = require('express')
const app = express()

const port = process.env.PORT || 3333

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
```

## Checklist prático de deploy

```bash
# 1. Verificar se a aplicação roda sem erros
npm start

# 2. Verificar conexão com banco de dados de produção
# (a string de conexão vem das variáveis de ambiente do servidor)

# 3. Verificar se a porta está acessível
curl -I http://seu-servidor.com:PORT

# 4. Verificar se o banco está acessível pelo servidor
# (testar conexão do servidor ao banco de produção)
```

## Estrutura típica de um deploy full-stack

```
Servidor de Produção
├── Aplicação (Node.js/Express)
│   ├── Código da aplicação
│   ├── Variáveis de ambiente (.env ou config do servidor)
│   └── Dependências (node_modules via npm install --production)
│
└── Banco de Dados (PostgreSQL/MySQL)
    ├── Instância rodando
    ├── Dados persistentes
    └── Configuração de acesso (permitir conexão do servidor da app)
```