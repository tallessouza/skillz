# Code Examples: Debugging de Pipeline de Observabilidade

## 1. Identificando o container

```bash
# Listar containers em execucao
docker ps

# Saida exemplo:
# CONTAINER ID   IMAGE          COMMAND   CREATED        STATUS        PORTS     NAMES
# abc123def456   grafana/loki   ...       2 hours ago    Up 2 hours    3100/tcp  loki
```

## 2. Verificando logs do container

```bash
# Ver logs do container (substitua pelo ID real)
docker logs abc123def456
```

### Exemplo de erro encontrado nos logs:
```
level=error msg="failed to send request" err="server supports HTTP only, but HTTPS was requested"
```

Esse erro indica mismatch de protocolo — a configuracao esta tentando HTTPS quando o servidor so aceita HTTP.

## 3. Corrigindo configuracao do Loki

### Configuracao com erro (insecure: false)
```yaml
# loki-config.yaml (ERRADO)
storage_config:
  aws:
    endpoint: minio:9000
    insecure: false  # Isso faz o Loki tentar HTTPS
    bucketnames: loki-data
    access_key_id: minioadmin
    secret_access_key: minioadmin
    s3forcepathstyle: true
```

### Configuracao corrigida (insecure: true)
```yaml
# loki-config.yaml (CORRETO)
storage_config:
  aws:
    endpoint: minio:9000
    insecure: true   # Conexao HTTP, sem TLS — compativel com MinIO local
    bucketnames: loki-data
    access_key_id: minioadmin
    secret_access_key: minioadmin
    s3forcepathstyle: true
```

## 4. Reiniciando o container

```bash
# Reiniciar container apos corrigir config
docker restart abc123def456

# Acompanhar logs para verificar se o erro sumiu
docker logs abc123def456
```

### O que procurar nos logs apos restart:
- `trace_id` com push confirmado = ingestao funcionando
- Ausencia de erros de requisicao = protocolo correto
- Mensagens de debug normais = pipeline saudavel

## 5. Adicionando log de teste na aplicacao

```typescript
// No servico da aplicacao (ex: controller do endpoint)
import { log } from './logger'; // abstração de logging criada anteriormente

// Endpoint de teste
app.get('/', (req, res) => {
  log.info('cheguei aqui');
  res.send('ok');
});
```

```bash
# Acessar o endpoint para gerar logs
curl http://localhost:3001/

# Acompanhar se o log aparece no container do Loki
docker logs abc123def456
```

## 6. Alterando log level via volume

```yaml
# loki-config.yaml — mudando log level
# Antes:
# (sem log_level definido, usa default)

# Depois:
server:
  log_level: warn  # ou o nivel desejado
```

```bash
# Apos alterar o arquivo (que esta no volume montado):
docker restart abc123def456

# O container recarrega a config do volume automaticamente
# Nao precisa rebuild da imagem
```

## 7. Verificando objetos no MinIO

Acesse a interface web do MinIO (geralmente `http://localhost:9001`) e verifique:

```
Bucket: loki-data/
├── index/           # Indices criados pelo Loki
│   └── ...
├── fake/            # Arquivo de ingestao
│   └── *.gz         # Dados comprimidos
└── chunks/          # Chunks de log
    └── ...
```

Se a UI nao atualizar, recarregue a pagina (bug visual conhecido).

## 8. Fluxo completo de debug (script de referencia)

```bash
#!/bin/bash
# Debug script para pipeline Loki → MinIO

echo "=== 1. Verificando containers ==="
docker ps --filter "name=loki"

CONTAINER_ID=$(docker ps -q --filter "name=loki")

echo "=== 2. Verificando logs recentes ==="
docker logs --tail 50 $CONTAINER_ID

echo "=== 3. Procurando erros de protocolo ==="
docker logs $CONTAINER_ID 2>&1 | grep -i "https\|http\|insecure\|request"

echo "=== 4. Se encontrou erro, corrija insecure: true no config ==="
echo "   Edite o arquivo de config montado via volume"
echo "   Depois: docker restart $CONTAINER_ID"

echo "=== 5. Verificando MinIO ==="
echo "   Acesse http://localhost:9001 e verifique o bucket"
```