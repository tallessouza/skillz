# Code Examples: Ajustando o YAML

## Arquivo de Namespace completo

```yaml
# infra/app-ns.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: app
  labels:
    istio.io/dataplane-mode: ambient
    istio.io/use-waypoint: waypoint
```

Substitui os comandos imperativos:
```bash
# NAO USE ESTES EM PRODUCAO — use o YAML acima
kubectl label namespace app istio.io/dataplane-mode=ambient
kubectl label namespace app istio.io/use-waypoint=waypoint
```

## Gateway YAML completo (waypoint)

```yaml
# infra/gateway.yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: waypoint
  namespace: app
spec:
  gatewayClassName: istio-waypoint
  listeners:
    - name: mesh
      port: 15008
      protocol: HBONE
      allowedRoutes:
        namespaces:
          from: Same
```

### Campos importantes da spec:
- `gatewayClassName: istio-waypoint` — define que e um waypoint do Istio
- `port: 15008` — porta padrao do HBONE (HTTP-Based Overlay Network Environment)
- `protocol: HBONE` — protocolo usado pelo ambient mode
- `allowedRoutes.namespaces.from: Same` — aceita rotas apenas do mesmo namespace

## Extraindo YAML de recurso existente

```bash
# Ver o YAML completo
kubectl get gateway waypoint -n app -o yaml
```

Output bruto do cluster (com campos a remover):
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: waypoint
  namespace: app
  # REMOVER: resourceVersion, uid, creationTimestamp, generation
  # REMOVER: managedFields (bloco inteiro)
  # REMOVER: annotations geradas automaticamente
spec:
  gatewayClassName: istio-waypoint
  listeners:
    - name: mesh
      port: 15008
      protocol: HBONE
      allowedRoutes:
        namespaces:
          from: Same
# REMOVER: status (bloco inteiro)
```

## Comandos de verificacao

```bash
# Listar CRDs instalados no cluster
kubectl get crd

# Ver gateway especifico
kubectl get gateway waypoint -n app

# Ver gateway em formato YAML
kubectl get gateway waypoint -n app -o yaml

# Ver pods do waypoint
kubectl get pods -n app | grep waypoint

# Ver logs do waypoint
kubectl logs -n app <waypoint-pod-name>
# Output esperado: "envoy proxy is ready"
```

## Deletando recursos antes de recriar

```bash
# Deletar rota
kubectl delete httproute <nome> -n app

# Deletar gateway
kubectl delete gateway <nome> -n app

# Aplicar novamente via declarativo
kubectl apply -f infra/
kubectl apply -f k8s/
```

## Fluxo completo de aplicacao

```bash
# 1. Aplicar namespace com labels
kubectl apply -f infra/app-ns.yaml

# 2. Aplicar gateway waypoint
kubectl apply -f infra/gateway.yaml

# 3. Aplicar recursos da aplicacao
kubectl apply -f k8s/

# 4. Verificar
kubectl get gateway -n app
kubectl get pods -n app
```

## Estrutura de diretorio recomendada

```
project/
├── infra/
│   ├── app-ns.yaml          # Namespace com labels do Istio
│   └── gateway.yaml         # Gateway waypoint
└── k8s/
    ├── deployment.yaml       # Deployments da app
    ├── service.yaml          # Services
    └── routes.yaml           # HTTPRoutes (se necessario)
```

## Teste de estresse com waypoint

```bash
# Criar pod de teste
kubectl run fortio -n app --image=fortio/fortio -- \
  load -qps 0 -c 10 -t 30s http://app-service-mesh:8080

# Verificar no Kiali:
# Workloads > waypoint — deve mostrar trafego passando pelo waypoint
# para o app-service-mesh
```