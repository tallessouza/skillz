# Code Examples: Docker Build — Construir Imagens Docker

## Comandos de verificacao

### Listar containers em execucao

```bash
docker ps
```

Output quando nao ha containers:
```
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

### Listar imagens disponiveis

```bash
docker image ls
```

Output quando nao ha imagens:
```
REPOSITORY   TAG   IMAGE ID   CREATED   SIZE
```

Output apos build:
```
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
api          latest    a1b2c3d4e5f6   10 seconds ago   150MB
```

## Build — Variacoes

### Build basico com nome

```bash
docker build -t api .
```
- `-t api` → nomeia a imagem como "api"
- `.` → usa o Dockerfile padrao no diretorio atual

### Build com tag de versao

```bash
docker build -t api:1.0 .
```
- Cria imagem "api" com tag "1.0" ao inves de "latest"

### Build com Dockerfile customizado

```bash
docker build -t api -f Dockerfile.dev .
```
- `-f Dockerfile.dev` → especifica arquivo diferente do padrao

### Build com nome composto

```bash
# Correto — com tracos
docker build -t api-skillz .

# Correto — com underline
docker build -t api_rocket .

# ERRADO — com espacos (vai falhar)
docker build -t "api skillz" .
```

## Fluxo completo demonstrado na aula

```bash
# 1. Verificar estado inicial
docker ps              # Nenhum container
docker image ls        # Nenhuma imagem

# 2. Fazer o build
docker build -t api .
# Output mostra cada etapa do Dockerfile sendo executada:
# - Download da imagem base (node:XX-alpine)
# - WORKDIR criado
# - COPY executado
# - npm install rodou
# - Build completou

# 3. Verificar resultado
docker image ls
# REPOSITORY  TAG     IMAGE ID      CREATED        SIZE
# api         latest  abc123def     2 seconds ago  150MB

# 4. Verificar containers (ainda nenhum — imagem != container)
docker ps
# CONTAINER ID  IMAGE  COMMAND  CREATED  STATUS  PORTS  NAMES
# (vazio)
```

## Cenario de versionamento com tags

```bash
# Versao 1 da aplicacao
docker build -t api:1.0 .

# Fez alteracoes no codigo...
# Versao 2
docker build -t api:2.0 .

# Agora tem ambas disponiveis
docker image ls
# REPOSITORY  TAG   IMAGE ID      CREATED          SIZE
# api         2.0   def456ghi     5 seconds ago    152MB
# api         1.0   abc123def     10 minutes ago   150MB
```

## Limpar terminal entre comandos

```bash
# Linux/Mac
clear
# ou Ctrl+L

# Windows
cls
```