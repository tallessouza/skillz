# Code Examples: Gateway no Istio

## Gateway YAML completo

Este e o arquivo criado na aula:

```yaml
# k8s/gateway.yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: app-service-mesh-gtw
  namespace: app
spec:
  gatewayClassName: istio
  listeners:
    - name: http
      port: 80
      protocol: HTTP
      allowedRoutes:
        namespaces:
          from: Same
```

### Explicacao campo a campo

- **apiVersion**: `gateway.networking.k8s.io/v1` — API padrao do Kubernetes Gateway (requer CRDs instalados)
- **kind**: `Gateway` — tipo do recurso
- **metadata.name**: nome do gateway, sufixo `-gtw` para diferenciar do servico (`-svc`)
- **spec.gatewayClassName**: `istio` — classe de load balancer; o Istio registra essa classe ao ser instalado
- **spec.listeners**: lista de "ouvintes" — cada um define um protocolo/porta
  - **name**: identificador do listener (referencial, pode ser qualquer nome)
  - **port**: porta que o gateway escuta
  - **protocol**: `HTTP`, `HTTPS`, `TCP`, `TLS`
  - **allowedRoutes.namespaces.from**: `Same` restringe rotas ao mesmo namespace

## Instalacao dos CRDs do Gateway API

```bash
# Verificar se ja esta instalado
kubectl get crd gateways.gateway.networking.k8s.io

# Instalar (comando da documentacao oficial do Istio)
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/latest/download/standard-install.yaml
```

## Aplicar o Gateway

```bash
kubectl apply -f gateway.yaml -n app
```

### Erro comum: CRD nao encontrado

```
error: resource mapping not found for name: "app-service-mesh-gtw"
namespace: "app" from "gateway.yaml": no matches for kind "Gateway"
in version "gateway.networking.k8s.io/v1"
```

**Solucao**: instalar os CRDs primeiro (comando acima).

### Erro comum: typo no YAML

O instrutor encontrou erro em `allowedRoutes` por digitacao incorreta. Sempre valide:

```bash
# Dry-run para validar YAML antes de aplicar
kubectl apply -f gateway.yaml -n app --dry-run=client
```

## Verificar o Gateway criado

```bash
# Ver o gateway
kubectl get gateway -n app

# Ver o Service LoadBalancer criado automaticamente
kubectl get svc -n app | grep gtw
```

O Istio cria automaticamente um Service do tipo LoadBalancer para o Gateway. Em ambiente local (Kind, Minikube, k3d), o External IP fica `<pending>`.

## Label do Ambient Mode no namespace

```bash
# Aplicar Ambient Mode (nao requer redeploy)
kubectl label namespace app istio.io/dataplane-mode=ambient

# Verificar label
kubectl get namespace app --show-labels
```

## Label do Sidecar no namespace (comparacao)

```bash
# Aplicar Sidecar injection (requer redeploy dos pods)
kubectl label namespace app istio-injection=enabled

# Forcar redeploy para injetar sidecar
kubectl rollout restart deployment -n app
```

## Teste de carga com Fortio

```bash
# Teste basico — 500 QPS por 10 segundos
kubectl run fortio --rm -it --image=fortio/fortio -- \
  load -qps 500 -t 10s \
  http://app-service-mesh-svc.app.svc.cluster.local/healthz

# Teste com header para canary (redireciona para v2)
kubectl run fortio --rm -it --image=fortio/fortio -- \
  load -qps 500 -t 10s \
  -H "teste-ab: true" \
  http://app-service-mesh-svc.app.svc.cluster.local/healthz
```

## Contexto: VirtualService com split de trafego

```yaml
# Referenciado na aula — controle de canary via header
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
spec:
  hosts:
    - app-service-mesh-svc
  http:
    - match:
        - headers:
            teste-ab:
              exact: "true"
      route:
        - destination:
            host: app-service-mesh-svc
            subset: v2
    - route:
        - destination:
            host: app-service-mesh-svc
            subset: v1
```

## Contexto: DestinationRule com circuit breaker

```yaml
# Referenciado na aula — circuit breaker configurado
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
spec:
  host: app-service-mesh-svc
  trafficPolicy:
    connectionPool:
      http:
        h2UpgradePolicy: DEFAULT
        http1MaxPendingRequests: 1
        http2MaxRequests: 1
    outlierDetection:
      consecutive5xxErrors: 1
      interval: 1s
      baseEjectionTime: 3m
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## Proximo passo: HTTPRoute (sera configurado na proxima aula)

O Gateway criado escuta na porta 80 mas retorna 404 porque nao tem rotas. A estrutura esperada:

```yaml
# Exemplo de HTTPRoute (sera detalhado na proxima aula)
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-service-mesh-route
  namespace: app
spec:
  parentRefs:
    - name: app-service-mesh-gtw
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: app-service-mesh-svc
          port: 80
```