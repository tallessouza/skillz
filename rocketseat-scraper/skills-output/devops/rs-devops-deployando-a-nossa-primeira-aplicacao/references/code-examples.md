# Code Examples: Deployando Aplicacao no Kubernetes

## Manifesto completo do deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 20%
      maxUnavailable: 10%
  selector:
    matchLabels:
      app: app-service-mesh
  template:
    metadata:
      labels:
        app: app-service-mesh
    spec:
      containers:
        - name: app-service-mesh
          image: danielrodrigues/app-service-mesh:v1
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 200m
              memory: 128Mi
            limits:
              cpu: 400m
              memory: 256Mi
```

## Fluxo completo de build e push

```bash
# 1. Instalar dependencias (gera lock file)
yarn

# 2. Build da imagem com tag local
docker build -t app-service-mesh:v1 .

# 3. Verificar imagem criada
docker image ls

# 4. Login no Docker Hub (se ainda nao logado)
docker login

# 5. Taguear para o registry
docker tag app-service-mesh:v1 danielrodrigues/app-service-mesh:v1

# 6. Push para Docker Hub
docker push danielrodrigues/app-service-mesh:v1
```

## Fluxo de deploy no cluster

```bash
# 1. Verificar namespaces existentes
kubectl get namespace

# 2. Criar namespace dedicado
kubectl create ns app
# Alternativa longa: kubectl create namespace app

# 3. Aplicar todos os manifestos da pasta k8s
kubectl apply -f k8s/ -n app
# IMPORTANTE: sem -n app, vai pro namespace default

# 4. Verificar pods
kubectl get pods -n app
```

## Variacoes: registry privado

### ECR (AWS)

```bash
# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag para ECR
docker tag app-service-mesh:v1 123456789.dkr.ecr.us-east-1.amazonaws.com/app-service-mesh:v1

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/app-service-mesh:v1
```

### Secret para pull de registry privado no Kubernetes

```bash
kubectl create secret docker-registry regcred \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=usuario \
  --docker-password=senha \
  -n app
```

```yaml
# No deployment, adicionar:
spec:
  template:
    spec:
      imagePullSecrets:
        - name: regcred
      containers:
        - name: app-service-mesh
          image: usuario/app-service-mesh:v1
```

## Alias util para kubectl

```bash
# Adicionar ao .bashrc ou .zshrc
alias k="kubectl"

# Uso equivalente:
k get pods -n app
# mesmo que:
kubectl get pods -n app
```

## Estrutura de pastas do projeto

```
app-ts/
├── src/
│   └── main.ts          # Porta 3000
├── Dockerfile
├── package.json
├── yarn.lock
└── k8s/
    └── deployment.yaml   # Manifesto criado nesta aula
```