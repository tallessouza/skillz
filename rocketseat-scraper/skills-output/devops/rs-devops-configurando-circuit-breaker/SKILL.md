---
name: rs-devops-configurando-circuit-breaker
description: "Applies Circuit Breaker configuration patterns using Istio DestinationRule when setting up service mesh resilience. Use when user asks to 'configure circuit breaker', 'protect against cascading failures', 'setup outlier detection', 'isolate failing service', or 'configure Istio destination rule'. Covers outlier detection, ejection policies, and circuit states (closed/open/half-open). Make sure to use this skill whenever configuring service-to-service resilience in Kubernetes with Istio. Not for application-level circuit breaker libraries, retry policies, or timeout configuration."
---

# Circuit Breaker com Istio

> Configure Circuit Breaker no DestinationRule do Istio para isolar servicos com falha e evitar efeito cascata na rede.

## Rules

1. **Configure no DestinationRule, nao no VirtualService** — porque o DestinationRule conhece o destino e controla se ele esta pronto para receber requisicoes
2. **Use consecutiveGatewayErrors, nao consecutive5xxErrors** — porque erro 500 e erro de aplicacao (tratavel no codigo), enquanto 502/503/504 indicam indisponibilidade real que causa lentidao na rede
3. **Defina sempre os 4 parametros de outlier detection** — `consecutiveGatewayErrors`, `interval`, `baseEjectionTime`, `maxEjectionPercent`, porque valores default podem nao proteger adequadamente
4. **Teste com chamadas entre aplicacoes, nao apenas teste de carga** — porque Circuit Breaker protege chamadas sincronas entre servicos, e ferramentas como Fortio podem crashar com 504 mascarando o comportamento real
5. **Considere fallback ao configurar Circuit Breaker** — redirecionar trafego para outro destino quando o circuito abre, porque simplesmente cortar 100% do trafego pode nao ser aceitavel

## How to write

### Outlier Detection no DestinationRule

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-dr
spec:
  host: my-service
  trafficPolicy:
    outlierDetection:
      consecutiveGatewayErrors: 5
      interval: 5s
      baseEjectionTime: 30s
      maxEjectionPercent: 100
    loadBalancer:
      simple: ROUND_ROBIN
```

### Configuracao conservadora (producao)

```yaml
outlierDetection:
  consecutiveGatewayErrors: 10
  interval: 10s
  baseEjectionTime: 30s
  maxEjectionPercent: 100
```

### Configuracao agressiva (isolamento rapido)

```yaml
outlierDetection:
  consecutiveGatewayErrors: 1
  interval: 1s
  baseEjectionTime: 120s
  maxEjectionPercent: 100
```

## Example

**Before (sem protecao — efeito cascata):**
```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-dr
spec:
  host: my-service
  trafficPolicy:
    loadBalancer:
      simple: ROUND_ROBIN
```

**After (com Circuit Breaker):**
```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-dr
spec:
  host: my-service
  trafficPolicy:
    outlierDetection:
      consecutiveGatewayErrors: 5
      interval: 5s
      baseEjectionTime: 30s
      maxEjectionPercent: 100
    loadBalancer:
      simple: ROUND_ROBIN
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Servico chama outro de forma sincrona | Configurar Circuit Breaker no DestinationRule do destino |
| Erros 502/503/504 frequentes | Usar `consecutiveGatewayErrors` |
| Erros 500 frequentes | Tratar na aplicacao, NAO no Circuit Breaker (a menos que cause lentidao na rede) |
| Precisa isolar completamente | `maxEjectionPercent: 100` |
| Quer degradacao parcial | `maxEjectionPercent: 50` (metade do trafego passa) |
| Circuito abriu mas servico ja voltou | `baseEjectionTime` controla quanto tempo esperar antes do half-open |
| Teste de validacao | Usar duas aplicacoes no cluster chamando uma a outra |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Configurar Circuit Breaker no VirtualService | Configurar no DestinationRule (outlierDetection) |
| Usar `consecutive5xxErrors` sem avaliar contexto | Usar `consecutiveGatewayErrors` para indisponibilidade real |
| Circuit Breaker manual via env var (desligar na mao) | Outlier detection automatizado no Istio |
| Implementar Circuit Breaker na aplicacao quando ja usa Istio | Aproveitar o Istio que ja esta no cluster |
| Testar Circuit Breaker apenas com teste de carga | Testar com chamadas reais entre servicos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
