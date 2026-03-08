# Code Examples: Rodando da API

## Setup completo passo a passo

### Download e organizacao

```bash
# Apos baixar o ZIP do GitHub e extrair:

# Renomear a pasta extraida
mv fullstack_refund_api-main api

# Mover para dentro do projeto (se necessario)
mv api /caminho/do/projeto/

# Estrutura final
ls /caminho/do/projeto/
# api/  web/
```

### Instalacao de dependencias

```bash
# Entrar na pasta da API
cd api

# Instalar dependencias
npm i

# Verificar que node_modules foi criado
ls node_modules
```

### Iniciando o servidor

```bash
# Iniciar em modo desenvolvimento (com hot-reload)
npm run dev

# Output esperado (exemplo):
# Server is running on port 3333
```

### Abrindo o Prisma Studio

```bash
# Em um NOVO terminal, na mesma pasta api/
cd api
npx prisma studio

# Output esperado:
# Prisma Studio is up on http://localhost:5555
```

## Variacoes de setup

### Se o projeto usa yarn em vez de npm

```bash
# Verifique se existe yarn.lock
ls yarn.lock

# Se existir, use yarn
yarn install
yarn dev
```

### Se o projeto usa pnpm

```bash
# Verifique se existe pnpm-lock.yaml
ls pnpm-lock.yaml

# Se existir, use pnpm
pnpm install
pnpm dev
```

### Se a porta ja esta em uso

```bash
# Encontrar o processo usando a porta (ex: 3333)
lsof -i :3333        # macOS/Linux
netstat -ano | findstr :3333  # Windows

# Encerrar o processo
kill -9 <PID>         # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

## Limpeza de dados via Prisma Studio

### Ordem correta de delecao

```
1. Abrir Prisma Studio (npx prisma studio)
2. Ir na tabela Refund (tabela dependente)
3. Selecionar todos os registros
4. Clicar em Delete
5. Ir na tabela User (tabela principal)
6. Selecionar todos os registros
7. Clicar em Delete
```

### Alternativa via terminal (Prisma CLI)

```bash
# Reset completo do banco (apaga todos os dados e recria as tabelas)
npx prisma migrate reset

# Ou via seed (se configurado)
npx prisma db seed
```

### Alternativa via SQL direto

```sql
-- Deletar na ordem correta (dependentes primeiro)
DELETE FROM "Refund";
DELETE FROM "User";
```

## Verificacao do servidor

```bash
# Testar se a API responde (em outro terminal)
curl http://localhost:3333

# Ou verificar uma rota especifica
curl http://localhost:3333/users
```

## Estrutura tipica da pasta api/

```
api/
├── node_modules/       # Gerado pelo npm i (nao versionado)
├── prisma/
│   ├── schema.prisma   # Definicao das tabelas
│   ├── migrations/     # Historico de migracoes
│   └── dev.db          # Banco SQLite (se aplicavel)
├── src/
│   ├── server.js       # Entry point do servidor
│   ├── routes/         # Definicao de rotas
│   └── controllers/    # Logica dos endpoints
├── package.json        # Dependencias e scripts
├── package-lock.json   # Lock de versoes
└── .env                # Variaveis de ambiente (DATABASE_URL, etc.)
```