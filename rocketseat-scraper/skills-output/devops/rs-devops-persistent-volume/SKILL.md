---
name: rs-devops-persistent-volume
description: "Applies Kubernetes PersistentVolume concepts when designing storage for containerized applications. Use when user asks to 'create a volume', 'persist data in k8s', 'configure storage', 'setup persistent storage', or 'write a PV manifest'. Covers ephemeral vs persistent volumes, StorageClass integration, capacity planning, and local vs remote provisioners. Make sure to use this skill whenever working with Kubernetes storage or data persistence. Not for application-level caching, ConfigMaps, Secrets, or in-memory storage patterns."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
