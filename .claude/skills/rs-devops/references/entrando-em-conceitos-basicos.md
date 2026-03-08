---
name: rs-devops-entrando-em-conceitos-basicos
description: "Applies service mesh fundamental concepts when designing microservice communication in Kubernetes clusters. Use when user asks to 'setup service mesh', 'configure mTLS', 'add retry policies', 'implement circuit breaker', or 'secure inter-service communication'. Covers mTLS, retry/timeout delegation to infrastructure, and service mesh adoption criteria. Make sure to use this skill whenever evaluating service mesh necessity or configuring inter-service resilience patterns. Not for application-level HTTP clients, API gateway configuration, or ingress controller setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: service-mesh
  tags: [service-mesh, mtls, circuit-breaker, retry, timeout, microservices, kubernetes]
---

# Service Mesh — Conceitos Fundamentais

> Ao projetar comunicacao entre microservicos em cluster, delegue seguranca, resiliencia e observabilidade para a camada de infraestrutura (Service Mesh).

## Rules

1. **Chamadas intra-cluster sao HTTP por padrao** — sem TLS, sem validacao de identidade
2. **Use mTLS para validar identidade entre servicos**
3. **Separe responsabilidades: aplicacao vs infraestrutura** — retry, timeout, circuit breaker pertencem a infra
4. **Service Mesh so faz sentido em escala** — a partir de 50+ servicos
5. **Nao use Service Mesh apenas para mTLS** — justifique com multiplas capacidades
6. **O sidecar amplia observabilidade automaticamente**

## Decision Framework

| Situacao | Decisao |
|----------|---------|
| < 20 microservicos | Nao usar Service Mesh |
| Precisa apenas de mTLS | Ferramenta dedicada, nao Service Mesh completo |
| 50+ microservicos | Forte candidato a Service Mesh |
| Retry duplicado em muitos servicos | Sinal de necessidade |
| Falha local propaga para toda rede | Precisa de circuit breaker |

## Capacidades

### Seguranca (mTLS)
```
Sem SM: Servico A ---[HTTP]---> Servico B
Com SM: Servico A ---[mTLS via sidecar]---> Servico B
```

### Resiliencia
```yaml
retry:
  attempts: 3
  perTryTimeout: 2s
timeout: 10s
circuitBreaker:
  maxConnections: 100
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Retry/timeout em cada microservico | Configurar no Service Mesh |
| DNS externo entre servicos no mesmo cluster | Chamadas intra-cluster |
| Service Mesh para 5 servicos | Avaliar se complexidade justifica |
| Chamadas intra-cluster sem criptografia em producao | mTLS via Service Mesh |

## Troubleshooting

### Service Mesh adicionado mas comunicacao entre servicos falha
**Symptom:** Requests entre microservicos retornam connection refused ou timeout apos instalar Service Mesh
**Cause:** Sidecar proxy nao foi injetado nos pods — namespace sem label de injecao automatica
**Fix:** Adicione `istio-injection: enabled` no namespace e faca rollout restart dos deployments: `kubectl rollout restart deployment -n <namespace>`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
