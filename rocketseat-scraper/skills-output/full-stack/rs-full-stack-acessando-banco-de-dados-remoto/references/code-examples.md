# Code Examples: Acessando Banco de Dados Remoto

## Formato da URL de conexao PostgreSQL

```
postgresql://usuario:senha@hostname:porta/nome_do_banco
```

### Exemplo real (estrutura)

```
postgresql://rocketlog_user:AbCdEf123456@dpg-abc123xyz.oregon-postgres.render.com:5432/rocketlog_fatv
```

## Configuracao via variavel de ambiente

### .env (desenvolvimento local com banco remoto)

```env
# Conexao externa — NUNCA commitar este arquivo
DATABASE_URL=postgresql://rocketlog_user:senha@dpg-abc123xyz.oregon-postgres.render.com:5432/rocketlog_fatv?sslmode=require
```

### .env (desenvolvimento local com banco local)

```env
# Conexao local — sem SSL necessario
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rocketlog
```

### .gitignore

```gitignore
.env
.env.local
.env.production
```

## Configuracao no Render (deploy)

No dashboard do Render, ao configurar o Web Service da API:

```
Environment Variables:
  DATABASE_URL = [Internal Database URL copiada do dashboard do banco]
```

Use a **Internal URL** quando a API esta no Render — comunicacao interna, sem exposicao.

## Conexao no Beekeeper Studio — passo a passo

```
1. Tipo de conexao: PostgreSQL
2. Connection String: [colar External Database URL]
   - Host: dpg-abc123xyz.oregon-postgres.render.com
   - Port: 5432
   - User: rocketlog_user (preenchido automaticamente)
   - Password: ******* (preenchido automaticamente)
   - Default Database: rocketlog_fatv (preenchido automaticamente)
3. SSL: Enable (Required)
4. Salvar como: "RocketLog-Render"
5. Conectar
```

## Configuracao com Knex.js (exemplo de uso no codigo)

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

## Configuracao com Prisma (exemplo de uso no codigo)

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Verificacao de conexao via terminal

```bash
# Testar conexao remota (requer psql instalado)
psql "postgresql://usuario:senha@hostname:5432/banco?sslmode=require"

# Listar tabelas apos conectar
\dt

# Sair
\q
```

## Checklist de seguranca para URLs de banco

```markdown
- [ ] URL armazenada em variavel de ambiente (.env)
- [ ] .env adicionado ao .gitignore
- [ ] Nenhuma credencial hardcoded no codigo
- [ ] Deploy usa Internal URL (se API no mesmo provedor)
- [ ] SSL habilitado para conexoes externas
- [ ] Banco de dados temporario deletado apos uso
- [ ] Credenciais nao compartilhadas por chat/email
```