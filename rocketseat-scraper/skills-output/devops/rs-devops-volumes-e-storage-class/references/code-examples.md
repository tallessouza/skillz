# Code Examples: Volumes e StorageClass

## Verificando StorageClass existente

### Comando basico
```bash
kubectl get storageclass
```

### Forma abreviada
```bash
kubectl get sc
```

### Output esperado (Kind com Rancher)
```
NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
standard (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  30d
```

### Interpretacao de cada campo

| Campo | Valor no exemplo | Significado |
|-------|-----------------|-------------|
| NAME | standard (default) | Nome do StorageClass; `(default)` indica que sera usado automaticamente se nenhum for especificado |
| PROVISIONER | rancher.io/local-path | Plugin que cria o storage fisico; neste caso usa disco local |
| RECLAIMPOLICY | Delete | Quando o volume e liberado, os dados sao apagados |
| VOLUMEBINDINGMODE | WaitForFirstConsumer | Volume so e criado quando um pod precisa dele |
| ALLOWVOLUMEEXPANSION | false | Nao permite aumentar o tamanho do volume depois de criado |

## Criando um StorageClass customizado

### Exemplo para ambiente local (similar ao existente)
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: custom-local
provisioner: rancher.io/local-path
reclaimPolicy: Retain  # Diferente do padrao: preserva dados
volumeBindingMode: WaitForFirstConsumer
```

### Exemplo para AWS EKS
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ebs-storage
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

### Exemplo para Azure AKS
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azure-disk
provisioner: disk.csi.azure.com
parameters:
  skuName: Premium_LRS
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

## Reclaim Policies comparadas

```yaml
# DELETE - dados apagados quando volume liberado (padrao em muitos clusters)
reclaimPolicy: Delete

# RETAIN - dados preservados, volume precisa ser limpo manualmente
reclaimPolicy: Retain

# RECYCLE - dados apagados mas volume reutilizado (deprecated em favor de Delete)
reclaimPolicy: Recycle
```

## Hierarquia completa (preview da proxima aula)

```yaml
# 1. StorageClass (ja existe ou voce cria)
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: rancher.io/local-path
---
# 2. PersistentVolumeClaim (pede storage)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  resources:
    requests:
      storage: 1Gi
---
# 3. Pod (consome o volume)
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
    - name: app
      image: app:latest
      volumeMounts:
        - mountPath: /data
          name: app-storage
  volumes:
    - name: app-storage
      persistentVolumeClaim:
        claimName: app-data
```

## Provisionadores suportados pelo Kubernetes (CSI)

Lista parcial mencionada ou implicita na aula:

| Provisionador | Ambiente | Plugin |
|---------------|----------|--------|
| Local Path | Kind, Rancher local | rancher.io/local-path |
| EBS | AWS EKS | ebs.csi.aws.com |
| Azure Disk | Azure AKS | disk.csi.azure.com |
| vSphere | VMware | csi.vsphere.vmware.com |
| Cinder | OpenStack | cinder.csi.openstack.org |

Qualquer provisionador que implemente a interface CSI pode ser usado.