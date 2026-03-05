# Code Examples: Acessando Diretório de Trabalho do Container

## Fluxo completo demonstrado na aula

### 1. Construir a imagem

```bash
docker build -t api .
```

- `-t api`: Nomeia a imagem como "api"
- `.`: Usa o Dockerfile no diretorio atual

### 2. Verificar imagem criada

```bash
docker image ls
```

Saida esperada:
```
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
api          latest    abc123def456   10 seconds ago   250MB
```

### 3. Criar e rodar container

```bash
docker run -p 3333:3333 -d api
```

- `-p 3333:3333`: Mapeia porta host:container
- `-d`: Roda em background (detached)
- `api`: Imagem a usar

### 4. Verificar container rodando

```bash
docker ps
```

Saida esperada:
```
CONTAINER ID   IMAGE   COMMAND       STATUS          PORTS
a1b2c3d4e5f6   api     "node ..."    Up 5 seconds    0.0.0.0:3333->3333/tcp
```

### 5. Acessar o container

```bash
# Opcao 1: bash (maioria dos containers)
docker exec -it a1b2c3d4e5f6 bash

# Opcao 2: sh (containers Alpine ou quando bash nao existe)
docker exec -it a1b2c3d4e5f6 /bin/sh
```

### 6. Explorar dentro do container

```bash
# Verificar diretorio atual (deve ser o WORKDIR)
pwd
# Output: /usr/src/app

# Listar arquivos
ls
# Output: dist  node_modules  package-lock.json  package.json  src  tsconfig.json
```

### 7. Comparacao: local vs container

| Arquivo/Pasta | Projeto Local | Dentro do Container | Motivo |
|---------------|:---:|:---:|--------|
| `src/` | sim | sim | Copiado pelo COPY |
| `package.json` | sim | sim | Copiado pelo COPY |
| `package-lock.json` | sim | sim | Copiado pelo COPY |
| `tsconfig.json` | sim | sim | Copiado pelo COPY |
| `dist/` | sim | sim | Gerada pelo RUN npm run build |
| `node_modules/` | sim | sim | Gerada pelo RUN npm install |
| `.dockerignore` | sim | **nao** | Bloqueado pelo .dockerignore |
| `.gitignore` | sim | **nao** | Bloqueado pelo .dockerignore |
| `Dockerfile` | sim | **nao** | Bloqueado pelo .dockerignore |

### 8. Sair do container

```bash
exit
```

### Exemplo: Executar comando unico sem entrar

```bash
# Listar arquivos sem sessao interativa
docker exec a1b2c3d4e5f6 ls /usr/src/app

# Verificar conteudo de um arquivo
docker exec a1b2c3d4e5f6 cat /usr/src/app/package.json

# Verificar se dist existe
docker exec a1b2c3d4e5f6 ls /usr/src/app/dist
```

### Dockerfile de referencia (contexto da aula)

```dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3333

CMD ["node", "dist/server.js"]
```