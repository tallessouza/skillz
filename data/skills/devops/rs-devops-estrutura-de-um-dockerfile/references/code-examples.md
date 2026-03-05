# Code Examples: Estrutura de um Dockerfile

## Dockerfile completo da aula

```dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]
```

### Explicacao linha a linha

| Linha | Instrucao | O que faz |
|-------|-----------|-----------|
| 1 | `FROM node:18-slim` | Puxa imagem base Node 18 sobre Debian slim (~70MB) |
| 3 | `WORKDIR /usr/src/app` | Define diretorio de trabalho (cria se nao existir) |
| 5 | `COPY package.json ./` | Copia apenas o manifesto de dependencias para o container |
| 7 | `RUN yarn` | Instala dependencias dentro do container |
| 9 | `COPY . .` | Copia todo o codigo fonte para o container |
| 11 | `RUN yarn run build` | Compila a aplicacao dentro do container |
| 13 | `EXPOSE 3000` | Documenta que o container usa porta 3000 |
| 15 | `CMD ["yarn", "run", "start"]` | Define comando padrao para iniciar o container |

## Comandos de build e inspecao

### Build basico

```bash
docker build -t api-skillz .
```

Output esperado (resumido):
```
Step 1/8 : FROM node:18-slim
 ---> pulling image...
Step 2/8 : WORKDIR /usr/src/app
Step 3/8 : COPY package.json ./
Step 4/8 : RUN yarn
 ---> Installing dependencies...
Step 5/8 : COPY . .
Step 6/8 : RUN yarn run build
Step 7/8 : EXPOSE 3000
Step 8/8 : CMD ["yarn", "run", "start"]
Successfully tagged api-skillz:latest
```

### Build com arquivo customizado

```bash
docker build -t api-skillz -f Production.Dockerfile .
```

### Verificar tamanho da imagem

```bash
docker image ls api-skillz
```

Output:
```
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
api-skillz    latest    abc123def456   2 minutes ago    1.05GB
```

### Ver historico de layers

```bash
docker image history api-skillz
```

Mostra cada layer criada, com tamanho individual e comando que a gerou.

## Variacoes para diferentes cenarios

### Com npm em vez de yarn

```dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

### Com pacote adicional necessario

```dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

# Instalar CLI adicional nao disponivel na imagem base
RUN apt-get update && apt-get install -y python3

COPY package.json ./

RUN yarn

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]
```

### Com lockfile (otimizacao mencionada para aulas futuras)

```dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]
```

## Erros comuns demonstrados

### Arquivo inexistente no COPY

```dockerfile
# ERRO: arquivo nao existe no contexto de build
COPY package ./
# Docker vai PARAR com erro, nao ignora silenciosamente
```

### Sem WORKDIR

```dockerfile
FROM node:18-slim
# Tudo roda em / (raiz do SO)
COPY package.json ./
RUN yarn
# Polui o filesystem base — ma pratica
```