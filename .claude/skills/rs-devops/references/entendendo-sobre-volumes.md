---
name: rs-devops-entendendo-sobre-volumes
description: "Applies Docker volume creation, mounting, and lifecycle management patterns. Use when user asks to 'create Docker volume', 'persist data in containers', 'mount volume to container', or 'manage Docker volumes'. Enforces volume usage for persistence, name-based identification, mounting at workdir, and local driver defaults. Make sure to use this skill whenever creating or managing Docker volumes for data persistence. Not for Kubernetes PersistentVolumes (use persistent-volume) or Docker Compose volume declarations."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-volumes
  tags: [docker, volumes, persistence, mount, containers, stateful, data]
---

# Docker Volumes — Persistencia de Dados em Containers

> Volumes sao diretorios externos ao container que garantem persistencia de dados entre reinicializacoes.

## Rules

1. **Containers sao efemeros por padrao** — dados criados dentro desaparecem ao restartar
2. **Volume nao e obrigatorio** — so use quando precisa persistir dados
3. **Volume nao tem ID** — a unicidade e pelo nome
4. **Monte o volume no workdir do container** — apontar para o diretorio de trabalho do Dockerfile
5. **Driver local por padrao** — armazena em `/var/lib/docker/volumes/{nome}/_data`

## How to write

```bash
# Criar volume
docker volume create primeiro-volume

# Associar ao container
docker run \
  -v primeiro-volume:/src/app \
  --network primeira-network \
  -p 3001:3001 \
  -d \
  api-skillz:v3

# Inspecionar
docker volume inspect primeiro-volume

# Limpar orfaos
docker volume prune
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Container precisa salvar uploads | Crie volume e monte no diretorio de uploads |
| Banco de dados em container | Volume obrigatorio no datadir do banco |
| Container stateless (API pura) | Nao precisa de volume |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Salvar dados importantes sem volume | Sempre associar volume |
| Montar volume em diretorio arbitrario | Montar no WORKDIR do Dockerfile |
| Referenciar volume por ID | Referenciar pelo nome |

## Troubleshooting

### Dados desaparecem ao restartar o container
**Symptom:** Container reinicia e todos os dados salvos anteriormente sumiram
**Cause:** Dados foram salvos dentro do filesystem do container sem volume montado
**Fix:** Criar volume com `docker volume create meu-volume` e montar no container com `-v meu-volume:/path/dados`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
