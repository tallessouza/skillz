---
name: rs-devops-reservando-espaco-pv
description: "Applies Kubernetes PersistentVolume (PV) configuration patterns when writing PV YAML manifests. Use when user asks to 'create a persistent volume', 'configure PV', 'setup kubernetes storage', 'write PV yaml', or 'reserve disk space in k8s'. Enforces correct capacity, accessModes, reclaimPolicy, storageClassName, and hostPath structure. Make sure to use this skill whenever generating Kubernetes PV manifests or reviewing storage configurations. Not for PVC, StatefulSet, or application-level volume mount configuration."
---

# Persistent Volume (PV) no Kubernetes

> Ao criar um PV, defina capacidade, modo de acesso, politica de recuperacao e storage class antes de associar a qualquer aplicacao.

## Rules

1. **Sempre use a estrutura padrao do YAML K8s** — `apiVersion`, `kind`, `metadata`, `spec`, porque PV segue a estrutura convencional (diferente de StorageClass e ConfigMap que sao excecoes)
2. **Defina capacity.storage explicitamente** — `5Gi`, `10Gi`, etc., porque isso reserva o espaco do disco no cluster
3. **Escolha accessModes pela necessidade de concorrencia** — use `ReadWriteOnce` por padrao, porque evita lock de arquivos entre nos
4. **Alinhe reclaimPolicy com o storageClass** — se storageClass e `standard`, use `Delete`, porque a politica deve ser consistente com o ciclo de vida do storage
5. **Especifique storageClassName mesmo quando e default** — torna a configuracao explicita e documentada, porque evita ambiguidade sobre qual storage class sera usado
6. **Use hostPath apenas para desenvolvimento local** — `hostPath` monta dentro do proprio no, porque em producao use CSI drivers ou cloud volumes

## How to write

### PV basico com hostPath

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: firstpv
  labels:
    name: firstpv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: standard
  hostPath:
    path: /mnt/data
```

### Verificacao apos criacao

```bash
# Criar o PV
kubectl apply -f pv.yaml

# Verificar status (deve ser Available)
kubectl get pv

# Ver detalhes completos
kubectl describe pv firstpv
```

## Example

**Before (PV incompleto):**
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mypv
spec:
  capacity:
    storage: 5Gi
  hostPath:
    path: /data
```

**After (PV completo):**
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mypv
  labels:
    name: mypv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: standard
  hostPath:
    path: /mnt/data
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Um pod por vez escrevendo | `ReadWriteOnce` (RWO) |
| Multiplos nos escrevendo | `ReadWriteMany` (RWX) |
| Somente leitura compartilhada | `ReadOnlyMany` (ROX) |
| Escopo por pod (nao por no) | `ReadWriteOncePod` (RWOP) |
| Ambiente local/dev | `hostPath` com `storageClassName: standard` |
| Dados descartaveis | `reclaimPolicy: Delete` |
| Dados que devem persistir apos PVC deletado | `reclaimPolicy: Retain` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Omitir `accessModes` | Sempre declarar explicitamente o modo de acesso |
| Usar `ReadWriteMany` sem necessidade | Usar `ReadWriteOnce` para evitar locks |
| Omitir `storageClassName` sem saber o default | Declarar `storageClassName` explicitamente |
| Usar `hostPath` em producao | Usar CSI drivers ou volumes cloud |
| Criar PV sem verificar com `kubectl get pv` | Sempre verificar status `Available` apos criacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
