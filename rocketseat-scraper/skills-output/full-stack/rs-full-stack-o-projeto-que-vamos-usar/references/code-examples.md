# Code Examples: Verificação de Projeto RocketLog

## Comandos Docker

### Verificar imagem disponível
```bash
# Lista todas as imagens Docker locais
docker image ls

# Saída esperada (exemplo):
# REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
# postgres     latest    abc123def456   2 weeks ago    379MB
```

### Verificar container em execução
```bash
# Lista apenas containers em execução
docker ps

# Saída esperada (exemplo):
# CONTAINER ID   IMAGE      COMMAND                  STATUS          PORTS                    NAMES
# 1a2b3c4d5e6f   postgres   "docker-entrypoint.s…"   Up 2 hours      0.0.0.0:5432->5432/tcp   rocketlog-db
```

### Se o container não estiver rodando
```bash
# Listar TODOS os containers (incluindo parados)
docker ps -a

# Iniciar container existente
docker start <container_name>

# Ou subir via docker-compose se disponível
docker compose up -d
```

## Variáveis de ambiente (.env)

```env
# Exemplo de configuração para desenvolvimento local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rocketlog?schema=public"
```

## Scripts do package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node build/server.js"
  }
}
```

### Executar em desenvolvimento
```bash
npm run dev
# Inicia a API com hot-reload
```

### Fazer build
```bash
npm run build
# Compila TypeScript para JavaScript na pasta build/
```

### Executar em produção
```bash
npm run start
# Executa o JavaScript compilado
```

## Prisma

### Executar migrations
```bash
npx prisma migrate dev
# Aplica todas as migrations pendentes e gera o client
```

### Abrir Prisma Studio
```bash
npx prisma studio
# Abre interface web para visualizar/editar dados do banco
# Acesso padrão: http://localhost:5555
```

## Insomnia — Importar rotas

O projeto inclui `insomnia-routes.json` com todas as rotas pré-configuradas.

### Importar coleção
1. Abrir Insomnia
2. Create → Import
3. Arrastar o arquivo `insomnia-routes.json` ou clicar "Choose a File"
4. Coleção "RocketLog" será criada com todas as rotas

### Exemplo de requisição — Criar usuário
```http
POST http://localhost:3333/users
Content-Type: application/json

{
  "name": "Ana Paula"
}
```

### Resposta esperada
```json
{
  "id": "uuid-gerado",
  "name": "Ana Paula",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## Conexão com banco via cliente SQL

```
Host: localhost
Porta: 5432
Usuário: postgres
Senha: postgres
Banco: rocketlog
```

## Checklist completo de verificação (script mental)

```bash
# 1. Docker
docker image ls | grep postgres
docker ps | grep postgres

# 2. Instalar dependências (se necessário)
npm install

# 3. Rodar API
npm run dev

# 4. Testar endpoint (em outro terminal)
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Teste"}'

# 5. Verificar no banco
npx prisma studio

# 6. Encerrar tudo
# Ctrl+C em cada terminal
```