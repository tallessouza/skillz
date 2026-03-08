---
name: rs-devops-envoy
description: "Applies Envoy proxy concepts when working with Istio service mesh or Kubernetes networking. Use when user asks about 'Envoy proxy', 'Istio data plane', 'sidecar proxy', 'L4/L7 proxy', or 'service mesh proxy layer'. Covers Envoy's role as data plane in Istio, its decoupled architecture, and L4/L7 capabilities. Make sure to use this skill whenever discussing or configuring the proxy layer in an Istio service mesh. Not for Envoy standalone configuration, EnvoyFilter CRDs, or non-Istio proxy setups."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: service-mesh
  tags: [envoy, istio, proxy, data-plane, sidecar, service-mesh, cncf]
---

# Envoy Proxy

> Envoy e o proxy de alto desempenho que forma a base do Data Plane do Istio — totalmente desacoplado da aplicacao.

## Key concept

Envoy e um proxy open source (CNCF) desenvolvido pela Lyft que opera nas camadas 4 (TCP) e 7 (HTTP/gRPC). Totalmente desacoplado da aplicacao: o codigo nao conhece o Envoy. No Istio, atua como o Data Plane.

## Desacoplamento total

```yaml
# Envoy injetado automaticamente pelo Istio
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
  labels:
    istio-injection: enabled
```

## Relacao Envoy / Istio

```
Istio
├── Control Plane (istiod)  <- Configura as regras
└── Data Plane (Envoy)      <- Executa o trafego
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Envoy e parte do Istio | Envoy e projeto independente (CNCF) |
| Preciso configurar Envoy no codigo | Totalmente desacoplado |
| Envoy so funciona com HTTP | Opera em L4 (TCP) e L7 (HTTP/gRPC) |
| Envoy foi criado pelo Google | Desenvolvido pela Lyft |

## Limitations

- Envoy sozinho nao e um service mesh — precisa do Control Plane
- Adiciona latencia (minima) por ser um hop extra
- EnvoyFilter pode ser complexo e fragil

## Troubleshooting

### Sidecar Envoy nao aparece no pod
**Symptom:** `kubectl get pods` mostra apenas 1/1 containers quando deveria ter 2/2 (app + envoy)
**Cause:** Namespace nao tem o label `istio-injection: enabled` ou o pod foi criado antes da instalacao do Istio
**Fix:** Adicione `istio-injection: enabled` ao namespace e faca `kubectl rollout restart deployment <name> -n <namespace>`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
