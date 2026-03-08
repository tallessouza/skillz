---
name: rs-devops-conhecendo-o-min-io
description: "Configures MinIO object storage containers using Docker Compose for local development. Use when user asks to 'setup MinIO', 'configure object storage', 'add MinIO to docker-compose', 'local S3 alternative', or 'persist logs with MinIO'. Applies correct port mapping, environment variables, and server command patterns. Make sure to use this skill whenever setting up MinIO or S3-compatible storage in Docker. Not for AWS S3 configuration, Kubernetes MinIO operators, or production MinIO clusters."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observability-storage
  tags: [minio, docker-compose, object-storage, s3, loki, volumes, docker]
---

# Configurando MinIO com Docker Compose

> Declarar o MinIO no docker-compose com portas, credenciais e comando de servidor corretos para ter object storage S3-compativel local.

## Rules

1. **Sempre use a imagem oficial** — `minio/minio:latest` porque e o repositorio oficial e garante compatibilidade
2. **Exponha duas portas** — `9000` (API) e `9001` (console web), porque o MinIO separa API de interface grafica
3. **Defina credenciais via environment** — `MINIO_ROOT_USER` e `MINIO_ROOT_PASSWORD`, porque sem elas o MinIO usa credenciais default inseguras (`minioadmin`/`minioadmin`)
4. **Use o command server com addresses** — passe `server /data --address :9000 --console-address :9001`, porque o MinIO precisa saber onde servir API e console
5. **Configure volume para persistencia** — sem volume Docker, dados sao perdidos ao restartar o container, porque o MinIO armazena tudo em `/data`
6. **Trate como S3 local** — buckets, access keys e policies seguem a mesma logica do Amazon S3, porque o MinIO e S3-compativel por design

## How to write

### Docker Compose basico

```yaml
minio:
  image: minio/minio:latest
  container_name: minio
  restart: always
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    MINIO_ROOT_USER: loki
    MINIO_ROOT_PASSWORD: supersecret
  command: server /data --address :9000 --console-address :9001
```

### Com volume para persistencia

```yaml
minio:
  image: minio/minio:latest
  container_name: minio
  restart: always
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    MINIO_ROOT_USER: loki
    MINIO_ROOT_PASSWORD: supersecret
  command: server /data --address :9000 --console-address :9001
  volumes:
    - minio_data:/data

volumes:
  minio_data:
```

## Example

**Before (incompleto, sem command correto):**
```yaml
minio:
  image: minio/minio
  ports:
    - "9000:9000"
```

**After (com this skill applied):**
```yaml
minio:
  image: minio/minio:latest
  container_name: minio
  restart: always
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    MINIO_ROOT_USER: loki
    MINIO_ROOT_PASSWORD: supersecret
  command: server /data --address :9000 --console-address :9001
  volumes:
    - minio_data:/data
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ambiente local de desenvolvimento | Sem volume e OK para testes rapidos, mas avise que dados serao perdidos |
| Integracao com Loki/Grafana | Use credenciais que o Loki vai referenciar (ex: `loki`/`supersecret`) |
| Precisa de access keys | Acesse console em `localhost:9001`, crie via interface (similar ao IAM da AWS) |
| Quer criar bucket | Pode criar pela interface web ou pelo MinIO Client (mc) — preferir mc para automacao |
| Producao / bare metal | MinIO open source roda no servidor fisico, custo zero de licenca |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| Expor apenas porta 9000 | Expor 9000 (API) e 9001 (console) |
| Deixar credenciais default | Definir `MINIO_ROOT_USER` e `MINIO_ROOT_PASSWORD` |
| Omitir `command: server /data` | Sempre passar o command com `/data` e addresses |
| Usar `minio/minio` sem tag | Usar `minio/minio:latest` para boa pratica |
| Criar bucket pela UI sem volume | Configurar volume primeiro, senao perde bucket ao restartar |

## Troubleshooting

### MinIO container inicia mas console nao abre na porta 9001
**Symptom:** Porta 9000 responde mas 9001 retorna connection refused
**Cause:** Falta o parametro `--console-address :9001` no command do container
**Fix:** Adicione `command: server /data --address :9000 --console-address :9001` no docker-compose

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
