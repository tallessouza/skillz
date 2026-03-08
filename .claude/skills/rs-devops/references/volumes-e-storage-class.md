---
name: rs-devops-volumes-e-storage-class
description: "Applies Kubernetes StorageClass concepts for understanding volume provisioning policies before creating PersistentVolumes. Use when user asks about 'StorageClass', 'volume provisioning', 'reclaim policy', 'CSI drivers', 'stateful applications in K8s', or 'why data is lost when pod restarts'. Provides decision framework for ephemeral vs persistent workloads, storage class selection, and Kubernetes extensibility interfaces (CRI/CNI/CSI). Make sure to use this skill whenever planning persistent storage in Kubernetes or selecting storage provisioners for a cluster. Not for PV/PVC creation (see dedicated skills), StatefulSet configuration, or specific CSI driver installation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-storage
  tags: [kubernetes, storage-class, volumes, csi, persistent-storage, reclaim-policy, ephemeral, statefulset]
---

# Volumes e StorageClass no Kubernetes

> Entenda StorageClass como a camada que define COMO e ONDE o armazenamento persistente sera provisionado no cluster antes de criar qualquer volume.

## Key concept

Containers sao efemeros por padrao — quando um pod morre, todo seu estado morre junto. Volumes resolvem isso ao separar o ciclo de vida dos dados do ciclo de vida do pod. O StorageClass define o provisionador e as politicas que governam esses volumes.

## Decision framework

| Situacao | Abordagem |
|----------|-----------|
| Aplicacao stateless (API, web server) | Nao usar volumes — manter efemera |
| Banco de dados em Kubernetes | StatefulSet + PersistentVolume (modulo avancado) |
| Aplicacao que persiste assets/logs em disco | PersistentVolumeClaim com StorageClass adequado |
| Cluster em cloud (EKS, AKS) | Usar StorageClass ja provisionado (EBS, Azure Disk) |
| Cluster local (Kind, Minikube) | Usar LocalPath provisioner (ja vem criado) |
| Provisionador padrao nao atende | Criar StorageClass customizado com CSI plugin |

## Rules

1. **Prefira aplicacoes efemeras** — o ideal e que a aplicacao NAO dependa de estado local, porque pods sao descartaveis por design (self-healing descarta e recria pods)
2. **Verifique o StorageClass existente antes de criar** — `kubectl get sc` mostra o que ja esta disponivel; clusters cloud ja trazem provisionadores configurados
3. **Entenda o Reclaim Policy** — `Delete` apaga dados quando o volume e liberado; `Retain` preserva; escolha baseado na criticidade dos dados
4. **Volume Binding Mode `WaitForFirstConsumer`** — o volume so e provisionado quando um pod consome; isso e o padrao e evita provisionamento desnecessario
5. **Banco de dados exige StatefulSet, nao apenas Pod** — StatefulSet garante ordem, identidade estavel, e lider/followers; Pod simples com volume NAO e suficiente para databases
6. **CSI e a interface padrao** — Kubernetes nao conhece provisionadores diretamente; usa Container Storage Interface (CSI) como plugin, similar ao CRI (runtime) e CNI (network)

## How to check

### Listar StorageClasses disponiveis
```bash
kubectl get storageclass
# ou abreviado
kubectl get sc
```

### Output tipico (Kind/Rancher)
```
NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION
standard (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false
```

### Criar StorageClass customizado
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: custom-storage
provisioner: kubernetes.io/aws-ebs  # ou outro CSI driver
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

## Hierarquia de conceitos

```
StorageClass (COMO provisionar)
  └── PersistentVolume (o volume em si)
       └── PersistentVolumeClaim (pedido de volume pelo pod)
            └── Pod (consumidor final)
```

Analogia do instrutor: e como Pod → ReplicaSet → Deployment — cada camada adiciona controle.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Basta adicionar volume ao Pod para rodar banco de dados | Banco de dados precisa de StatefulSet para garantir ordem e identidade |
| Preciso criar StorageClass em todo cluster | Clusters cloud (EKS, AKS) ja trazem StorageClass configurado |
| LocalPath serve para producao | LocalPath e para desenvolvimento local; producao usa EBS, Azure Disk, ou solucoes como vSphere/Cinder |
| Dados persistem automaticamente em containers | Containers sao efemeros; sem volume explicitamente configurado, dados morrem com o pod |
| Kubernetes conhece todos os provisionadores | Kubernetes conhece apenas a interface CSI; provisionadores sao plugins |

## Interfaces do Kubernetes (padrao de extensibilidade)

| Interface | Funcao |
|-----------|--------|
| **CRI** (Container Runtime Interface) | Integra com runtimes (containerd, CRI-O) |
| **CNI** (Container Network Interface) | Integra com solucoes de rede |
| **CSI** (Container Storage Interface) | Integra com provisionadores de storage |

