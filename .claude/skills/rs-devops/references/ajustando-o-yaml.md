---
name: rs-devops-ajustando-o-yaml
description: "Applies declarative YAML configuration patterns for Kubernetes Gateway API and Istio service mesh resources. Use when user asks to 'configure gateway', 'create namespace yaml', 'declarative kubernetes', 'service mesh yaml', 'istio gateway config', or 'waypoint configuration'. Ensures proper separation between infra and app resources, CRD-based Gateway API usage, and namespace label management. Make sure to use this skill whenever writing Kubernetes YAML for Gateway API or Istio ambient mode resources. Not for application code, Helm charts, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-declarative
  tags: [devops]
---

# Configuracao Declarativa de YAML para Service Mesh

> Mantenha toda configuracao de Kubernetes como arquivos declarativos, separando recursos de infraestrutura dos de aplicacao.

## Rules

1. **Declarativo sobre imperativo** — nunca configure recursos via `kubectl label` ou `kubectl create` em producao, porque comandos imperativos nao sao reproduziveis ao recriar o cluster
2. **Separe infra de app** — namespace e gateway ficam em `infra/`, recursos de aplicacao em `k8s/`, porque namespace e gateway sao responsabilidades de infraestrutura
3. **Gateway API e CRD, nao recurso nativo** — use `gateway.networking.k8s.io/v1` como apiVersion, porque Gateway API e um CRD que precisa ser instalado no cluster
4. **Extraia YAML do cluster com `kubectl get -o yaml`** — remova campos de status, managedFields e metadata desnecessarios, porque o cluster adiciona metadados que nao pertencem ao declarativo
5. **Nomeie waypoint consistentemente** — o nome no Gateway YAML deve corresponder ao label `istio.io/use-waypoint` no namespace, porque o waypoint e referenciado por nome
6. **Comente recursos deprecados ao inves de deletar** — mantenha estrutura de codigo comentada para referencia, porque facilita entender a evolucao da configuracao

## Steps

### Step 1: Criar arquivo de namespace com labels

```yaml
# infra/app-ns.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: app
  labels:
    istio.io/dataplane-mode: ambient
    istio.io/use-waypoint: waypoint
```

### Step 2: Criar Gateway declarativo

```yaml
# infra/gateway.yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: waypoint
  namespace: app
spec:
  gatewayClassName: istio-waypoint
  listeners:
    - name: mesh
      port: 15008
      protocol: HBONE
      allowedRoutes:
        namespaces:
          from: Same
```

### Step 3: Aplicar recursos

```bash
# Primeiro o namespace (se nao existir)
kubectl apply -f infra/app-ns.yaml

# Depois o gateway
kubectl apply -f infra/gateway.yaml

# Verificar
kubectl get gateway waypoint -n app
kubectl get pods -n app | grep waypoint
```

### Step 4: Extrair YAML de recurso existente no cluster

```bash
# Ver o YAML completo do recurso
kubectl get gateway waypoint -n app -o yaml

# Ver CRDs instalados
kubectl get crd
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Configurou algo via `kubectl label` | Mova para o YAML do namespace |
| Gateway atende uma app especifica | Coloque em `k8s/` da app |
| Gateway atende o namespace inteiro | Coloque em `infra/` |
| Precisa recriar o cluster | `kubectl apply -f infra/` recria tudo |
| Waypoint ja existe no cluster | Delete antes de aplicar o YAML ou use `apply` que faz update |
| Quer ver APIs disponiveis no cluster | `kubectl get crd` lista todos os CRDs |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `kubectl label namespace app istio.io/dataplane-mode=ambient` em producao | Declare o label no YAML do namespace |
| `kubectl create namespace app` sem arquivo | Crie `app-ns.yaml` com labels inclusos |
| Copiar YAML do cluster com campos de `status` e `managedFields` | Remova tudo exceto apiVersion, kind, metadata.name, metadata.namespace e spec |
| Definir waypoint name diferente no Gateway e no label do namespace | Use o mesmo nome em ambos |
| Manter rotas de Gateway antigo quando migrou para waypoint | Delete rotas e comente Gateway antigo |

## Troubleshooting

### Gateway waypoint nao e reconhecido pelo namespace
**Symptom:** Pods no namespace nao utilizam o waypoint configurado no Gateway
**Cause:** O nome do Gateway no YAML nao corresponde ao label `istio.io/use-waypoint` no namespace
**Fix:** Garanta que o `metadata.name` do Gateway corresponda exatamente ao valor do label `istio.io/use-waypoint` no namespace YAML

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-ajustando-o-yaml/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-ajustando-o-yaml/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
