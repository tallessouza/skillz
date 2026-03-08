---
name: rs-devops-persistent-volume
description: "Applies Kubernetes PersistentVolume patterns when designing storage for stateful workloads. Use when user asks to 'persist data in k8s', 'configure storage', 'setup PersistentVolume', 'handle database storage in kubernetes', or 'choose between ephemeral and persistent storage'. Enforces external storage over local-path and proper capacity planning. Make sure to use this skill whenever deploying stateful applications to Kubernetes. Not for Docker volumes, application code, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-storage
  tags: [kubernetes, persistent-volume, storage, pv, pvc, storage-class, stateful]
---

# PersistentVolume no Kubernetes

> Todo dado que precisa sobreviver ao ciclo de vida do container exige um PersistentVolume vinculado a um StorageClass.

## Rules

1. **Nunca salve dados persistentes no filesystem do container** — containers sao efemeros, tudo desaparece na reciclagem, porque o ciclo de vida do container nao garante persistencia
2. **Use PersistentVolume para reservar espaco** — o PV conversa com o StorageClass e reserva um espaco definido (ex: 5GB, 10GB), porque sem reserva nao ha garantia de disponibilidade
3. **Evite local-path em producao** — local-path reserva espaco do proprio no, criando concorrencia com a aplicacao e dificultando escala multi-no, porque pods distribuidos em nos diferentes nao compartilham o mesmo disco local
4. **Desacople storage do cluster** — use StorageClass apontando para storage externo (EBS, NFS, cloud storage), porque permite escalar nos independentemente do armazenamento
5. **Planeje a politica de retencao (retain)** — defina o que acontece quando o volume enche, porque volume cheio sem politica causa downtime
6. **Assets e logs nao pertencem ao container** — uploads vao para S3/cloud storage, logs vao para sistema de observabilidade, porque efemero significa perda total na reciclagem

## Modelo mental

```
StorageClass (provisionador)
       │
       ▼
PersistentVolume (reserva de espaco: 2GB, 5GB, 10GB...)
       │
       ▼
PersistentVolumeClaim (requisicao do pod — proxima etapa)
       │
       ▼
Pod/Deployment (consome o espaco requisitado)
```

## Dois tipos de volume

| Tipo | Comportamento | Uso |
|------|--------------|-----|
| **Efemero** | Morre com o container, emptyDir recria a cada deploy | Cache temporario, scratch space |
| **Persistente** | Sobrevive ao ciclo de vida do pod, reserva espaco real | Bancos de dados, filas, uploads |

## Como verificar

```bash
# Listar PersistentVolumes existentes
kubectl get pv
# ou
kubectl get persistentvolume

# Listar nos do cluster
kubectl get nodes
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Upload de arquivos | Mande para S3/cloud storage, nunca salve em pasta local do container |
| Logs da aplicacao | Envie para sistema de observabilidade (Datadog, Grafana, ELK) |
| Banco de dados em k8s | PersistentVolume com StorageClass externo ao cluster |
| Ambiente local/dev | local-path e aceitavel, mas saiba que nao escala |
| Volume encheu | Defina retain policy antes de chegar nesse ponto |
| Pods distribuidos em multiplos nos | Obrigatorio usar storage externo, local-path nao funciona |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Salvar uploads em `/app/images/` no container | Enviar para S3 ou equivalente cloud |
| Usar local-path em producao | StorageClass com provisionador externo (EBS, NFS, etc.) |
| Ignorar capacity planning do PV | Definir tamanho baseado na necessidade real + margem |
| Assumir que dados sobrevivem ao restart | Configurar PV + PVC explicitamente |
| Reservar todo o disco do no para PV | Lembrar que o no precisa de espaco para a aplicacao tambem |

## Troubleshooting

### PVC fica em Pending e nao vincula ao PV
**Symptom:** PersistentVolumeClaim permanece em status Pending indefinidamente
**Cause:** StorageClass do PVC nao corresponde ao StorageClass do PV, ou accessModes incompativeis
**Fix:** Verificar com `kubectl get pv` e `kubectl get pvc` se storageClassName e accessModes correspondem entre PV e PVC

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: PersistentVolume no Kubernetes

## A cadeia StorageClass → PV → PVC

O instrutor apresenta uma cadeia clara de tres elementos que formam o sistema de storage do Kubernetes:

1. **StorageClass** — funciona como uma "interface" (nas palavras do instrutor). Ele tem o provisionador e e a classe que define COMO o storage sera fornecido. Voce nao associa o StorageClass diretamente a aplicacao. Ele existe como uma camada de abstracao.

2. **PersistentVolume (PV)** — e a reserva de espaco propriamente dita. O PV "conversa" com o StorageClass. Voce define quanto espaco quer (2GB, 5GB, 10GB) e o PV reserva esse espaco junto ao provisionador.

3. **PersistentVolumeClaim (PVC)** — sera abordado na proxima aula. O PVC e quem conecta o pod ao volume. Ele "requisita" uma porcao do PV. Exemplo: PV tem 2GB, o PVC pede 1GB ou 512MB.

## Efemero vs Persistente — a decisao fundamental

### Volume Efemero
- Tudo que acontece no ciclo de vida do container desaparece quando o container morre
- Se voce nao fizer nada, sua aplicacao e efemera por padrao
- Pode usar `emptyDir` na declaracao do Deployment — a cada deploy, o volume e dropado e recriado
- Util para dados temporarios, mas perigoso para qualquer dado de valor

### Volume Persistente
- Antagonico ao efemero — o dado sobrevive
- E uma reserva de espaco que conversa com o StorageClass
- Voce define a capacidade e o Kubernetes garante a alocacao

O instrutor enfatiza: **se voce tem uploads, nao salve dentro do container**. Mande para S3. **Se voce tem logs, nao salve no container**. Mande para um sistema de observabilidade. A aplicacao efemera deve delegar tudo que e persistente para fora.

## O problema do local-path

O instrutor usa o Kind (Kubernetes in Docker) como ambiente local, que usa `local-path` como provisionador. Isso significa que o PV reserva espaco **do proprio no**.

### Por que isso e problematico em producao:

1. **Concorrencia de recursos** — a aplicacao e o volume competem pelo mesmo disco do no
2. **Escala de nos** — quando voce escala horizontalmente (mais nos), os volumes locais nao acompanham
3. **Pods distribuidos** — um Deployment pode rodar pods em multiplos nos. Se o volume e local a um no, os pods nos outros nos nao tem acesso
4. **Gerenciamento complexo** — cada no tem seu proprio volume local, impossivel centralizar

### A solucao: storage externo

O instrutor menciona que no modulo avancado eles vao trabalhar com StorageClass "apartado do cluster" — ou seja, storage externo. Opcoes incluem:
- **NFS (Network File System)** — funciona com ambientes on-premise, mas exige cuidado com infraestrutura
- **Cloud providers** — EBS (AWS), Persistent Disk (GCP), Azure Disk
- **Storage dedicado** — soluções como Ceph, Longhorn

Com storage externo, voce pode ter quantos nos forem necessarios sem problema de concorrencia.

## Complexidades mencionadas

O instrutor alerta sobre complexidades que vem com PersistentVolumes:

1. **Capacity planning** — voce precisa definir quanto espaco reservar. Em ambiente local, esta limitado ao tamanho do SSD/HD
2. **Retain policy** — quando o volume enche, qual e a politica? Isso precisa ser definido antecipadamente
3. **Gerenciamento de infra** — mesmo com NFS, voce precisa cuidar da infraestrutura do file system

A recomendacao do instrutor: **desacople o storage do cluster sempre que possivel**, a menos que seja realmente necessario manter local.

## Comandos demonstrados

```bash
# Verificar PersistentVolumes (nenhum existe por padrao)
kubectl get pv
kubectl get persistentvolume  # mesmo comando, forma longa

