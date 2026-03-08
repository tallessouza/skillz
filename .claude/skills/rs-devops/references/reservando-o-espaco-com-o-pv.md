---
name: rs-devops-reservando-o-espaco-com-o-pv
description: "Applies Kubernetes PersistentVolume (PV) configuration for reserving storage in the cluster. Use when user asks to 'create a PV', 'reserve storage in Kubernetes', 'configure persistent volume', 'set access modes', or 'define reclaim policy'. Enforces standard YAML structure, explicit capacity/accessModes/reclaimPolicy/storageClassName, and hostPath only for local development. Make sure to use this skill whenever generating PV manifests, selecting access modes, or configuring reclaim policies for cluster storage. Not for PVC creation (see PVC skill), StatefulSet configuration, or cloud-specific CSI driver setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-storage
  tags: [kubernetes, persistent-volume, pv, storage, access-modes, reclaim-policy, hostpath]
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

## Troubleshooting

### PV criado mas status nao e Available
**Symptom:** `kubectl get pv` mostra status diferente de `Available` apos criacao
**Cause:** storageClassName nao corresponde a nenhum StorageClass existente no cluster ou accessModes incompativeis
**Fix:** Verifique com `kubectl get sc` se o storageClassName existe e confira os accessModes suportados pelo provisionador

### PV nao e associado ao PVC
**Symptom:** PVC fica em status `Pending` mesmo com PV `Available`
**Cause:** Os criterios do PVC (capacity, accessModes, storageClassName) nao correspondem exatamente ao PV
**Fix:** Alinhe capacity, accessModes e storageClassName entre PV e PVC — todos devem ser compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Persistent Volume (PV) no Kubernetes

## Por que o PV fica "desassociado" da aplicacao

O instrutor enfatiza que o PV e criado **fora** do contexto da aplicacao. Isso e proposital — o PV representa o "disco", a reserva de capacidade no cluster. Ele existe independentemente de qualquer pod ou deployment. A associacao so acontece quando um PVC (Persistent Volume Claim) faz o "pedido" desse espaco.

Analogia: o PV e como alugar um espaco em um galpao. Voce reserva o espaco (PV), mas so quando alguem faz um pedido (PVC) e que aquele espaco e atribuido a um uso especifico.

## Estrutura padrao do YAML Kubernetes

O instrutor destaca que **praticamente todo YAML Kubernetes** segue a mesma estrutura:

```
apiVersion → kind → metadata → spec
```

Excecoes mencionadas: **StorageClass** e **ConfigMap**, que nao tem `spec` da mesma forma. Mas PV segue a regra.

## Access Modes — Explicacao detalhada

### ReadWriteOnce (RWO)
- Acesso de leitura E escrita
- Escopado **por no** — apenas um no por vez acessa
- Previne **lock de arquivos** — quando multiplos processos tentam escrever no mesmo arquivo simultaneamente
- E o modo mais comum e seguro para a maioria dos casos

### ReadWriteMany (RWX)
- Antagonico do RWO
- Multiplos nos podem escrever ao mesmo tempo
- Necessario para workloads distribuidos que precisam de escrita compartilhada
- Requer storage backends que suportem (NFS, CephFS, etc.)

### ReadOnlyMany (ROX)
- Somente leitura de multiplos nos
- Nao faz sentido ter "ReadOnlyOnce" porque leitura nao gera lock
- Util para dados estaticos compartilhados (configs, assets)

### ReadWriteOncePod (RWOP)
- Mesma ideia do RWO, mas escopado **por pod** (nao por no)
- Mais restritivo — apenas um pod pode acessar
- Util quando voce quer garantir exclusividade absoluta

## Reclaim Policy

Tres opcoes disponiveis:

| Policy | Comportamento |
|--------|--------------|
| **Delete** | Quando o PVC e deletado, o PV e o storage sao removidos |
| **Retain** | PV permanece mesmo apos PVC ser deletado (dados preservados, mas PV fica em status Released) |
| **Recycle** | Limpa os dados e torna o PV disponivel novamente (deprecado em favor de dynamic provisioning) |

O instrutor escolheu `Delete` para alinhar com o StorageClass `standard`, mantendo consistencia.

## Volume Mode: FileSystem

O `describe pv` mostra `VolumeMode: Filesystem`, que e o default. Isso significa que o volume e montado como um sistema de arquivos no container. A alternativa seria `Block` para raw block devices.

## hostPath — Limitacoes

O instrutor menciona que `hostPath` monta o volume **dentro do proprio no**. Isso significa:
- Funciona apenas em clusters locais (kind, minikube)
- Os dados ficam no filesystem do no, nao em storage externo
- Se o pod migrar para outro no, perde acesso aos dados
- Nunca deve ser usado em producao

## Fluxo completo de storage no Kubernetes

```
StorageClass (define COMO provisionar)
    ↓
PersistentVolume (reserva o espaco/disco)
    ↓
PersistentVolumeClaim (aplicacao pede o espaco)
    ↓
Pod (monta o volume via PVC)
```

O instrutor esta construindo essa cadeia passo a passo: ja fez StorageClass, agora PV, proximo sera PVC.

---

# Code Examples: Persistent Volume (PV) no Kubernetes

## Exemplo completo da aula — pv.yaml

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

## Comandos de criacao e verificacao

### Criar o PV
```bash
kubectl apply -f pv.yaml
```

### Listar PVs
```bash
kubectl get pv
```

Saida esperada:
```
NAME      CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   AGE
firstpv   5Gi        RWO            Delete           Available           standard       5s
```

Campos importantes na saida:
- **STATUS: Available** — PV criado mas sem PVC associado (unset)
- **ACCESS MODES: RWO** — ReadWriteOnce
- **RECLAIM POLICY: Delete**
- **STORAGECLASS: standard**

### Descrever PV com detalhes
```bash
kubectl describe pv firstpv
```

Informacoes adicionais visiveis no describe:
- `VolumeMode: Filesystem`
- `Source: HostPath` com o path `/mnt/data`
- Labels configuradas
- StorageClass associado

## Variacoes por Access Mode

### ReadWriteMany (RWX)
```yaml
spec:
  accessModes:
    - ReadWriteMany
```

### ReadOnlyMany (ROX)
```yaml
spec:
  accessModes:
    - ReadOnlyMany
```

### ReadWriteOncePod (RWOP)
```yaml
spec:
  accessModes:
    - ReadWriteOncePod
```

### Multiplos access modes
```yaml
spec:
  accessModes:
    - ReadWriteOnce
    - ReadOnlyMany
```

## Variacoes por Reclaim Policy

### Retain (preservar dados)
```yaml
spec:
  persistentVolumeReclaimPolicy: Retain
```

### Recycle (limpar e reutilizar — deprecado)
```yaml
spec:
  persistentVolumeReclaimPolicy: Recycle
```

## PV com storage class customizado

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: custom-pv
  labels:
    name: custom-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: firststorageclass
  hostPath:
    path: /mnt/custom-data
```

## PV para producao (exemplo com NFS)

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv
  labels:
    name: nfs-pv
spec:
  capacity:
    storage: 50Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: nfs-storage
  nfs:
    server: 192.168.1.100
    path: /exports/data
```
