# Code Examples: Configurando Storage com MinIO MC Client

## Exemplo completo: Docker Compose com MinIO + MC

```yaml
version: '3.8'

services:
  minio:
    image: minio/minio
    container_name: minio
    ports:
      - "9000:9000"   # API
      - "9001:9001"   # Console
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin}
    command: server /data --console-address ":9001"

  bucket:
    image: minio/mc
    container_name: mc
    depends_on:
      - minio
    entrypoint: >
      /bin/sh -c "
      /usr/bin/mc alias set minio http://minio:9000 $${MINIO_ROOT_USER} $${MINIO_ROOT_PASSWORD} &&
      /usr/bin/mc rm -r --force minio/lock || true &&
      /usr/bin/mc mb minio/lock &&
      /usr/bin/mc anonymous set public minio/lock &&
      exit 0
      "
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin}
```

## Passo a passo do entrypoint

### 1. Configurar alias

```bash
/usr/bin/mc alias set minio http://minio:9000 ACCESS_KEY SECRET_KEY
```

- `minio` — nome do alias (pode ser qualquer nome)
- `http://minio:9000` — endpoint (nome do servico Docker na porta API)
- Credenciais devem coincidir com `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`

### 2. Remover bucket existente (idempotencia)

```bash
/usr/bin/mc rm -r --force minio/lock || true
```

- `-r` — recursivo (remove conteudo dentro do bucket)
- `--force` — nao pede confirmacao
- `|| true` — nao falha se o bucket nao existir (primeira execucao)

### 3. Criar bucket

```bash
/usr/bin/mc mb minio/lock
```

- `mb` = make bucket
- `minio/lock` = alias/nome-do-bucket

### 4. Configurar permissao publica

```bash
/usr/bin/mc anonymous set public minio/lock
```

- `anonymous set public` — permite acesso sem autenticacao
- Use apenas para buckets que realmente devem ser publicos (ex: logs de observabilidade)

### 5. Encerrar container

```bash
exit 0
```

- Sai com codigo 0 (sucesso)
- Container morre e nao reinicia (sem restart policy)

## Comandos de diagnostico

```bash
# Ver containers ativos
docker ps

# Ver todos containers (incluindo mortos)
docker ps -a

# Ver logs do container MC
docker logs mc

# Recriar tudo do zero
docker-compose down && docker-compose up -d

# Restart de um servico especifico
docker-compose restart bucket
```

## Variacoes: multiplos buckets

```yaml
entrypoint: >
  /bin/sh -c "
  /usr/bin/mc alias set minio http://minio:9000 $${MINIO_ROOT_USER} $${MINIO_ROOT_PASSWORD} &&
  /usr/bin/mc mb minio/logs || true &&
  /usr/bin/mc mb minio/traces || true &&
  /usr/bin/mc mb minio/metrics || true &&
  /usr/bin/mc anonymous set public minio/logs &&
  /usr/bin/mc anonymous set public minio/traces &&
  /usr/bin/mc anonymous set public minio/metrics &&
  exit 0
  "
```

## Variacao: bucket privado (sem anonymous)

```yaml
entrypoint: >
  /bin/sh -c "
  /usr/bin/mc alias set minio http://minio:9000 $${MINIO_ROOT_USER} $${MINIO_ROOT_PASSWORD} &&
  /usr/bin/mc mb minio/private-data || true &&
  exit 0
  "
```

Sem o comando `mc anonymous set`, o bucket permanece privado por padrao — acessivel apenas com credenciais.

## Erro comum: restart always com container efemero

```yaml
# ERRADO — loop infinito
bucket:
  image: minio/mc
  restart: always  # Container faz exit 0, Docker reinicia, loop
  entrypoint: >
    /bin/sh -c "
    /usr/bin/mc mb minio/lock &&
    exit 0
    "
```

O Docker interpreta `exit 0` como "container parou" e com `restart: always` tenta reiniciar indefinidamente.