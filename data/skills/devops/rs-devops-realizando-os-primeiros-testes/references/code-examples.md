# Code Examples: Service Mesh — Primeiros Testes

## Exemplo completo: Deployments V1 e V2 com labels corretas

### V1

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v1
  namespace: app
spec:
  replicas: 4
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
        - name: app
          image: <registry>/app-service-mesh:v1
          ports:
            - containerPort: 8080
```

### V2

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v2
  namespace: app
spec:
  replicas: 4
  selector:
    matchLabels:
      app: app-service-mesh
  template:
    metadata:
      labels:
        app: app-service-mesh
        version: v2
    spec:
      containers:
        - name: app
          image: <registry>/app-service-mesh:v2
          ports:
            - containerPort: 8080
```

## Destination Rule completo

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
  namespace: app
spec:
  host: app-service-mesh
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## Virtual Service — variacao 80/20

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
  namespace: app
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
            subset: v1
          weight: 80
        - destination:
            host: app-service-mesh
            subset: v2
          weight: 20
```

## Virtual Service — variacao 50/50

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
  namespace: app
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
            subset: v1
          weight: 50
        - destination:
            host: app-service-mesh
            subset: v2
          weight: 50
```

## Teste de carga com FortIO

### Comando completo

```bash
kubectl run fortio --rm -it \
  --namespace=app \
  --image=fortio/fortio \
  -- load -qps 8000 -t 60s -c 35 \
  http://app-service-mesh/ready
```

### Parametros explicados

| Parametro | Valor | Significado |
|-----------|-------|-------------|
| `--rm` | — | Remove o pod apos execucao |
| `-it` | — | Modo interativo (ver output em tempo real) |
| `--namespace=app` | app | Namespace onde o servico roda |
| `-qps 8000` | 8000 | Queries per second |
| `-t 60s` | 60s | Duracao do teste |
| `-c 35` | 35 | Conexoes simultaneas (threads) |

### Rotas alternativas para teste

```bash
# Rota /ready (health check — leve)
http://app-service-mesh/ready

# Rota raiz
http://app-service-mesh/

# Qualquer rota da aplicacao funciona
http://app-service-mesh/api/v1/resource
```

## Troubleshooting: deletar deployment com labels erradas

```bash
# Via kubectl
kubectl delete deployment app-service-mesh-v2 -n app

# Recriar com labels corretas
kubectl apply -f deployment-v2.yaml
```

## Aplicar todos os manifests de uma vez

```bash
kubectl apply -f .
```

## Verificar endpoints do Service

```bash
# Deve listar IPs de pods V1 e V2
kubectl get endpoints app-service-mesh -n app
```

## Verificar config no Kiali/Istio

Apos alterar weights no Virtual Service:
1. `kubectl apply -f virtual-service.yaml`
2. Verificar no Kiali > Istio Config que as regras atualizaram
3. Rodar novo teste de carga para validar