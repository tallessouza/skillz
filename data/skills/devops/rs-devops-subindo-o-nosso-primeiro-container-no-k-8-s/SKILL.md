---
name: rs-devops-primeiro-container-k8s
description: "Applies Kubernetes pod creation best practices when deploying containers to a K8s cluster. Use when user asks to 'run a container in kubernetes', 'create a pod', 'deploy to k8s', 'kubectl run', or 'start an application in a cluster'. Enforces image tagging, namespace usage, and declarative over imperative approaches. Make sure to use this skill whenever creating pods or running containers in Kubernetes. Not for Docker-only workflows, CI/CD pipelines, or Helm chart authoring."
---

# Subindo Containers no Kubernetes

> Ao criar pods no Kubernetes, sempre use imagens versionadas com tag explicita, namespaces dedicados, e prefira a abordagem declarativa.

## Rules

1. **Sempre especifique a tag da imagem** — `nginx:alpine3.20-slim` nao `nginx` ou `nginx:latest`, porque sem tag o Kubernetes baixa `latest` que e imprevisivel e impossivel de rastrear em rollbacks
2. **Nunca use o namespace default para aplicacoes** — crie namespaces dedicados, porque o namespace default mistura workloads e dificulta organizacao e RBAC
3. **Prefira declarativo sobre imperativo** — use manifests YAML versionados no Git em vez de `kubectl run`, porque comandos imperativos nao deixam rastro e nao sao reproduziveis
4. **Entenda que pods sao efemeros** — pods sem controlador (Deployment/ReplicaSet) sao descartados permanentemente em caso de falha, porque o pod e a menor unidade hierarquica do K8s e nao tem auto-recuperacao
5. **Use controladores para aplicacoes reais** — Deployment + ReplicaSet garantem que o pod seja recriado automaticamente, porque pods sozinhos nao tem garantia de estabilidade
6. **Verifique logs apos criacao** — `kubectl logs <pod-name>` para confirmar que o container iniciou corretamente, porque o status Running nao garante que a aplicacao esta saudavel

## How to write

### Criacao imperativa (apenas para testes rapidos)

```bash
# Somente para exploracao — nunca em producao
kubectl run nginx --image=nginx:alpine3.20-slim
kubectl get pods
kubectl logs nginx
```

### Criacao declarativa (recomendada)

```yaml
# pod.yaml — versionado no Git
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: minha-app  # Nunca use default
spec:
  containers:
    - name: nginx
      image: nginx:alpine3.20-slim  # Tag explicita obrigatoria
```

```bash
kubectl apply -f pod.yaml
```

### Verificacao do pod

```bash
kubectl get pods -n minha-app
kubectl describe pod nginx -n minha-app
kubectl logs nginx -n minha-app
kubectl get events -n minha-app
```

## Example

**Before (pratica ruim):**
```bash
kubectl run nginx --image=nginx
# Sem tag, namespace default, sem versionamento, sem controlador
```

**After (com boas praticas):**
```yaml
# k8s/nginx-pod.yaml — versionado no repositorio
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: web-apps
spec:
  containers:
    - name: nginx
      image: nginx:alpine3.20-slim
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Teste rapido local | `kubectl run` e aceitavel, delete depois |
| Qualquer ambiente compartilhado | Manifest YAML + namespace dedicado |
| Aplicacao que precisa estar sempre disponivel | Use Deployment, nao Pod direto |
| Imagem propria em registry privado | Configure imagePullSecrets no cluster |
| Precisa ver o que aconteceu no pod | `kubectl describe pod` para eventos, `kubectl logs` para stdout |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `kubectl run app --image=myapp` | `kubectl apply -f pod.yaml` com tag explicita |
| Deploy no namespace `default` | Crie namespace dedicado por projeto/equipe |
| Pod sozinho em producao | Deployment com ReplicaSet |
| `image: nginx:latest` | `image: nginx:alpine3.20-slim` (tag fixa) |
| Ignorar eventos apos criacao | `kubectl get events` para verificar pull/start |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