Esse padrao de interfaces torna o Kubernetes agnostico — voce pode trocar qualquer camada sem mudar o cluster.

## When to apply

- Ao planejar deploy de qualquer aplicacao stateful no Kubernetes
- Ao migrar de Docker Compose (onde volumes sao locais) para Kubernetes
- Ao configurar cluster de producao e precisar escolher provisionador de storage
- Ao debugar perda de dados apos pod restart

## Limitations

- Esta aula cobre apenas StorageClass (a base); PersistentVolume e PersistentVolumeClaim sao a proxima aula
- StatefulSet e conteudo do modulo avancado
- Exemplos praticos com EKS/AKS sao do modulo avancado
- Volume expansion depende do provisionador suportar


## Troubleshooting

### Dados perdidos apos pod restart
**Symptom:** Aplicacao perde dados quando pod e recriado pelo Kubernetes
**Cause:** Container sem volume configurado — containers sao efemeros por padrao
**Fix:** Configure PersistentVolumeClaim e monte o volume no pod para dados que precisam persistir

### StorageClass nao encontrado no cluster
**Symptom:** `kubectl get sc` retorna vazio ou nao mostra o StorageClass esperado
**Cause:** Cluster local pode nao ter provisionador configurado, ou cluster cloud precisa de CSI driver instalado
**Fix:** Em clusters locais verifique se LocalPath provisioner esta instalado; em cloud (EKS/AKS) confirme que o CSI driver esta habilitado

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Volumes e StorageClass

## Por que volumes existem no Kubernetes

O instrutor conecta diretamente com o modulo de Docker: quando voce roda uma aplicacao em container (seja Docker Compose ou Kubernetes), ela e **efemera** por padrao. O termo chave e "ciclo de vida" — tudo que aconteceu durante a vida do container morre com ele.

O cenario critico: imagine um banco de dados rodando em Kubernetes. Se o self-healing descarta o pod (como vimos em aulas anteriores), voce perde toda a base de dados. Isso e "inadmissivel", nas palavras do instrutor.

## A ponte Docker → Kubernetes

No Docker Compose, o problema e identico: se voce dropa o compose ou o container morre, dados sao perdidos. A solucao la sao volumes Docker. No Kubernetes, a ideia e "mais ou menos a mesma, porem dentro do Kubernetes" — com mais camadas de abstracao.

## StorageClass: o que realmente e

StorageClass e a **definicao de COMO volumes sao gerenciados**. Nao e o volume em si — e a politica. Quando voce roda `kubectl get sc`, voce ve:

- **Provisioner**: quem de fato cria o storage (rancher.io/local-path, kubernetes.io/aws-ebs, etc.)
- **Reclaim Policy**: o que acontece quando o volume e liberado (Delete = apaga tudo, Retain = preserva)
- **Volume Binding Mode**: quando o volume e de fato criado (WaitForFirstConsumer = so quando um pod precisa)
- **Allow Volume Expansion**: se voce pode aumentar o tamanho depois

## Ponto importante do instrutor sobre ambientes

O instrutor enfatiza que no Kind (ambiente local), voce ja tem o LocalPath provisioner. Em clusters cloud:
- **EKS (AWS)**: ja vem com EBS provisioner
- **AKS (Azure)**: ja vem com Azure Disk provisioner

"Via de regra, voce ja vai ter ele criado quando fizer o deploy." Se o padrao nao serve, voce pode criar outro StorageClass com provisionador diferente.

## A analogia da hierarquia

O instrutor faz uma analogia direta com o que ja foi ensinado: Pod → ReplicaSet → Deployment tem uma hierarquia. Volumes seguem o mesmo padrao: StorageClass → PersistentVolume → PersistentVolumeClaim → Pod. Cada camada adiciona uma responsabilidade.

## CSI como padrao de extensibilidade

O insight mais arquitetural da aula: Kubernetes usa interfaces para tudo:
- CRI (Container Runtime Interface)
- CNI (Container Network Interface)  
- CSI (Container Storage Interface)

Isso torna o Kubernetes "uma solucao muito agnostica". Ele nao conhece os provisionadores diretamente — conhece a interface. Voce pode ate construir seu proprio plugin CSI se precisar.

## Quando NAO usar volumes

O instrutor e claro: "o ideal e que a sua aplicacao seja o mais efemera possivel". Volumes sao para quando voce realmente precisa de estado — banco de dados, cache persistente, assets que nao podem ser perdidos. Se nao precisa, nao use.

## StatefulSet vs Pod com volume

Ponto critico que o instrutor menciona mas deixa para o modulo avancado: banco de dados em Kubernetes NAO roda em Pods simples. Usa StatefulSet, que garante:
- Ordem de criacao/destruicao
- Identidade estavel (nomes previsiveis)
- Conceito de lider e followers
- Volume associado a cada replica individualmente

---

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
