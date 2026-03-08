---
name: rs-devops-explorando-a-v-1-do-hpa
description: "Applies Kubernetes HPA v1 manifest patterns when creating or reviewing Horizontal Pod Autoscaler configurations. Use when user asks to 'create HPA', 'autoscale pods', 'horizontal pod autoscaler', 'scale kubernetes app', or 'configure CPU-based scaling'. Covers scaleTargetRef, minReplicas, maxReplicas, and targetCPUUtilizationPercentage. Make sure to use this skill whenever generating HPA v1 manifests or reviewing existing ones. Not for HPA v2beta2/v2 configurations, memory-based scaling, or custom metrics."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-scaling
  tags: [kubernetes, hpa, hpa-v1, autoscaling, cpu-scaling, scaleTargetRef]
---

# Kubernetes HPA v1

> Ao criar um HPA v1, defina o target de CPU entre 75-80% para evitar tanto ociosidade quanto saturacao antes do scale-up.

## Rules

1. **HPA e por aplicacao, nao por cluster** — cada deployment tem seu proprio manifesto HPA, porque o HPA observa um deployment especifico via `scaleTargetRef`
2. **Use apiVersion autoscaling/v1** — a v1 so suporta CPU, memoria foi deprecada nesta versao
3. **Target CPU entre 75-80%** — valores muito baixos (ex: 30%) causam hiperescala e ociosidade; valores muito altos (ex: 95%) nao dao tempo para novos pods subirem antes da saturacao
4. **maxReplicas deve ser mais que o dobro de minReplicas** — permite absorver picos sazonais (campanhas, promocoes) sem atingir o teto rapidamente
5. **Use imagePullPolicy: IfNotPresent no deployment** — durante scale-up, evita pull desnecessario da imagem, reduzindo tempo de bootstrap dos novos pods
6. **v1 nao suporta targetMemoryUtilizationPercentage** — o campo foi deprecado e o apply vai falhar; use v2 para escala por memoria

## How to write

### Manifesto HPA v1 completo

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: appts-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: appts
  minReplicas: 3
  maxReplicas: 8
  targetCPUUtilizationPercentage: 75
```

### scaleTargetRef

```yaml
# Sempre referencie apiVersion, kind e name do deployment alvo
scaleTargetRef:
  apiVersion: apps/v1
  kind: Deployment
  name: <nome-do-deployment>
```

## Example

**Before (erro comum — target memory na v1):**
```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: appts-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: appts
  minReplicas: 3
  maxReplicas: 8
  targetCPUUtilizationPercentage: 75
  targetMemoryUtilizationPercentage: 75  # ERRO: campo nao existe na v1
```

**After (correto — apenas CPU na v1):**
```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: appts-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: appts
  minReplicas: 3
  maxReplicas: 8
  targetCPUUtilizationPercentage: 75
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa escalar por CPU apenas | HPA v1 atende |
| Precisa escalar por memoria ou custom metrics | Use HPA v2 |
| Target CPU < 50% | Provavelmente muito baixo, causa ociosidade |
| Target CPU > 90% | Muito alto, pods nao sobem a tempo |
| Aplicacao com bootstrap lento | Reduza o target para 70-75% |
| Deploy usa imagePullPolicy: Always | Troque para IfNotPresent antes de habilitar HPA |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `targetMemoryUtilizationPercentage` na v1 | Use HPA v2 para memoria |
| `targetCPUUtilizationPercentage: 30` | Use 75-80 como baseline |
| `targetCPUUtilizationPercentage: 95` | Use 75-80, margem para bootstrap |
| `maxReplicas` igual a `minReplicas` | maxReplicas deve ser >2x minReplicas |
| HPA sem alarmistica no maxReplicas | Configure alertas quando atingir max |
| `imagePullPolicy: Always` com HPA | Use `IfNotPresent` para scale-up rapido |

## Comandos uteis

```bash
# Aplicar HPA
kubectl apply -f k8s/hpa.yaml -n <namespace>

# Verificar HPA
kubectl get hpa -n <namespace>

# Deletar HPA por nome
kubectl delete hpa <nome-hpa> -n <namespace>

# Deletar HPA por arquivo
kubectl delete -f k8s/hpa.yaml -n <namespace>
```

## Troubleshooting

### HPA v1 apply falha com campo targetMemoryUtilizationPercentage
**Symptom:** `kubectl apply` retorna erro ao tentar usar `targetMemoryUtilizationPercentage` no HPA v1
**Cause:** O campo `targetMemoryUtilizationPercentage` foi deprecado e nao existe na API `autoscaling/v1`
**Fix:** Remova o campo e use apenas `targetCPUUtilizationPercentage` na v1, ou migre para `autoscaling/v2` para escalar por memoria

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
