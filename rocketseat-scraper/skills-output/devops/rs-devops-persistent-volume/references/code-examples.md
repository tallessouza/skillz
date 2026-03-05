# Code Examples: PersistentVolume no Kubernetes

## Verificacao basica do ambiente

```bash
# Listar PersistentVolumes — inicialmente vazio
kubectl get pv
# No resources found

# Forma longa — mesmo resultado
kubectl get persistentvolume

# Verificar nos disponiveis
kubectl get nodes
# NAME                 STATUS   ROLES           AGE   VERSION
# kind-control-plane   Ready    control-plane   ...   ...
# kind-worker          Ready    <none>          ...   ...
# kind-worker2         Ready    <none>          ...   ...
```

## Exemplo de volume efemero com emptyDir

```yaml
# emptyDir: criado quando o pod sobe, destruido quando o pod morre
apiVersion: v1
kind: Pod
metadata:
  name: app-efemera
spec:
  containers:
    - name: app
      image: nginx
      volumeMounts:
        - mountPath: /tmp/cache
          name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
# ATENCAO: dados em /tmp/cache desaparecem quando o pod e reciclado
```

## Exemplo de PersistentVolume com local-path

```yaml
# PV reservando 2GB usando local-path (apenas para desenvolvimento)
apiVersion: v1
kind: PersistentVolume
metadata:
  name: meu-pv
spec:
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard  # referencia ao StorageClass
  hostPath:
    path: /data/meu-pv  # caminho no no local
# ATENCAO: hostPath reserva espaco do proprio no
# NAO use em producao — concorrencia com a aplicacao
```

## Exemplo de PersistentVolume com capacidades variadas

```yaml
# PV pequeno — para config ou metadados
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-small
spec:
  capacity:
    storage: 512Mi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  hostPath:
    path: /data/pv-small
---
# PV medio — para aplicacoes com dados moderados
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-medium
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  hostPath:
    path: /data/pv-medium
---
# PV grande — para bancos de dados
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-large
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  hostPath:
    path: /data/pv-large
```

## Padrao correto: dados persistentes fora do container

```yaml
# ERRADO: salvar uploads dentro do container
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-upload
spec:
  replicas: 1
  selector:
    matchLabels:
      app: upload
  template:
    metadata:
      labels:
        app: upload
    spec:
      containers:
        - name: app
          image: minha-app:latest
          # Upload salvo em /app/images/ — EFEMERO!
          # Quando o pod morrer, todos os uploads somem
```

```yaml
# CORRETO: usar variavel de ambiente para apontar para S3
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-upload
spec:
  replicas: 1
  selector:
    matchLabels:
      app: upload
  template:
    metadata:
      labels:
        app: upload
    spec:
      containers:
        - name: app
          image: minha-app:latest
          env:
            - name: STORAGE_DRIVER
              value: "s3"
            - name: S3_BUCKET
              value: "meu-bucket-uploads"
          # Uploads vao para S3, nao para o filesystem do container
```

## Verificar StorageClass disponivel

```bash
# Ver qual StorageClass esta configurado no cluster
kubectl get storageclass
# NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE
# standard (default)   rancher.io/local-path   Delete          WaitForFirstConsumer

# No Kind, o provisioner padrao e local-path
# Em cloud, seria algo como kubernetes.io/aws-ebs ou pd.csi.storage.gke.io
```

## Relacao completa: StorageClass → PV → PVC → Pod

```
kubectl get storageclass    # "Quem provisiona?"
        │
        ▼
kubectl get pv              # "Quanto espaco reservado?"
        │
        ▼
kubectl get pvc             # "Quanto espaco requisitado?" (proxima aula)
        │
        ▼
kubectl get pods            # "Quem esta consumindo?"
```