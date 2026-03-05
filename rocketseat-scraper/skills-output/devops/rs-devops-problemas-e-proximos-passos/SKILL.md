---
name: rs-devops-problemas-e-proximos-passos
description: "Applies Kubernetes pod ephemerality and controller concepts when designing or reviewing cluster workloads. Use when user asks to 'create a pod', 'deploy to kubernetes', 'run containers in k8s', 'write a pod manifest', or reviews Kubernetes YAML. Enforces redundancy via ReplicaSet/Deployment instead of bare pods. Make sure to use this skill whenever generating Kubernetes manifests or discussing pod lifecycle. Not for Docker Compose, local Docker, or non-Kubernetes container orchestration."
---

# Pods Efêmeros e Controladores Kubernetes

> Nunca execute pods isolados em producao — use controllers (ReplicaSet/Deployment) para garantir redundancia e auto-recuperacao.

## Conceito central

Pods sao 100% efemeros e descartaveis. Um pod deletado manualmente NAO e recriado automaticamente. Somente controllers (ReplicaSet, Deployment) garantem que o numero desejado de replicas esteja sempre rodando.

## Rules

1. **Nunca crie pods bare em producao** — use Deployment ou ReplicaSet, porque um pod isolado que morre nao e recriado automaticamente
2. **Defina replicas >= 2 para disponibilidade** — um unico pod significa downtime durante falhas, porque entre a morte e a recriacao voce fica indisponivel
3. **Pod e a menor unidade do Kubernetes** — ele nao tem logica de auto-recuperacao, porque essa responsabilidade pertence aos controllers acima dele na hierarquia
4. **Declare o estado desejado, nao o imperativo** — o controller verifica continuamente se o numero de pods rodando corresponde ao declarado, porque Kubernetes e declarativo

## Decision framework

| Situacao | Use |
|----------|-----|
| Teste local rapido, debug | Pod bare (kubectl run) OK |
| Qualquer carga em producao | Deployment (com replicas >= 2) |
| Workload stateless | Deployment |
| Workload stateful | StatefulSet |
| Job unico (batch) | Job/CronJob |

## Hierarquia de objetos

```
Deployment (controla)
  └── ReplicaSet (garante N replicas)
       └── Pod (unidade minima, efemero)
```

O Deployment gerencia ReplicaSets. O ReplicaSet garante que exatamente N pods estejam rodando. Se um pod morre ou e deletado, o ReplicaSet cria outro.

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `kind: Pod` em producao | `kind: Deployment` com `replicas: 2+` |
| `replicas: 1` para servicos criticos | `replicas: 2` minimo para disponibilidade |
| Deletar pod esperando recriacao automatica (sem controller) | Usar Deployment — ele recria automaticamente |
| Gerenciar pods manualmente com scripts | Declarar estado desejado no manifesto YAML |

## Exemplo

**Errado (pod bare — nao se recupera):**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: minha-app
spec:
  containers:
    - name: app
      image: minha-app:1.0
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 200m
          memory: 256Mi
```

**Correto (Deployment com replicas):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: minha-app
  template:
    metadata:
      labels:
        app: minha-app
    spec:
      containers:
        - name: app
          image: minha-app:1.0
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 200m
              memory: 256Mi
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Usuario pede `kind: Pod` | Perguntar se e teste ou producao; sugerir Deployment |
| Manifesto sem `replicas` | Adicionar `replicas: 2` minimo |
| Pod deletado e nao volta | Verificar se existe controller gerenciando-o |
| Servico precisa de zero-downtime | `replicas >= 2` + readiness probes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
