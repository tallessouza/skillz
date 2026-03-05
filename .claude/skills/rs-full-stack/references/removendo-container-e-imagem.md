---
name: rs-full-stack-removendo-container-e-imagem
description: "Applies correct Docker container and image removal commands and sequences. Use when user asks to 'remove container', 'delete image', 'clean up docker', 'docker rm', 'force remove', or any Docker cleanup task. Enforces stop-before-remove pattern and force flag usage. Make sure to use this skill whenever removing Docker resources. Not for building images, running containers, or Docker Compose operations."
---

# Removendo Container e Imagem no Docker

> Antes de remover um container, pare-o primeiro — ou force a remocao explicitamente.

## Rules

1. **Pare antes de remover** — `docker stop` antes de `docker rm`, porque Docker bloqueia remocao de containers em execucao
2. **Use `-f` para forcar** — `docker rm -f` combina stop+remove em um comando, porque evita o passo intermediario quando voce tem certeza
3. **Remocao de imagem usa comando diferente** — `docker image rm`, nao `docker rm`, porque sao recursos distintos no Docker
4. **Identifique pelo ID ou nome** — sempre passe o container/image ID como argumento, porque Docker precisa saber qual recurso remover
5. **Verifique apos remover** — execute `docker ps -a` e `docker image ls` apos remocao, porque confirma que o ambiente esta limpo

## Steps

### Step 1: Verificar containers em execucao

```bash
docker ps
```

### Step 2: Remover container (duas opcoes)

**Opcao A — Parar e depois remover:**

```bash
docker stop <container_id>
docker rm <container_id>
```

**Opcao B — Forcar remocao direta:**

```bash
docker rm -f <container_id>
```

### Step 3: Remover imagem

```bash
docker image rm <image_id>
```

### Step 4: Verificar ambiente limpo

```bash
docker ps -a
docker image ls
```

## Example

**Cenario: container em execucao que precisa ser removido**

```bash
# Ver o que esta rodando
$ docker ps
CONTAINER ID   IMAGE     STATUS
abc123         myapp     Up 5 minutes

# Tentativa direta falha:
$ docker rm abc123
# Error: cannot remove running container — stop first or use -f

# Opcao 1: stop + rm
$ docker stop abc123
$ docker rm abc123

# Opcao 2: force
$ docker rm -f abc123

# Remover a imagem tambem
$ docker image ls
REPOSITORY   TAG       IMAGE ID
myapp        latest    def456

$ docker image rm def456

# Confirmar limpeza
$ docker ps -a       # nenhum container
$ docker image ls    # nenhuma imagem
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Container em execucao | `docker stop` + `docker rm` ou `docker rm -f` |
| Container ja parado (status Exited) | `docker rm` direto |
| Remover imagem | `docker image rm <id>` |
| Limpeza completa do ambiente | Remova containers primeiro, depois imagens |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `docker rm` em container rodando sem `-f` | `docker stop` + `docker rm` ou `docker rm -f` |
| `docker rm` para remover imagem | `docker image rm` |
| Remover sem verificar depois | Sempre `docker ps -a` + `docker image ls` apos limpeza |
| Remover imagem antes dos containers que a usam | Remova containers primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ciclo de vida de containers e por que Docker bloqueia remocao
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes e cenarios reais

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-removendo-container-e-imagem/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-removendo-container-e-imagem/references/code-examples.md)
