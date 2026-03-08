---
name: rs-devops-alterando-recursos-replicas
description: "Applies Kubernetes HPA resource and replica tuning strategies when scaling applications. Use when user asks to 'configure HPA', 'scale pods', 'tune CPU limits', 'stress test kubernetes', 'increase request throughput', or 'adjust replicas'. Covers CPU request/limit sizing, HPA min/max replicas, average utilization triggers, and interpreting stress test results. Make sure to use this skill whenever configuring horizontal pod autoscaling or optimizing k8s application performance. Not for node-level autoscaling, cluster setup, or Kubernetes installation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-scaling
  tags: [kubernetes]
---

# Alterando Recursos e Réplicas da Aplicação

> Escalar uma aplicação Kubernetes exige calibrar três eixos em conjunto: recursos por pod (CPU requests/limits), quantidade de réplicas (min/max no HPA), e o trigger de utilização que dispara a escala.

## Rules

1. **Ajuste CPU requests e limits proporcionalmente** — requests define o mínimo garantido, limits o teto; uma proporção de ~1:1.75 (ex: 400m:700m) permite burst sem desperdício, porque requests muito baixos causam throttling e limits muito altos desperdiçam capacidade do nó
2. **Defina minReplicas igual ao deployment replicas** — o HPA e o Deployment devem concordar no mínimo, porque divergência causa oscilação no número de pods na inicialização
3. **Use average utilization entre 75-80%** — valores muito próximos de 100% (90-95%) atrasam a escala e causam indisponibilidade, porque o pod atinge 100% CPU antes de novos pods ficarem prontos
4. **Sempre valide mudanças com teste de estresse** — aplique a configuração, rode o teste, compare métricas (total requests, latência média, QPS), porque cada aplicação responde diferente ao scaling
5. **Recursos do pod consomem do nó** — aumentar CPU/memória por pod só funciona se o nó tiver capacidade disponível, porque não existe CPU virtual infinita — o limite é o tamanho do nó
6. **Calibre por microserviço** — cada serviço tem perfil diferente (CPU-bound, I/O-bound, com banco), porque um HPA genérico não serve para todo o parque

## How to configure

### HPA com réplicas e CPU ajustados

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-deployment
  minReplicas: 6
  maxReplicas: 10
  targetCPUUtilizationPercentage: 75
```

### Deployment com recursos aumentados

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 6
  template:
    spec:
      containers:
        - name: app
          resources:
            requests:
              cpu: "400m"
            limits:
              cpu: "700m"
```

### Aplicar e monitorar

```bash
# Aplicar configuração
kubectl apply -f ./k8s/ -n minha-aplicacao

# Monitorar HPA
kubectl get hpa -n minha-aplicacao -w

# Monitorar consumo por pod
kubectl top pods -n minha-aplicacao
```

### Teste de estresse com Fortio

```bash
kubectl run fortio --rm -i --image=fortio/fortio -- \
  load -c 50 -qps 6000 -t 2m \
  http://app-svc.minha-aplicacao.svc.cluster.local/endpoint
```

## Example

**Before (recursos baixos, poucas réplicas):**
```yaml
# Deployment: 3 replicas, CPU 100m request / 200m limit
# HPA: min 3, max 5, target 80%
# Resultado stress test:
#   ~9.000 requests | latência 650ms | ~75 QPS
```

**After (recursos e réplicas ajustados):**
```yaml
# Deployment: 6 replicas, CPU 400m request / 700m limit
# HPA: min 6, max 10, target 75%
# Resultado stress test:
#   ~36.000 requests | latência 166ms | ~300 QPS
#   (4x mais requests, latência 4x menor)
```

## Heuristics

| Situação | Ação |
|----------|------|
| QPS muito abaixo do target no teste | Aumentar CPU requests/limits e/ou maxReplicas |
| Pods escalam mas latência não melhora | Gargalo pode estar no banco ou rede, não em CPU |
| CPU atinge 100% antes de escalar | Baixar o averageUtilization trigger (75% é seguro) |
| Escala sobe rápido mas desce devagar | Configurar stabilization window no HPA v2 |
| Muitos pods mas nó sem recursos | Escalar nós (node autoscaler) ou reduzir requests por pod |
| Vários microserviços no mesmo nó | Calibrar individualmente, não usar HPA genérico |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Colocar target CPU 95-100% | Usar 75-80% para dar margem de escala |
| Mesmo HPA para todos os serviços | Calibrar por microserviço conforme perfil |
| Aumentar CPU sem testar | Sempre rodar stress test antes e depois |
| minReplicas diferente de deployment replicas | Manter ambos sincronizados |
| Escalar pods sem verificar capacidade do nó | Confirmar recursos disponíveis no nó com `kubectl top nodes` |
| Configurar e esquecer | Iterar: configurar → testar → comparar → ajustar |

## Troubleshooting

### HPA nao escala mesmo com CPU alta
**Symptom:** Pods atingem 100% CPU mas HPA nao cria novas replicas
**Cause:** O targetCPUUtilizationPercentage esta muito alto (90-100%) e o pod satura antes de escalar
**Fix:** Reduza o target para 75-80% e verifique se o Metrics Server esta instalado com `kubectl top pods`

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-alterando-recursos-e-replicas-da-aplicacao/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-alterando-recursos-e-replicas-da-aplicacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
