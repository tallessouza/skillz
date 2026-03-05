---
name: rs-devops-metrics-server-k8s
description: "Explains Kubernetes Metrics Server architecture and its relationship with HPA (Horizontal Pod Autoscaler). Use when user asks about 'metrics server', 'HPA setup', 'horizontal pod autoscaler', 'kubernetes autoscaling', 'pod metrics', or 'auto scaling kubernetes'. Make sure to use this skill whenever configuring autoscaling in Kubernetes or troubleshooting missing CPU/Memory metrics. Not for application-level monitoring (Prometheus, Grafana, Datadog) or vertical pod autoscaling."
---

# Metrics Server no Kubernetes

> O Metrics Server e o prerequisito obrigatorio para autoscaling horizontal no Kubernetes — sem ele, o HPA nao funciona.

## Key concept

O Metrics Server e um componente open-source do ecossistema Kubernetes SIGs (nao e built-in). Ele coleta metricas de CPU e memoria em near real-time (a cada ~10 segundos) de todos os pods e nodes do cluster. O HPA (Horizontal Pod Autoscaler) depende dessas metricas para tomar decisoes de escala.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| CPU/Memory como "Not Available" no Lens ou `kubectl top` | Metrics Server nao esta instalado — instale primeiro |
| Precisa de autoscaling horizontal | Instale Metrics Server + configure HPA |
| Precisa de metricas historicas ou dashboards | Metrics Server NAO serve — use Prometheus/Grafana |
| Precisa de autoscaling vertical | Use VPA (Vertical Pod Autoscaler), nao HPA |

## How to think about it

### Fluxo de funcionamento

```
Metrics Server (coleta a cada ~10s)
        │
        ▼
  Metrics API (expoe metricas)
        │
        ▼
  HPA (consulta metricas → decide replica count)
        │
        ▼
  Deployment (ajusta replicas automaticamente)
```

### Por que metricas aparecem como "N/A"

Sem o Metrics Server instalado, nenhum componente coleta metricas de uso de recursos. Ferramentas como Lens, `kubectl top pods`, e o HPA dependem da Metrics API — que so existe quando o Metrics Server esta rodando.

### Near real-time, nao real-time

O Metrics Server coleta metricas em intervalos de ~10 segundos. Isso e suficiente para autoscaling mas nao para alertas instantaneos ou observabilidade detalhada.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Metrics Server vem instalado no K8s | E um componente separado, precisa instalar manualmente |
| Metrics Server substitui Prometheus | Metrics Server e para autoscaling; Prometheus e para observabilidade |
| HPA funciona sem Metrics Server | HPA e condicionado ao Metrics Server — sem ele, nao escala |
| Metrics Server armazena historico | Ele so mantem o snapshot mais recente (~10s window) |

## When to apply

- Configurando autoscaling horizontal (HPA) em qualquer cluster
- Diagnosticando por que `kubectl top nodes/pods` retorna erro
- Preparando cluster para producao (Metrics Server e baseline)
- Vendo "Not Available" em colunas de CPU/Memory no Lens

## Limitations

- Nao armazena metricas historicas — apenas o valor mais recente
- Nao serve para alertas ou dashboards (use Prometheus + Grafana)
- Nao monitora metricas customizadas (use Custom Metrics API para isso)
- Near real-time (~10s) pode ser lento demais para cenarios criticos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-como-o-metrics-server-funciona/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-como-o-metrics-server-funciona/references/code-examples.md)
