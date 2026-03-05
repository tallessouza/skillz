# Code Examples: Configurando Retry e Timeout no Istio

## Exemplo 1: VirtualService com fault injection + timeout

Este e o cenario completo da aula — fault injection simulando delay + timeout protegendo o cliente.

### DestinationRule (pre-requisito)

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: my-service
spec:
  host: my-service
  trafficPolicy:
    connectionPool:
      http:
        h2UpgradePolicy: DEFAULT
  subsets:
    - name: v1
      labels:
        version: v1
```

### VirtualService com delay + timeout

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-service
spec:
  hosts:
    - my-service
  http:
    - fault:
        delay:
          fixedDelay: 1s
          percentage:
            value: 5
      route:
        - destination:
            host: my-service
            subset: v1
      timeout: 0.2s
```

**O que acontece:** 5% das requisicoes recebem delay de 1s. Com timeout de 200ms, essas requisicoes retornam 504 ao inves de esperar o segundo inteiro.

## Exemplo 2: Timeout + Retries completo

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-service
spec:
  hosts:
    - my-service
  http:
    - fault:
        delay:
          fixedDelay: 1s
          percentage:
            value: 5
      route:
        - destination:
            host: my-service
            subset: v1
      timeout: 0.2s
      retries:
        attempts: 3
        perTryTimeout: 1s
```

**O que acontece:** Requisicao falha por timeout → Istio retenta ate 3 vezes, esperando 1s entre cada tentativa.

## Exemplo 3: Teste de carga com Fortio

```bash
# Rodar teste de carga para validar configuracao
fortio load -c 50 -qps 0 -t 30s http://my-service:8080/endpoint
```

**Metricas a observar:**
- Sem timeout: ~500 chamadas em 30s, requisicoes lentas
- Com timeout 200ms: ~2200 chamadas em 30s, 504s rapidos
- Com timeout + retry: ~1900 chamadas (retry consome capacidade), mas menos dados perdidos

## Exemplo 4: Variacao com backoff exponencial (avancado)

```yaml
retries:
  attempts: 3
  perTryTimeout: 2s
  retryOn: 5xx,reset,connect-failure,retriable-4xx
```

**Nota:** O `retryOn` permite especificar quais erros disparam retry. O backoff exponencial no Istio e automatico quando configurado com `retryOn`.

## Exemplo 5: Cenario sem retry (alta carga)

```yaml
http:
  - route:
      - destination:
          host: my-service
          subset: v1
    timeout: 0.5s
    # SEM retries — upstream ja esta sobrecarregado
    # Retry multiplicaria o trafego e pioraria a situacao
```

**Quando usar:** upstream com problema de capacidade, nao de disponibilidade intermitente.