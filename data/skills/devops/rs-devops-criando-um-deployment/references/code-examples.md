# Code Examples: Kubernetes Deployment

## Exemplo 1: Deployment YAML completo (da aula)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 5
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
          image: nginx:1.27.1-alpine-slim
          resources:
            requests:
              cpu: 100m
              memory: 164Mi
            limits:
              cpu: 200m
              memory: 328Mi
          ports:
            - containerPort: 80
```

### Walkthrough:

1. **apiVersion: apps/v1** — mesma API group usada pelo ReplicaSet
2. **kind: Deployment** — o objeto que adiciona capacidade de implantacao
3. **metadata.name** — identificador do Deployment no cluster
4. **spec.replicas: 5** — quantidade desejada de Pods
5. **spec.selector.matchLabels** — como o Deployment encontra seus Pods (deve coincidir com template.metadata.labels)
6. **template** — especificacao do Pod que sera criado
7. **resources.requests** — minimo garantido (100m CPU = 10% de 1 vCPU, 164Mi memoria)
8. **resources.limits** — maximo permitido (200m CPU, 328Mi memoria) — dobro dos requests
9. **ports.containerPort: 80** — porta exposta pelo container (NGINX default)

## Exemplo 2: Aplicando com namespace

```bash
# Correto — sempre especificar namespace
kubectl apply -f deployment.yaml -n primeira-app

# Errado — vai para namespace default
kubectl apply -f deployment.yaml
```

## Exemplo 3: Simulando um deploy (atualizacao de versao)

Versao inicial:
```yaml
image: nginx:alpine3.20-slim
```

Nova versao:
```yaml
image: nginx:1.27.1-alpine-slim
```

Apos alterar o YAML:
```bash
kubectl apply -f deployment.yaml -n primeira-app
```

O Deployment detecta a mudanca na imagem e inicia o rolling update automaticamente.

## Exemplo 4: Rollback (demonstrado na aula)

Se a versao `1.27.1` causar problemas, reverter no YAML:
```yaml
image: nginx:alpine3.20-slim
```

```bash
kubectl apply -f deployment.yaml -n primeira-app
```

O Deployment re-deploya com a versao anterior, mantendo zero downtime via rolling update.

## Exemplo 5: Verificando o estado

```bash
# Ver Deployments no namespace
kubectl get deployments -n primeira-app

# Ver ReplicaSets (criados automaticamente pelo Deployment)
kubectl get replicasets -n primeira-app

# Ver Pods
kubectl get pods -n primeira-app

# Ver detalhes de um Pod especifico
kubectl describe pod <pod-name> -n primeira-app
```

## Variacoes uteis

### Deployment com aplicacao Node.js
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: minha-api:1.0.0
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
          ports:
            - containerPort: 3000
```

### Regra de proporcao requests/limits

| Requests | Limits (2x) |
|----------|-------------|
| cpu: 100m | cpu: 200m |
| cpu: 250m | cpu: 500m |
| memory: 128Mi | memory: 256Mi |
| memory: 164Mi | memory: 328Mi |