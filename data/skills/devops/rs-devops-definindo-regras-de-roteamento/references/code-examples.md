# Code Examples: Regras de Roteamento no Istio Virtual Service

## Exemplo 1: Virtual Service com match e rewrite

Configuracao completa mostrada na aula — rota `/teste` reescrita para `/healthz` direcionada ao subset V2:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh
spec:
  hosts:
    - app-service-mesh
  http:
    - name: app-service-mesh-v2
      match:
        - uri:
            prefix: "/teste"
      rewrite:
        uri: "/healthz"
      route:
        - destination:
            host: app-service-mesh.default.svc.cluster.local
            subset: v2
    - name: web-service-mesh-v1
      route:
        - destination:
            host: app-service-mesh.default.svc.cluster.local
            subset: v1
```

## Exemplo 2: Multiplos prefixes com rewrites diferentes

Extensao do exemplo — cada prefix redireciona para uma URI diferente:

```yaml
http:
  - name: rota-teste
    match:
      - uri:
          prefix: "/teste"
    rewrite:
      uri: "/healthz"
    route:
      - destination:
          host: app-service-mesh.default.svc.cluster.local
          subset: v2
  - name: rota-teste2
    match:
      - uri:
          prefix: "/teste2"
    rewrite:
      uri: "/readyz"
    route:
      - destination:
          host: app-service-mesh.default.svc.cluster.local
          subset: v2
  - name: rota-default
    route:
      - destination:
          host: app-service-mesh.default.svc.cluster.local
          subset: v1
```

## Exemplo 3: Destination Rule com traffic policy por subset

Algoritmo de balanceamento diferente por versao:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh
spec:
  host: app-service-mesh.default.svc.cluster.local
  trafficPolicy:
    loadBalancer:
      simple: RANDOM
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
      trafficPolicy:
        loadBalancer:
          simple: LEAST_CONN
```

**Comportamento**: V1 usa RANDOM (herda da spec), V2 usa LEAST_CONN (subset tem precedencia).

## Exemplo 4: Traffic policy global (sem subset override)

Se voce quer o mesmo algoritmo para todos os subsets:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh
spec:
  host: app-service-mesh.default.svc.cluster.local
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## Exemplo 5: Teste de carga com Fortio

Comandos usados na aula para validar o roteamento:

```bash
# Teste na rota default (V1)
fortio load -qps 500 -t 10s http://app-service-mesh/healthz

# Teste na rota com rewrite (V2 via /teste -> /healthz)
fortio load -qps 500 -t 10s http://app-service-mesh/teste
```

Resultado esperado:
- Primeiro comando: trafego vai para V1 (rota default)
- Segundo comando: trafego vai para V2 (match no prefix `/teste`, rewrite para `/healthz`)

## Exemplo 6: Canary deploy com weight split (contexto da aula)

Configuracao anterior que foi substituida pelo roteamento por match:

```yaml
http:
  - route:
      - destination:
          host: app-service-mesh.default.svc.cluster.local
          subset: v1
        weight: 80
      - destination:
          host: app-service-mesh.default.svc.cluster.local
          subset: v2
        weight: 20
```

**Nota**: este modelo nao garante consistencia de sessao — um usuario pode alternar entre V1 e V2 entre requests. Consistent hashing resolve isso (aulas futuras).

## Erro comum: subset fora de destination

```yaml
# ERRADO - subset no mesmo nivel de destination
route:
  - destination:
      host: app-service-mesh.default.svc.cluster.local
    subset: v2  # ERRO: invalid patch

# CORRETO - subset dentro de destination
route:
  - destination:
      host: app-service-mesh.default.svc.cluster.local
      subset: v2  # OK
```