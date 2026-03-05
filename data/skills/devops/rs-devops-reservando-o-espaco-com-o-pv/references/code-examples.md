# Code Examples: Persistent Volume (PV) no Kubernetes

## Exemplo completo da aula — pv.yaml

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: firstpv
  labels:
    name: firstpv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: standard
  hostPath:
    path: /mnt/data
```

## Comandos de criacao e verificacao

### Criar o PV
```bash
kubectl apply -f pv.yaml
```

### Listar PVs
```bash
kubectl get pv
```

Saida esperada:
```
NAME      CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   AGE
firstpv   5Gi        RWO            Delete           Available           standard       5s
```

Campos importantes na saida:
- **STATUS: Available** — PV criado mas sem PVC associado (unset)
- **ACCESS MODES: RWO** — ReadWriteOnce
- **RECLAIM POLICY: Delete**
- **STORAGECLASS: standard**

### Descrever PV com detalhes
```bash
kubectl describe pv firstpv
```

Informacoes adicionais visiveis no describe:
- `VolumeMode: Filesystem`
- `Source: HostPath` com o path `/mnt/data`
- Labels configuradas
- StorageClass associado

## Variacoes por Access Mode

### ReadWriteMany (RWX)
```yaml
spec:
  accessModes:
    - ReadWriteMany
```

### ReadOnlyMany (ROX)
```yaml
spec:
  accessModes:
    - ReadOnlyMany
```

### ReadWriteOncePod (RWOP)
```yaml
spec:
  accessModes:
    - ReadWriteOncePod
```

### Multiplos access modes
```yaml
spec:
  accessModes:
    - ReadWriteOnce
    - ReadOnlyMany
```

## Variacoes por Reclaim Policy

### Retain (preservar dados)
```yaml
spec:
  persistentVolumeReclaimPolicy: Retain
```

### Recycle (limpar e reutilizar — deprecado)
```yaml
spec:
  persistentVolumeReclaimPolicy: Recycle
```

## PV com storage class customizado

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: custom-pv
  labels:
    name: custom-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: firststorageclass
  hostPath:
    path: /mnt/custom-data
```

## PV para producao (exemplo com NFS)

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv
  labels:
    name: nfs-pv
spec:
  capacity:
    storage: 50Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: nfs-storage
  nfs:
    server: 192.168.1.100
    path: /exports/data
```