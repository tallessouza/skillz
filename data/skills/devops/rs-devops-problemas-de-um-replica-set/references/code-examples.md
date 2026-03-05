# Code Examples: Problemas de um ReplicaSet

## Exemplo 1: ReplicaSet com tag inicial

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:alpine3.20-slim
```

## Exemplo 2: Tentando trocar a tag (nao funciona)

```yaml
# Mudanca no manifesto:
image: nginx:1.27-alpine-slim  # era alpine3.20-slim
```

```bash
# Aplicar a mudanca
kubectl apply -f replicaset.yaml
# Output: replicaset.apps/nginx configured

# Verificar pods — AINDA com tag antiga
kubectl get pods
# nginx-xxxxx   1/1   Running   0   17m  ← sem recriacao

# Inspecionar pod individual
kubectl describe pod nginx-xxxxx | grep Image
# Image: nginx:alpine3.20-slim  ← NAO ATUALIZOU
```

## Exemplo 3: Unica solucao com ReplicaSet puro

```bash
# Deletar o ReplicaSet (causa indisponibilidade)
kubectl delete rs nginx
# replicaset.apps "nginx" deleted

# Todos os pods sao removidos neste momento — DOWNTIME

# Reaplicar o manifesto com nova tag
kubectl apply -f replicaset.yaml
# replicaset.apps/nginx created

# Agora os novos pods tem a tag correta
kubectl describe pod nginx-xxxxx | grep Image
# Image: nginx:1.27-alpine-slim  ← AGORA SIM
```

## Exemplo 4: Como deveria ser feito (com Deployment)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0  # zero downtime
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:alpine3.20-slim
```

```bash
# Trocar a tag — Deployment faz rolling update automaticamente
kubectl set image deployment/nginx nginx=nginx:1.27-alpine-slim
# deployment.apps/nginx image updated

# Pods sao substituidos gradualmente — SEM downtime
kubectl rollout status deployment/nginx
# Waiting for deployment "nginx" rollout to finish...
# deployment "nginx" successfully rolled out

# Rollback se necessario
kubectl rollout undo deployment/nginx
# deployment.apps/nginx rolled back
```

## Exemplo 5: Boa pratica de tags (hash do commit)

```bash
# No CI/CD pipeline:
COMMIT_HASH=$(git rev-parse --short HEAD)  # ex: abc123f
docker build -t user-skillz:${COMMIT_HASH} .
docker push user-skillz:${COMMIT_HASH}

# No manifesto Kubernetes:
# image: user-skillz:abc123f  ← tag rastreavel ao commit

# NUNCA:
# image: user-skillz:latest   ← imprevisivel, impossivel rastrear
```