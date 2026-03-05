# Code Examples: Definindo Roteamento com Gateway API

## Exemplo 1: HTTPRoute basico (arquivo route.yaml)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-service-mesh-route
  namespace: app
spec:
  parentRefs:
    - name: app-service-mesh-gateway
  rules:
    - matches:
        - path:
            type: Exact
            value: /healthz
      backendRefs:
        - name: service-mesh-svc
          port: 80
```

### Aplicando no cluster

```bash
kubectl apply -f route.yaml -n app
# httproute.gateway.networking.k8s.io/app-service-mesh-route created
```

## Exemplo 2: Multiplos paths

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-service-mesh-route
  namespace: app
spec:
  parentRefs:
    - name: app-service-mesh-gateway
  rules:
    - matches:
        - path:
            type: Exact
            value: /healthz
        - path:
            type: Exact
            value: /readyz
      backendRefs:
        - name: service-mesh-svc
          port: 80
```

## Exemplo 3: Gateway referenciado pelo HTTPRoute

O Gateway que o HTTPRoute referencia via parentRefs:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: app-service-mesh-gateway
  namespace: app
spec:
  gatewayClassName: istio
  listeners:
    - name: http
      port: 80
      protocol: HTTP
```

## Testes de validacao

### Teste 1: Rota com match exato

```bash
# Gateway IP obtido via:
kubectl get gateway app-service-mesh-gateway -n app -o jsonpath='{.status.addresses[0].value}'

# Teste da rota configurada
curl http://<GATEWAY_IP>:80/healthz
# Esperado: 200 OK (resposta da aplicacao)
```

### Teste 2: Rota sem match

```bash
curl http://<GATEWAY_IP>:80/redis
# Esperado: 404 do Gateway (nao ha match para /redis)
```

### Teste 3: Rota com match mas app nao tem handler

```bash
# Se configurou /ralph no HTTPRoute mas a app Node nao tem essa rota:
curl http://<GATEWAY_IP>:80/ralph
# Esperado: 404 do Node.js (erro da aplicacao, nao do gateway)
# Isso confirma que o routing do gateway FUNCIONA — chegou ao backend
```

### Teste 4: Teste de carga via Gateway

```bash
# Port-forward no gateway (nao no service)
kubectl port-forward svc/app-service-mesh-gateway-istio -n app 8080:80

# Teste de carga
hey -n 1000 -c 50 http://localhost:8080/healthz

# Verificar no Kiali: Traffic Graph mostra Gateway → Service → v1/v2
```

## Alternativa: Multiplos YAML no mesmo arquivo

O instrutor menciona mas nao recomenda:

```yaml
# gateway.yaml (nao recomendado — tudo junto)
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: app-service-mesh-gateway
spec:
  gatewayClassName: istio
  listeners:
    - name: http
      port: 80
      protocol: HTTP
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-service-mesh-route
spec:
  parentRefs:
    - name: app-service-mesh-gateway
  rules:
    - matches:
        - path:
            type: Exact
            value: /healthz
      backendRefs:
        - name: service-mesh-svc
          port: 80
```

## Commit de referencia

[Codigo completo da aula](https://github.com/rocketseat-education/devops-service-mesh/commit/40a78541a52bd030f41a25a7b543e403e323db6e)