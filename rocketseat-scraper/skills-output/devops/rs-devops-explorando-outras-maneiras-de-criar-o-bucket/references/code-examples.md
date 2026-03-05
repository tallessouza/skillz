# Code Examples: MinIO Bucket Creation em Docker

## Exemplo 1: MC Client com health check (abordagem completa)

```yaml
# docker-compose.yml
services:
  minio:
    image: minio/minio
    command: server /data --console-address ':9001'
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

  mc:
    image: minio/mc
    depends_on:
      minio:
        condition: service_healthy
    entrypoint: >
      /bin/sh -c "
      mc alias set myminio http://minio:9000 $${MINIO_ROOT_USER} $${MINIO_ROOT_PASSWORD} &&
      mc mb myminio/loki-data --ignore-existing &&
      mc mb myminio/loki-ruler --ignore-existing &&
      mc anonymous set public myminio/loki-data
      "
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
```

**Problema demonstrado na aula:** Sem o health check e `condition: service_healthy`, o MC tenta conectar antes do MinIO estar pronto e recebe "connection refused".

## Exemplo 2: Entrypoint mkdir (metodo recomendado)

```yaml
# docker-compose.yml
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

**Passo a passo:**
1. `entrypoint: sh -lc` — define o shell como ponto de entrada com login shell
2. `mkdir -p /data/loki-data` — cria diretorio que MinIO interpreta como bucket
3. `mkdir -p /data/loki-ruler` — cria segundo bucket
4. `minio server /data --console-address ':9001'` — inicia o servidor
5. O `&&` garante que cada comando so executa se o anterior teve sucesso

## Exemplo 3: Arquivo .env para credenciais

```env
# .env
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=supersecretpassword
```

## Exemplo 4: Verificacao via docker CLI

```bash
# Verificar status do health check
docker ps
# CONTAINER ID   IMAGE         STATUS                   PORTS
# abc123         minio/minio   Up 5s (health: starting) 0.0.0.0:9000->9000/tcp

# Apos health check passar:
# abc123         minio/minio   Up 30s (healthy)         0.0.0.0:9000->9000/tcp

# Ver logs do MinIO
docker logs <container-id>

# Restart manual (solucao temporaria para timing issues)
docker restart <container-id>
```

## Exemplo 5: Multiplos buckets com entrypoint

```yaml
# Para criar muitos buckets, organize o entrypoint
services:
  minio:
    image: minio/minio
    entrypoint: sh -lc
    command: >
      "mkdir -p /data/loki-data &&
       mkdir -p /data/loki-ruler &&
       mkdir -p /data/tempo-data &&
       mkdir -p /data/app-uploads &&
       minio server /data --console-address ':9001'"
```

**Insight:** Como buckets sao apenas diretorios em `/data`, voce pode criar quantos quiser com `mkdir -p` sem nenhuma dependencia externa.