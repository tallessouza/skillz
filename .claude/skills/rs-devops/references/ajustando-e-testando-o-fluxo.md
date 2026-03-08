---
name: rs-devops-ajustando-testando-fluxo
description: "Applies debugging workflow for containerized observability pipelines when troubleshooting log ingestion issues with Loki, MinIO, and Docker. Use when user asks to 'debug logs not arriving', 'fix Loki connection', 'troubleshoot log pipeline', 'logs not showing in MinIO', or 'container logging not working'. Guides through protocol mismatch fixes, container restarts, and log verification. Make sure to use this skill whenever diagnosing observability stack issues in Docker or Kubernetes. Not for application-level logging libraries, log format design, or Kubernetes deployment configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observability-debugging
  tags: [devops]
---

# Debugging de Pipeline de Observabilidade em Containers

> Ao debugar pipelines de log (Loki → MinIO), verifique protocolo, reinicie containers e acompanhe logs antes de assumir falhas complexas.

## Rules

1. **Verifique erros de protocolo primeiro** — HTTP vs HTTPS e a flag `insecure` sao a causa mais comum de falhas silenciosas, porque o servidor rejeita a conexao sem feedback obvio nos logs iniciais
2. **Acompanhe logs apos restart** — use `docker logs <id>` e observe por erros de requisicao especificos, porque o container pode logar com atraso
3. **Confirme ingestao no destino** — verifique no MinIO se os objetos foram criados (index, arquivos zipados), porque logs locais funcionando nao garante que a ingestao remota esta ok
4. **Lembre que ingestao tem delay** — o pipeline faz varredura periodica, entao aguarde antes de concluir que ha falha
5. **Alteracoes em configmaps/volumes sao hot-reloadable** — ao alterar config estatica montada via volume, um restart do container recarrega a config sem rebuild

## Workflow de Debug

### Passo 1: Verificar logs do container
```bash
docker ps
docker logs <container_id>
```
Procure por erros de requisicao, especialmente mensagens sobre protocolo (HTTP/HTTPS mismatch).

### Passo 2: Corrigir configuracao de protocolo
```yaml
# ERRADO — causa rejeicao silenciosa
insecure: false  # servidor so aceita HTTP, mas voce esta mandando HTTPS

# CORRETO
insecure: true   # conexao via HTTP, sem TLS
```

### Passo 3: Reiniciar container e acompanhar
```bash
docker restart <container_id>
docker logs <container_id>
# Observe: trace_id, push confirmations, ausencia de erros de requisicao
```

### Passo 4: Validar no destino (MinIO)
- Verifique se objetos foram criados (cluster, arquivo de ingestao)
- Confirme que indices estao sendo gerados
- Note que a UI pode ter bug visual — recarregue a pagina

### Passo 5: Testar com log explicito
```typescript
// Adicione log temporario no endpoint para forcar ingestao
log.info('cheguei aqui');
```
Acesse o endpoint, observe logs chegando, confirme no MinIO.

## Heuristics

| Situacao | Acao |
|----------|------|
| Logs nao chegam apos 2+ minutos | Verificar erros de protocolo nos logs do container |
| Container loga mas MinIO vazio | Aguardar — ingestao e periodica, nao instantanea |
| Config alterada mas sem efeito | Restart do container (volume remontado) |
| MinIO mostra objetos mas UI nao atualiza | Bug visual — recarregar pagina |
| Precisa mudar log level (ex: crew) | Editar config no volume, restart container |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Assumir falha complexa sem checar protocolo | Verificar HTTP vs HTTPS e flag `insecure` primeiro |
| Rebuild da imagem para mudar config | Alterar volume montado + `docker restart` |
| Concluir que ingestao falhou em < 2 min | Aguardar ciclo de varredura do pipeline |
| Ignorar logs intermediarios do container | Acompanhar `docker logs` apos cada mudanca |
| Debugar a aplicacao quando o problema e infra | Isolar: log local funciona? Conexao funciona? Destino recebe? |

## Troubleshooting

### Logs nao chegam ao destino (MinIO/Loki) mesmo com container rodando
**Symptom:** Container de log esta Running mas nenhum objeto aparece no MinIO
**Cause:** Flag `insecure` esta como false quando o servidor aceita apenas HTTP (sem TLS)
**Fix:** Altere `insecure: true` na configuracao, reinicie o container com `docker restart` e acompanhe com `docker logs`

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-ajustando-e-testando-o-fluxo/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-ajustando-e-testando-o-fluxo/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
