---
name: rs-devops-esboco-do-problema
description: "Applies Kubernetes orchestration fundamentals when designing container deployments, resource declarations, or autoscaling strategies. Use when user asks to 'deploy to kubernetes', 'configure pod resources', 'setup HPA', 'declare resource limits', or 'plan kubernetes architecture'. Enforces pod ephemerality, declarative resource management, HPA configuration, and horizontal-first scaling. Make sure to use this skill whenever planning Kubernetes workload architecture or writing deployment manifests. Not for Docker-only deployments, serverless architectures, or VM-based infrastructure."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-fundamentos
  tags: [kubernetes, pods, hpa, autoscaling, resources, orchestration, stateless]
---

# Kubernetes: Esboco do Problema

> Aplicacoes containerizadas precisam de orquestracao para garantir redundancia, elasticidade e gestao de recursos.

## Key concepts

1. **Container = unidade efemera** — Kubernetes mata e recria como mecanismo de recuperacao
2. **Pod = container no Kubernetes** — pod e replica sao sinonimos praticos
3. **Stateless por padrao** — pods nao guardam estado local
4. **Recursos sao declarativos** — cada pod declara quanto de RAM e CPU precisa
5. **Replicacao horizontal primeiro** — escale com mais pods (HPA), nao mais recursos
6. **Elasticidade tem custo** — configure minimo e maximo

## Como Declarar Recursos

```yaml
resources:
  requests:
    memory: "1Gi"
    cpu: "1000m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

## Como Configurar HPA

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-a
  minReplicas: 3
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 70
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Guardar logs dentro do container | Exportar para ferramenta de observabilidade |
| Guardar assets no filesystem do pod | Enviar para S3/Blob Storage |
| Rodar sem limite de recursos | Declarar requests e limits |
| Escalar apenas verticalmente | Usar HPA (horizontal) como padrao |
| Rodar replicas fixas sem autoscaling | Configurar HPA com min/max |

## Troubleshooting

### HPA nao escala — mostra "unknown" nos targets
**Symptom:** `kubectl get hpa` mostra `<unknown>/70%` na coluna TARGETS
**Cause:** Metrics Server nao esta instalado no cluster ou o Deployment nao tem `resources.requests` definidos
**Fix:** Instale o Metrics Server (`kubectl apply -f components.yaml`) e adicione `resources.requests` de cpu e memoria no Deployment

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
