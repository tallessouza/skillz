---
name: rs-devops-deployando-a-nossa-primeira-aplicacao
description: "Applies Kubernetes Deployment manifest creation with rolling update strategy, resource limits, and registry push workflow. Use when user asks to 'create Kubernetes deployment', 'deploy app to K8s', 'configure rolling update', or 'push image to registry'. Enforces explicit replicas, rolling update strategy, matching selector labels, resource requests/limits, and versioned image tags. Make sure to use this skill whenever writing Kubernetes Deployment manifests or pushing images to a container registry. Not for Helm charts or Kustomize overlays."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-deployments
  tags: [kubernetes, deployment, rolling-update, docker, registry, resources, namespace]
---

# Deployando Aplicacao no Kubernetes

> Crie manifestos de deployment com replicas, estrategia de rolling update, resource limits, e faca push da imagem para um registry antes de aplicar.

## Rules

1. **Sempre defina replicas explicitamente** — nunca deixe o default de 1
2. **Sempre defina strategy rolling update** — com `maxSurge` e `maxUnavailable` em porcentagem
3. **Labels do selector DEVEM coincidir com labels do template**
4. **Sempre defina resources requests E limits**
5. **Use imagePullPolicy: IfNotPresent**
6. **Tageie imagens com versao, nunca apenas latest**
7. **Crie namespace dedicado antes de aplicar** — nunca use o namespace default

## How to write

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 20%
      maxUnavailable: 10%
  selector:
    matchLabels:
      app: app-service-mesh
  template:
    metadata:
      labels:
        app: app-service-mesh
    spec:
      containers:
        - name: app-service-mesh
          image: usuario/app-service-mesh:v1
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 200m
              memory: 128Mi
            limits:
              cpu: 400m
              memory: 256Mi
```

### Docker build, tag e push

```bash
docker build -t app-service-mesh:v1 .
docker tag app-service-mesh:v1 usuario/app-service-mesh:v1
docker push usuario/app-service-mesh:v1
```

### Criar namespace e aplicar

```bash
kubectl create ns app
kubectl apply -f k8s/ -n app
```

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `docker push app:v1` (sem usuario) | `docker push usuario/app:v1` |
| Aplicar no namespace default | `kubectl apply -f k8s/ -n app` |
| Labels diferentes entre selector e template | Labels identicas em ambos |
| Tag `latest` em producao | Tag com versao ou hash do commit |

## Troubleshooting

### Pod fica em ImagePullBackOff
**Symptom:** Pod nao inicia e mostra status ImagePullBackOff
**Cause:** Imagem nao foi pushada para o registry ou nome/tag esta incorreto
**Fix:** Verificar que `docker push usuario/app:v1` foi executado com sucesso e que o nome da imagem no manifest bate exatamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
