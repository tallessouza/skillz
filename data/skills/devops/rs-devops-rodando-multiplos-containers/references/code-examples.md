# Code Examples: Rodando Multiplos Containers

## Fluxo completo da aula

### 1. Build da imagem com configuracao de banco

```bash
docker build -t ns-api-skillz:v9 .
```

Verificando tamanho da imagem:
```bash
docker images ns-api-skillz
# v9: 263MB (cresceu 53MB por TypeORM + MySQL driver)
# v8: 210MB
```

### 2. Primeira tentativa — app na rede custom, banco na bridge

```bash
# App na rede custom
docker run -d --network primeira-network -p 3001:3000 ns-api-skillz:v9
```

Resultado: container sobe e logo morre. `docker ps` nao mostra nada.

### 3. Diagnostico do container que sumiu

```bash
# Mostrar todos os containers (incluindo parados)
docker ps -a

# Mostrar apenas o ultimo container criado
docker ps -l

# Ver logs do container crashado
docker logs <container-id>
# Output: "Unable to connect to the database. Retrying..."
```

### 4. Verificando em qual rede o MySQL esta

```bash
docker container inspect <mysql-container-id>
# Na secao Networks: "bridge" — rede default, NAO a custom
```

### 5. Corrigindo — colocando MySQL na mesma rede

```bash
# Parar e remover o MySQL atual
docker stop <mysql-container-id>
docker rm <mysql-container-id>

# Recriar na rede correta
docker run -d --name mysql --network primeira-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydb \
  mysql:8
```

### 6. Corrigindo a aplicacao — host localhost para mysql

Antes (no codigo da app):
```
DATABASE_URL=mysql://root:root@localhost:3306/mydb
```

Depois:
```
DATABASE_URL=mysql://root:root@mysql:3306/mydb
```

Rebuild:
```bash
docker build -t ns-api-skillz:v10 .
```

### 7. Subindo app corrigida

```bash
docker run -d --network primeira-network -p 3001:3000 ns-api-skillz:v10
```

Verificando:
```bash
docker logs <app-container-id>
# Output: TypeORM iniciado com sucesso
```

### 8. Confirmando que ambos estao na mesma rede

```bash
docker network inspect primeira-network
# Mostra dois containers:
# - app (sem nome definido)
# - mysql
```

## Monitoramento com watch

```bash
# Acompanhar containers em tempo real
watch docker ps
```

Util para ver containers subindo e caindo durante debug.