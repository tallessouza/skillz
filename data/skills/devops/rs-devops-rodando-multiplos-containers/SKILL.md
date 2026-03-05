---
name: rs-devops-rodando-multiplos-containers
description: "Enforces correct multi-container Docker networking when writing docker run commands, Dockerfiles, or container orchestration scripts. Use when user asks to 'connect containers', 'run multiple containers', 'docker networking', 'container communication', or 'fix database connection in Docker'. Applies rules: named containers for DNS resolution, shared custom networks, host references by container name not localhost, startup order awareness. Make sure to use this skill whenever configuring inter-container communication. Not for Docker Compose, Kubernetes, or single-container setups."
---

# Rodando Multiplos Containers

> Containers na mesma rede custom se comunicam pelo nome do container, nunca por localhost.

## Rules

1. **Sempre nomeie containers** — use `--name mysql` porque o nome vira o hostname DNS na rede, sem nome nao ha como referenciar o container
2. **Nunca use localhost entre containers** — substitua `localhost` pelo nome do container (ex: `mysql`), porque cada container tem seu proprio namespace de rede isolado
3. **Use rede custom compartilhada** — ambos containers devem estar na mesma rede custom (`--network minha-rede`), porque a rede bridge default nao resolve nomes DNS
4. **Verifique a rede antes de debugar a app** — use `docker network inspect` para confirmar que ambos containers estao na mesma rede, porque 90% dos erros de conexao sao rede errada
5. **Suba dependencias antes da aplicacao** — MySQL demora para inicializar, se a app subir antes vai falhar com connection refused
6. **Use `docker ps -a` ou `docker ps -l` para containers que sumiram** — containers que crasham no start desaparecem do `docker ps` normal

## How to write

### Criar rede e subir containers conectados

```bash
# 1. Criar rede custom
docker network create minha-rede

# 2. Subir banco COM nome e NA rede
docker run -d --name mysql --network minha-rede \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=mydb \
  mysql:8

# 3. Aguardar banco inicializar, depois subir app NA MESMA rede
docker run -d --network minha-rede \
  -p 3001:3000 \
  minha-app:v1
```

### Configuracao de conexao na aplicacao

```typescript
// O host eh o NOME do container, nao localhost
const dbConfig = {
  host: 'mysql',      // nome do container
  port: 3306,
  database: 'mydb',
  username: 'root',
  password: 'root',
}
```

## Example

**Before (erro comum — localhost entre containers):**
```
DATABASE_URL=mysql://root:root@localhost:3306/mydb
```
Container sobe, tenta conectar em localhost (ele mesmo), falha: `Unable to connect to the database`.

**After (nome do container como host):**
```
DATABASE_URL=mysql://root:root@mysql:3306/mydb
```
Container resolve `mysql` via DNS da rede custom, conexao funciona.

## Heuristics

| Situacao | Acao |
|----------|------|
| Container sumiu do `docker ps` | Rodar `docker ps -a` ou `docker ps -l`, depois `docker logs <id>` |
| `ENOTFOUND` ou `getaddrinfo failed` | Containers estao em redes diferentes — verificar com `docker network inspect` |
| `Connection refused` no start | Dependencia ainda nao inicializou — aguardar ou implementar retry |
| Precisa mover container para outra rede | `docker stop` + `docker rm` + `docker run` com `--network` correto |
| Quer confirmar qual rede o container esta | `docker container inspect <id>` e verificar campo Networks |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `host: 'localhost'` entre containers | `host: 'mysql'` (nome do container) |
| Rodar containers sem `--network` compartilhado | `--network minha-rede` em ambos |
| Rodar container sem `--name` | `--name mysql` para criar DNS resolvivel |
| Debugar app sem checar rede | `docker network inspect minha-rede` primeiro |
| Ignorar container que sumiu | `docker ps -l` + `docker logs` para diagnosticar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
