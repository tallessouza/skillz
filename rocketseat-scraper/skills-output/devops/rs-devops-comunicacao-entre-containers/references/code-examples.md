# Code Examples: Comunicacao entre Containers

## Exemplo completo do docker-compose.yml da aula

### Versao inicial (minima)

```yaml
services:
  mysql:
    image: mysql:8

  api-rocket:
    build:
      context: .
    ports:
      - "3001:3000"
```

### Versao com depends_on

```yaml
services:
  mysql:
    image: mysql:8

  api-rocket:
    build:
      context: .
    ports:
      - "3001:3000"
    depends_on:
      - mysql
```

### Versao com container_name

```yaml
services:
  mysql:
    image: mysql:8
    container_name: mysql

  api-rocket:
    build:
      context: .
    container_name: api-rocket
    ports:
      - "3001:3000"
    depends_on:
      - mysql
```

### Versao final completa (com rede customizada)

```yaml
services:
  mysql:
    image: mysql:8
    container_name: mysql
    networks:
      - primeira-network

  api-rocket:
    build:
      context: .
    container_name: api-rocket
    ports:
      - "3001:3000"
    depends_on:
      - mysql
    networks:
      - primeira-network

networks:
  primeira-network:
    driver: bridge
```

### Variacao: rede externa ja existente

```yaml
networks:
  primeira-network:
    external: true
    name: primeira-network
```

## Comandos CLI usados na aula

### Subir containers

```bash
# Subir sem rebuild
docker compose up -d

# Subir com rebuild (mais comum no dia a dia)
docker compose up --build -d
```

### Apenas buildar

```bash
docker compose build
```

### Parar containers

```bash
docker compose stop
```

### Ver logs

```bash
# Todos os servicos
docker compose logs

# Servico especifico
docker compose logs mysql
docker compose logs api-rocket
```

### Inspecionar container para verificar rede

```bash
docker container inspect <container_id>
```

### Verificar containers rodando

```bash
docker ps
```

## Build context em diretorio diferente

Se o Dockerfile estiver em `./docker/Dockerfile`:

```yaml
services:
  api-rocket:
    build:
      context: ./docker
```

## Teste rapido com curl

```bash
# Verificar se a API esta respondendo
curl http://localhost:3001
```