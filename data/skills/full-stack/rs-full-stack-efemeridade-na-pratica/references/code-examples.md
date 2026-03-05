# Code Examples: Efemeridade de Containers na Prática

## Demonstracao do instrutor (passo a passo)

### 1. Criando arquivo dentro do container

```bash
# Dentro do container (modo interativo)
ls                    # Lista conteudo do diretorio de trabalho
touch teste.txt       # Cria arquivo vazio
ls                    # Confirma: teste.txt aparece
```

### 2. Stop + Start (arquivo preservado)

```bash
exit                         # Sai do modo interativo
docker ps                    # Mostra container em execucao
docker stop <container_id>   # Para o container
docker ps                    # Container nao aparece (nao esta rodando)
docker ps -a                 # Container aparece como parado
docker start <container_id>  # Reinicia o MESMO container
docker ps                    # Container rodando novamente
docker exec -it <container_id> /bin/sh  # Entra no container
ls                           # teste.txt AINDA ESTA LA
```

### 3. Rm + Run (arquivo perdido)

```bash
exit                         # Sai do modo interativo
docker stop <container_id>   # Para o container
docker rm <container_id>     # Remove o container
docker run -d <image>        # Cria container NOVO
docker ps                    # Novo ID! Container e diferente
docker exec -it <novo_id> /bin/sh  # Entra no novo container
ls                           # teste.txt NAO EXISTE MAIS
```

## Padroes corretos com volumes

### Postgres com volume nomeado

```bash
# Criar e rodar
docker run -d --name postgres \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres:16

# Recriar sem perder dados
docker stop postgres
docker rm postgres
docker run -d --name postgres \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres:16
# Banco intacto — volume pgdata preservou tudo
```

### MySQL com volume nomeado

```bash
docker run -d --name mysql \
  -v mysqldata:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -p 3306:3306 \
  mysql:8
```

### MongoDB com volume nomeado

```bash
docker run -d --name mongo \
  -v mongodata:/data/db \
  -p 27017:27017 \
  mongo:7
```

### Redis com persistencia

```bash
# Redis com AOF (append-only file) persistido
docker run -d --name redis \
  -v redisdata:/data \
  redis:7 redis-server --appendonly yes
```

### Aplicacao Node.js com uploads persistidos

```bash
docker run -d --name api \
  -v ./uploads:/app/uploads \
  -p 3000:3000 \
  myapi:latest
```

## Docker Compose completo (cenario real)

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - uploads:/app/uploads    # Uploads persistidos
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data  # Banco persistido
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    command: redis-server --appendonly yes
    volumes:
      - redisdata:/data                  # Cache persistido

volumes:
  pgdata:      # Volume nomeado para Postgres
  redisdata:   # Volume nomeado para Redis
  uploads:     # Volume nomeado para uploads
```

## Gerenciamento de volumes

```bash
# Listar volumes
docker volume ls

# Inspecionar volume
docker volume inspect pgdata

# Backup de volume
docker run --rm \
  -v pgdata:/source:ro \
  -v $(pwd):/backup \
  alpine tar czf /backup/pgdata-backup.tar.gz -C /source .

# Restaurar volume
docker run --rm \
  -v pgdata:/target \
  -v $(pwd):/backup \
  alpine tar xzf /backup/pgdata-backup.tar.gz -C /target

# Remover volume (CUIDADO: dados perdidos)
docker volume rm pgdata

# Remover volumes nao utilizados
docker volume prune
```