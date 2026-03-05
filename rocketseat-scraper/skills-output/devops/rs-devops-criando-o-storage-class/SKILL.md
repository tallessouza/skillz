---
name: rs-devops-criando-o-storage-class
description: "Generates Kubernetes StorageClass manifests when configuring persistent storage. Use when user asks to 'create a StorageClass', 'configure storage in Kubernetes', 'setup persistent storage', or 'write a storage manifest'. Applies correct apiVersion, provisioner, reclaimPolicy, and volumeBindingMode fields. Make sure to use this skill whenever generating Kubernetes storage configuration manifests. Not for PersistentVolume, PersistentVolumeClaim, or application deployment manifests."
---

# Kubernetes StorageClass

> Ao criar um StorageClass, defina explicitamente provisioner, reclaimPolicy e volumeBindingMode — nunca dependa dos defaults implícitos do cluster.

## Rules

1. **Use apiVersion `storage.k8s.io/v1`** — porque StorageClass pertence ao grupo storage, não ao core API
2. **Sempre declare o provisioner** — campo obrigatório; sem ele o manifesto é inválido e o kubectl rejeita
3. **Defina reclaimPolicy explicitamente** — escolha entre `Delete`, `Recycle` ou `Retain` com intenção, porque o default varia por provisioner
4. **Defina volumeBindingMode** — use `WaitForFirstConsumer` para agendar o volume no mesmo node do pod, ou `Immediate` quando o binding pode ser antecipado
5. **StorageClass é recurso de cluster** — não pertence a um namespace; organize o manifesto fora de pastas de aplicação, junto com configurações de cluster (kind, metric-server, etc.)
6. **Nomeie de forma descritiva** — o nome do StorageClass aparece em todo PVC que o referencia; use nomes como `fast-ssd`, `standard-retain`, não `sc1`

## How to write

### StorageClass básico com provisioner local

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard-local
provisioner: rancher.io/local-path
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

### StorageClass sem provisionamento automático

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: manual-retain
provisioner: kubernetes.io/no-provisioner
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
```

## Example

**Before (manifesto incompleto — kubectl rejeita):**

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: my-storage
```

**After (com todos os campos obrigatórios):**

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: my-storage
provisioner: rancher.io/local-path
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
```

## Heuristics

| Situação | Faça |
|----------|------|
| Storage para desenvolvimento local (kind, minikube) | `rancher.io/local-path` ou `kubernetes.io/no-provisioner` |
| Precisa que dados sobrevivam à deleção do PVC | `reclaimPolicy: Retain` |
| Pode descartar dados quando PVC for deletado | `reclaimPolicy: Delete` |
| Pod precisa estar no mesmo node que o volume | `volumeBindingMode: WaitForFirstConsumer` |
| Volume pode ser criado em qualquer node | `volumeBindingMode: Immediate` |
| Manifesto de cluster (StorageClass, metrics, kind) | Coloque na raiz do diretório k8s, fora das pastas de app |

## Anti-patterns

| Nunca escreva | Escreva isto |
|---------------|-------------|
| StorageClass sem `provisioner` | Sempre declare o provisioner, mesmo que seja `no-provisioner` |
| `reclaimPolicy` omitido (depender do default) | Declare explicitamente: `Retain`, `Delete` ou `Recycle` |
| StorageClass dentro de pasta de namespace/app | StorageClass na raiz do diretório k8s (é recurso de cluster) |
| `metadata.name: sc1` | `metadata.name: standard-retain` (nome descritivo) |

## Comandos de verificação

```bash
# Aplicar o StorageClass
kubectl apply -f storage-class.yaml

# Listar StorageClasses do cluster
kubectl get storageclass
```

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
