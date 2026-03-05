---
name: rs-devops-explorando-cenarios-estresse
description: "Applies Kubernetes HPA tuning and stress testing patterns when configuring autoscaling, resource limits, or load testing containerized applications. Use when user asks to 'configure HPA', 'set resource limits', 'stress test', 'load test', 'tune replicas', or 'optimize pod scaling'. Guides replica count, CPU/memory requests/limits, and HPA min/max based on observed load patterns. Make sure to use this skill whenever adjusting Kubernetes scaling parameters or analyzing application performance under load. Not for application code architecture, CI/CD pipelines, or Helm chart templating."
---

# Kubernetes HPA Tuning e Testes de Estresse

> Ajuste replicas e resources com base em dados reais de estresse, nunca em numeros magicos.

## Rules

1. **Observe o decaimento antes de ajustar** — apos um teste de estresse, o HPA reduz replicas gradualmente (ex: 8→7→6→5→3), porque existe um cooldown period proposital para resiliencia
2. **Ajuste minReplicas pelo baseline de trafego** — se a aplicacao sempre recebe carga alta, suba o minimo de replicas (ex: 3→6), porque o HPA e para picos extremos, nao para trafego normal
3. **CPU e o gargalo mais comum em I/O sincrono** — operacoes como writeStream sincrono em Node.js consomem CPU rapidamente sob carga, porque cada requisicao bloqueia a thread
4. **Aumente resources antes de aumentar replicas** — se CPU bate o limite rapido (ex: 200m→190m em segundos), aumente o request/limit (ex: 400m/700m), porque mais replicas com recursos insuficientes nao resolve
5. **Memoria so ajuste se for gargalo medido** — nao aumente memoria preventivamente, porque recurso ocioso implica custo direto no cluster
6. **Rolling update respeita o numero atual de replicas** — se voce faz deploy com 8 replicas ativas (HPA escalado), o rollout substitui todas as 8, nao apenas o minimo

## How to write

### HPA com baseline ajustado

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-deployment
  minReplicas: 6        # baseline real, nao o minimo possivel
  maxReplicas: 10       # headroom para picos
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### Resources ajustados pos-estresse

```yaml
resources:
  requests:
    cpu: "400m"       # subiu de 200m apos medir gargalo
    memory: "128Mi"   # manteve — memoria nao foi gargalo
  limits:
    cpu: "700m"       # headroom proporcional ao request
    memory: "256Mi"
```

### Monitoramento durante teste

```bash
# Observar consumo em tempo real
watch kubectl top pods -n minha-aplicacao

# Verificar estado do HPA
kubectl get hpa -n minha-aplicacao
```

## Example

**Before (numeros magicos, sem dados):**
```yaml
minReplicas: 3
maxReplicas: 8
resources:
  requests:
    cpu: "200m"
  limits:
    cpu: "200m"
# Resultado: 10k req em 2min, 617ms latencia, 80 QPS
```

**After (ajustado com dados do teste de estresse):**
```yaml
minReplicas: 6       # baseline real do trafego diario
maxReplicas: 10      # mais headroom
resources:
  requests:
    cpu: "400m"      # dobrou — CPU era gargalo medido
  limits:
    cpu: "700m"      # limite com margem
# Resultado esperado: mais throughput, menor latencia
```

## Heuristics

| Situacao | Acao |
|----------|------|
| CPU bate limite em segundos sob carga | Aumentar cpu request/limit |
| HPA escala ao maximo e latencia continua alta | Aumentar maxReplicas E resources |
| Trafego alto e previsivel todo dia | Subir minReplicas para o baseline |
| Aplicacao so retorna string (sem I/O) | Pode manter resources baixos, HPA cuida dos picos |
| Memoria estavel durante estresse | Nao mexer em memoria — focar em CPU |
| Tempo de decaimento muito lento | Configurar `behavior.scaleDown.stabilizationWindowSeconds` |
| Deploy durante pico de trafego | Normal — rolling update substitui todas as replicas ativas |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Definir minReplicas=1 para app com trafego constante | Medir baseline e usar como minReplicas |
| Igualar request e limit de CPU | Dar headroom no limit (ex: request 400m, limit 700m) |
| Aumentar replicas sem medir resources | Primeiro verificar se CPU/memoria esta no limite |
| Manter numeros magicos sem teste de carga | Rodar teste de estresse e ajustar com dados reais |
| Escalar memoria quando o gargalo e CPU | Verificar `kubectl top pods` antes de ajustar |
| Assumir que HPA resolve tudo | HPA e para picos — trafego normal precisa de baseline adequado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-explorando-mais-cenarios-de-estresse/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-explorando-mais-cenarios-de-estresse/references/code-examples.md)
