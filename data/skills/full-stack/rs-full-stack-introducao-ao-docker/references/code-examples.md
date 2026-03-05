# Code Examples: Introdução ao Docker

## Nota sobre esta aula

Esta aula é conceitual/introdutória — o instrutor não apresenta código prático, mas menciona que nas próximas aulas serão criados Dockerfiles e containers. Abaixo estão exemplos ilustrativos baseados nos conceitos apresentados.

## Estrutura básica de um Dockerfile

O instrutor menciona que o Dockerfile contém "todas as informações necessárias para gerar nossa imagem Docker":

```dockerfile
# Imagem base (disponível no Docker Hub)
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Comando para executar a aplicação
CMD ["node", "server.js"]
```

## Comandos básicos referenciados nos conceitos

```bash
# Construir imagem a partir do Dockerfile
docker build -t minha-app .

# Listar imagens disponíveis localmente
docker images

# Executar container a partir de uma imagem
docker run -d -p 3000:3000 minha-app

# Listar containers em execução
docker ps

# Parar um container
docker stop <container_id>

# Buscar imagem no Docker Hub
docker pull node:20-alpine
```

## Visualizando o isolamento (namespaces)

```bash
# Dentro do Container 1 — só vê seus processos
docker exec container1 ps aux
# PID 1: node server.js
# PID 2: ...

# Dentro do Container 2 — só vê seus processos (isolado)
docker exec container2 ps aux
# PID 1: python app.py
# PID 2: ...

# Container 1 não sabe que Container 2 existe
```

## Visualizando controle de recursos (cgroups)

```bash
# Limitar memória de um container (cgroups em ação)
docker run -d --memory=512m --cpus=1 minha-app

# Sem limite, um container poderia monopolizar o host
docker run -d minha-app  # usa recursos sem restrição
```

## Comparação: VM vs Container

```bash
# VM: precisa instalar SO completo (~2-10 GB por VM)
# Tempo de boot: minutos

# Container: compartilha kernel (~50-200 MB por container)
# Tempo de boot: segundos
docker run -d minha-app  # inicia em segundos
```

## Docker Hub — imagens oficiais

```bash
# Imagens oficiais mencionadas no conceito de Docker Hub
docker pull node:20-alpine    # Node.js
docker pull postgres:16       # PostgreSQL
docker pull nginx:alpine      # Nginx
docker pull ubuntu:22.04      # Ubuntu base

# Imagens da comunidade
docker pull bitnami/redis     # Redis pela Bitnami
```