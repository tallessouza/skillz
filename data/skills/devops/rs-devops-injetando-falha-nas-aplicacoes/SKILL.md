---
name: rs-devops-injetando-falha-nas-aplicacoes
description: "Applies Istio fault injection patterns (delay and abort) in Kubernetes service mesh environments. Use when user asks to 'inject faults', 'simulate failures', 'test resilience', 'add delay to service', 'simulate 503/504 errors', or 'chaos testing with Istio'. Configures VirtualService fault rules with percentage-based traffic impact. Make sure to use this skill whenever configuring fault injection or discussing chaos engineering with Istio. Not for application-level error handling, Circuit Breaker configuration, or non-Istio chaos tools like Chaos Mesh or Litmus."
---

# Fault Injection com Istio

> Configure injecao de falhas no VirtualService do Istio para testar resiliencia sem modificar a aplicacao.

## Rules

1. **Fault injection mora no VirtualService, nao no DestinationRule** — DestinationRule e para politica de destino (load balancing, subsets); toda configuracao de trafego (fault, retry, timeout) vai no VirtualService, porque o Istio separa roteamento de politica de destino
2. **Sempre defina percentage** — nunca injete falha em 100% do trafego em producao; comece com 5% e suba gradualmente, porque blast radius descontrolado derruba servicos dependentes
3. **Istio atua na camada HTTP** — delay e abort sao as duas opcoes; para testes mais profundos (kernel fault, pod injection) use Chaos Mesh ou Litmus, porque Istio intercepta apenas no proxy sidecar
4. **O erro e injetado no proxy, nao na aplicacao** — a aplicacao continua retornando 200; o Envoy sidecar injeta o erro antes de entregar ao chamador, porque isso permite testar sem alterar codigo
5. **Teste de carga valida o impacto real** — use Fortio, K6, Vegeta ou Locust para medir QPS e blast radius com a falha ativa, porque percentual teorico nao revela o comportamento real da rede
6. **Abort e mais extremo que delay** — delay deixa o servico lento mas respondendo; abort nega o servico completamente e pode crashar pods dependentes, porque nao ha resposta util para o chamador

## How to write

### Delay (lentidao simulada)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-vs
spec:
  hosts:
    - app.svc.cluster.local
  http:
    - fault:
        delay:
          fixedDelay: 1s
          percentage:
            value: 20
      route:
        - destination:
            host: app.svc.cluster.local
            subset: v1
```

### Abort (negacao de servico simulada)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-vs
spec:
  hosts:
    - app.svc.cluster.local
  http:
    - fault:
        abort:
          httpStatus: 504
          percentage:
            value: 20
      route:
        - destination:
            host: app.svc.cluster.local
            subset: v1
```

## Example

**Before (sem fault injection — tudo funciona normalmente):**
```yaml
http:
  - route:
      - destination:
          host: app.svc.cluster.local
          subset: v1
```

**After (20% do trafego com delay de 1s):**
```yaml
http:
  - fault:
      delay:
        fixedDelay: 1s
        percentage:
          value: 20
    route:
      - destination:
          host: app.svc.cluster.local
          subset: v1
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Quer testar lentidao na rede | Use `fault.delay` com `fixedDelay` e `percentage` |
| Quer simular servico fora do ar | Use `fault.abort` com `httpStatus` (503/504) e `percentage` |
| Primeira vez testando | Comece com 5% e suba gradualmente |
| Delay de 5s com 20% travou tudo | Reduza para 1s ou diminua percentage — blast radius e real |
| Pod do chamador esta crashando com abort | Precisa de Circuit Breaker no DestinationRule (outro skill) |
| Precisa de chaos testing alem de HTTP | Use Chaos Mesh ou Litmus, nao Istio |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Injetar falha sem percentage (100% implicito) | Sempre definir `percentage.value` explicitamente |
| Colocar fault injection no DestinationRule | Configurar no VirtualService |
| Testar com delay alto (5s+) de primeira | Comecar com 1s e subir gradualmente |
| Assumir que 20% de delay impacta so 20% do sistema | Rodar teste de carga para medir blast radius real |
| Modificar a aplicacao para retornar erros de teste | Usar fault injection do Istio — injeta no proxy |
| Deixar fault injection ativo apos teste | Remover ou comentar a configuracao de fault |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
