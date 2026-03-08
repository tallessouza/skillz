---
name: rs-devops-persistindo-informacoes-nos-volumes
description: "Applies Docker volume patterns when configuring data persistence for containers. Use when user asks to 'persist data in docker', 'mount volume', 'keep data after container restart', 'configure docker-compose volumes', or 'backup container data'. Enforces named volumes over anonymous and volume verification with docker inspect. Make sure to use this skill whenever running stateful containers with Docker. Not for Kubernetes storage, application code, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-volumes
  tags: [docker, volumes, persistence, mount, container, data, stateful]
---

# Persistencia de Dados com Docker Volumes

> Sempre associe um volume ao executar containers que precisam persistir dados — o filesystem do container e efemero por definicao.

## Rules

1. **Sempre use `-v` ou `--mount` para dados persistentes** — `docker run -v meu-volume:/app/data`, porque sem volume os arquivos existem apenas enquanto o container roda com aquela configuracao
2. **Volume sobrevive ao container** — deletar ou recriar o container nao apaga o volume, porque volumes sao entidades independentes no Docker
3. **Sem volume = dados perdidos** — rodar `docker run` sem `-v` para um container que tinha volume significa que os arquivos do volume nao estarao acessiveis, porque o novo container nao sabe do volume anterior
4. **Verifique montagens com inspect** — `docker inspect <container>` mostra a secao `Mounts` confirmando se o volume esta associado, porque erros silenciosos de montagem sao comuns
5. **Volume persiste apos delete de arquivos internos** — mesmo deletando arquivos dentro do container, o volume mantem os dados para futuros containers que o referenciarem

## How to write

### Container com volume

```bash
# Criar volume
docker volume create app-data

# Rodar container COM volume — dados persistem
docker run -d -v app-data:/app/src -p 3000:3000 minha-imagem:v3

# Verificar que o volume esta montado
docker inspect <container-id> | grep -A 10 "Mounts"
```

### Container SEM volume (dados efemeros)

```bash
# Rodar container SEM volume — dados vivem apenas neste container
docker run -d -p 3000:3000 minha-imagem:v3

# Arquivos criados aqui desaparecem quando o container e removido
```

### Ciclo completo: criar, verificar, persistir

```bash
# 1. Entrar no container e criar arquivo
docker exec -it <container-id> bash
touch src/file.log
exit

# 2. Parar e recriar container COM mesmo volume
docker stop <container-id>
docker run -d -v app-data:/app/src -p 3000:3000 minha-imagem:v3

# 3. Verificar — arquivo continua existindo
docker exec -it <novo-container-id> bash
ls src/  # file.log esta aqui
```

## Example

**Before (dados perdidos ao recriar container):**

```bash
docker run -d -p 3000:3000 api-skillz:v3
docker exec -it abc123 bash
touch src/file.log    # criou arquivo
exit
docker stop abc123
docker run -d -p 3000:3000 api-skillz:v3   # SEM -v
docker exec -it def456 bash
ls src/               # file.log NAO existe
```

**After (dados persistem com volume):**

