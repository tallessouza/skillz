# Code Examples: Versionamento de Imagens Docker com Tags

## Exemplo 1: Build basico com tag

```bash
# Contexto: diretorio com Dockerfile configurado
# Comando: criar imagem com nome "api" e tag "v1"
docker build -t api:v1 .

# O ponto (.) indica o contexto de build — diretorio atual com Dockerfile
```

## Exemplo 2: Multiplas versoes da mesma imagem

```bash
# Criar v1
docker build -t api:v1 .

# Criar v2 (mesmo Dockerfile, sem mudancas)
docker build -t api:v2 .

# Listar imagens
docker image ls
# REPOSITORY   TAG   IMAGE ID       CREATED        SIZE
# api          v2    abc123def456   2 minutes ago  150MB
# api          v1    abc123def456   3 minutes ago  150MB
#
# Note: mesmo IMAGE ID porque o conteudo e identico
```

## Exemplo 3: Executar container com versao especifica

```bash
# Rodar api:v2 em background, mapeando porta 3000
docker run -d -p 3000:3000 api:v2

# Verificar container rodando
docker ps
# CONTAINER ID   IMAGE     COMMAND        STATUS         PORTS
# 7f8a9b2c3d    api:v2    "node ..."     Up 10 seconds  0.0.0.0:3000->3000/tcp
```

## Exemplo 4: Parar e remover container

```bash
# Metodo 1: parar e depois remover
docker stop 7f8a9b2c3d
docker rm 7f8a9b2c3d

# Metodo 2: force remove (container rodando)
docker rm -f 7f8a9b2c3d

# Verificar que nao ha containers
docker ps        # containers ativos
docker ps -a     # todos (incluindo parados)
```

## Exemplo 5: Remover imagens com tags compartilhando ID

```bash
# Ver imagens
docker image ls
# api   v1   abc123
# api   v2   abc123   (mesmo ID)

# Remover por ID — remove TODAS as tags
docker rmi -f abc123

# Resultado
docker image ls
# (vazio — ambas removidas)
```

## Exemplo 6: Variacoes de nomes de tag

```bash
# Versoes simples
docker build -t api:v1 .
docker build -t api:v2 .

# Semantic versioning
docker build -t api:1.0.0 .
docker build -t api:1.1.0 .

# Ambientes
docker build -t api:staging .
docker build -t api:production .

# Com hash do commit (CI/CD)
docker build -t api:abc123f .

# Multiplas tags para mesma build
docker build -t api:v2 -t api:latest .
```

## Exemplo 7: Workflow completo

```bash
# 1. Garantir ambiente limpo
docker ps -a          # verificar containers
docker image ls       # verificar imagens

# 2. Build com tag
docker build -t api:v1 .

# 3. Rodar
docker run -d -p 3000:3000 api:v1

# 4. Testar
curl http://localhost:3000

# 5. Fazer mudancas no codigo...

# 6. Build nova versao
docker build -t api:v2 .

# 7. Trocar versao: parar v1, rodar v2
docker rm -f $(docker ps -q)
docker run -d -p 3000:3000 api:v2

# 8. Cleanup total
docker rm -f $(docker ps -q)
docker rmi -f $(docker image ls -q)
```