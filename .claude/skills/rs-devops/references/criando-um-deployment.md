---
name: rs-devops-criando-deployment
description: "Applies Kubernetes Deployment manifest patterns when creating production workloads. Use when user asks to 'create deployment', 'write deployment yaml', 'deploy to kubernetes', 'configure replicas', or 'set resource limits'. Enforces Deployment over ReplicaSet, namespace usage, label consistency, resource requests/limits, and containerPort declaration. Make sure to use this skill whenever generating Kubernetes Deployment manifests. Not for StatefulSets, DaemonSets, Jobs, or Helm chart templates."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-deployments
  tags: [kubernetes, deployment, replicas, resources, labels, namespace]
---

# Kubernetes Deployment

> Deployment e o componente de implantacao e controle de versao no Kubernetes — ele gerencia ReplicaSets que por sua vez gerenciam Pods.

## Rules

1. **Sempre especifique namespace no apply** — `kubectl apply -f file.yaml -n namespace`
2. **Deployment > ReplicaSet > Pod** — nunca use ReplicaSet ou Pod isolado para producao
3. **Labels do selector devem coincidir com labels do template**
4. **Sempre defina resources requests e limits**
5. **Limits = 2x requests como baseline**
6. **Sempre declare containerPort**

## How to write

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 5
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.27.1-alpine-slim
          resources:
            requests:
              cpu: 100m
              memory: 164Mi
            limits:
              cpu: 200m
              memory: 328Mi
          ports:
            - containerPort: 80
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `kubectl apply` sem `-n` | Sempre especifique namespace |
| Usar ReplicaSet diretamente | Usar Deployment |
| Pod isolado em producao | Deployment com replicas >= 2 |
| Omitir resources/limits | Definir requests e limits |

## Troubleshooting

### Pod criado no namespace default acidentalmente
**Symptom:** `kubectl get pods` no namespace da aplicacao nao mostra os pods, mas eles existem no namespace `default`.
**Cause:** O comando `kubectl apply` foi executado sem a flag `-n <namespace>`.
**Fix:** Sempre use `kubectl apply -f deployment.yaml -n <namespace>`. Para corrigir, delete os pods do namespace errado e reaplique com `-n`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
