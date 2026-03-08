---
name: rs-devops-o-que-e-escala
description: "Applies Kubernetes scaling concepts when designing or reviewing application deployments. Use when user asks to 'scale an app', 'handle high traffic', 'configure autoscaling', 'prepare for traffic spikes', or 'load test a Kubernetes deployment'. Provides mental model for why scaling matters, when to apply manual vs auto scaling, and what resilience means in practice. Make sure to use this skill whenever discussing Kubernetes scaling strategy or capacity planning. Not for implementing specific HPA/VPA manifests, Helm charts, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-scaling
  tags: [kubernetes, scaling, autoscaling, resilience, capacity-planning, hpa, traffic]
---

# O que e Escala no Kubernetes

> Escalar e adaptar a aplicacao a cenarios variados de trafego, mantendo-a de pe de forma resiliente — automaticamente.

## Key concepts

Escala e a capacidade de uma aplicacao se adaptar a diferentes cenarios de trafego — alto ou baixo, curto ou longo. A aplicacao deve ser **resiliente**: continuar funcionando durante periodos atipicos, especialmente de alto trafego.

Sem escala adequada, picos de acesso (datas comemorativas, campanhas de marketing, eventos virais) causam **downtime** — a plataforma cai exatamente quando mais usuarios precisam dela.

## Decision framework

| Cenario | Estrategia |
|---------|-----------|
| Trafego previsivel e constante | Escala manual com replicas fixas |
| Picos sazonais (Black Friday, lancamentos) | Auto escala baseada em metricas |
| Trafego imprevisivel | Auto escala + testes de carga regulares |
| Ambiente de desenvolvimento/staging | Replicas minimas, sem auto escala |

## How to think about it

### Cenario: Campanha de marketing

Uma plataforma lanca uma campanha. O trafego sobe 10x em 30 minutos. Sem escala: a aplicacao cai, usuarios recebem erro 502, a campanha que deveria gerar receita gera prejuizo. Com auto escala: o cluster detecta o aumento de carga, cria novas replicas automaticamente, a aplicacao absorve o trafego.

### Cenario: Trafego fora da mediana

O sistema monitora metricas (CPU, memoria, requests). Quando os valores ultrapassam a mediana configurada, o Kubernetes **reage**: aumenta recursos (escala vertical) ou aumenta replicas (escala horizontal). Quando o trafego normaliza, reduz — evitando custo desnecessario.

### Dois modos de escala

1. **Manual** — voce configura o numero de replicas diretamente. Util para entender o mecanismo, mas nao reage a imprevistos.
2. **Automatica (auto escala)** — o cluster reage sozinho baseado em metricas. E o objetivo final para producao.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Escalar e so adicionar mais servidores | Escalar e adaptar a cenarios — inclui subir E descer recursos |
| Alto trafego e sempre ruim | Alto trafego e positivo (mais usuarios), o problema e nao estar preparado |
| Escala manual e suficiente para producao | Picos sao imprevisiveis — auto escala e necessaria para resiliencia real |
| Basta configurar auto escala e esquecer | Testes de carga e estresse sao essenciais para validar que a configuracao funciona |

## When to apply

- Ao planejar deploys de aplicacoes que recebem trafego variavel
- Antes de eventos que podem gerar picos (lancamentos, campanhas, datas comemorativas)
- Ao revisar manifests Kubernetes que definem replicas fixas sem auto escala
- Ao discutir resiliencia e disponibilidade de servicos

## Diagnostic

```bash
# Verificar HPA configurado
kubectl get hpa

# Verificar metricas de consumo dos pods
kubectl top pods

# Verificar replicas atuais de um deployment
kubectl get deployment <name> -o jsonpath='{.spec.replicas}'
```

## Limitations

- Este modelo mental cobre o **porque** e o **quando** escalar, nao o **como** implementar (HPA, VPA, KEDA)
- Nao substitui testes de carga reais — a teoria de escala precisa ser validada com simulacao de trafego
- Escala resolve problemas de capacidade, nao de performance de codigo (uma aplicacao lenta com 100 replicas continua lenta)

## Troubleshooting

### Auto escala nao reage a picos de trafego
**Symptom:** HPA configurado mas pods nao escalam quando trafego aumenta
**Cause:** Metrics Server nao instalado ou metricas nao sendo coletadas corretamente
**Fix:** Verificar se Metrics Server esta rodando (`kubectl top pods`) e se os recursos requests/limits estao definidos no Deployment

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