```bash
docker run -d -v app-volume:/app/src -p 3000:3000 api-skillz:v3
docker exec -it abc123 bash
touch src/file.log    # criou arquivo
exit
docker stop abc123
docker run -d -v app-volume:/app/src -p 3000:3000 api-skillz:v3  # COM -v
docker exec -it def456 bash
ls src/               # file.log EXISTE
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Banco de dados (Postgres, MySQL, Redis) | Sempre monte volume no datadir |
| Aplicacao stateless (API pura) | Volume opcional, apenas para logs se necessario |
| Ambiente de desenvolvimento local | Volume para hot-reload do codigo |
| Recriando container de producao | Sempre referenciar o mesmo volume nomeado |
| Debugging — arquivo sumiu | `docker inspect` para verificar se volume esta montado |
| Volume existe mas container nao ve | Verificar se `docker run` inclui `-v` apontando para ele |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `docker run -d app` (stateful sem volume) | `docker run -d -v data:/app/data app` |
| Confiar que arquivos sobrevivem sem volume | Sempre montar volume para dados importantes |
| `docker volume rm` sem backup | `docker run --rm -v vol:/data -v $(pwd):/backup alpine tar czf /backup/vol.tar.gz /data` |
| Recriar container esquecendo o `-v` | Documentar o comando completo com volume no docker-compose |
| Usar volumes anonimos para dados criticos | Usar volumes nomeados: `-v nome-explicito:/path` |

## Troubleshooting

### Dados desaparecem ao recriar container mesmo com volume
**Symptom:** Arquivos criados no container nao persistem apos `docker stop` e `docker run`
**Cause:** Esqueceu de passar `-v volume-name:/path` ao recriar o container — o volume existe mas nao esta montado
**Fix:** Sempre incluir `-v` no comando `docker run` referenciando o mesmo volume nomeado; usar `docker inspect` para confirmar montagem

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Persistencia de Dados com Docker Volumes

## O modelo mental do instrutor

O instrutor demonstra um conceito fundamental que muitos iniciantes em Docker nao compreendem intuitivamente: **o filesystem de um container e efemero**. Quando voce cria um arquivo dentro de um container, esse arquivo vive apenas naquele contexto de execucao. A unica forma de garantir persistencia e atraves de volumes.

## A analogia implicita: volume como HD externo

O volume funciona como um HD externo conectado ao container. Voce pode:
- Desconectar o HD (parar o container sem `-v`)
- Destruir o computador (deletar o container)
- Comprar um computador novo (criar novo container)
- Reconectar o HD (rodar `docker run -v`) e todos os arquivos estarao la

## O experimento demonstrado na aula

O instrutor faz um experimento em 4 etapas para provar o comportamento:

### Etapa 1: Criar arquivo com volume
```bash
docker exec -it <container> bash
touch src/file.log
exit
```
Resultado: arquivo criado dentro do container que tem volume montado.

### Etapa 2: Parar e recriar container COM volume
```bash
docker stop <container>
docker run -v app-volume:/app/src ...
docker exec -it <novo-container> bash
ls src/  # file.log EXISTE
```
Resultado: arquivo persiste porque o volume mantem os dados.

### Etapa 3: Recriar container SEM volume
```bash
docker stop <container>
docker run ...  # sem -v
docker exec -it <novo-container> bash
ls src/  # file.log NAO EXISTE
```
Resultado: arquivo desaparece porque o novo container nao referencia o volume.

### Etapa 4: Volume continua existindo
```bash
docker volume inspect <volume-name>
```
Resultado: mesmo sem nenhum container usando, o volume e seus dados continuam existindo. Se voce criar um novo container apontando para esse volume, o `file.log` volta a aparecer.

## Insight critico: volume != container

O ponto mais importante da aula e que **volumes e containers tem ciclos de vida independentes**:

- Deletar container → volume continua
- Deletar arquivos no container → volume mantem (se o arquivo estava no volume)
- Rodar container sem `-v` → volume existe mas nao esta acessivel
- Rodar container com `-v` novamente → dados voltam a aparecer

## Contexto futuro mencionado

O instrutor menciona que no modulo de orquestracao (modulo 4), volumes serao usados para:
- Rodar bancos de dados com dados persistentes
- Workflows com commit → build → container
- Cenarios mais proximos de producao

## Erro comum que o instrutor destaca

O erro mais perigoso e **esquecer o `-v` ao recriar um container**. Os dados nao sao perdidos (o volume existe), mas o container nao consegue ve-los. Isso causa confusao porque parece que os dados sumiram, quando na verdade so nao estao montados.

## Tags de imagem e ambiente local

O instrutor explica por que sempre usa a mesma tag (`:v3`): no ambiente local, sem pipeline de CI/CD, nao ha rebuild automatico. No dia a dia com pipeline, cada commit gera um build e uma nova tag. Isso e relevante porque em producao, ao atualizar a imagem, o volume deve ser preservado entre versoes.

---

# Code Examples: Persistencia de Dados com Docker Volumes

## Exemplo 1: Fluxo completo da aula

### Passo 1 — Verificar container rodando
```bash
docker ps
# CONTAINER ID   IMAGE           STATUS          PORTS
# def123abc      api-skillz:v3   Up 5 minutes    0.0.0.0:3000->3000/tcp
```

### Passo 2 — Entrar no container
```bash
docker exec -it def123abc bash
```

### Passo 3 — Listar arquivos e criar novo
```bash
ls src/
# index.js  package.json  node_modules/

