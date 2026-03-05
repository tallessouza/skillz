# Code Examples: Sidecar em Service Mesh

## Exemplo 1: Pod simples vs Pod com sidecar

### Pod sem sidecar (tradicional)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: api-service
  labels:
    app: api
spec:
  containers:
    - name: api
      image: minha-api:1.0
      ports:
        - containerPort: 8080
```

### Mesmo pod com sidecar proxy

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: api-service
  labels:
    app: api
spec:
  containers:
    - name: api
      image: minha-api:1.0
      ports:
        - containerPort: 8080
    - name: envoy-sidecar
      image: envoyproxy/envoy:v1.28
      ports:
        - containerPort: 15001  # Inbound
        - containerPort: 15006  # Outbound
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 200m
          memory: 256Mi
```

## Exemplo 2: Deployment com replicas (N pods = N sidecars)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 10  # 10 pods = 10 sidecars
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
          image: minha-api:1.0
          ports:
            - containerPort: 8080
        - name: envoy-sidecar
          image: envoyproxy/envoy:v1.28
          ports:
            - containerPort: 15001
```

## Exemplo 3: Fluxo de comunicacao entre dois servicos

```
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│          Pod: Servico A          │     │          Pod: Servico B          │
│                                  │     │                                  │
│  ┌──────────┐   ┌─────────────┐ │     │ ┌─────────────┐   ┌──────────┐ │
│  │  App A    │──→│  Sidecar A  │─┼────→┼─│  Sidecar B  │──→│  App B   │ │
│  │ :8080     │   │ :15001      │ │     │ │ :15001      │   │ :8080    │ │
│  └──────────┘   └─────────────┘ │     │ └─────────────┘   └──────────┘ │
│                                  │     │                                  │
│  Container 1    Container 2      │     │  Container 1      Container 2   │
└─────────────────────────────────┘     └─────────────────────────────────┘

Fluxo: App A → Sidecar A (intercepta saida) → rede → Sidecar B (intercepta entrada) → App B
```

## Exemplo 4: Sidecar barrando request (aplicacao nao saudavel)

```
Cliente → Sidecar B → [Health check: App B DOWN] → 503 Service Unavailable
                       (request NUNCA chega no App B)
```

Sem sidecar, a request chegaria na aplicacao e o erro seria tratado pela propria app (se tiver health check implementado) ou causaria timeout.

## Exemplo 5: Com Istio (injecao automatica de sidecar)

No Istio, voce nao precisa declarar o sidecar manualmente. Basta anotar o namespace:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: meu-namespace
  labels:
    istio-injection: enabled  # Istio injeta sidecar automaticamente
```

Depois, qualquer pod criado nesse namespace recebe automaticamente o container sidecar do Envoy:

```bash
# Verifica que o pod tem 2 containers (app + sidecar)
kubectl get pods -n meu-namespace
# NAME              READY   STATUS    RESTARTS
# api-service-xyz   2/2     Running   0        ← 2 containers!
```

## Exemplo 6: Calculando overhead de sidecars

```
Cenario: 50 microservicos, media de 3 replicas cada

Total de pods: 50 × 3 = 150 pods
Total de sidecars: 150

Recursos por sidecar (tipico Envoy):
  CPU: 100m request, 200m limit
  Memoria: 128Mi request, 256Mi limit

Overhead total:
  CPU: 150 × 100m = 15 cores (request) / 30 cores (limit)
  Memoria: 150 × 128Mi = 18.75 GiB (request) / 37.5 GiB (limit)
```

Esse overhead deve ser considerado no capacity planning do cluster.