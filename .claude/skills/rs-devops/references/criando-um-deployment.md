---
name: rs-devops-criando-um-deployment
description: "Applies Kubernetes Deployment manifest patterns when writing YAML for container orchestration. Use when user asks to 'create a deployment', 'deploy to kubernetes', 'write k8s manifest', 'update container version', or 'manage replicas'. Enforces correct apiVersion, resource limits, namespace usage, selector-label matching, and rolling update strategy. Make sure to use this skill whenever generating Kubernetes Deployment YAML or discussing deployment vs ReplicaSet. Not for Services, Ingress, ConfigMaps, or non-Kubernetes container orchestration."
---

# Kubernetes Deployment

> Deployment e o componente de implantacao e controle de versao no Kubernetes — ele gerencia ReplicaSets que por sua vez gerenciam Pods.

## Rules

1. **Sempre especifique namespace no apply** — `kubectl apply -f file.yaml -n namespace`, porque sem isso o recurso vai para o namespace `default` e causa confusao organizacional
2. **Deployment > ReplicaSet > Pod** — nunca use ReplicaSet ou Pod isolado para workloads de producao, porque somente o Deployment tem controle de implantacao (versionamento e rollback)
3. **Labels do selector devem coincidir com labels do template** — o `matchLabels` do spec.selector deve ser identico ao `metadata.labels` do template, porque o Deployment usa isso para encontrar seus Pods
4. **Sempre defina resources requests e limits** — omitir resources e uma ma pratica que gera alertas e scheduling imprevisivel
5. **Limits = 2x requests como baseline** — CPU e memoria dos limits devem ser pelo menos o dobro dos requests, porque isso da margem para picos sem desperdicar recursos
6. **Sempre declare containerPort** — explicitar a porta do container no manifest documenta o servico e facilita integracao com Services

## How to write

### Deployment completo

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

### Aplicando com namespace

```bash
kubectl apply -f deployment.yaml -n primeira-app
```

## Example

**Before (Pod isolado — sem controle de versao):**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.27.1-alpine-slim
```
Problema: alterar a imagem nao causa re-deploy. Sem replicas, sem rollback.

**After (Deployment — controle completo):**
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
Alterar a imagem e rodar `kubectl apply` dispara rolling update automatico com zero downtime.

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo workload stateless | Sempre use Deployment, nunca Pod ou ReplicaSet direto |
| Atualizar versao da imagem | Altere o campo `image` no YAML e rode `kubectl apply -f -n namespace` |
| Rollback necessario | `kubectl rollout undo deployment/nome -n namespace` |
| Verificar status do deploy | `kubectl rollout status deployment/nome -n namespace` |
| Escalar replicas | Altere `replicas` no YAML ou use `kubectl scale deployment/nome --replicas=N` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `kubectl apply -f x.yaml` sem `-n` | `kubectl apply -f x.yaml -n meu-namespace` |
| Usar ReplicaSet diretamente | Usar Deployment que gerencia o ReplicaSet |
| Usar Pod isolado em producao | Usar Deployment com replicas >= 2 |
| Omitir resources/limits | Definir requests e limits para CPU e memoria |
| Labels diferentes entre selector e template | Garantir que matchLabels == template.metadata.labels |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-criando-um-deployment/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-criando-um-deployment/references/code-examples.md)
