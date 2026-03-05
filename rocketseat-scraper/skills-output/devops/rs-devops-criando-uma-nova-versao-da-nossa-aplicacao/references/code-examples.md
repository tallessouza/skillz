# Code Examples: Deploy Multi-Versao com Istio Service Mesh

## 1. Build, Tag e Push da V2

```bash
# Build local
docker build -t app-service-mesh:v2 .

# Tag para o registry (se nao buildou com nome completo)
docker tag app-service-mesh:v2 usuario/app-service-mesh:v2

# Push
docker push usuario/app-service-mesh:v2

# Alternativa: build ja com nome final (pula o tag)
docker build -t usuario/app-service-mesh:v2 .
```

## 2. Deployment V1 com label version

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh
  namespace: app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-service-mesh
  template:
    metadata:
      labels:
        app: app-service-mesh
        version: v1
    spec:
      containers:
        - name: app-service-mesh
          image: usuario/app-service-mesh:v1
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
```

## 3. Deployment V2 (arquivo separado)

```yaml
# deployment-v2.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v2
  namespace: app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-service-mesh-v2
  template:
    metadata:
      labels:
        app: app-service-mesh-v2
        version: v2
    spec:
      containers:
        - name: app-service-mesh-v2
          image: usuario/app-service-mesh:v2
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
```

## 4. DestinationRule com subsets

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
  namespace: app
spec:
  host: app-service-mesh.app.svc.cluster.local
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## 5. VirtualService com weight (canario 80/20)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
  namespace: app
spec:
  hosts:
    - app-service-mesh.app.svc.cluster.local
  http:
    - route:
        - destination:
            host: app-service-mesh.app.svc.cluster.local
            subset: v1
          weight: 80
        - destination:
            host: app-service-mesh.app.svc.cluster.local
            subset: v2
          weight: 20
```

## 6. Modificacao dos health checks para V2

```typescript
// Antes (v1)
function checkHealth() {
  return { status: 'ok' }
}

function checkReady() {
  return { status: 'ok' }
}

// Depois (v2) — identificador da versao na resposta
function checkHealth() {
  return { status: 'ok v2' }
}

function checkReady() {
  return { status: 'ok v2' }
}
```

## 7. Comandos kubectl para o fluxo

```bash
# Aplicar deployment v2
kubectl apply -f deployment-v2.yaml -n app

# Verificar pods (0/2 = sidecar Istio inicializando)
kubectl get pods -n app

# Aplicar todos os manifestos da pasta
kubectl apply -f k8s/ -n app

# Teste rapido — mudar deployment existente para v2 temporariamente
# (editar image tag no deployment.yaml, apply, testar, reverter)

# Port-forward para testar pod especifico
kubectl port-forward pod/nome-do-pod 3000:3000 -n app
```

## 8. Endereco DNS interno — formatos

```
# Abreviado (so funciona no mesmo namespace)
app-service-mesh

# Com namespace (funciona cross-namespace no mesmo cluster)
app-service-mesh.app

# Completo (boa pratica — sempre use este)
app-service-mesh.app.svc.cluster.local
```