# Verificar nos do cluster
kubectl get nodes  # no exemplo: 2 worker nodes
```

---

# Code Examples: PersistentVolume no Kubernetes

## Verificacao basica do ambiente

```bash
# Listar PersistentVolumes — inicialmente vazio
kubectl get pv
# No resources found

# Forma longa — mesmo resultado
kubectl get persistentvolume

# Verificar nos disponiveis
kubectl get nodes
# NAME                 STATUS   ROLES           AGE   VERSION
# kind-control-plane   Ready    control-plane   ...   ...
# kind-worker          Ready    <none>          ...   ...
# kind-worker2         Ready    <none>          ...   ...
```

## Exemplo de volume efemero com emptyDir

```yaml
# emptyDir: criado quando o pod sobe, destruido quando o pod morre
apiVersion: v1
kind: Pod
metadata:
  name: app-efemera
spec:
  containers:
    - name: app
      image: nginx
      volumeMounts:
        - mountPath: /tmp/cache
          name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
# ATENCAO: dados em /tmp/cache desaparecem quando o pod e reciclado
```

## Exemplo de PersistentVolume com local-path

```yaml
# PV reservando 2GB usando local-path (apenas para desenvolvimento)
apiVersion: v1
kind: PersistentVolume
metadata:
  name: meu-pv
spec:
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard  # referencia ao StorageClass
  hostPath:
    path: /data/meu-pv  # caminho no no local
# ATENCAO: hostPath reserva espaco do proprio no
# NAO use em producao — concorrencia com a aplicacao
```

## Exemplo de PersistentVolume com capacidades variadas

```yaml
# PV pequeno — para config ou metadados
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-small
spec:
  capacity:
    storage: 512Mi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  hostPath:
    path: /data/pv-small
---
# PV medio — para aplicacoes com dados moderados
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-medium
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  hostPath:
    path: /data/pv-medium
---
# PV grande — para bancos de dados
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-large
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  hostPath:
    path: /data/pv-large
```

## Padrao correto: dados persistentes fora do container

```yaml
# ERRADO: salvar uploads dentro do container
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-upload
spec:
  replicas: 1
  selector:
    matchLabels:
      app: upload
  template:
    metadata:
      labels:
        app: upload
    spec:
      containers:
        - name: app
          image: minha-app:latest
          # Upload salvo em /app/images/ — EFEMERO!
          # Quando o pod morrer, todos os uploads somem
```

```yaml
# CORRETO: usar variavel de ambiente para apontar para S3
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-upload
spec:
  replicas: 1
  selector:
    matchLabels:
      app: upload
  template:
    metadata:
      labels:
        app: upload
    spec:
      containers:
        - name: app
          image: minha-app:latest
          env:
            - name: STORAGE_DRIVER
              value: "s3"
            - name: S3_BUCKET
              value: "meu-bucket-uploads"
          # Uploads vao para S3, nao para o filesystem do container
```

## Verificar StorageClass disponivel

```bash
# Ver qual StorageClass esta configurado no cluster
kubectl get storageclass
# NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE
# standard (default)   rancher.io/local-path   Delete          WaitForFirstConsumer

# No Kind, o provisioner padrao e local-path
# Em cloud, seria algo como kubernetes.io/aws-ebs ou pd.csi.storage.gke.io
```

## Relacao completa: StorageClass → PV → PVC → Pod

```
kubectl get storageclass    # "Quem provisiona?"
        │
        ▼
kubectl get pv              # "Quanto espaco reservado?"
        │
        ▼
kubectl get pvc             # "Quanto espaco requisitado?" (proxima aula)
        │
        ▼
kubectl get pods            # "Quem esta consumindo?"
```
