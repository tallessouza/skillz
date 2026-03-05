---
name: rs-devops-entendendo-o-problema
description: "Enforces ephemeral log management patterns when designing container or Kubernetes architectures. Use when user asks to 'configure logging', 'persist logs', 'setup Loki', 'manage container logs', or 'store logs in Kubernetes'. Applies rule: never use local volumes for logs, always use external storage backends. Make sure to use this skill whenever designing observability stacks or configuring log persistence in containerized environments. Not for application-level logging libraries, log formatting, or metrics/tracing configuration."
---

# Gerenciamento Efêmero de Logs em Containers

> Logs em containers devem ser persistidos em ferramentas externas de storage, nunca em volumes locais, preservando a efemeridade do container.

## Rules

1. **Nunca persista logs em volumes locais do container** — porque containers sao efemeros e dados locais sao perdidos quando o container morre
2. **Use ferramentas externas de storage para logs** — assim como voce manda arquivos para S3 em vez de salvar no container, logs seguem o mesmo principio
3. **Mantenha o container efemero** — o container faz ingestao e repassa, nunca armazena; porque efemeridade e o principio fundamental de containers
4. **Considere a volumetria antes de escolher PV** — volumes persistentes funcionam para alguns contextos, mas logs tem volumetria muito grande e sao dados sensiveis
5. **Separe responsabilidades** — o servico de log (ex: Loki) faz ingestao, a ferramenta de storage persiste; cada componente tem uma unica responsabilidade

## Decision framework

| Situacao | Abordagem |
|----------|-----------|
| Log em ambiente local (docker-compose) | Volume no container da ferramenta de storage e aceitavel para dev |
| Log em Kubernetes producao | Ferramenta externa de storage (S3, object storage), nunca PV para logs |
| Dados pequenos e nao-sensiveis | PV com claim pode ser aceitavel |
| Dados sensiveis ou alta volumetria (logs) | Sempre storage externo descentralizado |

## How to configure

### Anti-pattern: Volume direto no Loki

```yaml
# docker-compose.yml — ERRADO para producao
services:
  loki:
    image: grafana/loki
    volumes:
      - loki-data:/loki  # Dados presos ao host, perde efemeridade
```

### Pattern correto: Storage externo

```yaml
# docker-compose.yml — CORRETO
services:
  loki:
    image: grafana/loki
    # Sem volume local para dados de log
    # Loki configurado para enviar para storage externo (S3, MinIO, etc)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Configurando logging stack | Sempre planejar storage externo desde o inicio |
| Container precisa salvar algo | Mande para S3, banco externo, ou object storage |
| Ambiente local de desenvolvimento | Volume no container de storage e aceitavel, mas Loki continua efemero |
| Migrando para Kubernetes | Substitua volumes locais por storage backends descentralizados |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Volume persistente direto no Loki | Configure storage backend externo (S3, MinIO) |
| Salvar logs dentro do container | Ingestao no container, persistencia em ferramenta externa |
| Assumir que PV resolve tudo em K8s | Avaliar volumetria e sensibilidade antes de escolher PV |
| Tratar logs como dados simples | Reconhecer alta volumetria e sensibilidade dos logs |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-entendendo-o-problema/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-entendendo-o-problema/references/code-examples.md)
