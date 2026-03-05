# Code Examples: Pods Efêmeros e Controladores Kubernetes

## Demonstração da aula: deletar pod bare

O instrutor demonstra que um pod criado diretamente não é recriado após deleção:

```bash
# Listar pods
kubectl get pods

# Deletar um pod (duas formas equivalentes mostradas na aula)
kubectl delete pod minha-app

# Verificar — pod sumiu, não voltou
kubectl get pods
# Resultado: o pod não existe mais
```

## Pod bare (o que foi usado na aula)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: minha-app
  labels:
    app: minha-app
spec:
  containers:
    - name: app
      image: minha-app:1.0
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 200m
          memory: 256Mi
```

**Problema**: Se este pod for deletado (`kubectl delete pod minha-app`), ele desaparece permanentemente.

## Deployment (solução introduzida conceitualmente)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: minha-app
  template:
    metadata:
      labels:
        app: minha-app
    spec:
      containers:
        - name: app
          image: minha-app:1.0
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 200m
              memory: 256Mi
```

**Comportamento com Deployment:**

```bash
# Ver pods gerenciados pelo deployment
kubectl get pods
# NAME                         READY   STATUS    RESTARTS   AGE
# minha-app-7d4b8c6f9-abc12   1/1     Running   0          5m
# minha-app-7d4b8c6f9-def34   1/1     Running   0          5m
# minha-app-7d4b8c6f9-ghi56   1/1     Running   0          5m

# Deletar um pod
kubectl delete pod minha-app-7d4b8c6f9-abc12

# Verificar — ReplicaSet já criou um substituto
kubectl get pods
# NAME                         READY   STATUS    RESTARTS   AGE
# minha-app-7d4b8c6f9-def34   1/1     Running   0          6m
# minha-app-7d4b8c6f9-ghi56   1/1     Running   0          6m
# minha-app-7d4b8c6f9-jkl78   1/1     Running   0          3s  ← NOVO!
```

## ReplicaSet (gerenciado pelo Deployment)

```bash
# Ver o ReplicaSet criado pelo Deployment
kubectl get replicaset
# NAME                   DESIRED   CURRENT   READY   AGE
# minha-app-7d4b8c6f9   3         3         3       10m

# Descrever para ver o controle de réplicas
kubectl describe replicaset minha-app-7d4b8c6f9
# Replicas: 3 current / 3 desired
# Pods Status: 3 Running / 0 Waiting / 0 Succeeded / 0 Failed
```

## Escalar réplicas

```bash
# Aumentar para 5 pods
kubectl scale deployment minha-app --replicas=5

# Verificar — 2 novos pods sendo criados
kubectl get pods
# 5 pods listados, 2 com Age recente
```

## Verificar que o controller está reconciliando

```bash
# Em um terminal: watch nos pods
kubectl get pods -w

# Em outro terminal: deletar pods repetidamente
kubectl delete pod minha-app-7d4b8c6f9-def34

# No primeiro terminal: verá o pod sendo terminado e um novo aparecendo
# minha-app-7d4b8c6f9-def34   1/1   Terminating   0   10m
# minha-app-7d4b8c6f9-mno90   0/1   Pending       0   0s
# minha-app-7d4b8c6f9-mno90   1/1   Running       0   2s
```