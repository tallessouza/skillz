---
name: rs-devops-minio-bucket-docker
description: "Applies MinIO bucket creation patterns in Docker Compose environments. Use when user asks to 'configure MinIO', 'create buckets in Docker', 'setup object storage container', 'MinIO health check', or 'Docker entrypoint for MinIO'. Covers three approaches: MC client, entrypoint mkdir, and volume persistence. Make sure to use this skill whenever setting up MinIO in docker-compose or debugging MinIO container startup issues. Not for AWS S3 configuration, Kubernetes MinIO operators, or MinIO cluster/distributed mode."
---

# MinIO Bucket Creation em Docker

> Ao configurar MinIO em Docker Compose, crie buckets via entrypoint mkdir no proprio container ao inves de depender de um container MC separado.

## Rules

1. **Prefira entrypoint mkdir sobre MC client em containers** — `mkdir -p /data/bucket-name` e inicie o servidor no mesmo entrypoint, porque o MC client tem problemas de timing com depends_on que nao garante readiness
2. **Sempre configure health check no MinIO** — use o endpoint `/minio/health/live` na porta 9000, porque depends_on sem health check nao garante que o servico esta pronto para conexoes
3. **Use variaveis de ambiente para credenciais** — coloque `MINIO_ROOT_USER` e `MINIO_ROOT_PASSWORD` em `.env`, porque deixar credenciais expostas no docker-compose.yml e risco de seguranca
4. **Declare volume nomeado para persistencia** — monte `/data` em volume nomeado ou bind mount, porque MinIO e componente de storage e perder dados em restart e inaceitavel
5. **Use http, nao https, em ambiente local** — MinIO local nao tem SSL configurado, entao use `http://` nas conexoes para evitar erros de handshake

## How to write

### Health Check para MinIO

```yaml
services:
  minio:
    image: minio/minio
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 15s
      timeout: 10s
      retries: 3
```

### Criacao de buckets via entrypoint (metodo recomendado)

```yaml
services:
  minio:
    image: minio/minio
    entrypoint: sh -lc
    command: >
      "mkdir -p /data/loki-data &&
       mkdir -p /data/loki-ruler &&
       minio server /data --console-address ':9001'"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

volumes:
  minio_data:
```

### MC client (alternativa para uso local, nao recomendado em compose)

```yaml
services:
  mc:
    image: minio/mc
    depends_on:
      minio:
        condition: service_healthy
    entrypoint: >
      /bin/sh -c "
      mc alias set myminio http://minio:9000 $${MINIO_ROOT_USER} $${MINIO_ROOT_PASSWORD} &&
      mc mb myminio/my-bucket --ignore-existing &&
      mc anonymous set public myminio/my-bucket
      "
```

## Example

**Before (MC client sem health check — falha de conexao):**

```yaml
services:
  minio:
    image: minio/minio
    command: server /data --console-address ':9001'

  mc:
    image: minio/mc
    depends_on:
      - minio  # depends_on NAO garante readiness
    entrypoint: >
      /bin/sh -c "mc alias set m http://minio:9000 admin password &&
      mc mb m/my-bucket"
```

**After (entrypoint mkdir com health check e volume):**

```yaml
services:
  minio:
    image: minio/minio
    entrypoint: sh -lc
    command: >
      "mkdir -p /data/my-bucket &&
       minio server /data --console-address ':9001'"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    ports:
      - "9000:9000"
      - "9001:9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 15s
      timeout: 10s
      retries: 3
    volumes:
      - minio_data:/data

volumes:
  minio_data:
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa criar buckets no startup do container | Use entrypoint com mkdir -p + minio server |
| Precisa de operacoes avancadas (policies, users) | Use MC client com depends_on + condition: service_healthy |
| MC client falha com connection refused | Adicione health check no MinIO e use condition: service_healthy |
| Ambiente local de desenvolvimento | Use http://, porta 9000 API + 9001 console |
| Dados precisam sobreviver a restart | Monte volume nomeado em /data |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `depends_on: [minio]` sem health check | `depends_on: { minio: { condition: service_healthy } }` |
| Credenciais hardcoded no docker-compose | Variaveis de ambiente via `.env` |
| MinIO sem volume de persistencia | Volume nomeado montado em `/data` |
| `https://` em MinIO local sem SSL | `http://` para ambiente local |
| `docker restart` manual para resolver timing | Health check + depends_on condition |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
