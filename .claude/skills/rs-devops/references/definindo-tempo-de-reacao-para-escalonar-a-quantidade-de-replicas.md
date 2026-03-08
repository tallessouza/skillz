---
name: rs-devops-hpa-stabilization-scaling-policies
description: "Applies HPA behavior configuration with stabilization windows and scaling policies. Use when user asks to 'configure HPA stabilization', 'set scale down policy', 'control scaling cadence', or 'tune HPA behavior block'. Enforces near-zero scaleUp window, larger scaleDown window, cadence-based policies, and correct selectPolicy placement. Make sure to use this skill whenever tuning HPA behavior blocks or configuring stabilization windows. Not for basic HPA setup (use entendendo-os-principais-triggers) or VPA configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-escalabilidade
  tags: [kubernetes, hpa, autoscaling, stabilization-window, scale-down, scale-up, behavior]
---

# HPA Stabilization Window e Politicas de Escalabilidade

> Configure o bloco `behavior` do HPA com janelas de estabilizacao e politicas de cadencia para controlar como e quando replicas sobem ou descem.

## Rules

1. **Sempre defina pelo menos uma metrica no HPA** — sem metrica o HPA nao consegue escalar
2. **Scale Up com janela proxima de zero** — use 0 ou 5s para evitar downtime
3. **Scale Down com janela maior que Scale Up** — default e 300s, ajuste conforme criticidade
4. **Use policies com cadencia no Scale Down** — remova N pods a cada X segundos
5. **selectPolicy vai dentro de scaleDown/scaleUp, nao em behavior**
6. **Valores reais vem da observabilidade em producao** — no dia zero nao ha esses numeros

## How to write

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  minReplicas: 6
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 30
      policies:
        - type: Pods
          value: 2
          periodSeconds: 15
      selectPolicy: Max
    scaleUp:
      stabilizationWindowSeconds: 5
      policies:
        - type: Pods
          value: 2
          periodSeconds: 5
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| HPA sem nenhuma metrica | Defina pelo menos CPU ou memoria |
| `stabilizationWindowSeconds: 300` no scaleUp | Use 0 ou valor muito baixo |
| `selectPolicy` dentro de `behavior` direto | Coloque dentro de `scaleDown` ou `scaleUp` |
| Dropar todas replicas de uma vez no scaleDown | Use policy com cadencia |

## Troubleshooting

### HPA nao escala mesmo com CPU alta
**Symptom:** CPU acima do threshold mas HPA nao cria novas replicas
**Cause:** Falta declarar `metrics` no spec do HPA — sem metrica o HPA nao consegue escalar
**Fix:** Adicionar bloco `metrics` com pelo menos uma metrica de CPU ou memoria no spec do HPA

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
