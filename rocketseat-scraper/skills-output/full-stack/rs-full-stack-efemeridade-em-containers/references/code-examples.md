# Code Examples: Efemeridade em Containers

## Exemplo 1: Dados perdidos sem volume

```bash
# Cria e roda um container
docker run -d --name meu-app nginx

# Cria um arquivo dentro do container
docker exec meu-app bash -c "echo 'dados importantes' > /tmp/dados.txt"

# Verifica que o arquivo existe
docker exec meu-app cat /tmp/dados.txt
# Output: dados importantes

# Remove o container
docker rm -f meu-app

# Recria o container
docker run -d --name meu-app nginx

# Tenta ler o arquivo
docker exec meu-app cat /tmp/dados.txt
# Output: cat: /tmp/dados.txt: No such file or directory
# DADOS PERDIDOS!
```

## Exemplo 2: Dados persistidos com volume nomeado

```bash
# Cria um volume nomeado
docker volume create meus-dados

# Roda container com volume montado
docker run -d --name meu-app -v meus-dados:/app/data nginx

# Cria arquivo no volume
docker exec meu-app bash -c "echo 'dados importantes' > /app/data/dados.txt"

# Remove o container
docker rm -f meu-app

# Recria o container com o MESMO volume
docker run -d --name meu-app -v meus-dados:/app/data nginx

# Verifica que os dados persistiram
docker exec meu-app cat /app/data/dados.txt
# Output: dados importantes
# DADOS PRESERVADOS!
```

## Exemplo 3: Banco de dados com volume (docker-compose)

### ERRADO — sem volume (dados perdidos ao recriar)

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    # SEM VOLUME — dados perdidos ao fazer docker-compose down!
```

### CORRETO — com volume nomeado

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:  # Volume nomeado, persiste independente do container
```

## Exemplo 4: Aplicacao Node.js com uploads

### ERRADO — uploads dentro do container

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
# Uploads vao para /app/uploads DENTRO do container
# Se o container morrer, uploads sao perdidos
CMD ["node", "server.js"]
```

### CORRETO — uploads em volume externo

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

```bash
# Roda com volume para uploads
docker run -d \
  --name minha-api \
  -v uploads_data:/app/uploads \
  minha-api:latest
```

## Exemplo 5: Container efemero como ferramenta

```bash
# Container descartavel para rodar um comando e morrer
# --rm remove automaticamente apos execucao
docker run --rm node:20-alpine node -e "console.log('Hello')"
# Container ja nao existe mais — e isso e o correto!

# Container descartavel para instalar dependencias
docker run --rm -v $(pwd):/app -w /app node:20-alpine npm install
# Container morreu, mas node_modules ficou no host via bind mount
```

## Exemplo 6: Verificando se um container tem volumes

```bash
# Inspeciona volumes montados em um container
docker inspect meu-app --format '{{json .Mounts}}' | jq

# Se retornar [] vazio para um container com dados, e um problema!
# Significa que os dados estao apenas na writable layer do container
```