# Code Examples: PersistentVolumeClaim

## Exemplo completo: StorageClass + PV + PVC + Deployment

### 1. StorageClass

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: rancher.io/local-path
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Delete
```

### 2. PersistentVolume (10Gi)

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: app-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: local-storage
  hostPath:
    path: /data/app
```

### 3. PersistentVolumeClaim (1Gi do PV de 10Gi)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: local-storage
```

### 4. Deployment usando o PVC

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: app
          image: app:latest
          ports:
            - containerPort: 3000
          volumeMounts:
            - mountPath: /app/data
              name: app-storage
      volumes:
        - name: app-storage
          persistentVolumeClaim:
            claimName: app-pvc
```

## Verificacao dos objetos

```bash
# Ver StorageClass
kubectl get storageclass

# Ver PV e status
kubectl get pv

# Ver PVC e status (Pending ate ter Pod consumidor com WaitForFirstConsumer)
kubectl get pvc

# Verificar binding apos criar Pod
kubectl get pvc app-pvc -o yaml | grep phase
# Esperado: phase: Bound

# Descrever PVC para ver eventos
kubectl describe pvc app-pvc
```

## Cenario: provisionamento dinamico (cloud)

Em cloud, o PV e criado automaticamente pelo provisionador. Basta criar StorageClass + PVC:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp2-storage
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: gp2
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: gp2-storage
```

Nesse caso, ao criar um Pod que referencia `app-pvc`, o provisionador cria o PV automaticamente com 5Gi.

## Troubleshooting comum

```bash
# PVC stuck em Pending
kubectl describe pvc app-pvc
# Causas comuns:
# - Nenhum PV compativel (capacidade/accessMode/storageClass)
# - WaitForFirstConsumer sem Pod consumidor
# - StorageClass nao existe

# PV stuck em Released (nao volta pra Available)
kubectl patch pv app-pv -p '{"spec":{"claimRef": null}}'
# Cuidado: so faca isso se tiver certeza que os dados nao sao necessarios
```