# Code Examples: Service Mesh — Problemas que Resolve

## 1. Circuit Breaker — Código vs Service Mesh

### No código (o que o Service Mesh substitui)

```typescript
// Exemplo de circuit breaker a nível de código (lib)
// Cada serviço precisa implementar isso individualmente
import { CircuitBreaker } from 'some-circuit-breaker-lib'

const breaker = new CircuitBreaker(callServiceC, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
})

// Controle manual via env var (anti-pattern mencionado pelo instrutor)
if (process.env.CIRCUIT_BREAKER_ENABLED === 'true') {
  breaker.fire(request)
} else {
  callServiceC(request) // bypass manual
}
```

### No Service Mesh (configuração declarativa)

```yaml
# DestinationRule no Istio (exemplo conceitual)
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: service-c-circuit-breaker
spec:
  host: service-c
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: DEFAULT
        http1MaxPendingRequests: 100
    outlierDetection:
      consecutive5xxErrors: 5        # Abre circuito após 5 erros 5xx
      interval: 10s                   # Janela de verificação
      baseEjectionTime: 30s          # Tempo com circuito aberto
      maxEjectionPercent: 50         # Máximo de hosts ejetados
```

## 2. Retry e Timeout — Centralizado no Mesh

### Sem Service Mesh (em cada serviço)

```typescript
// Serviço A — retry manual
async function callServiceB(data: unknown, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      const response = await fetch('http://service-b/api', {
        signal: controller.signal,
        method: 'POST',
        body: JSON.stringify(data)
      })
      clearTimeout(timeout)
      return response.json()
    } catch (error) {
      if (i === retries - 1) throw error
    }
  }
}

// Serviço B — mesma lógica duplicada
// Serviço C — mesma lógica duplicada
// ... N serviços com o mesmo código
```

### Com Service Mesh (declarativo, uma vez)

```yaml
# VirtualService no Istio
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: service-b-resilience
spec:
  hosts:
    - service-b
  http:
    - route:
        - destination:
            host: service-b
      retries:
        attempts: 3
        perTryTimeout: 2s
        retryOn: 5xx,reset,connect-failure
      timeout: 10s
```

## 3. Deploy Strategies via Service Mesh

### Canary Deployment (liberar para X% do tráfego)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service-canary
spec:
  hosts:
    - my-service
  http:
    - route:
        - destination:
            host: my-service
            subset: stable
          weight: 90          # 90% vai para versão estável
        - destination:
            host: my-service
            subset: canary
          weight: 10          # 10% vai para versão nova
---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-versions
spec:
  host: my-service
  subsets:
    - name: stable
      labels:
        version: v1
    - name: canary
      labels:
        version: v2
```

### Blue-Green (nova versão só recebe tráfego quando healthy)

```yaml
# Fase 1: Todo tráfego para blue (versão atual)
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service-blue-green
spec:
  hosts:
    - my-service
  http:
    - route:
        - destination:
            host: my-service
            subset: blue
          weight: 100

# Fase 2: Após validar green, switch instantâneo
# Alterar weight: blue=0, green=100
```

### A/B Testing (duas versões para comparação)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service-ab-test
spec:
  hosts:
    - my-service
  http:
    - match:
        - headers:
            x-test-group:
              exact: "B"
      route:
        - destination:
            host: my-service
            subset: version-b
    - route:
        - destination:
            host: my-service
            subset: version-a
```

## 4. mTLS entre serviços

```yaml
# PeerAuthentication — ativa mTLS no namespace
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: my-namespace
spec:
  mtls:
    mode: STRICT    # Todas as comunicações devem usar mTLS
```

## 5. Observabilidade — Integração automática

```yaml
# O Service Mesh automaticamente expõe métricas para Prometheus
# Exemplo de métricas disponíveis sem código adicional:
#
# istio_requests_total          — Total de requisições entre serviços
# istio_request_duration_ms     — Latência por rota
# istio_tcp_connections_opened  — Conexões TCP abertas
#
# Grafana dashboards pré-configurados mostram:
# - Service graph (visualização da malha)
# - Request rate entre serviços
# - Error rate por serviço
# - Latência P50/P95/P99
```

## Comparação: Kubernetes Rolling Update vs Service Mesh Strategies

```
Rolling Update (K8s padrão):
  Réplica v1 ████████████
  Réplica v1 ████████████  → remove gradualmente
  Réplica v2     ████████████  → sobe gradualmente
  Réplica v2         ████████████

Blue-Green (Service Mesh):
  Blue v1  ████████████████████  (100% tráfego)
  Green v2 ████████████████████  (0% tráfego, validando)
  --- switch instantâneo ---
  Blue v1  (0%)
  Green v2 ████████████████████  (100% tráfego)

Canary (Service Mesh):
  Stable v1  ██████████████████  (90%)
  Canary v2  ██                  (10%)
  --- gradual ---
  Stable v1  ██████████████      (70%)
  Canary v2  ██████              (30%)
  --- confiança ---
  v2         ████████████████████ (100%)
```