---
name: rs-devops-criando-o-pvc
description: "Generates Kubernetes PersistentVolumeClaim manifests following best practices. Use when user asks to 'create a PVC', 'claim storage in k8s', 'write PVC manifest', 'persistent volume claim yaml', or 'configure storage for deployment'. Enforces resource requests, storageClassName, accessModes, and selector matchLabels for proper PV binding. Make sure to use this skill whenever generating PVC manifests or configuring pod storage claims. Not for PV creation, StorageClass definition, or CSI driver configuration."
---

# Criando PVC no Kubernetes

> Todo PVC deve declarar explicitamente seus requisitos (capacidade, storageClass, accessModes) para garantir o match correto com um PV disponivel.

## Rules

1. **Sempre declare resources.requests.storage** — o PVC requisita uma quantidade especifica do PV, porque sem isso nao ha como o scheduler fazer o binding
2. **Sempre passe storageClassName** — mesmo que use `standard`, declare explicitamente, porque o cluster pode ter multiplos PVs com classes diferentes e o match depende disso
3. **Sempre declare accessModes** — use o mesmo mode do PV alvo (ex: `ReadWriteOnce`), porque o binding exige compatibilidade de access mode
4. **Use selector.matchLabels para PV especifico** — quando voce sabe qual PV quer usar, selecione por labels, porque o cluster pode ter varios PVs e sem selector o binding e imprevisivel
5. **Capacidade do PVC <= capacidade do PV** — se o PV tem 5Gi, o PVC pode pedir 1Gi a 5Gi, porque o request e o total para o deployment inteiro, nao por pod
6. **PVC pertence ao namespace da aplicacao** — aplique com `-n <namespace>`, porque PVCs sao namespaced (diferente de PVs que sao cluster-scoped)

## How to write

### PVC completo com selector

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-pvc
spec:
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
  selector:
    matchLabels:
      name: app-pv
```

### Aplicar e verificar

```bash
# Criar o PVC no namespace da aplicacao
kubectl apply -f pvc.yaml -n minha-aplicacao

# Verificar status
kubectl get pvc -n minha-aplicacao

# Debugar se necessario
kubectl describe pvc app-pvc -n minha-aplicacao
```

## Example

**Before (PVC incompleto):**
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  resources:
    requests:
      storage: 1Gi
```

**After (with this skill applied):**
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
  selector:
    matchLabels:
      name: my-pv
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Cluster tem um unico PV | Ainda declare storageClassName e accessModes para match explicito |
| PVC fica Pending apos apply | Verifique com `kubectl describe pvc` — provavelmente aguarda consumer (WaitForFirstConsumer) |
| Precisa binding imediato | Crie StorageClass com `volumeBindingMode: Immediate` em vez de `WaitForFirstConsumer` |
| Multiplos pods usam mesmo PVC | O storage request e para o deployment todo, nao por pod (1Gi = 1Gi total, nao 1Gi x N pods) |
| Quer garantir PV especifico | Use `selector.matchLabels` apontando para labels definidas no PV |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| PVC sem `storageClassName` | Declare `storageClassName: standard` (ou a classe correta) |
| PVC sem `accessModes` | Declare `accessModes: [ReadWriteOnce]` compativel com o PV |
| PVC com storage > PV capacity | Request <= capacidade do PV (ex: PV=5Gi, PVC<=5Gi) |
| `kubectl apply -f pvc.yaml` sem `-n` | `kubectl apply -f pvc.yaml -n <namespace>` |
| Assumir que storage e por pod | Entender que o request e para o deployment inteiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
