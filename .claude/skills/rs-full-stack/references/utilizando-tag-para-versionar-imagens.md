---
name: rs-full-stack-docker-image-tags
description: "Applies Docker image tagging conventions when building and running containers. Use when user asks to 'build a docker image', 'version a container', 'tag an image', 'run a specific version', or 'manage docker images'. Enforces semantic tag naming, explicit version references in docker run, and proper cleanup of tagged images. Make sure to use this skill whenever working with Dockerfiles or docker-compose builds. Not for Dockerfile syntax, multi-stage builds, or container orchestration (Kubernetes/Swarm)."
---

# Versionamento de Imagens Docker com Tags

> Sempre versione imagens Docker com tags explicitas — nunca dependa de `latest` implicito.

## Rules

1. **Use dois pontos para separar nome e tag** — `docker build -t api:v1 .` nao `docker build -t api .`, porque sem tag o Docker assume `latest` e voce perde rastreabilidade
2. **Nomeie tags semanticamente** — `v1`, `v2`, `1.0.0`, `staging`, porque tags descrevem o estado da imagem naquele momento
3. **Sempre especifique a tag no docker run** — `docker run api:v2` nao `docker run api`, porque garante que voce executa a versao correta
4. **Imagens com mesmo Dockerfile geram mesmo ID** — tags diferentes podem apontar para o mesmo image ID, porque a tag e apenas um rotulo sobre o conteudo
5. **Deletar por ID remove todas as tags associadas** — use `docker rmi -f <id>` com cuidado, porque apaga todas as versoes que compartilham aquele ID
6. **Force remove com `-f` quando necessario** — `docker rm -f <container>` para containers em execucao, `docker rmi -f <id>` para imagens com multiplas tags

## How to write

### Build com tag

```bash
# Sempre inclua a tag na build
docker build -t api:v1 .
docker build -t api:v2 .
```

### Run com versao especifica

```bash
# Especifique a versao ao criar o container
docker run -d -p 3000:3000 api:v2
```

### Listar e verificar tags

```bash
# Verificar imagens e suas tags
docker image ls
# Output: REPOSITORY  TAG  IMAGE ID
#         api         v1   abc123
#         api         v2   abc123
```

### Cleanup completo

```bash
# Parar container
docker stop <container_id>

# Remover container (force se necessario)
docker rm -f <container_id>

# Remover imagem (remove todas as tags com mesmo ID)
docker rmi -f <image_id>
```

## Example

**Before (sem tags — perigoso):**
```bash
docker build -t api .
docker run -d -p 3000:3000 api
# Qual versao esta rodando? Impossivel saber.
```

**After (com tags — rastreavel):**
```bash
docker build -t api:v1 .
docker build -t api:v2 .
docker run -d -p 3000:3000 api:v2
# docker ps mostra claramente: api:v2
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Desenvolvimento local | Tags simples: `v1`, `v2`, `dev` |
| CI/CD pipeline | Tags com semver: `1.0.0`, `1.0.1` |
| Multiplos ambientes | Tags por ambiente: `staging`, `production` |
| Mesmo Dockerfile sem mudancas | Mesma tag — o ID sera identico |
| Precisa trocar versao do container | Stop + rm container antigo, run com nova tag |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `docker build -t api .` | `docker build -t api:v1 .` |
| `docker run api` | `docker run api:v2` |
| `docker rm <id>` (container rodando) | `docker rm -f <id>` |
| Deletar tags individualmente com mesmo ID | `docker rmi -f <id>` (remove todas) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre tags, IDs compartilhados e lifecycle de imagens
- [code-examples.md](references/code-examples.md) — Todos os comandos Docker expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-utilizando-tag-para-versionar-imagens/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-utilizando-tag-para-versionar-imagens/references/code-examples.md)
