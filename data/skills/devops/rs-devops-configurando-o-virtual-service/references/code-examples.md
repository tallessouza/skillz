# Code Examples: Configurando o Virtual Service

## Estrutura de arquivos do projeto

```
k8s/
├── deployment.yaml
├── service.yaml
└── virtualservice.yaml    # novo arquivo criado nesta aula
```

## Manifesto completo do VirtualService (como escrito na aula)

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: app-service-mesh-howtos
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
            subset: v1
          weight: 80
        - destination:
            host: app-service-mesh
            subset: v2
          weight: 20
```

### Notas sobre o manifesto

- `apiVersion: networking.istio.io/v1` — versao estavel (nao usar v1alpha3)
- `kind: VirtualService` — CRD do Istio
- `hosts: [app-service-mesh]` — referencia o Service K8s pelo nome curto
- `subset: v1` / `subset: v2` — requerem DestinationRule (nao criado nesta aula)
- `weight: 80` + `weight: 20` = 100% do trafego

## Alternativa: host com FQDN

```yaml
spec:
  hosts:
    - app-service-mesh.app.svc.cluster.local
```

O instrutor mencionou que poderia usar o endereco completo, mas o nome curto e suficiente quando o VirtualService esta no mesmo namespace.

## Comandos de aplicacao e verificacao

### Aplicar o VirtualService

```bash
# Aplicar arquivo especifico
kubectl apply -f k8s/virtualservice.yaml

# Ou aplicar toda a pasta (idempotente)
kubectl apply -f k8s/
```

### Verificar o recurso criado

```bash
# Listar VirtualServices
kubectl get virtualservice -n app

# Ver detalhes
kubectl describe virtualservice app-service-mesh-howtos -n app

# Verificar o Service referenciado
kubectl get svc -n app
```

### Debug via Kiali

O Kiali mostra na secao "Istio Config":
- Status do VirtualService
- Alertas de configuracao (host not found, subset not found)
- Validacao automatica das referencias

## Variacao: VirtualService sem traffic splitting

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: app-service-mesh-routes
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
```

Sem subset e sem weight — roteia 100% para o host diretamente.

## Variacao: Canary progressivo

```yaml
# Fase 1: 95/5
- destination:
    host: app-service-mesh
    subset: stable
  weight: 95
- destination:
    host: app-service-mesh
    subset: canary
  weight: 5

# Fase 2: 80/20
- destination:
    host: app-service-mesh
    subset: stable
  weight: 80
- destination:
    host: app-service-mesh
    subset: canary
  weight: 20

# Fase 3: 50/50
- destination:
    host: app-service-mesh
    subset: stable
  weight: 50
- destination:
    host: app-service-mesh
    subset: canary
  weight: 50

# Fase 4: rollout completo
- destination:
    host: app-service-mesh
    subset: canary
  weight: 100
```

## Variacao: Roteamento por path (mencionado pelo instrutor)

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: app-routes
spec:
  hosts:
    - app-service-mesh
  http:
    - match:
        - uri:
            prefix: /api/v1
      route:
        - destination:
            host: app-service-mesh
            subset: v1
    - match:
        - uri:
            prefix: /api/v2
      route:
        - destination:
            host: app-service-mesh
            subset: v2
```

## Variacao: Timeout e retry (mencionados pelo instrutor)

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: app-with-resilience
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
      timeout: 5s
      retries:
        attempts: 3
        perTryTimeout: 2s
        retryOn: 5xx,reset,connect-failure
```