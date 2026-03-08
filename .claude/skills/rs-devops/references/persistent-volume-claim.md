---
name: rs-devops-persistent-volume-claim
description: "Applies Kubernetes PersistentVolumeClaim patterns when configuring persistent storage for pods. Use when user asks to 'create PVC', 'persist data in Kubernetes', 'configure storage class', 'mount volume in pod', or 'setup PersistentVolume'. Enforces StorageClass-PV-PVC hierarchy, WaitForFirstConsumer binding, and pod-to-PVC abstraction. Make sure to use this skill whenever writing Kubernetes storage manifests or debugging PVC binding issues. Not for Docker volumes, cloud-native storage services, or ephemeral container storage."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-storage
  tags: [kubernetes, pvc, persistent-volume, storage-class, storage, stateful]
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

---

# Deep Explanation: PersistentVolumeClaim

## Modelo mental: o disco e o requerimento

O instrutor usa uma analogia clara: o PersistentVolume e como reservar um disco fisico. Voce pega um espaco (ex: 10Gi) e reserva para o cluster. Mas a aplicacao nao fala diretamente com esse disco — ela fala com o PVC, que e quem faz o "requerimento" de uma parcela desse disco.

Pense assim:
- **PV** = disco fisico reservado (10Gi)
- **PVC** = "eu quero 1Gi desse disco"
- **Pod** = "eu uso o que o PVC reservou pra mim"

## StorageClass e o provisionador

O StorageClass e o objeto que conversa com o provisionador do cluster. No exemplo da aula, o provisionador e o `local-path` (padrao do k3d/Rancher). Em ambientes cloud, seria `gp2` (AWS), `pd-standard` (GCP), etc.

O StorageClass define:
- Qual provisionador usar
- Politica de binding (`WaitForFirstConsumer` vs `Immediate`)
- Parametros especificos do provisionador

## WaitForFirstConsumer — por que importa

Com `volumeBindingMode: WaitForFirstConsumer`, o binding entre PV e PVC so acontece quando um Pod consumidor e criado. Isso significa:

1. Voce cria StorageClass → ok
2. Voce cria PV → status `Available`
3. Voce cria PVC → status `Pending` (nao `Bound`!)
4. Voce cria Pod referenciando o PVC → agora o PVC fica `Bound`

O instrutor enfatiza: "todos ainda vao ficar com Wait for First Consumer. Voce so vai ter de fato o bound disso quando voce tiver uma aplicacao consumindo."

Isso e diferente de `Immediate`, onde o PVC tenta fazer bind assim que e criado — o que pode causar problemas em clusters multi-zona.

## Fluxo completo de comunicacao

```
StorageClass ←→ Provisionador (local-path, gp2, etc.)
     ↑
PersistentVolume (reserva espaco: 10Gi)
     ↑
PersistentVolumeClaim (requer parcela: 1Gi)
     ↑
Pod/Deployment (consome via volumeMount)
```

A chave e: **o Pod nunca sabe sobre o PV**. Ele so conhece o PVC. Isso permite trocar a implementacao de storage sem mudar os manifests dos Pods.

## Por que nao conectar Pod direto ao volume?

O PVC serve como camada de abstracao. Beneficios:
- **Desacoplamento**: Pod nao precisa saber detalhes do storage
- **Portabilidade**: mesmo PVC funciona em local-path ou cloud
- **Controle de acesso**: PVC pode limitar quanto cada app usa
- **Lifecycle independente**: PVC pode sobreviver ao Pod

---

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
