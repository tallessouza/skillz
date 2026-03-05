---
name: rs-devops-manifestos-declarativos-namespaces
description: "Enforces Kubernetes declarative manifest and namespace best practices when writing Pod YAML files. Use when user asks to 'create a pod', 'write kubernetes yaml', 'deploy to k8s', 'set up namespace', or 'configure container resources'. Applies rules: always declare namespace, always set resource requests/limits, use declarative manifests over imperative commands, structure YAML with apiVersion/kind/metadata/spec. Make sure to use this skill whenever generating Kubernetes manifests or discussing pod configuration. Not for Helm charts, Kustomize overlays, or CI/CD pipeline configuration."
---

# Manifestos Declarativos e Namespaces no Kubernetes

> Sempre use manifestos declarativos YAML com namespace explícito e resource limits definidos para todo container.

## Rules

1. **Nunca use o namespace default** — crie namespaces por projeto, domínio ou equipe, porque sem namespace dedicado não há governança sobre os recursos do cluster
2. **Sempre declare resources requests e limits** — todo container deve ter CPU e memória definidos, porque containers sem limites podem consumir recursos do nó inteiro e causar problemas para outros pods
3. **Prefira declarativo sobre imperativo** — use `kubectl apply -f` com arquivos YAML em vez de `kubectl run`, porque o manifesto é versionável, repetível e auditável
4. **Sempre passe `-n namespace`** — em todo comando kubectl, especifique o namespace, porque sem `-n` o kubectl opera no default silenciosamente
5. **Estruture o YAML na ordem padrão** — `apiVersion` → `kind` → `metadata` → `spec`, porque essa é a convenção do Kubernetes e facilita leitura
6. **Nomeie containers explicitamente** — passe `name` antes de `image` no bloco containers, porque um pod pode ter múltiplos containers e cada um precisa identificação clara

## How to write

### Namespace

```bash
# Criar namespace dedicado
kubectl create namespace minha-app
```

### Pod manifest completo

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.25.3
      ports:
        - containerPort: 80
      resources:
        requests:
          cpu: "100m"
          memory: "64Mi"
        limits:
          cpu: "200m"
          memory: "128Mi"
```

### Aplicar com namespace

```bash
kubectl apply -f pod.yaml -n minha-app
```

## Example

**Before (imperativo, sem namespace, sem resources):**

```bash
kubectl run nginx --image=nginx
kubectl get pods  # olha no default
```

**After (declarativo, com namespace e resources):**

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.25.3
      ports:
        - containerPort: 80
      resources:
        requests:
          cpu: "100m"
          memory: "64Mi"
        limits:
          cpu: "200m"
          memory: "128Mi"
```

```bash
kubectl create namespace minha-app
kubectl apply -f pod.yaml -n minha-app
kubectl get pods -n minha-app
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Container simples (nginx, proxy) | requests: 100m CPU, 64Mi RAM / limits: 200m CPU, 128Mi RAM |
| Aplicação Node.js | Ajustar porta (3000, 4000, 5000) e resources conforme perfil real |
| Múltiplos containers no pod | Apenas para sidecars/proxies, nunca duas aplicações distintas |
| Precisa recriar o pod | `kubectl apply -f` novamente — o manifesto é a fonte de verdade |
| Verificar pods no namespace | Sempre `kubectl get pods -n <namespace>` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `kubectl run nginx --image=nginx` (imperativo) | Manifesto YAML + `kubectl apply -f` |
| Pod sem `resources` | Sempre declarar `requests` e `limits` |
| `kubectl apply -f pod.yaml` (sem -n) | `kubectl apply -f pod.yaml -n minha-app` |
| `kubectl get pods` (sem -n) | `kubectl get pods -n minha-app` |
| Duas apps no mesmo pod | Um pod por aplicação, sidecars são exceção |
| Tudo no namespace `default` | Namespace por projeto/domínio/equipe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
