---
name: rs-devops-entendendo-o-problema
description: "Applies ephemeral log management patterns for containerized environments. Use when user asks to 'persist logs in Kubernetes', 'configure log storage for containers', 'choose between PV and external storage for logs', or 'handle high-volume logs'. Enforces external storage over local volumes, container ephemerality, volumetry-aware storage decisions, and separation of ingestion vs persistence. Make sure to use this skill whenever deciding on log storage strategy for containerized workloads. Not for application logging configuration (use logando-informacoes-da-aplicacao) or Loki setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade-logs
  tags: [containers, logs, storage, ephemeral, s3, minio, kubernetes, persistent-volume]
---

# Gerenciamento Efemero de Logs em Containers

> Logs em containers devem ser persistidos em ferramentas externas de storage, nunca em volumes locais, preservando a efemeridade do container.

## Rules

1. **Nunca persista logs em volumes locais do container** — containers sao efemeros
2. **Use ferramentas externas de storage para logs** — S3, MinIO, object storage
3. **Mantenha o container efemero** — ingestao e repasse, nunca armazenamento
4. **Considere a volumetria antes de escolher PV** — logs tem volumetria muito grande
5. **Separe responsabilidades** — servico de log faz ingestao, ferramenta de storage persiste

## Decision framework

| Situacao | Abordagem |
|----------|-----------|
| Log em ambiente local | Volume no container de storage e aceitavel para dev |
| Log em Kubernetes producao | Ferramenta externa de storage, nunca PV para logs |
| Dados pequenos e nao-sensiveis | PV com claim pode ser aceitavel |
| Dados sensiveis ou alta volumetria | Sempre storage externo |

## Diagnostic commands

```bash
# Check disk usage on Kubernetes nodes
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.conditions[?(@.type=="DiskPressure")].status}{"\n"}{end}'

# Check PV usage in the cluster
kubectl get pv -o wide

# Verify log volume size in a pod
kubectl exec -it <pod-name> -- du -sh /var/log/
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Volume persistente direto no Loki | Configure storage backend externo |
| Salvar logs dentro do container | Ingestao no container, persistencia externa |
| Assumir que PV resolve tudo em K8s | Avaliar volumetria e sensibilidade |

## Troubleshooting

### Disco do node Kubernetes cheio por causa de logs
**Symptom:** Node entra em DiskPressure e pods sao evicted
**Cause:** Logs sendo persistidos em PersistentVolume local com volumetria alta
**Fix:** Migrar persistencia de logs para storage externo (S3, MinIO) e manter container apenas com ingestao e repasse

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
