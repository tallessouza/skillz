# Code Examples: Kubernetes StorageClass

## Exemplo 1: StorageClass com no-provisioner (da aula)

O instrutor cria este manifesto como exemplo didático, usando o provisioner manual:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: firstStorageClass
provisioner: kubernetes.io/no-provisioner
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
```

### Passo a passo:

1. **apiVersion: storage.k8s.io/v1** — grupo de API para recursos de storage
2. **kind: StorageClass** — tipo do recurso
3. **metadata.name: firstStorageClass** — nome que será referenciado pelos PVCs
4. **provisioner: kubernetes.io/no-provisioner** — sem provisionamento automático
5. **reclaimPolicy: Retain** — dados são retidos após deleção do PVC
6. **volumeBindingMode: WaitForFirstConsumer** — só faz binding quando um Pod consumir

## Exemplo 2: StorageClass standard (já existente no cluster)

O cluster kind já vem com este StorageClass pré-configurado:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: rancher.io/local-path
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

## Comandos utilizados na aula

### Criar o arquivo

```bash
touch storage-class.yaml
```

### Verificar StorageClasses existentes

```bash
kubectl get storageclass
```

Saída esperada antes de criar:
```
NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      AGE
standard (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   ...
```

### Aplicar o manifesto

```bash
kubectl apply -f storage-class.yaml
```

### Verificar após criação

```bash
kubectl get storageclass
```

Saída esperada após criar:
```
NAME                 PROVISIONER                       RECLAIMPOLICY   VOLUMEBINDINGMODE      AGE
firstStorageClass    kubernetes.io/no-provisioner      Retain          WaitForFirstConsumer   ...
standard (default)   rancher.io/local-path             Delete          WaitForFirstConsumer   ...
```

## Variações úteis

### StorageClass para cloud (AWS EBS)

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

### StorageClass com reclaimPolicy Delete (para ambientes efêmeros)

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ephemeral-storage
provisioner: rancher.io/local-path
reclaimPolicy: Delete
volumeBindingMode: Immediate
```

### Estrutura de diretório recomendada (conforme instrutor)

```
k8s/
├── kind.yaml              # Configuração do cluster kind
├── metric-server.yaml     # Metric server (cluster-level)
├── storage-class.yaml     # StorageClass (cluster-level)
└── app/                   # Manifests de aplicação (namespace-level)
    ├── deployment.yaml
    ├── service.yaml
    └── pvc.yaml
```