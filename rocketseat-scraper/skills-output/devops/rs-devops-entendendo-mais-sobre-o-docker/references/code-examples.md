# Code Examples: Docker — Imagens e Containers

## Verificando a Instalacao do Docker

```bash
# Verificar se o Docker CLI esta disponivel
docker --version

# Ver informacoes detalhadas do Docker
docker info
```

## Trabalhando com Imagens

### Listar imagens locais
```bash
docker image ls
```
Saida esperada:
```
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
node          18        abc123def456   2 weeks ago    950MB
nginx         latest    789ghi012jkl   3 days ago     142MB
```

### Remover uma imagem
```bash
docker image rm <IMAGE_ID>
# Exemplo:
docker image rm abc123def456
```

### Construir uma imagem a partir de um Dockerfile
```bash
# Sintaxe basica (o ponto indica o diretorio atual como contexto)
docker build -t minha-aplicacao .

# Com tag de versao
docker build -t minha-aplicacao:1.0 .
```

## Trabalhando com Containers

### Listar containers em execucao
```bash
docker container ls
```

### Listar todos os containers (incluindo parados)
```bash
docker container ls -a
```

### Executar um container a partir de uma imagem
```bash
# Basico
docker run minha-aplicacao

# Com porta mapeada
docker run -p 3000:3000 minha-aplicacao

# Em modo detached (background)
docker run -d -p 3000:3000 minha-aplicacao
```

### Remover um container
```bash
docker container rm <CONTAINER_ID>
```

## Demonstrando a Efemeridade

Este e o experimento que o instrutor propoe para entender na pratica:

```bash
# 1. Rodar um container
docker run -d -p 3000:3000 minha-aplicacao

# 2. Fazer upload de um arquivo para a aplicacao (via app)
# O arquivo fica salvo DENTRO do container

# 3. Parar o container
docker container stop <CONTAINER_ID>

# 4. Rodar novamente
docker run -d -p 3000:3000 minha-aplicacao

# 5. Resultado: o arquivo uploadado NAO existe mais
# Porque o container novo parte da imagem original (imutavel)
```

## Ciclo Completo: Do Codigo ao Container

```bash
# Passo 1: Ter uma aplicacao com Dockerfile
ls
# Dockerfile  package.json  src/  ...

# Passo 2: Buildar a imagem
docker build -t minha-app .

# Passo 3: Verificar que a imagem foi criada
docker image ls
# REPOSITORY    TAG       IMAGE ID
# minha-app     latest    xyz789...

# Passo 4: Rodar o container
docker run -d -p 3000:3000 minha-app

# Passo 5: Verificar que esta rodando
docker container ls
# CONTAINER ID   IMAGE       STATUS
# abc123...      minha-app   Up 2 seconds
```

## Padrao dos Comandos Docker

A CLI do Docker segue um padrao consistente de `docker <recurso> <acao>`:

```bash
# IMAGENS
docker image ls        # listar
docker image rm <id>   # remover
docker image inspect   # inspecionar
docker image pull      # baixar do registry
docker image push      # enviar para registry

# CONTAINERS
docker container ls      # listar
docker container rm <id> # remover
docker container stop    # parar
docker container start   # iniciar
docker container logs    # ver logs
```