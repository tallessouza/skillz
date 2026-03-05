# Code Examples: Criando PVC no Kubernetes

## Manifesto PVC completo da aula

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: first-pvc
spec:
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
  selector:
    matchLabels:
      name: firstPv
```

## PV correspondente (referencia)

O PV que este PVC referencia:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: first-pv
  labels:
    name: firstPv
spec:
  capacity:
    storage: 5Gi
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/first-pv
```

Pontos de match:
- `storageClassName: standard` — igual nos dois
- `accessModes: ReadWriteOnce` — igual nos dois
- PVC `selector.matchLabels.name: firstPv` — bate com PV `metadata.labels.name: firstPv`
- PVC request `1Gi` <= PV capacity `5Gi`

## Comandos de operacao

### Aplicar o PVC

```bash
kubectl apply -f pvc.yaml -n primeira-aplicacao
```

### Verificar status

```bash
kubectl get pvc -n primeira-aplicacao
```

Output esperado:
```
NAME        STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
first-pvc   Pending                                      standard       5s
```

Status `Pending` e normal quando o StorageClass usa `WaitForFirstConsumer`.

### Debugar PVC

```bash
kubectl describe pvc first-pvc -n primeira-aplicacao
```

Output relevante:
```
Events:
  Type    Reason                Age   From                         Message
  ----    ------                ----  ----                         -------
  Normal  WaitForFirstConsumer  5s    persistentvolume-controller  waiting for first consumer to be created before binding
```

## Variacoes

### PVC sem selector (match automatico)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: auto-match-pvc
spec:
  resources:
    requests:
      storage: 2Gi
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
```

Sem selector, o Kubernetes escolhe qualquer PV disponivel que satisfaca os requisitos de capacidade, storageClass e accessModes.

### PVC requisitando capacidade maxima do PV

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: full-capacity-pvc
spec:
  resources:
    requests:
      storage: 5Gi  # Usando toda a capacidade do PV de 5Gi
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
  selector:
    matchLabels:
      name: firstPv
```