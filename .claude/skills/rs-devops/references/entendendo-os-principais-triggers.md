---
name: rs-devops-entendendo-os-principais-triggers
description: "Applies HPA configuration with CPU and memory metric triggers for Kubernetes autoscaling. Use when user asks to 'configure HPA', 'setup autoscaling triggers', 'define min/max replicas', or 'autoscale based on CPU/memory'. Enforces resource requests/limits in Deployment, min/max replicas definition, percentage-based triggers, and GitOps for scaling changes. Make sure to use this skill whenever creating HorizontalPodAutoscaler manifests or configuring autoscaling triggers. Not for HPA behavior tuning (use definindo-tempo-de-reacao) or VPA configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-escalabilidade
  tags: [kubernetes, hpa, autoscaling, cpu, memory, triggers, replicas, metrics]
---

# HPA — Horizontal Pod Autoscaler Triggers

> Configure HPA com triggers baseados em metricas de CPU e memoria, sempre definindo limites minimos e maximos de replicas.

## Rules

1. **Sempre defina resources no Deployment** — `requests` e `limits` sao obrigatorios para o HPA
2. **Defina min e max replicas** — nunca deixe HPA sem `maxReplicas`
3. **Use triggers percentuais** — configure gatilhos em 70-80% de utilizacao
4. **maxReplicas como alerta** — atingir maxReplicas indica anomalia
5. **Nunca escale manualmente no cluster** — alteracoes devem passar pelo Git
6. **HPA cuida do scale-down automaticamente**

## How to write

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-deployment
  minReplicas: 3
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 80
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| HPA sem `maxReplicas` | Sempre defina limite maximo |
| `kubectl scale` direto no cluster | Altere replicas via Git |
| Deployment sem `resources.requests` | Defina requests e limits antes do HPA |
| maxReplicas = 100 "por seguranca" | 2-3x do baseline com alerta |

## Troubleshooting

### HPA mostra unknown para metricas de CPU
**Symptom:** `kubectl get hpa` mostra `<unknown>/80%` na coluna de CPU
**Cause:** Deployment nao tem `resources.requests` definido — HPA precisa do request para calcular porcentagem
**Fix:** Adicionar `resources.requests.cpu` e `resources.limits.cpu` no container spec do Deployment

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
