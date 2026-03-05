---
name: rs-devops-configurando-retry-e-timeout
description: "Applies Istio VirtualService timeout and retry configurations when writing service mesh manifests. Use when user asks to 'configure timeout', 'add retries', 'set request timeout', 'improve resilience', or 'handle slow services' in Kubernetes/Istio context. Enforces correct YAML structure for timeout, retries with attempts and perTryTimeout, and backoff strategies. Make sure to use this skill whenever generating or reviewing Istio VirtualService routing rules. Not for application-level timeout code, HTTP client configuration, or non-Istio service meshes."
---

# Configurando Retry e Timeout no Istio

> Configure timeout e retries no VirtualService para garantir resiliencia sem provocar efeitos em cascata.

## Rules

1. **Timeout no destino, nao na rota raiz** — coloque `timeout` dentro do bloco `route[].destination`, porque o timeout se aplica por destino especifico, nao globalmente
2. **Timeout deve ser agressivo** — use valores baixos como `0.2s` (200ms), porque liberar a requisicao rapido evita problemas em cascata quando ha delay no upstream
3. **Retries com espacamento** — configure `perTryTimeout` de pelo menos 1s entre tentativas, porque tentar imediatamente apos falha provavelmente encontrara o mesmo problema
4. **Considere o multiplicador de trafego** — 3 attempts = 3x trafego no pior caso, avalie se o contexto suporta esse aumento antes de configurar retries
5. **Timeout + Retry = defesa em camadas** — use ambos juntos: timeout libera o cliente, retry tenta recuperar o payload sem perder dados
6. **Para cenarios criticos, considere filas** — se o payload nao pode ser perdido, avalie processar via fila (async) com DLQ ao inves de retry sincrono

## How to write

### Timeout no VirtualService

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-service
spec:
  hosts:
    - my-service
  http:
    - route:
        - destination:
            host: my-service
            subset: v1
      timeout: 0.2s
```

### Retry com perTryTimeout

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-service
spec:
  hosts:
    - my-service
  http:
    - route:
        - destination:
            host: my-service
            subset: v1
      timeout: 0.2s
      retries:
        attempts: 3
        perTryTimeout: 1s
```

## Example

**Before (sem protecao — requisicao trava no delay):**
```yaml
http:
  - route:
      - destination:
          host: my-service
          subset: v1
```
Resultado: com delay de 1s no upstream, cliente fica travado. Fortio consegue ~500 chamadas.

**After (timeout + retry):**
```yaml
http:
  - route:
      - destination:
          host: my-service
          subset: v1
    timeout: 0.2s
    retries:
      attempts: 3
      perTryTimeout: 1s
```
Resultado: requisicoes retornam 504 em 200ms ao inves de travar. Fortio consegue ~2200 chamadas. Retries tentam recuperar sem bloquear o cliente.

## Heuristics

| Situacao | Faca |
|----------|------|
| Upstream com latencia variavel | Timeout agressivo (200-500ms) + retry com spacing |
| Payload critico que nao pode perder | Retry + considere fila assincrona com DLQ |
| Upstream com falha intermitente | Retry 3 attempts com perTryTimeout 1-2s |
| Alta carga e upstream instavel | Apenas timeout, sem retry (evita multiplicar trafego) |
| Backoff necessario | Use retry com backoff exponential ao inves de perTryTimeout fixo |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Sem timeout nenhum | Sempre defina timeout, mesmo que alto (ex: 5s) |
| `perTryTimeout: 0s` (retry imediato) | `perTryTimeout: 1s` — espaco entre tentativas |
| `attempts: 10` sem calcular impacto | `attempts: 3` e avalie o multiplicador de trafego |
| Retry sincrono para processos criticos | Fila assincrona + DLQ para garantir entrega |
| Timeout no nível errado do YAML | Timeout dentro do bloco `http[].route`, mesmo nivel do `retries` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
