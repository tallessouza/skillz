---
name: rs-full-stack-removendo-volumes
description: "Applies Docker volume removal procedures when managing containers and volumes. Use when user asks to 'remove volume', 'delete docker volume', 'clean up volumes', 'prune containers', or 'free disk space in docker'. Covers listing, removing individual volumes, handling in-use errors, and batch cleanup with prune. Make sure to use this skill whenever dealing with Docker volume lifecycle management. Not for creating volumes, configuring volume mounts, or Docker Compose volume definitions."
---

# Removendo Volumes no Docker

> Antes de remover um volume, remova ou pare todos os containers vinculados a ele.

## Rules

1. **Sempre liste antes de remover** — execute `docker volume ls` antes de qualquer remoção, porque volumes órfãos são invisíveis sem listagem explícita
2. **Volumes em uso não podem ser removidos** — Docker bloqueia `docker volume rm` se houver containers (mesmo parados) vinculados, porque protege contra perda de dados
3. **Containers parados ainda bloqueiam** — parar um container com `docker stop` não libera o volume; o container precisa ser removido, porque o vínculo persiste até a remoção do container
4. **Use prune para limpeza em lote** — `docker container prune` remove todos os containers parados de uma vez, porque remover um a um é impraticável em ambientes com muitos containers
5. **Volumes e containers são entidades separadas** — remover containers não remove volumes automaticamente, porque Docker trata persistência de dados como responsabilidade explícita do usuário

## Steps

### Step 1: Listar volumes existentes
```bash
docker volume ls
```

### Step 2: Tentar remover o volume
```bash
docker volume rm <nome-do-volume>
```
Se retornar erro de "volume is in use": prossiga para Step 3.

### Step 3: Identificar containers vinculados
```bash
docker ps        # containers em execução
docker ps -a     # todos os containers (incluindo parados)
```

### Step 4: Parar containers em execução
```bash
docker stop <container-id>
```

### Step 5: Remover containers parados
```bash
# Individual:
docker rm <container-id>

# Em lote (todos os parados):
docker container prune
# Confirme com 'y' quando solicitado
```

### Step 6: Remover o volume
```bash
docker volume rm <nome-do-volume>
```

### Step 7: Verificar remoção
```bash
docker volume ls
```

## Output format

Após execução bem-sucedida, `docker volume ls` não deve mais listar o volume removido.

## Error handling

- Se `docker volume rm` falha com "volume in use" → execute `docker ps -a` para encontrar containers vinculados, remova-os primeiro
- Se `docker container prune` remove containers que não deveria → use `docker rm <id>` individual para controle granular
- Se volume persiste após remover containers → verifique se há containers em outros networks ou compose stacks

## Heuristics

| Situação | Faça |
|----------|------|
| Volume único para remover | `docker stop` + `docker rm` nos containers, depois `docker volume rm` |
| Muitos containers parados | `docker container prune` de uma vez |
| Limpeza geral de volumes | `docker volume prune` (remove todos os volumes não utilizados) |
| Volume compartilhado entre containers | Remova todos os containers vinculados antes |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Tentar `docker volume rm` sem verificar containers | `docker ps -a` primeiro para identificar vínculos |
| Assumir que `docker stop` libera o volume | `docker rm` no container após o stop |
| Remover containers um a um quando há muitos | `docker container prune` para limpeza em lote |
| Assumir que remover container remove o volume | `docker volume rm` explicitamente após remover containers |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação containers/volumes e cenários de bloqueio
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variações e outputs esperados

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-removendo-volumes/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-removendo-volumes/references/code-examples.md)
