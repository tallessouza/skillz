# Code Examples: Criando o Banco de Dados no Render

## Conectando ao banco apos criacao

### Usando a URL externa (desenvolvimento local)

```bash
# URL fornecida pelo Render apos criacao
psql "postgres://usuario:senha@host.render.com:5432/rocketlog"
```

### Configurando variavel de ambiente na aplicacao

```env
# .env (local development — usando External Database URL)
DATABASE_URL="postgres://usuario:senha@host-externo.render.com:5432/rocketlog"
```

```env
# Render environment (usando Internal Database URL — mais rapido)
DATABASE_URL="postgres://usuario:senha@host-interno:5432/rocketlog"
```

### Verificando conexao com Node.js

```javascript
const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

async function testConnection() {
  await client.connect()
  const result = await client.query('SELECT NOW()')
  console.log('Connected:', result.rows[0].now)
  await client.end()
}

testConnection()
```

### Usando com Knex.js (comum no curso full-stack)

```javascript
// knexfile.js
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
  },
}
```

### Usando com Prisma

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Checklist de deploy do banco

```markdown
- [ ] Conta no Render criada
- [ ] Nova instancia PostgreSQL criada
- [ ] Nome da instancia: {app}-postgresql
- [ ] Nome do banco: {app}
- [ ] Regiao selecionada (mesma da API)
- [ ] Plano selecionado (Free para estudo)
- [ ] Status: Available
- [ ] DATABASE_URL copiada para as variaveis de ambiente
- [ ] Conexao testada (psql ou aplicacao)
```

## URLs do Render — qual usar onde

```
Internal Database URL (dentro do Render):
  postgres://user:pass@dpg-xxxxx:5432/rocketlog
  → Usar em: Web Services hospedados no Render (mesma regiao)
  → Vantagem: menor latencia, sem custo de trafego externo

External Database URL (fora do Render):
  postgres://user:pass@dpg-xxxxx.render.com:5432/rocketlog
  → Usar em: desenvolvimento local, ferramentas externas
  → Desvantagem: maior latencia, conexao pela internet publica

PSQL Command:
  psql -h dpg-xxxxx.render.com -U user rocketlog
  → Usar em: acesso direto ao banco via terminal
```