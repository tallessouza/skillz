---
name: rs-devops-criando-objetos-k8s
description: "Applies Kubernetes deployment workflow when pushing Docker images to registries and creating K8s manifests. Use when user asks to 'deploy to kubernetes', 'create deployment yaml', 'push docker image', 'setup k8s manifests', or 'deploy container to cluster'. Covers docker login, tag, push flow and deployment.yaml structure with replicas, labels, resources, and port-forward testing. Make sure to use this skill whenever creating Kubernetes deployment manifests or pushing images to container registries. Not for Helm charts, Kustomize, CI/CD pipelines, or Ingress configuration."
---

# Criando Objetos do Kubernetes

> Para deployar uma aplicacao no Kubernetes, envie a imagem para um registry remoto e crie um manifesto deployment.yaml com replicas, labels, resources e container port.

## Rules

1. **Sempre logue no container registry antes do push** — `docker login` antes de qualquer `docker push`, porque o envio requer autenticacao mesmo para repositorios publicos
2. **Tagueie a imagem com usuario/repositorio:tag** — `docker tag app:v1 usuario/app:v1`, porque o push precisa referenciar o registry destino
3. **Use tags explicitas, nunca apenas latest** — `v1`, `v2`, porque latest causa problemas de cache e rollback no Kubernetes
4. **Labels do selector devem coincidir com labels do template** — porque o controller usa o selector para identificar quais pods gerenciar
5. **Sempre declare resources (requests e limits)** — porque sem limites um container pode consumir todos os recursos do node
6. **Crie um namespace dedicado** — `kubectl create ns nome`, porque isola recursos e facilita gerenciamento

## Steps

### Step 1: Login no Container Registry

```bash
docker login
# Insira username e senha se solicitado
```

### Step 2: Taguear e Enviar a Imagem

```bash
# Taguear imagem local para o registry
docker tag app:v1 seuusuario/app:v1

# Enviar para o registry
docker push seuusuario/app:v1
```

Alternativa: buildar ja com a tag final:
```bash
docker build -t seuusuario/app:v1 .
```

### Step 3: Criar o Manifesto deployment.yaml

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-app
  template:
    metadata:
      labels:
        app: api-app    # DEVE coincidir com selector.matchLabels
    spec:
      containers:
        - name: app
          image: seuusuario/app:v1
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 100m
              memory: 64Mi
            limits:
              cpu: 200m
              memory: 128Mi
```

### Step 4: Aplicar no Cluster

```bash
# Criar namespace
kubectl create ns minha-aplicacao

# Aplicar manifesto
kubectl apply -f k8s/ -n minha-aplicacao
```

### Step 5: Testar com Port Forward

```bash
# Encaminhar porta do pod para localhost
kubectl port-forward -n minha-aplicacao pod/NOME_DO_POD 3000:3000
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Imagem publica | Push direto apos login |
| Imagem privada | Configurar imagePullSecrets no deployment |
| Primeiro deploy | Comecar com 2 replicas e resources conservadores |
| Testar rapidamente | Usar port-forward no pod |
| Mac com Apple Silicon | Build gera imagem ARM64 por default; forcar AMD64 se necessario com `--platform linux/amd64` |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `docker push app:v1` sem taguear | `docker tag app:v1 usuario/app:v1` + `docker push usuario/app:v1` |
| Usar apenas `latest` como tag | Usar tags versionadas: `v1`, `v2` |
| Labels diferentes entre selector e template | Mesmas labels em ambos |
| Deployment sem resources | Sempre declarar requests e limits |
| Aplicar direto no namespace default | Criar namespace dedicado |
| Referenciar imagem local no manifesto | Enviar para registry remoto primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-criando-os-objetos-do-kubernetes/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-criando-os-objetos-do-kubernetes/references/code-examples.md)
