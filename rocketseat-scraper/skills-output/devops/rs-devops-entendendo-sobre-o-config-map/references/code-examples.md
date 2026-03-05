# Code Examples: Kubernetes ConfigMap

## 1. Arquivo .gitignore — proteger .env

```gitignore
.env
```

## 2. Arquivo .dockerignore — proteger .env no build local

```dockerignore
.env
```

## 3. Deployment com RollingUpdate e 3 replicas

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: appts
  namespace: primeira-aplicacao
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: appts
  template:
    metadata:
      labels:
        app: appts
    spec:
      containers:
        - name: appts
          image: usuario/appts:v3
          env:
            - name: APP
              valueFrom:
                configMapKeyRef:
                  name: appts
                  key: appname
```

## 4. ConfigMap completo

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: appts
  namespace: primeira-aplicacao
data:
  appname: rocketseatapp
```

## 5. Build e push da imagem

```bash
# Build com nova tag
docker build -t usuario/appts:v3 .

# Push para registry
docker push usuario/appts:v3
```

## 6. Aplicar recursos no cluster

```bash
# Aplicar ConfigMap
kubectl apply -f k8s/configmap.yml -n primeira-aplicacao

# Aplicar Deployment (que referencia o ConfigMap)
kubectl apply -f k8s/deployment.yaml -n primeira-aplicacao

# Verificar pods
kubectl get pods -n primeira-aplicacao
```

## 7. Verificar ConfigMap criado

```bash
# Listar configmaps
kubectl get configmap -n primeira-aplicacao

# Descrever configmap especifico
kubectl describe configmap appts -n primeira-aplicacao
# Output esperado:
# Name: appts
# Data:
# appname: rocketseatapp
```

## 8. Troubleshooting — restart do deployment

```bash
# Se a variavel aparecer como undefined apos apply
kubectl rollout restart deployment appts -n primeira-aplicacao
```

## 9. Exemplo com multiplas variaveis (extensao)

```yaml
# configmap.yml com multiplas chaves
apiVersion: v1
kind: ConfigMap
metadata:
  name: appts
data:
  appname: rocketseatapp
  appport: "3000"
  appenv: production
```

```yaml
# deployment.yaml — injecao individual de cada variavel
env:
  - name: APP
    valueFrom:
      configMapKeyRef:
        name: appts
        key: appname
  - name: PORT
    valueFrom:
      configMapKeyRef:
        name: appts
        key: appport
  - name: NODE_ENV
    valueFrom:
      configMapKeyRef:
        name: appts
        key: appenv
```

## 10. Alternativa para muitas variaveis (preview da proxima aula)

```yaml
# Em vez de injecao individual, usar envFrom
spec:
  containers:
    - name: appts
      image: usuario/appts:v3
      envFrom:
        - configMapRef:
            name: appts
# Todas as chaves do ConfigMap viram env vars automaticamente
# Neste caso, os nomes das keys no ConfigMap DEVEM coincidir
# com o que a aplicacao espera
```