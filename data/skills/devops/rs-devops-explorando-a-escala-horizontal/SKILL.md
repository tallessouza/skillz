---
name: rs-devops-explorando-a-escala-horizontal
description: "Applies Kubernetes horizontal scaling patterns when designing pod autoscaling, HPA configuration, or replica strategies. Use when user asks to 'scale pods', 'configure HPA', 'add autoscaling', 'handle more traffic', or 'replicate application'. Covers HPA resource-based scaling, KEDA event-driven scaling, redundancy planning, and stateful caveats. Make sure to use this skill whenever designing Kubernetes workload scaling strategies. Not for vertical scaling (VPA), node-level autoscaling (Cluster Autoscaler), or non-Kubernetes infrastructure."
---

# Escala Horizontal no Kubernetes

> Replique pods horizontalmente para distribuir carga, aumentar redundancia e tolerar falhas — nunca dependa de um unico pod ou dos limites de uma unica maquina.

## Rules

1. **Escala horizontal replica pods, nao aumenta hardware** — crie mais instancias ao inves de aumentar CPU/memoria de uma so, porque isso elimina o teto do hardware individual
2. **Distribua carga igualmente com balanceador** — use algoritmos como Round Robin na frente dos pods, porque pods sobrecarregados individualmente anulam o beneficio da replicacao
3. **Calcule redundancia como percentual** — 5 pods com 1 falhando = 80% de disponibilidade, porque isso permite planejar tolerancia a falhas com numeros concretos
4. **Use HPA para autoscaling baseado em recursos** — HPA e built-in do Kubernetes (dia zero), diferente do VPA que requer instalacao adicional
5. **Use KEDA para autoscaling baseado em eventos** — quando a carga depende de mensageria (Kafka, RabbitMQ, SQS), porque o HPA so monitora CPU/memoria
6. **Sempre defina limites na escala** — mesmo sem restricao de hardware, configure maxReplicas, porque escala sem limite gera custos descontrolados
7. **Cuidado com aplicacoes stateful** — replicacao horizontal com volumes persistentes causa problemas de consistencia de dados distribuidos

## How to write

### HPA basico por CPU

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
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 80  # Trigger: 80% CPU → scale up
```

### Deployment com replicas iniciais

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 3  # Principio da horizontalidade: 3 pods desde o inicio
  template:
    spec:
      containers:
        - name: app
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

## Example

**Before (escala manual, sem autoscaling):**
```yaml
# Operador precisa estar online para alterar replicas manualmente
spec:
  replicas: 5  # Fixo — nao responde a picos de trafego
```

**After (HPA com autoscaling por CPU e memoria):**
```yaml
# HPA ajusta automaticamente baseado em condicoes
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 3
  maxReplicas: 15
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
          averageUtilization: 75
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao stateless com trafego variavel | HPA com CPU/memoria targets |
| Microservicos com mensageria (Kafka, SQS) | KEDA para scaling baseado em eventos |
| Precisa de alta disponibilidade | minReplicas >= 3 para redundancia |
| Picos imprevisiveis (finais de semana, eventos) | Autoscaling — nunca dependa de escala manual |
| Aplicacao stateful com volumes persistentes | Avalie StatefulSet antes de replicar — risco de inconsistencia |
| Nos do cluster estao lotados | Escale nos horizontalmente (Cluster Autoscaler) antes de mais pods |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Escala manual como estrategia principal | Configure HPA para resposta automatica |
| maxReplicas sem limite definido | Sempre defina maxReplicas com base em custo e capacidade |
| HPA sem resource requests no Deployment | Defina requests de CPU/memoria — HPA depende disso para calcular |
| Replicar pods stateful sem avaliar consistencia | Use StatefulSet e avalie estrategia de dados distribuidos |
| Assumir que escalar pods resolve tudo | Verifique se os nos comportam os pods — pode precisar de Cluster Autoscaler |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
