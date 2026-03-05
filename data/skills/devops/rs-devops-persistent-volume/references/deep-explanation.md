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