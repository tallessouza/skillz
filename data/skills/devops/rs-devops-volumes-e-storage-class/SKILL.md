---
name: rs-devops-volumes-e-storage-class
description: "Applies Kubernetes volume and StorageClass concepts when designing stateful workloads. Use when user asks to 'deploy a database on Kubernetes', 'persist data in k8s', 'configure storage class', 'handle stateful applications', or 'manage volumes in Kubernetes'. Covers StorageClass provisioners, reclaim policies, volume binding modes, and CSI interface. Make sure to use this skill whenever configuring persistent storage in Kubernetes clusters. Not for Docker-only volume mounts, application code changes, or Helm chart configuration."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
