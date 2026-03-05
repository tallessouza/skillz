# Code Examples: Verificacao de Trafego em Service Mesh

## Teste de carga direto no servico

O instrutor roda testes de carga batendo diretamente no Service, nao no Gateway:

```bash
# Teste para validar roteamento para V2
# O Waypoint intercepta automaticamente no namespace
kubectl exec -it deploy/fortio -- fortio load \
  -c 5 -qps 10 -t 30s \
  http://app-service-mesh.default.svc.cluster.local:8080
```

**Por que direto no Service?** Porque o objetivo e testar se o Waypoint intercepta corretamente dentro do namespace. Se voce bater no Gateway, o trafego passa por outra camada e voce nao isola o comportamento do Waypoint.

## Verificacao no Kiali passo a passo

### Selecionar modo correto do graph

```
Kiali UI → Graph → Dropdown no topo
  ❌ App graph (nao mostra versoes)
  ❌ Service graph (nao mostra versoes)
  ❌ Workload graph (nao mostra versoes agrupadas)
  ✅ Versioned app graph (mostra V1 e V2 separados)
```

### Verificar Waypoint via Workloads

```
Kiali UI → Workloads → waypoint
  → Aba "Traffic": mostra requisicoes passando pelo Waypoint
  → Servicos conectados ao Waypoint visiveis
  → Confirmar que trafego sai do Waypoint para a versao correta
```

### Verificar ausencia de trafego

```
Kiali UI → Workloads → app-service-mesh-v1
  → Ajustar timeframe: "Last 2 min"
  → Resultado esperado: ZERO trafego (quando regra manda tudo para V2)

Kiali UI → Workloads → app-service-mesh-v2
  → Resultado esperado: TODO trafego visivel
```

### Verificar logs via Kiali

```
Kiali UI → Workloads → app-service-mesh-v2 → Logs tab
  → Apenas logs com marcacao "V2" devem aparecer
  → Se aparecer log de "V1", a regra nao esta funcionando
```

## Exemplo de VirtualService para roteamento por versao

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
  namespace: default
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
            subset: v2
          weight: 100
```

## Exemplo de DestinationRule com subsets

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
  namespace: default
spec:
  host: app-service-mesh
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## Conversao de imperativo para declarativo

### Imperativo (nao escala):

```bash
# Labels no namespace via comando
kubectl label namespace default istio.io/dataplane-mode=ambient
kubectl label namespace default istio.io/use-waypoint=waypoint
```

### Declarativo (correto):

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: default
  labels:
    istio.io/dataplane-mode: ambient
    istio.io/use-waypoint: waypoint
```

## Checklist de debug quando roteamento falha

```bash
# 1. Namespace tem label de Ambient Mode?
kubectl get ns default --show-labels | grep dataplane-mode

# 2. Waypoint esta rodando?
kubectl get pods -n default | grep waypoint

# 3. VirtualService esta aplicado?
kubectl get vs -n default

# 4. DestinationRule tem subsets corretos?
kubectl get dr -n default -o yaml

# 5. Pods tem labels de versao corretas?
kubectl get pods -n default --show-labels | grep version

# 6. Logs do Waypoint mostram interceptacao?
kubectl logs deploy/waypoint -n default --tail=50
```