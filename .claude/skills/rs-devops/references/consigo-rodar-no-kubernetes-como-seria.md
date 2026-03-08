---
name: rs-devops-minio-kubernetes-integracao
description: "Applies MinIO integration patterns when deploying object storage on Kubernetes clusters. Use when user asks to 'deploy MinIO on k8s', 'setup object store in cluster', 'persistent volume management', 'internalize S3 storage', or 'run MinIO as StatefulSet'. Covers StatefulSet deployment, persistent volume management, backup strategies with Velero, and bucket organization. Make sure to use this skill whenever designing object storage architecture for Kubernetes environments. Not for MinIO local development setup, Loki log configuration, or general S3/AWS usage outside Kubernetes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-storage
  tags: [minio, kubernetes, statefulset, persistent-volume, velero, object-storage, backup]
---

# MinIO no Kubernetes

> MinIO roda como StatefulSet dentro do cluster para internalizar object storage com gerenciamento visual completo e volumes persistentes.

## Key concepts

MinIO funciona como um Object Store open source, compativel com S3, que pode rodar dentro de um cluster Kubernetes. Ele serve tanto para armazenar logs (via Loki) quanto para dados de aplicacoes que normalmente iriam para S3 na AWS — internalizando esse storage com controle total.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Aplicacao envia dados para S3 e quer internalizar | MinIO como alternativa open source dentro do cluster |
| Precisa de object storage com UI de monitoramento | MinIO — mostra capacidade livre, utilizada, objetos, status dos drives |
| Precisa de storage stateful no Kubernetes | Deploy como StatefulSet (nao Deployment) |
| Dados criticos no MinIO | Velero para backups e snapshots |
| Multiplas aplicacoes precisam de object storage | Organizar em buckets separados dentro do MinIO |

## Como deployar

### StatefulSet, nao Deployment

```yaml
# MinIO DEVE ser StatefulSet porque:
# - Replicas ordinais (minio-0, minio-1, minio-2)
# - Estado persistente (stateful, nao stateless)
# - Volumes persistentes atrelados a cada replica
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: minio
spec:
  serviceName: minio
  replicas: 1
  selector:
    matchLabels:
      app: minio
  volumeClaimTemplates:
    - metadata:
        name: minio-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

### Dois casos de uso

| Caso | Descricao |
|------|-----------|
| **Logs (Loki → MinIO)** | Loki envia logs para MinIO como backend de storage |
| **Aplicacao → MinIO** | Aplicacao salva objetos (arquivos, imagens, dados) em buckets no MinIO em vez de S3 |

## Backup — ponto critico de atencao

Perder dados do MinIO pode causar problemas serios. Sempre configure backup:

```bash
# Velero para snapshots dos volumes persistentes do MinIO
velero install --provider aws --plugins velero/velero-plugin-for-aws:v1.2.0
velero schedule create minio-backup --schedule="0 2 * * *" \
  --include-namespaces minio-namespace
```

## Monitoramento incluso

MinIO fornece UI com:
- Capacidade livre e utilizada
- Quantidade de objetos por bucket
- Status dos drives (online/offline)
- Visao dos objetos armazenados

## Anti-patterns

| Nunca faca | Faca isso |
|-----------|-----------|
| Deploy MinIO como Deployment (stateless) | StatefulSet com volumeClaimTemplates |
| Rodar MinIO sem estrategia de backup | Velero com schedule de snapshots |
| Usar S3 externo quando pode internalizar | MinIO open source dentro do cluster |
| Ignorar monitoramento de capacidade | Usar UI do MinIO para acompanhar storage |

## Troubleshooting

### Dados do MinIO perdidos apos restart do pod
**Symptom:** Buckets e objetos desaparecem quando o pod MinIO reinicia
**Cause:** MinIO deployado como Deployment (stateless) sem volumeClaimTemplates
**Fix:** Use StatefulSet com `volumeClaimTemplates` para garantir volumes persistentes atrelados a cada replica

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
