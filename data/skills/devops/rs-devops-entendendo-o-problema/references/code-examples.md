# Code Examples: Gerenciamento Efêmero de Logs em Containers

## Exemplo mencionado na aula: Volume convencional no Loki

O instrutor mostra que a abordagem convencional seria definir um volume no docker-compose para o Loki:

```yaml
# docker-compose.yml — Abordagem convencional (NAO recomendada para producao)
services:
  loki:
    image: grafana/loki:latest
    volumes:
      - loki-data:/loki

volumes:
  loki-data:
```

**Por que nao usar isso em producao:**
- Em Kubernetes, gerenciar volumes persistentes para logs e complexo
- Alta volumetria de logs pode estourar o PV
- Dados sensiveis ficam presos ao node/host
- Perde-se a efemeridade do container

## Abordagem correta: Storage externo

### Loki com S3 backend

```yaml
# loki-config.yaml
schema_config:
  configs:
    - from: 2024-01-01
      store: tsdb
      object_store: s3
      schema: v13
      index:
        prefix: loki_index_
        period: 24h

storage_config:
  aws:
    s3: s3://access-key:secret-key@region/bucket-name
    s3forcepathstyle: true
```

### Loki com MinIO (ambiente local simulando S3)

```yaml
# docker-compose.yml — Setup local com storage externo
services:
  loki:
    image: grafana/loki:latest
    # Sem volumes de dados — efemero
    volumes:
      - ./loki-config.yaml:/etc/loki/local-config.yaml
    command: -config.file=/etc/loki/local-config.yaml

  minio:
    image: minio/minio:latest
    volumes:
      - minio-data:/data  # Volume aceitavel aqui — MinIO e o storage
    command: server /data
    environment:
      MINIO_ROOT_USER: loki
      MINIO_ROOT_PASSWORD: supersecret

volumes:
  minio-data:  # Volume esta na ferramenta de storage, NAO no Loki
```

**Ponto chave:** O volume existe no MinIO (ferramenta de storage), nao no Loki. O Loki continua efemero — ele faz ingestao e repassa para o MinIO.

## Analogia com aplicacoes: mesmo principio

```yaml
# ERRADO — salvar uploads dentro do container
services:
  api:
    volumes:
      - uploads:/app/uploads  # Preso ao container

# CORRETO — mandar para S3
services:
  api:
    environment:
      AWS_S3_BUCKET: my-uploads
      # Container efemero, dados no S3
```

## Kubernetes: PV vs Storage externo

```yaml
# Abordagem PV (funciona mas nao ideal para logs)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: loki-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi  # E se a volumetria ultrapassar?
---
# Abordagem recomendada: Loki configurado com S3 backend
# Sem PVC necessario — logs vao para object storage externo
```