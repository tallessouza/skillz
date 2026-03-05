---
name: rs-devops-entendendo-os-principais-triggers
description: "Applies Horizontal Pod Autoscaler (HPA) best practices when configuring Kubernetes autoscaling. Use when user asks to 'configure HPA', 'autoscale pods', 'set up horizontal scaling', 'define resource limits', or 'create HPA manifest'. Enforces trigger-based scaling with CPU/memory metrics, min/max replica boundaries, and alerting thresholds. Make sure to use this skill whenever writing or reviewing HPA configurations or deployment resource specs. Not for KEDA event-driven scaling, VPA vertical scaling, or node-level cluster autoscaler configuration."
---

# HPA — Horizontal Pod Autoscaler Triggers

> Configure HPA com triggers baseados em metricas de CPU e memoria, sempre definindo limites minimos e maximos de replicas para evitar escala descontrolada.

## Rules

1. **Sempre defina resources no Deployment** — `requests` e `limits` de CPU e memoria sao obrigatorios, porque o HPA depende dessas metricas para calcular utilizacao percentual
2. **Defina min e max replicas** — nunca deixe HPA sem `maxReplicas`, porque escala infinita gera custo descontrolado e pode indicar problema na aplicacao
3. **Use triggers percentuais** — configure gatilhos em 70-80% de utilizacao, porque isso da margem para novos pods subirem antes do limite ser atingido
4. **maxReplicas como alerta** — se a aplicacao atingir maxReplicas, isso indica anomalia; configure alertas (Slack, PagerDuty) nesse threshold
5. **Nunca escale manualmente no cluster** — alteracoes de replicas devem passar pelo Git/SCM, porque mudancas diretas no cluster nao ficam lastreadas no manifesto
6. **HPA cuida do scale-down automaticamente** — quando o trafego baixa, o HPA retorna ao `minReplicas`; nao faca downsize manual

## How to write

### Deployment com resources (pre-requisito do HPA)

```yaml
# Resources sao obrigatorios para HPA funcionar
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: app
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "200m"
              memory: "256Mi"
```

### HPA basico com CPU e memoria

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
  namespace: app-namespace
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

## Example

**Before (escala manual, sem HPA):**
```yaml
# Problema: alterar replicas manualmente causa downtime e custo
spec:
  replicas: 10  # subiu manual, vai esquecer de baixar
```

**After (com HPA gerenciando):**
```yaml
# Deployment com 3 replicas base
spec:
  replicas: 3
---
# HPA escala automaticamente entre 3 e 8
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 3
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 80
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App com trafego previsivel | minReplicas = baseline normal, maxReplicas = 2-3x baseline |
| App atingiu maxReplicas | Investigue a causa antes de aumentar o limite |
| Precisa escalar por eventos (filas, mensagens) | Use KEDA, nao HPA nativo |
| Metrics Server nao instalado | Instale primeiro; HPA depende dele para coletar metricas |
| Quer escalar por CPU E memoria | Configure ambos; qualquer um que atingir o threshold dispara escala |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| HPA sem `maxReplicas` | Sempre defina limite maximo |
| `kubectl scale` direto no cluster | Altere replicas via Git e redeploy |
| Deployment sem `resources.requests` | Defina requests e limits antes de criar HPA |
| maxReplicas = 100 "por seguranca" | maxReplicas = 2-3x do baseline com alerta |
| Escalar manualmente e esquecer de voltar | Deixe o HPA fazer scale-down automatico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
