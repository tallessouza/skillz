---
name: rs-devops-estressando-a-nossa-aplicacao
description: "Applies Kubernetes stress testing patterns using FortIO when user asks to 'stress test', 'load test', 'test scaling', 'simulate traffic', 'test HPA', or 'chaos engineering' on K8s applications. Enforces ephemeral pod execution with kubectl run, proper QPS/connection/duration configuration, and HPA behavior monitoring. Make sure to use this skill whenever generating load test commands for Kubernetes or evaluating application scalability under pressure. Not for unit testing, integration testing, or non-Kubernetes load testing setups."
---

# Teste de Estresse no Kubernetes com FortIO

> Execute testes de carga em aplicacoes Kubernetes usando pods efemeros para validar escalabilidade do HPA e comportamento sob pressao.

## Rules

1. **Use pods efemeros para testes de carga** — `kubectl run --rm -it` com a flag `--rm` para remover o pod ao fim da execucao, porque o container de teste nao faz parte do parque de aplicacoes e nao deve persistir no cluster
2. **Enderece o servico interno pelo DNS do cluster** — `http://service-name.namespace.svc.cluster.local:port/path` ou `http://service-name/path` quando no mesmo namespace, porque dentro do cluster o pod enxerga o ClusterIP via resolucao DNS
3. **Configure QPS, duracao e conexoes simultaneas** — sempre defina os tres parametros (`-qps`, `-t`, `-c`) para ter um teste reproduzivel e controlado
4. **Monitore o HPA durante o teste** — acompanhe eventos do HPA (`kubectl describe hpa`) para confirmar que o autoscaling esta reagindo ao aumento de carga
5. **Valide o relatorio de saida** — verifique codigo de resposta (% de 200s), tempo medio de resposta, QPS efetivo e distribuicao por percentis
6. **Respeite os limites do HPA** — o cluster nao escalara alem do `maxReplicas` configurado, entao dimensione o teste de acordo

## How to write

### Comando de teste de carga com FortIO

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
# Em outro terminal — acompanhar scaling do HPA
kubectl get hpa -n <namespace> -w

# Verificar consumo de recursos dos pods
kubectl top pods -n <namespace>

# Ver eventos do HPA
kubectl describe hpa <hpa-name> -n <namespace>
```

## Example

**Cenario real da aula — teste com FortIO no namespace `primeira-aplicacao`:**

```bash
kubectl run fortio --rm -it \
  --namespace=primeira-aplicacao \
  --image=fortio/fortio \
  -- load \
  -qps 6000 \
  -t 120s \
  -c 50 \
  http://app-ts-svc/exemplo-k8s
```

**Resultado observado:**
- ~500.000 requisicoes em 2 minutos
- 100% respostas HTTP 200
- ~4000 QPS efetivo
- Tempo medio de resposta: 12ms
- HPA escalou de 3 para 8 pods (limite maximo configurado)

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao simples sem processamento pesado | Aumente QPS e conexoes para forcar escala |
| Quer validar comportamento SEM HPA | Comente/delete o HPA e rode o teste — espere falhas |
| Teste em namespace diferente da app | Use FQDN: `service.namespace.svc.cluster.local` |
| Pod de teste nao deve persistir | Sempre use `--rm` no `kubectl run` |
| Quer ver impacto em tempo real | Use `kubectl top pods -w` e `kubectl get hpa -w` em terminais separados |
| Aplicacao muito leve (so return) | Adicione complexidade (CPU/memoria) para teste mais realista |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar um Deployment/manifesto YAML para rodar teste temporario | `kubectl run --rm -it` com pod efemero |
| Testar usando IP externo de dentro do cluster | Usar DNS do servico interno (`svc-name` ou FQDN) |
| Rodar teste sem definir QPS, duracao e conexoes | Sempre especificar `-qps`, `-t`, `-c` |
| Ignorar o relatorio de saida do FortIO | Analisar % de sucesso, QPS efetivo, latencia por percentil |
| Assumir que a app escala infinitamente | Verificar `maxReplicas` do HPA antes de testar |
| Deixar pod de teste rodando apos o fim | Usar `--rm` para auto-remocao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
