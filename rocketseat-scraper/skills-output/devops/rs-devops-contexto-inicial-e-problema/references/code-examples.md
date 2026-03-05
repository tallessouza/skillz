# Code Examples: Contexto Inicial e Problema do Kubernetes

## Cenario 1: Aplicacao unica sem orquestracao

Esta aula e conceitual — nao ha codigo direto. Os exemplos abaixo ilustram os problemas discutidos com configuracoes praticas.

### Container simples sem protecao (o problema)

```bash
# Rodando um container sem restart policy
docker run -d --name api myapp:latest

# Se o container falhar... fica offline ate alguem perceber
docker ps -a  # Status: Exited (1)

# Resolucao manual
docker start api
```

### Container com restart policy (solucao parcial, sem K8s)

```bash
# Restart automatico resolve falhas simples
docker run -d --restart=unless-stopped --name api myapp:latest
```

## Cenario 2: Replicas manuais (o problema)

```bash
# Tentando replicar manualmente
docker run -d --name api-1 -p 3001:3000 myapp:latest
docker run -d --name api-2 -p 3002:3000 myapp:latest
docker run -d --name api-3 -p 3003:3000 myapp:latest

# Problemas:
# - Quem faz o load balancing entre api-1, api-2, api-3?
# - Se api-2 cair, quem sobe outro?
# - Como escalar para 5 replicas no horario de pico?
```

## Cenario 3: Como Kubernetes resolve (preview)

```yaml
# Deployment com replicas e recursos definidos
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3                    # Problema 2: replicas automaticas
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: myapp:latest
        resources:               # Problema 5: controle de recursos
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
```

```yaml
# HPA para fluxo elastico (Problema 3)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 8                 # Escala ate 8 no pico
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Mapeamento: Problema → Recurso K8s

| Problema da aula | Recurso Kubernetes |
|-------------------|-------------------|
| Container falhar na execucao | Pod restart policy + ReplicaSet |
| Multiplos containers da mesma app | Deployment com replicas |
| Fluxo elastico | HorizontalPodAutoscaler (HPA) |
| Multiplas aplicacoes | Multiplos Deployments + Services |
| Controle de recursos | resources.requests + resources.limits |