touch src/file.log

ls src/
# index.js  package.json  node_modules/  file.log
```

### Passo 4 — Sair, parar e recriar com volume
```bash
exit
docker stop def123abc
docker run -d -v meu-volume:/app/src --network minha-rede -p 3000:3000 api-skillz:v3
```

### Passo 5 — Verificar persistencia
```bash
docker exec -it <novo-id> bash
ls src/
# index.js  package.json  node_modules/  file.log  ← PERSISTIU
cat src/file.log
# (vazio, porque so fizemos touch)
```

## Exemplo 2: Recriar SEM volume (dados inacessiveis)

```bash
# Parar container atual
docker stop <container-id>

# Rodar SEM -v
docker run -d --network minha-rede -p 3000:3000 api-skillz:v3

# Verificar — sem volume montado
docker inspect <novo-id> | grep -A 10 "Mounts"
# "Mounts": []   ← VAZIO

# Entrar e verificar
docker exec -it <novo-id> bash
ls src/
# index.js  package.json  node_modules/   ← SEM file.log
```

## Exemplo 3: Volume continua existindo independentemente

```bash
# Mesmo sem container usando, o volume existe
docker volume inspect meu-volume
# [
#     {
#         "CreatedAt": "2024-01-15T10:30:00Z",
#         "Driver": "local",
#         "Labels": {},
#         "Mountpoint": "/var/lib/docker/volumes/meu-volume/_data",
#         "Name": "meu-volume",
#         "Options": {},
#         "Scope": "local"
#     }
# ]

# Reassociar — dados voltam
docker run -d -v meu-volume:/app/src -p 3000:3000 api-skillz:v3
docker exec -it <id> bash
ls src/
# file.log EXISTE novamente
```

## Exemplo 4: Aplicacao pratica — banco de dados

```bash
# Criar volume nomeado para PostgreSQL
docker volume create postgres-data

# Rodar Postgres COM volume
docker run -d \
  --name meu-postgres \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=senha123 \
  -p 5432:5432 \
  postgres:15

# Mesmo deletando o container, os dados do banco persistem
docker rm -f meu-postgres

# Recriar — banco com todos os dados intactos
docker run -d \
  --name meu-postgres \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=senha123 \
  -p 5432:5432 \
  postgres:15
```

## Exemplo 5: docker-compose com volumes (padrao recomendado)

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    image: api-skillz:v3
    ports:
      - "3000:3000"
    volumes:
      - app-data:/app/src
    networks:
      - app-network

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: senha123
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  app-data:      # volume nomeado — persiste entre docker-compose down/up
  postgres-data:  # volume nomeado — dados do banco seguros

networks:
  app-network:
```

```bash
# Subir
docker-compose up -d

# Derrubar (volumes preservados)
docker-compose down

# Derrubar E deletar volumes (CUIDADO — perda de dados)
docker-compose down -v
```

## Comandos uteis para debug de volumes

```bash
# Listar todos os volumes
docker volume ls

# Inspecionar volume especifico
docker volume inspect <nome-do-volume>

# Ver quais containers usam um volume
docker ps -a --filter volume=<nome-do-volume>

# Remover volumes orfaos (sem container associado)
docker volume prune

# Remover volume especifico
docker volume rm <nome-do-volume>

# Backup de volume para arquivo tar
docker run --rm -v <volume>:/data -v $(pwd):/backup alpine \
  tar czf /backup/volume-backup.tar.gz -C /data .

# Restaurar volume de backup
docker run --rm -v <volume>:/data -v $(pwd):/backup alpine \
  tar xzf /backup/volume-backup.tar.gz -C /data
```
