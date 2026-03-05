# Code Examples: MinIO no Kubernetes

## Exemplo 1: StatefulSet basico para MinIO

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: minio
  namespace: storage
spec:
  serviceName: minio
  replicas: 1
  selector:
    matchLabels:
      app: minio
  template:
    metadata:
      labels:
        app: minio
    spec:
      containers:
        - name: minio
          image: minio/minio:latest
          args: ["server", "/data"]
          env:
            - name: MINIO_ROOT_USER
              valueFrom:
                secretKeyRef:
                  name: minio-credentials
                  key: root-user
            - name: MINIO_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: minio-credentials
                  key: root-password
          ports:
            - containerPort: 9000  # API
            - containerPort: 9001  # Console UI
          volumeMounts:
            - name: minio-data
              mountPath: /data
  volumeClaimTemplates:
    - metadata:
        name: minio-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 50Gi
```

## Exemplo 2: Service para expor MinIO

```yaml
apiVersion: v1
kind: Service
metadata:
  name: minio
  namespace: storage
spec:
  selector:
    app: minio
  ports:
    - name: api
      port: 9000
      targetPort: 9000
    - name: console
      port: 9001
      targetPort: 9001
```

## Exemplo 3: Velero backup schedule

```bash
# Instalar Velero no cluster
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.2.0 \
  --bucket velero-backups \
  --secret-file ./credentials-velero

# Criar schedule de backup diario para namespace do MinIO
velero schedule create minio-daily \
  --schedule="0 2 * * *" \
  --include-namespaces storage \
  --include-resources persistentvolumeclaims,persistentvolumes

# Backup manual (ad-hoc)
velero backup create minio-manual-backup \
  --include-namespaces storage

# Restaurar de um backup
velero restore create --from-backup minio-daily-20260228020000
```

## Exemplo 4: Loki configurado para usar MinIO no cluster

```yaml
# Trecho de configuracao do Loki apontando para MinIO interno
loki:
  storage:
    type: s3
    s3:
      endpoint: http://minio.storage.svc.cluster.local:9000
      bucketnames: loki-logs
      access_key_id: ${MINIO_ROOT_USER}
      secret_access_key: ${MINIO_ROOT_PASSWORD}
      s3forcepathstyle: true
      insecure: true
```

## Exemplo 5: Aplicacao usando MinIO em vez de S3

```typescript
// SDK S3 compativel — mesma API, endpoint diferente
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  // Aponta para MinIO dentro do cluster
  endpoint: "http://minio.storage.svc.cluster.local:9000",
  region: "us-east-1", // obrigatorio mas ignorado pelo MinIO
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER!,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD!,
  },
  forcePathStyle: true, // necessario para MinIO
});

// Uso identico ao S3
await s3Client.send(
  new PutObjectCommand({
    Bucket: "app-uploads",
    Key: `users/${userId}/avatar.png`,
    Body: fileBuffer,
  })
);
```

## Comparacao: Deployment vs StatefulSet

```yaml
# ERRADO — Deployment (stateless, perde dados ao recriar pod)
apiVersion: apps/v1
kind: Deployment        # <-- NAO use para MinIO
metadata:
  name: minio
spec:
  replicas: 1
  template:
    spec:
      containers:
        - name: minio
          image: minio/minio:latest
          # Sem volume persistente = dados perdidos ao restart

---

# CORRETO — StatefulSet (stateful, volumes persistentes por replica)
apiVersion: apps/v1
kind: StatefulSet       # <-- Use StatefulSet
metadata:
  name: minio
spec:
  serviceName: minio    # <-- Obrigatorio em StatefulSet
  replicas: 1
  volumeClaimTemplates: # <-- Volume persistente por replica
    - metadata:
        name: minio-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 50Gi
```