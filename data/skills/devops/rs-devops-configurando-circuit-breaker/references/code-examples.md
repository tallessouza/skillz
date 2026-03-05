# Code Examples: Circuit Breaker com Istio

## Exemplo 1: Configuracao inicial (conservadora)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-dr
spec:
  host: my-service
  trafficPolicy:
    outlierDetection:
      consecutiveGatewayErrors: 10
      interval: 10s
      baseEjectionTime: 30s
      maxEjectionPercent: 100
    loadBalancer:
      simple: ROUND_ROBIN
```

**Comportamento:** Se houver 10 erros consecutivos de gateway em 10 segundos, ejeta 100% do trafego por 30 segundos. Apos 30s, entra em half-open e testa se o servico voltou.

## Exemplo 2: Configuracao agressiva (isolamento rapido)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-dr
spec:
  host: my-service
  trafficPolicy:
    outlierDetection:
      consecutiveGatewayErrors: 1
      interval: 1s
      baseEjectionTime: 120s
      maxEjectionPercent: 100
    loadBalancer:
      simple: ROUND_ROBIN
```

**Comportamento:** Um unico erro de gateway em 1 segundo ejeta 100% do trafego por 2 minutos. Muito agressivo — usado pelo instrutor para demonstrar o circuito abrindo rapidamente.

## Exemplo 3: Ejecao parcial (degradacao gradual)

```yaml
outlierDetection:
  consecutiveGatewayErrors: 5
  interval: 5s
  baseEjectionTime: 30s
  maxEjectionPercent: 50
```

**Comportamento:** Metade do trafego continua passando, metade e bloqueada. Util quando voce quer degradar gradualmente ao inves de cortar tudo.

## Exemplo 4: Configuracao por subset (nao global)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-dr
spec:
  host: my-service
  subsets:
    - name: v1
      labels:
        version: v1
      trafficPolicy:
        outlierDetection:
          consecutiveGatewayErrors: 5
          interval: 5s
          baseEjectionTime: 30s
          maxEjectionPercent: 100
    - name: v2
      labels:
        version: v2
```

**Nota:** O instrutor menciona que a configuracao pode ser por subset ou global. No exemplo da aula, usa global (no trafficPolicy raiz).

## Verificacao apos aplicar

```bash
# Aplicar a configuracao
kubectl apply -f destination-rule.yaml

# Verificar se foi aplicado corretamente
kubectl get destinationrule my-service-dr -o yaml

# Verificar no Kiali (dashboard do Istio)
# O icone de raio aparece no servico indicando Circuit Breaker configurado
# Vermelho = circuito aberto
# Laranja = half-open
```

## VirtualService com fault injection (usado no teste)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service-vs
spec:
  hosts:
    - my-service
  http:
    - fault:
        abort:
          httpStatus: 500
          percentage:
            value: 50
      route:
        - destination:
            host: my-service
```

**Nota:** O instrutor usou fault injection no VirtualService para simular erros e testar o Circuit Breaker. Aumentou a porcentagem de erro para 20% e depois 50% durante os testes.

## Teste de carga com Fortio

```bash
# Fortio crashava com 504 — comportamento da ferramenta, nao do Circuit Breaker
fortio load -c 10 -qps 0 -t 10s http://my-service:8080/

# Alternativa sugerida: k6 pode ter comportamento melhor com erros de gateway
```

## Teste ideal: duas aplicacoes

O instrutor recomenda criar duas aplicacoes no cluster onde uma chama a outra sincronamente. Isso simula o cenario real do Circuit Breaker melhor do que teste de carga externo.