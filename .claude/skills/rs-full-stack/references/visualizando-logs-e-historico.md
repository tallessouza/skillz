---
name: rs-full-stack-visualizando-logs-e-historico
description: "Applies Docker logs and history inspection commands when debugging containers or analyzing image layers. Use when user asks to 'check container logs', 'view docker logs', 'inspect image history', 'debug container', or 'analyze image layers'. Make sure to use this skill whenever troubleshooting Docker containers or investigating image composition. Not for building Dockerfiles, docker-compose, or container orchestration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker
  tags: [docker, logs, history, debugging, containers, image-layers]
---

# Visualizando Logs e Histórico no Docker

> Utilize `docker logs` para diagnosticar containers em execução e `docker history` para inspecionar a composição de camadas de uma imagem.

## Rules

1. **Sempre identifique o container antes de inspecionar** — execute `docker ps` para obter o ID ou nome, porque logs sem o ID correto falham silenciosamente
2. **Use `docker logs` para output da aplicação** — mostra stdout/stderr do processo principal do container, porque é equivalente ao console.log/print da aplicação
3. **Use `docker history` com o nome da imagem, não do container** — porque history opera sobre imagens (layers), não sobre containers em execução
4. **Analise o tamanho de cada layer** — a coluna SIZE do history revela qual instrução Dockerfile mais impacta o tamanho final, porque otimizar imagens começa por identificar layers grandes

## Steps

### Step 1: Listar containers em execução

```bash
docker ps
```

Copie o CONTAINER ID ou NAME do container alvo.

### Step 2: Visualizar logs do container

```bash
docker logs <container_id>
```

Variações úteis:

```bash
# Seguir logs em tempo real (como tail -f)
docker logs -f <container_id>

# Últimas 50 linhas
docker logs --tail 50 <container_id>

# Logs com timestamp
docker logs -t <container_id>
```

### Step 3: Visualizar histórico da imagem

```bash
docker history <nome_da_imagem>
```

Mostra para cada layer: data de criação, comando executado, e tamanho.

```bash
# Sem truncar comandos longos
docker history --no-trunc <nome_da_imagem>
```

## Output format

**docker logs** retorna o stdout/stderr do processo principal — no exemplo, o `console.log` do server.ts indicando a porta.

**docker history** retorna uma tabela com colunas: IMAGE, CREATED, CREATED BY, SIZE, COMMENT — mostrando cada instrução do Dockerfile (EXPOSE, RUN, COPY, WORKDIR) e seu impacto no tamanho.

## Heuristics

| Situação | Faça |
|----------|------|
| Aplicação não responde | `docker logs <id>` para verificar erros de startup |
| Imagem muito grande | `docker history <imagem>` para identificar layers pesadas |
| Precisa monitorar em tempo real | `docker logs -f <id>` |
| Quer ver apenas erros recentes | `docker logs --tail 20 <id>` |

## Anti-patterns

| Nunca faça | Faça isso |
|------------|-----------|
| `docker logs <nome_da_imagem>` | `docker logs <container_id>` — logs são de containers |
| `docker history <container_id>` | `docker history <nome_da_imagem>` — history é de imagens |
| Ignorar a coluna SIZE do history | Analisar SIZE para otimizar Dockerfile |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `Error: No such container` | Container ID ou nome incorreto | Execute `docker ps -a` para listar todos os containers |
| Logs vazios | Aplicacao nao escreve em stdout/stderr | Verifique se a aplicacao usa `console.log` ou redireciona output |
| `docker history` mostra `<missing>` | Layers intermediarias de imagem base | Normal — imagens multi-stage ou base nao mantem IDs intermediarios |
| Logs muito extensos | Container rodando ha muito tempo | Use `--tail 50` para limitar ou `--since 1h` para filtrar por tempo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar cada comando e como interpretar outputs
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-visualizando-logs-e-historico/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-visualizando-logs-e-historico/references/code-examples.md)
