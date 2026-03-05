# Code Examples: Service Mesh — Conceitos Fundamentais

## Chamada intra-cluster vs chamada externa

### Sem Service Mesh — chamada saindo do cluster (ineficiente)
```
Servico A (pod) 
  → sai do cluster 
  → resolve DNS externo (ex: servicob.empresa.com) 
  → volta para o cluster 
  → chega no Servico B (pod)

Problemas:
- Latencia desnecessaria (saida e retorno ao cluster)
- Depende de DNS externo estar disponivel
- Trafego passa por rede externa sem necessidade
```

### Sem Service Mesh — chamada intra-cluster (eficiente mas insegura)
```
Servico A (pod)
  → chamada HTTP para servicob.namespace.svc.cluster.local
  → resolve DNS interno do Kubernetes
  → chega no Servico B (pod)

Problema:
- Chamada HTTP pura, sem TLS
- Sem validacao de identidade
- Qualquer pod pode chamar qualquer servico
```

### Com Service Mesh — chamada intra-cluster com mTLS
```
Servico A (pod) + Sidecar Proxy
  → sidecar intercepta a chamada
  → estabelece conexao mTLS com sidecar do Servico B
  → certificados validados mutuamente
  → Servico B sabe que foi A quem chamou

Beneficios:
- Comunicacao criptografada dentro do cluster
- Identidade validada em ambos os lados
- Zero mudanca no codigo da aplicacao
```

## Kubernetes: Hierarquia de objetos mencionada

```yaml
# Hierarquia tipica de um servico em Kubernetes
apiVersion: apps/v1
kind: Deployment          # Gerencia ReplicaSets
metadata:
  name: servico-a
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: servico-a:latest
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service             # Camada de rede (DNS interno)
metadata:
  name: servico-a
spec:
  selector:
    app: servico-a
  ports:
  - port: 80
    targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress             # Entrada externa
metadata:
  name: servico-a-ingress
spec:
  rules:
  - host: servico-a.empresa.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: servico-a
            port:
              number: 80
```

## Retry e timeout — na aplicacao vs no Service Mesh

### Na aplicacao (manual, replicado em cada servico)
```typescript
// servico-a/src/http-client.ts
async function callServicoB(payload: unknown) {
  const maxRetries = 3
  const timeout = 5000

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('http://servico-b/api', {
        method: 'POST',
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeout),
      })
      return response.json()
    } catch (error) {
      if (attempt === maxRetries - 1) throw error
      await sleep(1000 * attempt) // backoff
    }
  }
}

// Problema: esse MESMO codigo esta em servico-b, servico-c, servico-d...
// Cada equipe implementa diferente, com bugs diferentes
```

### No Service Mesh (configuracao de infraestrutura)
```yaml
# Exemplo conceitual de configuracao de retry/timeout no Service Mesh
apiVersion: networking.example.io/v1
kind: RetryPolicy
metadata:
  name: servico-b-retry
spec:
  destination:
    name: servico-b
  retryOn: "5xx,reset,connect-failure"
  numRetries: 3
  perTryTimeout: 2s
  retryBackOff:
    baseInterval: 1s
    maxInterval: 10s
---
apiVersion: networking.example.io/v1
kind: Timeout
metadata:
  name: servico-b-timeout
spec:
  destination:
    name: servico-b
  timeout: 10s
```

```typescript
// servico-a/src/http-client.ts — COM Service Mesh
async function callServicoB(payload: unknown) {
  // Simples! Retry e timeout sao gerenciados pelo sidecar
  const response = await fetch('http://servico-b/api', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.json()
}
```

## Circuit breaker — configuracao conceitual

```yaml
# Service Mesh gerencia circuit breaker automaticamente
apiVersion: networking.example.io/v1
kind: CircuitBreaker
metadata:
  name: servico-b-circuit
spec:
  destination:
    name: servico-b
  maxConnections: 100
  maxPendingRequests: 50
  maxRetries: 3
  consecutiveErrors: 5        # Apos 5 erros consecutivos
  interval: 30s               # Janela de avaliacao
  baseEjectionTime: 30s       # Tempo com circuito aberto
  maxEjectionPercent: 50      # Max 50% dos pods ejetados
```

## Observabilidade — metricas extraidas pelo sidecar

```
Metricas automaticas por sidecar:
┌─────────────────────────────────────────────┐
│ request_total{source="A", dest="B"}    1234 │
│ request_duration_ms{source="A", dest="B"}   │
│   p50=12ms  p95=45ms  p99=120ms             │
│ request_errors{source="A", dest="B"}     23 │
│ active_connections{service="B"}          47  │
│ retry_count{source="A", dest="B"}        15 │
│ circuit_breaker_open{service="B"}         0  │
└─────────────────────────────────────────────┘

Service Graph (visibilidade da malha):
  A ──→ B ──→ D
  │     │
  └──→ C ──→ E
```

## VPC e DNS — contexto mencionado pelo instrutor

```
Cenario tipico:
┌─ VPC Privada ──────────────────────────────┐
│                                             │
│  ┌─ Cluster Kubernetes ─────────────────┐   │
│  │  [Servico A] ←──intra-cluster──→ [B] │   │
│  │       ↑                               │   │
│  │  [Ingress]                            │   │
│  └───────┼───────────────────────────────┘   │
│          │                                    │
│    [NAT Gateway] ──→ Internet (saida)         │
│                                               │
│    DNS Privado: servicoa.internal.empresa.com  │
└───────────────────────────────────────────────┘

- Servicos dentro do cluster: chamada intra-cluster (HTTP)
- DNS privado: nao recebe trafego da internet
- Saida para internet: via NAT Gateway
- Com Service Mesh: chamadas intra-cluster ganham mTLS
```