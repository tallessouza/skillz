---
name: rs-devops-valor-dos-manifestos-declarativos-e-namespaces
description: "Applies Kubernetes declarative manifest patterns with namespace isolation and resource limits. Use when user asks to 'write pod manifest', 'create namespace', 'set resource limits', 'use kubectl apply', or 'organize cluster resources'. Enforces declarative YAML over imperative commands, dedicated namespaces, explicit resource requests/limits, and standard YAML structure. Make sure to use this skill whenever writing declarative Kubernetes manifests or organizing cluster resources with namespaces. Not for Deployment/ReplicaSet configuration, Service networking, or RBAC policies."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-manifests
  tags: [kubernetes, manifest, yaml, namespace, resource-limits, declarative, kubectl-apply, requests]
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


## Troubleshooting

### Warning "containers do not have resource limits"
**Symptom:** Pod funciona mas mostra warning sobre falta de resource limits
**Cause:** Manifesto nao define `resources.requests` e `resources.limits` no container
**Fix:** Adicione bloco `resources` com `requests` (minimo garantido) e `limits` (maximo permitido) para CPU e memoria

### Pod criado no namespace errado
**Symptom:** Pod nao aparece onde esperado, ou aparece no namespace `default`
**Cause:** Comando `kubectl apply` foi executado sem flag `-n <namespace>`
**Fix:** Sempre use `-n <namespace>` em todo comando kubectl, ou defina namespace no metadata do manifesto

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Manifestos Declarativos e Namespaces

## Por que namespaces são essenciais

O namespace é uma **divisão lógica** dentro do cluster Kubernetes. Sem namespaces dedicados, tudo fica no `default` e não há nenhuma governança. O instrutor enfatiza que namespaces devem seguir a organização do projeto ou da equipe:

- **Por projeto/API** — cada microserviço ou API tem seu namespace
- **Por domínio/contexto** — alinhado com bounded contexts do time
- **Por equipe** — no sentido organizacional

A criação é simples (`kubectl create namespace <nome>`) mas o impacto organizacional é grande: permite isolamento, controle de acesso (RBAC futuro), e visibilidade clara de quem possui o quê.

## A estrutura do manifesto YAML

As duas primeiras linhas de qualquer manifesto Kubernetes seguem o mesmo padrão:

1. **`apiVersion`** — qual versão da API do Kubernetes usar (ex: `v1`)
2. **`kind`** — qual objeto dessa API criar (ex: `Pod`)

Isso é idêntico à estrutura do Kind (ferramenta de cluster local), porque ambos seguem a convenção declarativa do Kubernetes.

Depois vem:
- **`metadata`** — informações sobre o recurso (nome, labels, annotations)
- **`spec`** — a especificação do que o recurso deve ser

## Resources: requests vs limits

O instrutor destaca que o warning "One or more containers do not have resource limits" aparece mesmo que o manifesto funcione sem resources. A boa prática exige definir ambos:

- **requests** — o mínimo garantido que o scheduler reserva no nó. É o que o Kubernetes usa para decidir em qual nó colocar o pod.
- **limits** — o máximo que o container pode consumir. Se ultrapassar, o Kubernetes intervém (CPU throttling, OOM kill para memória).

### Unidades de CPU

- `1000m` (milicores) = 1 vCPU
- `100m` = 1/10 de uma vCPU
- `200m` = 1/5 de uma vCPU

O instrutor usou um padrão de **limits = 2x requests** como ponto de partida para o nginx, mas ressaltou que cada aplicação terá seu perfil e que valores assertivos impactam diretamente em **custo**.

## Containers no plural

O campo `containers` é um array porque um pod pode ter múltiplos containers. O instrutor esclarece:

- **Comum:** sidecar patterns (proxy, log collector) — um container auxiliar ao lado do principal
- **Incomum:** duas aplicações distintas no mesmo pod — isso quebra o princípio de isolamento

Esse conceito será aprofundado no módulo de service mesh/proxy.

## Pods são efêmeros

O instrutor menciona que pods têm **self-healing** por padrão: se algo falha, o Kubernetes tenta restartar. O campo `RESTARTS` no `kubectl get pods` mostra quantas vezes isso ocorreu. Esse comportamento pode ser customizado em cenários avançados.

## Interface de rede do pod

Cada pod recebe um IP interno (faixa 10.x.x.x), acessível apenas dentro do cluster. Para acesso externo, é necessário configurar Services (tema da próxima aula). O Lens mostra esse IP na interface gráfica do pod.

## kubectl delete — padrão de deleção

Para deletar qualquer recurso: `kubectl delete <tipo> <nome>`. A estrutura é consistente para todos os workloads (Pod, Deployment, Service, etc.).

---

# Code Examples: Manifestos Declarativos e Namespaces

## 1. Criar e deletar pod imperativo (antes do manifesto)

```bash
# Rodar pod imperativamente (forma NÃO recomendada para produção)
kubectl run nginx --image=nginx:1.25.3

# Ver detalhes do pod (IP, consumo, eventos)
# Pode ser feito via Lens GUI ou:
kubectl describe pod nginx

# Deletar pod
kubectl delete pod nginx
```

## 2. Criar namespace

```bash
# Forma completa
kubectl create namespace primeira-app

# Forma abreviada
kubectl create ns primeira-app
```

## 3. Manifesto completo do pod (pod.yaml)

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
          cpu: "100m"      # 1/10 de uma vCPU
          memory: "64Mi"   # 64 megabytes
        limits:
          cpu: "200m"      # 1/5 de uma vCPU (2x request)
          memory: "128Mi"  # 128 megabytes (2x request)
```

## 4. Aplicar manifesto no namespace correto

```bash
# Aplicar no namespace dedicado
kubectl apply -f pod.yaml -n primeira-app

# ERRADO: sem -n vai para o default
kubectl apply -f pod.yaml
```

## 5. Verificar pods no namespace

```bash
# Sem -n: mostra default (vazio)
kubectl get pods
# Resultado: No resources found in default namespace.

# Com -n: mostra o namespace correto
kubectl get pods -n primeira-app
# NAME    READY   STATUS    RESTARTS   AGE
# nginx   1/1     Running   0          30s

# Forma abreviada
kubectl get po -n primeira-app
```

## 6. Variações de porta por tipo de aplicação

```yaml
# Nginx (porta 80)
containers:
  - name: nginx
    image: nginx:1.25.3
    ports:
      - containerPort: 80

# Node.js (porta 3000)
containers:
  - name: api
    image: minha-api:1.0.0
    ports:
      - containerPort: 3000

# Python/FastAPI (porta 8000)
containers:
  - name: backend
    image: meu-backend:1.0.0
    ports:
      - containerPort: 8000
```

## 7. Referência de unidades de CPU

```yaml
# 1 vCPU = 1000m (milicores)
resources:
  requests:
    cpu: "100m"   # 1/10 vCPU
    cpu: "250m"   # 1/4 vCPU
    cpu: "500m"   # 1/2 vCPU
    cpu: "1000m"  # 1 vCPU (pode escrever "1")
```

## 8. Reaplicar manifesto após mudanças

```bash
# Editou o YAML? Basta reaplicar
kubectl apply -f pod.yaml -n primeira-app
# O Kubernetes faz diff e aplica apenas as mudanças
```
