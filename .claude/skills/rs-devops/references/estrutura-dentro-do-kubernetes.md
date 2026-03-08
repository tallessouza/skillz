---
name: rs-devops-estrutura-dentro-do-kubernetes
description: "Enforces correct multi-container pod patterns in Kubernetes, specifically sidecar vs application separation. Use when user asks to 'add sidecar', 'run multiple containers in pod', 'configure istio injection', 'setup sidecar proxy', or 'design pod structure'. Covers sidecar as valid multi-container pattern, automatic injection via namespace labels, and anti-pattern of running multiple applications in same pod. Make sure to use this skill whenever designing pod specifications with multiple containers. Not for init containers, DaemonSets, or pod networking configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: service-mesh
  tags: [kubernetes, sidecar, pod, multi-container, istio-injection, namespace, envoy]
---

# Estrutura do Sidecar no Kubernetes

> Pods podem rodar multiplos containers, mas apenas sidecars devem acompanhar o container principal — nunca outras aplicacoes.

## Rules

1. **Nunca rode multiplas aplicacoes no mesmo pod** — concorrem por recursos
2. **Segregue aplicacoes em ReplicaSets separados** — escala independente
3. **Sidecars sao a excecao valida para multi-container** — proxy/auxiliar, nao app concorrente
4. **Use injecao automatica de sidecar via namespace** — configurar manualmente nao escala
5. **Multiplos sidecars sao validos** — Vault + Istio no mesmo pod e valido

## How to write

### Namespace com injecao automatica (Istio)

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: skillz
  labels:
    istio-injection: enabled
```

### Pod com sidecar (estrutura resultante)

```yaml
spec:
  containers:
    - name: app
      image: minha-app:latest
      ports:
        - containerPort: 8080
    # Sidecar do Istio (envoy) injetado automaticamente
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Duas apps no mesmo pod | ReplicaSets separados |
| Sidecar manualmente em cada YAML | `istio-injection: enabled` no namespace |
| Confiar que dev lembrou de adicionar sidecar | Injecao automatica como default |
| Rodar sem verificar se sidecar foi injetado | `kubectl get pods -o jsonpath='{.spec.containers[*].name}'` |

## Troubleshooting

### Pod mostra 1/1 READY quando deveria ter sidecar (2/2)
**Symptom:** Apos habilitar istio-injection no namespace, pods novos ainda mostram apenas 1 container
**Cause:** Pods existentes precisam de restart para receberem o sidecar — a injecao so ocorre na criacao do pod
**Fix:** Execute `kubectl rollout restart deployment <name> -n <namespace>` para recriar os pods com sidecar injetado

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
