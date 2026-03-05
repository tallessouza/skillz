---
name: rs-devops-persistent-volume-claim
description: "Applies Kubernetes PersistentVolumeClaim patterns when writing pod/deployment manifests. Use when user asks to 'create a PVC', 'mount volume in pod', 'configure storage in k8s', 'persistent storage kubernetes', or any Kubernetes storage task. Enforces the hierarchy: StorageClass → PersistentVolume → PVC → Pod. Make sure to use this skill whenever generating Kubernetes manifests that involve storage or volumes. Not for Docker volumes, host-only storage, or non-Kubernetes container orchestration."
---

# PersistentVolumeClaim no Kubernetes

> Aplicacoes nunca conversam diretamente com o volume — elas conversam com o PVC, que faz o requerimento de espaco do volume.

## Hierarquia de Storage

```
StorageClass → PersistentVolume → PersistentVolumeClaim → Pod/Deployment
(provisionador)  (disco reservado)   (requerimento)        (consumidor)
```

1. **StorageClass** — conversa com o provisionador (ex: `local-path`, `gp2`, `standard`)
2. **PersistentVolume (PV)** — reserva um espaco no cluster (o "disco")
3. **PersistentVolumeClaim (PVC)** — requer uma parcela desse disco (ex: 1Gi de um PV de 10Gi)
4. **Pod/Deployment** — associa-se ao PVC, nunca diretamente ao PV

## Rules

1. **Pod referencia PVC, nunca PV** — porque o PVC e a camada de abstracao que faz o requerimento do espaco
2. **Crie os objetos na ordem: StorageClass → PV → PVC** — porque cada camada depende da anterior
3. **Use `WaitForFirstConsumer`** — o binding so acontece quando um Pod consumir, evitando alocacao prematura
4. **Declare capacidade no PV e request no PVC** — o PVC solicita uma parcela do espaco total do PV

## How to write

### StorageClass

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: rancher.io/local-path
volumeBindingMode: WaitForFirstConsumer
```

### PersistentVolume

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
  storageClassName: local-storage
  hostPath:
    path: /data/app
```

### PersistentVolumeClaim

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

### Pod consumindo o PVC

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
    - name: app
      image: app:latest
      volumeMounts:
        - mountPath: /app/data
          name: app-storage
  volumes:
    - name: app-storage
      persistentVolumeClaim:
        claimName: app-pvc
```

## Example

**Before (erro comum — pod referenciando PV diretamente):**

```yaml
# ERRADO: Pod nao deve referenciar PV
volumes:
  - name: storage
    hostPath:
      path: /data/app
```

**After (com PVC):**

```yaml
# CORRETO: Pod referencia o PVC
volumes:
  - name: storage
    persistentVolumeClaim:
      claimName: app-pvc
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao precisa de storage persistente | Crie StorageClass + PV + PVC |
| Cluster com provisionador dinamico (cloud) | StorageClass + PVC (PV criado automaticamente) |
| `WaitForFirstConsumer` configurado | Objetos ficam `Pending` ate um Pod consumir — isso e normal |
| Precisa de mais espaco que o PV oferece | Crie novo PV ou redimensione, nunca aumente o PVC alem do PV |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Pod com `hostPath` direto para persistencia | Use PVC para abstrair o storage |
| PVC sem `storageClassName` | Especifique a StorageClass explicitamente |
| Ignorar status `Pending` do PVC | Verifique se existe PV compativel e se o Pod foi criado |
| Criar PVC maior que o PV disponivel | Verifique `capacity` do PV antes de definir `requests` do PVC |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
