# Code Examples: Criando Objetos do Kubernetes

## Fluxo Completo: Login, Tag, Push

```bash
# 1. Login no Docker Hub
docker login
# Login Succeeded

# 2. Verificar imagens locais
docker image ls
# REPOSITORY   TAG   IMAGE ID       CREATED        SIZE
# appts        v1    abc123         5 minutes ago  150MB

# 3. Taguear para o registry remoto
docker tag appts:v1 danielrodrigues/appts:v1

# 4. Verificar que a nova tag aparece
docker image ls
# REPOSITORY                TAG   IMAGE ID       CREATED        SIZE
# appts                     v1    abc123         5 minutes ago  150MB
# danielrodrigues/appts     v1    abc123         5 minutes ago  150MB

# 5. Push para o registry
docker push danielrodrigues/appts:v1
```

## Alternativa: Build com Tag Final

```bash
# Build ja apontando para o registry
docker build -t danielrodrigues/appts:v1 .

# Push direto (sem necessidade de docker tag)
docker push danielrodrigues/appts:v1
```

## Manifesto Deployment Completo da Aula

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: appts
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-appts
  template:
    metadata:
      labels:
        app: api-appts
    spec:
      containers:
        - name: appts
          image: danielrodrigues/appts:v1
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 100m
              memory: 64Mi
            limits:
              cpu: 200m
              memory: 128Mi
```

## Comandos Kubernetes Usados na Aula

```bash
# Criar namespace
kubectl create ns primeira-aplicacao
# namespace/primeira-aplicacao created

# Aplicar todos os manifestos da pasta k8s/
kubectl apply -f k8s/ -n primeira-aplicacao
# deployment.apps/appts created

# Verificar pods rodando
kubectl get pods -n primeira-aplicacao

# Ver logs de um pod
kubectl logs POD_NAME -n primeira-aplicacao

# Port forward para testar localmente
kubectl port-forward -n primeira-aplicacao pod/POD_NAME 3000:3000
# Forwarding from 127.0.0.1:3000 -> 3000
```

## Comparacao: Logs Docker vs Kubernetes

```bash
# Logs via Docker (container local)
docker ps
docker logs CONTAINER_ID

# Logs via Kubernetes (mesmo output)
kubectl logs POD_NAME -n primeira-aplicacao

# Ambos mostram os mesmos logs da aplicacao
```

## Estrutura de Pastas do Projeto

```
projeto/
├── src/                  # Codigo fonte da aplicacao
├── Dockerfile            # Build da imagem
└── k8s/                  # Manifestos Kubernetes
    └── deployment.yaml   # Deployment da aplicacao
```