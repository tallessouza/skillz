# Code Examples: Conhecendo o MinIO

## Docker Compose completo da aula

O instrutor adiciona o MinIO ao docker-compose ja existente (que contem Grafana, Loki e outros containers):

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

### Detalhamento de cada campo

**`image: minio/minio:latest`**
- Repositorio oficial: `minio/minio`
- Imagem pequena (~60MB)
- Tag `latest` como boa pratica mencionada pelo instrutor

**`container_name: minio`**
- Boa pratica para identificar o container facilmente em `docker ps` e `docker logs`

**`restart: always`**
- Mesmo padrao usado nos outros containers do compose

**`ports`**
```yaml
ports:
  - "9000:9000"   # API — onde aplicacoes se conectam
  - "9001:9001"   # Console web — interface grafica
```

**`environment`**
```yaml
environment:
  MINIO_ROOT_USER: loki           # Sobrescreve default 'minioadmin'
  MINIO_ROOT_PASSWORD: supersecret # Sobrescreve default 'minioadmin'
```

**`command`**
```yaml
command: server /data --address :9000 --console-address :9001
```
- `server /data` — inicializa o servidor MinIO no diretorio `/data`
- `--address :9000` — define porta da API
- `--console-address :9001` — define porta do console web

## Comandos Docker usados na aula

```bash
# Subir todos os containers
docker-compose up

# Verificar containers rodando
docker ps

# Ver logs do MinIO
docker logs <container_id>
```

## Acesso ao console

```
URL: http://localhost:9001
User: loki
Password: supersecret
```

## Variacao: com volume para persistencia

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

# No bloco volumes do compose
volumes:
  minio_data:
```

## Variacao: integrado com Loki

```yaml
services:
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

  loki:
    image: grafana/loki:latest
    # ... configuracao do Loki apontando para MinIO
    # endpoint: http://minio:9000
    # access_key_id: loki
    # secret_access_key: supersecret
    depends_on:
      - minio

volumes:
  minio_data:
```