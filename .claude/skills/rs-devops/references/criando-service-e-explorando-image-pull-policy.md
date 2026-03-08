---
name: rs-devops-k8s-service-image-pull-policy
description: "Applies Kubernetes Service creation and imagePullPolicy best practices when exposing deployments. Use when user asks to 'create k8s service', 'expose deployment', 'configure ClusterIP', 'set imagePullPolicy', or 'map service ports'. Enforces ClusterIP as default type, port-to-targetPort mapping, label consistency, and IfNotPresent pull policy. Make sure to use this skill whenever creating Kubernetes Services or configuring image pull behavior. Not for Ingress, LoadBalancer setup, or Helm chart configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-services
  tags: [kubernetes, service, clusterip, imagePullPolicy, ports, labels]
---

# Kubernetes Service e imagePullPolicy

> Ao criar Services no Kubernetes, mapeie portas corretamente para o deployment e mantenha imutabilidade de tags com imagePullPolicy IfNotPresent.

## Rules

1. **Use ClusterIP como tipo padrao de Service** — exposicao interna segura, compativel com Ingress
2. **Mapeie porta 80 no Service para a porta do container** — `port: 80` com `targetPort: 3000`
3. **Labels do selector devem coincidir com o deployment** — identicos entre Service e Deployment
4. **Sempre declare imagePullPolicy: IfNotPresent** — garante imutabilidade
5. **Nunca reutilize tags de imagem** — cada deploy deve ter tag unica

## How to write

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-svc
spec:
  type: ClusterIP
  selector:
    matchLabels:
      app: app-name
  ports:
    - port: 80
      targetPort: 3000
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `image: app:latest` | `image: app:v2` ou `image: app:abc123` |
| `imagePullPolicy: Always` em producao | `imagePullPolicy: IfNotPresent` |
| `port: 3000` no Service | `port: 80, targetPort: 3000` |
| Labels diferentes entre Service e Deployment | Labels identicos no selector |

## Troubleshooting

### Service nao roteia trafego para os pods
**Symptom:** Requests ao Service retornam erro ou timeout, mas os pods estao rodando.
**Cause:** As labels no `selector` do Service nao correspondem as labels no `template.metadata.labels` do Deployment.
**Fix:** Verifique que as labels sao identicas entre o selector do Service e o template do Deployment. Use `kubectl describe svc <name>` para ver o selector e `kubectl get pods --show-labels` para comparar.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
