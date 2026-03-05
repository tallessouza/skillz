---
name: rs-devops-entendendo-sobre-volumes
description: "Applies Docker volume concepts when creating persistent storage for containers. Use when user asks to 'create a volume', 'persist data in docker', 'mount volume', 'docker run with volume', or 'keep data between restarts'. Covers volume creation, inspection, association with containers via -v flag, and mount points. Make sure to use this skill whenever working with Docker data persistence or container storage. Not for Kubernetes persistent volumes, docker-compose volume definitions, or cloud storage drivers."
---

# Docker Volumes — Persistencia de Dados em Containers

> Volumes sao diretorios externos ao container que garantem persistencia de dados entre reinicializacoes.

## Rules

1. **Containers sao efemeros por padrao** — dados criados dentro do container desaparecem ao restartar, porque o comportamento padrao e de efemeridade
2. **Volume nao e obrigatorio** — so use quando precisa persistir dados: uploads, logs, arquivos de banco de dados
3. **Volume nao tem ID** — a unicidade e pelo nome, diferente de containers, images e networks que possuem IDs
4. **Monte o volume no workdir do container** — o destino do `-v` deve apontar para o diretorio de trabalho definido no Dockerfile, porque e ali que o container opera
5. **Driver local por padrao** — armazena em `/var/lib/docker/volumes/{nome}/_data`; drivers remotos (cloud/bucket) sao configuracao adicional
6. **`-v` nao tem equivalente `-n`** — `--volume` ou `-v` funciona, mas `--network` nao tem abreviacao `-n`

## How to write

### Criar e inspecionar volume

```bash
# Criar volume nomeado
docker volume create primeiro-volume

# Inspecionar (mostra driver, mountpoint)
docker volume inspect primeiro-volume

# Listar todos
docker volume ls

# Remover volumes nao utilizados
docker volume prune
```

### Associar volume ao container

```bash
docker run \
  -v primeiro-volume:/src/app \
  --network primeira-network \
  -p 3001:3001 \
  -d \
  api-skillz:v3
```

### Verificar bind no container

```bash
# Inspect do container mostra Mounts com source e destination
docker container inspect <container_id>
```

## Example

**Before (sem volume — dados perdidos ao restartar):**

```bash
docker run -d --network minha-rede -p 3001:3001 api-skillz:v3
# Cria arquivo dentro do container
docker exec <id> touch /src/app/upload.txt
# Restarta container
docker restart <id>
# upload.txt desapareceu!
```

**After (com volume — dados persistentes):**

```bash
docker volume create app-data
docker run -d \
  -v app-data:/src/app \
  --network minha-rede \
  -p 3001:3001 \
  api-skillz:v3
# Cria arquivo
docker exec <id> touch /src/app/upload.txt
# Restarta container
docker restart <id>
# upload.txt continua la!
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Container precisa salvar uploads/assets | Crie volume e monte no diretorio de uploads |
| Banco de dados em container | Volume obrigatorio no datadir do banco |
| Container stateless (API pura) | Nao precisa de volume |
| Precisa inspecionar volume | `docker volume inspect` ou `docker inspect` direto |
| Comando `docker run` ficando grande | Anote que docker-compose resolve isso (proximo passo) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Salvar dados importantes sem volume | Sempre associar volume para dados persistentes |
| Montar volume em diretorio arbitrario | Montar no WORKDIR definido no Dockerfile |
| Referenciar volume por ID | Referenciar pelo nome (volumes nao tem ID) |
| Usar `-n` como abreviacao de `--network` | Usar `--network` por extenso |
| Ignorar `docker volume prune` | Limpar volumes orfaos periodicamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
