---
name: rs-devops-four-golden-signals-monitoring
description: "Applies Google's Four Golden Signals monitoring framework: latency, traffic, errors, and saturation. Use when user asks to 'monitor application health', 'implement golden signals', 'setup circuit breaker', or 'correlate monitoring signals'. Enforces monitoring all 4 signals together, relative latency evaluation, circuit breaker for saturation isolation, and trace usage for error chain analysis. Make sure to use this skill whenever designing monitoring strategies or evaluating application health signals. Not for specific metric implementation (use entendendo-o-prom-ql) or dashboard creation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade-fundamentos
  tags: [golden-signals, monitoring, latency, traffic, errors, saturation, circuit-breaker, observability]
---

# Golden Signals — Os Quatro Sinais de Ouro

> Monitore latencia, trafego, erros e saturacao para saber se sua aplicacao esta saudavel.

## Key concepts

### 1. Latencia
Observe o SALTO, nao o valor absoluto. 500ms pode ser ok, mas um salto de 5x indica problema.

### 2. Trafego
Volume de solicitacoes (RPS, RPM). Trafego triplicou sem explicacao = investigar.

### 3. Erros
Taxa de falhas (5xx). Log mostra o erro individual, trace mostra a cadeia completa.

### 4. Saturacao
CPU, memoria e largura de banda. Servico saturado = Circuit Breaker para isolar.

## Circuit Breaker

```
Estado normal: A -> B -> C (circuito fechado)
Servico C degradado: A -> B -> X (circuito aberto, C isolado)
```

## Interdependencia

```
Trafego ↑ -> Enfileiramento -> Latencia ↑ -> Erros ↑ -> Saturacao ↑ -> App cai
```

Nunca analise um sinal isolado. Correlacione sempre.

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Monitorar apenas erros | Monitorar os 4 sinais juntos |
| Avaliar latencia pelo valor absoluto | Avaliar pelo salto relativo |
| Manter tudo sincrono em microservicos | Async para o que nao precisa de resposta imediata |
| Ignorar blast radius | Circuit Breaker para isolar falhas |
| Investigar erro apenas pelo log | Usar trace para cadeia completa |

## Troubleshooting

### Aplicacao com latencia alta mas sem erros aparentes
**Symptom:** Latencia aumentou 5x mas taxa de erros permanece baixa
**Cause:** Saturacao de recursos (CPU/memoria) causando enfileiramento — sinal de saturacao precede erros
**Fix:** Correlacionar os 4 sinais: verificar saturacao e trafego antes de investigar a latencia isoladamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
