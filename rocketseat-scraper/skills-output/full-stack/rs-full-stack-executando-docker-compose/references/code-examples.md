# Code Examples: Executando Docker Compose

## Comando principal: iniciar containers

```bash
# Iniciar em modo detached (background)
docker-compose up -d

# Iniciar com rebuild de imagens (apos mudar Dockerfile)
docker-compose up -d --build

# Iniciar apenas um servico especifico
docker-compose up -d postgres
```

## Verificacao de imagens

```bash
# Listar todas as imagens locais
docker image ls

# Exemplo de saida esperada:
# REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
# postgres     15        abc123def456   2 weeks ago    379MB
```

## Verificacao de containers

```bash
# Listar containers em execucao
docker ps

# Exemplo de saida esperada:
# CONTAINER ID   IMAGE        COMMAND                  STATUS         PORTS                    NAMES
# a1b2c3d4e5f6   postgres:15  "docker-entrypoint.s…"   Up 2 minutes   0.0.0.0:5432->5432/tcp   rocket-log-db

# Listar todos os containers (incluindo parados)
docker ps -a
```

## Logs e debugging

```bash
# Ver logs do container
docker-compose logs

# Ver logs em tempo real (follow)
docker-compose logs -f

# Ver logs de um servico especifico
docker-compose logs postgres

# Ver ultimas 50 linhas de log
docker-compose logs --tail=50
```

## Parar e remover containers

```bash
# Parar containers (mantem dados)
docker-compose down

# Parar e remover volumes (APAGA dados do banco)
docker-compose down -v

# Parar sem remover containers
docker-compose stop

# Reiniciar containers
docker-compose restart
```

## docker-compose.yml de referencia (contexto da aula)

```yaml
version: '3'

services:
  database:
    image: postgres
    container_name: rocket-log-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: rocketlog
```

## Conexao via Beekeeper Studio

Configuracao de conexao:

```
Tipo:     PostgreSQL
Host:     localhost
Porta:    5432
Usuario:  postgres
Senha:    postgres
Database: rocketlog
```

## Conexao via linha de comando (alternativa)

```bash
# Conectar via psql dentro do container
docker exec -it rocket-log-db psql -U postgres -d rocketlog

# Conectar via psql local (se instalado)
psql -h localhost -p 5432 -U postgres -d rocketlog
```

## Verificacao rapida de conectividade

```bash
# Testar se a porta esta acessivel
nc -zv localhost 5432

# Ou com curl (menos preciso)
curl -v telnet://localhost:5432
```

## Fluxo completo de execucao

```bash
# 1. Navegar ate o diretorio do projeto
cd /caminho/do/projeto

# 2. Subir os containers
docker-compose up -d

# 3. Verificar se esta rodando
docker ps

# 4. Ver logs se necessario
docker-compose logs

# 5. Conectar com cliente de banco (Beekeeper, DBeaver, pgAdmin, psql)
# -> usar credenciais do docker-compose.yml
```