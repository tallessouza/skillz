---
name: rs-devops-configurando-cluster-multiplos-nos
description: "Applies Kind multi-node Kubernetes cluster configuration when user asks to 'create a cluster', 'configure Kind', 'setup Kubernetes locally', 'add worker nodes', or 'multi-node Kind'. Enforces declarative YAML manifests over imperative commands, correct node role separation (control-plane vs worker), and redundancy patterns. Make sure to use this skill whenever creating or modifying Kind cluster configurations. Not for production cloud cluster setup (EKS/GKE/AKS), Helm charts, or application deployment manifests."
---

# Configurando Cluster Kind com Multiplos Nos

> Sempre declare clusters Kind via manifesto YAML, nunca apenas via comandos imperativos, porque o YAML e o lastro declarativo de como o cluster foi criado.

## Rules

1. **Sempre use manifesto YAML** — `kind create cluster --config kind.yaml`, nunca apenas `kind create cluster` sem config, porque sem o YAML nao ha lastro declarativo da configuracao
2. **Separe control-plane de workers** — workloads rodam em workers, componentes do cluster (etcd, API server, CoreDNS) ficam no control-plane, porque misturar responsabilidades compromete estabilidade
3. **Use redundancia em producao** — minimo 2 control-planes e 2 workers para resiliencia, porque se um no cai, o cluster continua operando
4. **Inclua apiVersion e kind em todo YAML** — sao a base de qualquer manifesto Kubernetes, porque identificam qual API acessar e qual tipo de recurso criar
5. **Delete cluster antes de recriar localmente** — `kind delete cluster --name X` antes de criar novo, porque Kind roda containers Docker e recursos ficam alocados

## How to write

### Cluster basico (1 control-plane + 1 worker)

```yaml
apiVersion: kind.x-k8s.io/v1alpha4
kind: Cluster
nodes:
  - role: control-plane
  - role: worker
```

### Cluster com redundancia (2 control-planes + 2 workers)

```yaml
apiVersion: kind.x-k8s.io/v1alpha4
kind: Cluster
nodes:
  - role: control-plane
  - role: control-plane
  - role: worker
  - role: worker
```

### Comandos de ciclo de vida

```bash
# Criar cluster a partir do manifesto
kind create cluster --config kind.yaml --name meu-cluster

# Verificar nos
kubectl get nodes

# Verificar containers Docker subjacentes
docker ps

# Deletar cluster
kind delete cluster --name meu-cluster
```

## Example

**Before (imperativo, sem lastro):**
```bash
kind create cluster --name meu-app
# Funciona, mas nao ha registro de como foi configurado
# Tudo roda no control-plane, sem separacao
```

**After (declarativo, com separacao de nos):**
```yaml
# kind.yaml
apiVersion: kind.x-k8s.io/v1alpha4
kind: Cluster
nodes:
  - role: control-plane
  - role: worker
```
```bash
kind create cluster --config kind.yaml --name meu-app
# Configuracao versionada, workloads separados do control-plane
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ambiente local de desenvolvimento | 1 control-plane + 1 worker e suficiente |
| Simular producao localmente | 2 control-planes + 2 workers |
| Precisa recriar cluster | Delete primeiro, crie depois |
| Cluster sem workers | Workloads rodarao no control-plane (evite) |
| Verificar estado do cluster | `kubectl get nodes` + `docker ps` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `kind create cluster` sem `--config` | `kind create cluster --config kind.yaml` |
| Deploy de app em cluster sem worker nodes | Adicione pelo menos 1 worker ao YAML |
| Deletar apenas o no quando quer remover tudo | `kind delete cluster --name X` |
| Criar YAML sem `apiVersion` e `kind` | Sempre inclua ambos no topo do manifesto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
