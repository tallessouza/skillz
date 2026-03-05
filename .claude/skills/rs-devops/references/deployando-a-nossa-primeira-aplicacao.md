---
name: rs-devops-deployando-primeira-aplicacao
description: "Applies Kubernetes deployment workflow when deploying applications to a K8s cluster. Use when user asks to 'deploy to kubernetes', 'create a deployment manifest', 'push docker image', 'create k8s namespace', or 'write deployment yaml'. Follows pattern: build image, tag with username, push to registry, create namespace, apply manifest. Make sure to use this skill whenever creating Kubernetes deployment manifests or Docker image push workflows. Not for Helm charts, Istio/service mesh configuration, or CI/CD pipeline setup."
---

# Deployando Aplicacao no Kubernetes

> Crie manifestos de deployment com replicas, estrategia de rolling update, resource limits, e faca push da imagem para um registry antes de aplicar.

## Rules

1. **Sempre defina replicas explicitamente** — nunca deixe o default de 1, porque em producao voce precisa de redundancia e o rolling update precisa de margem
2. **Sempre defina strategy rolling update** — com `maxSurge` e `maxUnavailable` em porcentagem, porque isso controla o comportamento de deploy sem downtime
3. **Labels do selector DEVEM coincidir com labels do template** — se nao baterem, o ReplicaSet nunca encontra os pods e fica recriando infinitamente
4. **Sempre defina resources requests E limits** — porque sem isso o scheduler nao consegue alocar corretamente e pods podem consumir recursos indefinidamente
5. **Use imagePullPolicy: IfNotPresent** — porque economiza banda e forca voce a taguear corretamente (latest so baixa uma vez e nao atualiza)
6. **Tageie imagens com versao, nunca apenas latest** — a tag deve ser a hash do commit em producao, porque garante rastreabilidade
7. **Crie namespace dedicado antes de aplicar** — nunca use o namespace default, porque isola recursos e facilita cleanup

## How to write

### Deployment manifest

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
        app: app-service-mesh  # DEVE ser igual ao selector.matchLabels
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
# Build com tag local
docker build -t app-service-mesh:v1 .

# Tag para o registry (usuario/repo:tag)
docker tag app-service-mesh:v1 usuario/app-service-mesh:v1

# Push (precisa estar logado: docker login)
docker push usuario/app-service-mesh:v1
```

### Criar namespace e aplicar

```bash
kubectl create ns app
kubectl apply -f k8s/ -n app
kubectl get pods -n app
```

## Example

**Before (erros comuns):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  # sem replicas (default 1)
  # sem strategy
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: api  # DIFERENTE do selector — ReplicaSet se perde
    spec:
      containers:
        - name: myapp
          image: myapp:latest  # sem usuario, push falha
          # sem resources
```

**After (com esta skill aplicada):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 20%
      maxUnavailable: 10%
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp  # IGUAL ao selector
    spec:
      containers:
        - name: myapp
          image: usuario/myapp:v1
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Repositorio privado (ECR, Docker Hub privado) | Configure Secret de pull no cluster |
| Repositorio publico | Nenhuma autenticacao necessaria para pull |
| Precisa fazer push | `docker login` antes, tag com `usuario/repo:tag` |
| Sem CI/CD | Tag manual com hash do commit como boa pratica |
| Multiplas aplicacoes no cluster | Crie namespaces separados por aplicacao |
| Sem probes configuradas | Kubernetes nao sabe se app esta saudavel — adicione em producao |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `docker push app:v1` (sem usuario) | `docker push usuario/app:v1` |
| Aplicar no namespace default | `kubectl apply -f k8s/ -n app` |
| Labels diferentes entre selector e template | Labels identicas em ambos |
| Sem resources definidos | Sempre requests + limits |
| `imagePullPolicy: Always` sem necessidade | `IfNotPresent` para economizar banda |
| Tag `latest` em producao | Tag com versao ou hash do commit |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-deployando-a-nossa-primeira-aplicacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-deployando-a-nossa-primeira-aplicacao/references/code-examples.md)
