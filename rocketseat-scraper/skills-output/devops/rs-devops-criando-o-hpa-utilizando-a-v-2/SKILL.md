---
name: rs-devops-hpa-v2
description: "Applies Kubernetes HPA v2 configuration patterns when writing autoscaling manifests. Use when user asks to 'create HPA', 'configure autoscaling', 'scale pods', 'horizontal pod autoscaler', or 'auto scale kubernetes'. Enforces v2 API with combined CPU/memory metrics, average utilization targets, and proper scaleTargetRef. Make sure to use this skill whenever generating Kubernetes autoscaling manifests. Not for Vertical Pod Autoscaler, KEDA, or cluster-level autoscaling."
---

# HPA v2 — Horizontal Pod Autoscaler

> Ao configurar autoscaling no Kubernetes, usar sempre a API `autoscaling/v2` com metricas combinadas de CPU e memoria.

## Rules

1. **Usar `autoscaling/v2`, nunca v1** — porque v2 suporta multiplas metricas simultaneamente (CPU + memoria), enquanto v1 so permite CPU
2. **Definir metricas como array em `metrics`** — cada metrica tem seu proprio `type`, `resource.name` e `target`, porque isso substitui o campo `targetCPUUtilizationPercentage` da v1
3. **Usar `type: Utilization` com `averageUtilization`** — valores em porcentagem relativa ao `requests` do container, porque o HPA calcula com base no requests, nao no limits
4. **Definir `minReplicas` e `maxReplicas` explicitamente** — porque sem limites o HPA pode escalar para 1 pod (indisponibilidade) ou infinitos pods (custo)
5. **Ajustar requests do deployment antes de ajustar o HPA** — porque se requests esta subdimensionado, o HPA vai escalar desnecessariamente mesmo sem carga real
6. **Considerar que deploy causa pico de memoria temporario** — ao usar metrica de memoria, prever que subida de pods consome mais memoria, causando escala desnecessaria

## How to write

### Manifesto HPA v2 completo

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 3
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 75
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

### scaleTargetRef

```yaml
scaleTargetRef:
  apiVersion: apps/v1    # Deve bater com o apiVersion do Deployment
  kind: Deployment
  name: app              # Nome exato do Deployment alvo
```

## Example

**Before (HPA v1 — limitado a CPU):**
```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 3
  maxReplicas: 8
  targetCPUUtilizationPercentage: 75
```

**After (HPA v2 — CPU + memoria):**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 3
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 75
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## Heuristics

| Situacao | Acao |
|----------|------|
| App so consome CPU (APIs stateless) | Metrica de CPU sozinha ja atende |
| App consome memoria crescente (cache, conexoes) | Adicionar metrica de memoria |
| HPA escalou apos deploy sem carga | Verificar se requests de memoria esta subdimensionado |
| Pods nao voltam ao minimo apos pico | Aguardar — downscale demora por design (estabilizacao) |
| Utilizacao sempre acima do target | Aumentar requests no Deployment, nao o target do HPA |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Usar `autoscaling/v1` para novos HPAs | Usar `autoscaling/v2` |
| Definir `averageUtilization: 50` para memoria | Usar 70-80%, pois deploy causa picos temporarios |
| Ajustar target do HPA quando requests esta errado | Corrigir requests/limits do Deployment primeiro |
| Esperar que HPA olhe para `limits` | HPA calcula porcentagem sobre `requests` |
| Colocar `maxReplicas` sem considerar custo | Definir max com base na capacidade real do cluster |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
