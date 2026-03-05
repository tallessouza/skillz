# Code Examples: Alternativas na Camada da Aplicacao

## Nota sobre exemplos

A aula e conceitual — nao apresenta codigo diretamente. Os exemplos abaixo ilustram os patterns discutidos para referencia pratica.

## Circuit Breaker — Fluxo conceitual

```
Servico A ──[requisicao]──> Servico B

Estado: CLOSED (normal)
  A chama B normalmente
  Se B falha X vezes consecutivas → muda para OPEN

Estado: OPEN
  A NAO chama B
  Retorna fallback ou erro imediato
  Apos timeout → muda para HALF_OPEN

Estado: HALF_OPEN
  A envia 10% do trafego para B
  Se 10% retorna OK → aumenta para 20%, 40%... ate CLOSED
  Se 10% retorna erro → volta para OPEN
```

## Circuit Breaker com biblioteca (Node.js — opossum)

```typescript
import CircuitBreaker from 'opossum';

async function callServiceB(request: Request): Promise<Response> {
  return fetch('http://service-b/api/data', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

const breaker = new CircuitBreaker(callServiceB, {
  timeout: 3000,           // tempo max por requisicao
  errorThresholdPercentage: 50,  // 50% de erro → abre circuito
  resetTimeout: 10000,     // tenta half-open apos 10s
  volumeThreshold: 10,     // minimo de requisicoes antes de avaliar
});

// Fallback quando circuito esta aberto
breaker.fallback(() => ({
  status: 503,
  body: { message: 'Service B temporarily unavailable' },
}));

// Uso
const response = await breaker.fire(request);
```

## Circuit Breaker com Resilience4j (Java/Kotlin)

```kotlin
val circuitBreakerConfig = CircuitBreakerConfig.custom()
    .failureRateThreshold(50f)           // 50% falha → abre
    .waitDurationInOpenState(Duration.ofSeconds(10))  // espera 10s
    .permittedNumberOfCallsInHalfOpenState(5)         // 5 chamadas em half-open
    .slidingWindowSize(10)               // janela de 10 requisicoes
    .build()

val circuitBreaker = CircuitBreaker.of("serviceB", circuitBreakerConfig)

val result = circuitBreaker.executeSupplier {
    serviceBClient.getData()
}
```

## Fault Injection com Chaos Mesh (Kubernetes)

```yaml
# Injetar delay de 5s em 50% das requisicoes do service-b
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: delay-service-b
  namespace: production
spec:
  action: delay
  mode: all
  selector:
    namespaces:
      - production
    labelSelectors:
      app: service-b
  delay:
    latency: "5s"
    correlation: "50"
  duration: "5m"
```

## Fault Injection com Istio VirtualService

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: service-b-fault
spec:
  hosts:
    - service-b
  http:
    - fault:
        delay:
          percentage:
            value: 10    # 10% das requisicoes
          fixedDelay: 5s
        abort:
          percentage:
            value: 5     # 5% retorna erro 503
          httpStatus: 503
      route:
        - destination:
            host: service-b
```

## Litmus Chaos Experiment

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: service-b-chaos
  namespace: production
spec:
  appinfo:
    appns: production
    applabel: app=service-b
    appkind: deployment
  chaosServiceAccount: litmus-admin
  experiments:
    - name: pod-network-latency
      spec:
        components:
          env:
            - name: NETWORK_LATENCY
              value: "5000"    # 5s de latencia
            - name: TOTAL_CHAOS_DURATION
              value: "300"     # 5 minutos
```

## Blast Radius — Visualizacao

```
Sem Circuit Breaker:
  A ──> B (defeituoso) ──> C ──> D
  │                        │
  └── lentidao propaga ────┘── todo ecossistema afetado

Com Circuit Breaker:
  A ──X B (defeituoso)     C ──> D
  │   circuito aberto      │
  └── fallback imediato    └── ecossistema protegido
```