# Code Examples: Kubernetes Secrets

## Exemplo completo da aula

### 1. Arquivo .env (local, nao commitado)

```env
API_KEY=superSecretKey123abc
```

### 2. Encoding do valor para base64

```bash
echo -n "superSecretKey123abc" | base64
# Output: c3VwZXJTZWNyZXRLZXkxMjNhYmM=
```

### 3. Secret manifest (k8s/secret.yml)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  API_KEY: c3VwZXJTZWNyZXRLZXkxMjNhYmM=
```

### 4. Deployment com ConfigMap + Secret

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
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
          image: registry/app:v4
          ports:
            - containerPort: 3000
          env:
            - name: APP_CONFIG
              valueFrom:
                configMapKeyRef:
                  name: app-configmap
                  key: APP_CONFIG
            - name: API_KEY
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: API_KEY
```

### 5. Aplicacao lendo as variaveis (Node.js)

```javascript
// A aplicacao le normalmente via process.env
// O Kubernetes ja decodifica o base64 automaticamente
const configMap = process.env.APP_CONFIG;
const apiKey = process.env.API_KEY;

console.log("ConfigMap:", configMap);   // valor do ConfigMap
console.log("API Key:", apiKey);         // valor decodificado da Secret
```

### 6. Comandos kubectl usados

```bash
# Aplicar o Secret
kubectl apply -f k8s/secret.yml -n primeira-aplicacao

# Verificar Secrets criados
kubectl get secret -n primeira-aplicacao

# Aplicar o Deployment atualizado
kubectl apply -f k8s/deployment.yml -n primeira-aplicacao
```

## Variacao: multiplas keys em um Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  API_KEY: c3VwZXJTZWNyZXRLZXkxMjNhYmM=
  DATABASE_URL: cG9zdGdyZXM6Ly91c2VyOnBhc3NAZGIuZXhhbXBsZS5jb20vbXlkYg==
  JWT_SECRET: bXlKd3RTZWNyZXRUb2tlbjEyMw==
```

Cada key e referenciada individualmente no Deployment:

```yaml
env:
  - name: API_KEY
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: API_KEY
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: DATABASE_URL
  - name: JWT_SECRET
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: JWT_SECRET
```

## Erro que voce vai encontrar

```bash
# Se passar valor raw (sem base64):
kubectl apply -f k8s/secret.yml -n primeira-aplicacao
# Error: illegal base64 data at input byte X

# Solucao: encodar o valor
echo -n "meuValor" | base64
# Usar o output no campo data do Secret
```