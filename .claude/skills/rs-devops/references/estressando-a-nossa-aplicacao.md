---
name: rs-devops-estressando-a-nossa-aplicacao
description: "Applies Kubernetes load testing patterns using FortIO ephemeral pods to validate HPA autoscaling behavior. Use when user asks to 'stress test kubernetes', 'load test pods', 'validate HPA', 'run fortio', or 'test autoscaling'. Covers kubectl run --rm for ephemeral load generators, cluster-internal DNS addressing, QPS/duration/connections configuration, and HPA monitoring during tests. Make sure to use this skill whenever performing load testing on Kubernetes workloads. Not for application-level benchmarking, JMeter/k6 configuration, or non-Kubernetes load testing."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-scaling
  tags: [kubernetes, fortio, load-testing, hpa, stress-test, autoscaling, kubectl]
---

# Teste de Estresse no Kubernetes com FortIO

> Execute testes de carga em aplicacoes Kubernetes usando pods efemeros para validar escalabilidade do HPA.

## Rules

1. **Use pods efemeros para testes de carga** — `kubectl run --rm -it` com `--rm`
2. **Enderece o servico interno pelo DNS do cluster** — `http://service-name.namespace.svc.cluster.local:port/path`
3. **Configure QPS, duracao e conexoes simultaneas** — `-qps`, `-t`, `-c`
4. **Monitore o HPA durante o teste** — `kubectl describe hpa`
5. **Valide o relatorio de saida** — codigo de resposta, tempo medio, QPS efetivo
6. **Respeite os limites do HPA** — cluster nao escalara alem do `maxReplicas`

## How to write

```bash
kubectl run fortio --rm -it \
  --namespace=<namespace> \
  --image=fortio/fortio \
  -- load \
  -qps 6000 \
  -t 120s \
  -c 50 \
  http://<service-name>.<namespace>.svc.cluster.local:<port>/<path>
```

### Monitoramento durante o teste

```bash
kubectl get hpa -n <namespace> -w
kubectl top pods -n <namespace>
kubectl describe hpa <hpa-name> -n <namespace>
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deployment YAML para teste temporario | `kubectl run --rm -it` |
| Testar usando IP externo de dentro do cluster | DNS do servico interno |
| Rodar teste sem definir QPS, duracao e conexoes | Sempre especificar `-qps`, `-t`, `-c` |
| Deixar pod de teste rodando | Usar `--rm` para auto-remocao |

## Troubleshooting

### FortIO pod fica em Pending e nao inicia
**Symptom:** `kubectl run fortio` cria o pod mas ele fica em status Pending indefinidamente
**Cause:** Cluster sem recursos suficientes para agendar o pod ou namespace com ResourceQuota atingida
**Fix:** Verifique com `kubectl describe pod fortio -n <namespace>` os eventos de scheduling e libere recursos ou use outro namespace

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
