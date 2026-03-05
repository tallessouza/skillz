# Code Examples: Gerenciamento de Env no Kubernetes

## Exemplo 1: Migracao de env para envFrom

### Antes — env com mapeamento explicito

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: app:latest
          env:
            - name: APP
              valueFrom:
                configMapKeyRef:
                  name: app
                  key: app_name
            - name: API_KEY
              valueFrom:
                secretKeyRef:
                  name: app-secret
                  key: api_key
```

### Depois — envFrom (injecao em massa)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: app:latest
          envFrom:
            - configMapRef:
                name: app
            - secretRef:
                name: app-secret
```

## Exemplo 2: ConfigMap com chaves corrigidas

### Antes (chaves nao correspondem a aplicacao)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app
data:
  app_name: "my-application"
```

### Depois (chaves correspondem ao que a aplicacao espera)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app
data:
  APP: "my-application"
```

## Exemplo 3: Secret com chaves corrigidas

### Antes

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  api_key: bXktc2VjcmV0LWtleQ==
```

### Depois

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  API_KEY: bXktc2VjcmV0LWtleQ==
```

## Exemplo 4: Combinando env e envFrom

```yaml
spec:
  containers:
    - name: app
      image: app:latest
      envFrom:
        - configMapRef:
            name: app
      env:
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: api_key
        - name: EXTRA_CONFIG
          value: "static-value"
```

## Exemplo 5: Restart apos alteracao

```bash
# Aplicar ConfigMap atualizado
kubectl apply -f configmap.yaml

# Aplicar Secret atualizado
kubectl apply -f secret.yaml

# Aplicar Deployment (pode retornar unchanged se nao mudou)
kubectl apply -f deployment.yaml

# Forcar restart para pegar novas variaveis
kubectl rollout restart deployment app

# Verificar se os pods subiram
kubectl get pods

# Verificar logs para confirmar variaveis
kubectl logs <pod-name>
```

## Exemplo 6: Debugging de variaveis undefined

```bash
# Verificar quais env vars estao no Pod
kubectl exec <pod-name> -- env | sort

# Verificar ConfigMap atual
kubectl get configmap app -o yaml

# Verificar Secret atual (valores em base64)
kubectl get secret app-secret -o yaml

# Decodificar valor de secret
echo "bXktc2VjcmV0LWtleQ==" | base64 -d
```

## Exemplo 7: ConfigMap compartilhado (quando usar env seletivo)

```yaml
# ConfigMap compartilhado entre apps
apiVersion: v1
kind: ConfigMap
metadata:
  name: shared-config
data:
  DATABASE_URL: "postgres://..."
  REDIS_URL: "redis://..."
  APP_A_SPECIFIC: "value-a"
  APP_B_SPECIFIC: "value-b"

---
# App A — usa env seletivo (nao envFrom)
spec:
  containers:
    - name: app-a
      env:
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: shared-config
              key: DATABASE_URL
        - name: APP_CONFIG
          valueFrom:
            configMapKeyRef:
              name: shared-config
              key: APP_A_SPECIFIC
```