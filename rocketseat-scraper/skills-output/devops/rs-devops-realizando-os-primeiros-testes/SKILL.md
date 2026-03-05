---
name: rs-devops-realizando-os-primeiros-testes
description: "Applies Istio service mesh traffic splitting and load testing patterns when configuring Kubernetes deployments with Virtual Services and Destination Rules. Use when user asks to 'split traffic', 'canary deployment', 'A/B testing k8s', 'test traffic routing', 'configure virtual service', or 'destination rule setup'. Make sure to use this skill whenever working with Istio traffic management or service mesh testing. Not for application-level load balancing, ingress gateway config, or non-Istio service meshes."
---

# Service Mesh — Primeiros Testes com Virtual Service e Destination Rules

> Configure labels consistentes entre versoes de deployments, use Virtual Services para split de trafego e valide com testes de carga via FortIO.

## Rules

1. **Labels do selector e template devem ser identicas entre versoes** — o Service do Kubernetes faz match pelo selector `app: <nome>`, entao V1 e V2 precisam da mesma label `app`, porque senao o Service nao encontra os pods da versao nova
2. **Segregue versoes pelo nome do deployment e label `version`** — mude o `metadata.name` do Deployment e adicione `version: v1/v2` no template labels, porque o Destination Rule usa essa label para criar subsets
3. **Destination Rule define subsets, Virtual Service define pesos** — o `subset` no Virtual Service referencia o `name` no Destination Rule, porque sao recursos complementares e nao intercambiaveis
4. **Nao mute labels em deployments existentes** — delete e recrie o deployment, porque Kubernetes nao permite alterar labels do selector em recursos ja criados
5. **Aplicacao deve ser 100% agnostica ao split** — controle de trafego fica na infraestrutura via Istio, porque isso desacopla logica de roteamento do codigo da aplicacao

## Steps

### Step 1: Configurar labels consistentes nos Deployments

```yaml
# deployment-v1.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v1  # Nome unico por versao
spec:
  selector:
    matchLabels:
      app: app-service-mesh   # MESMO entre V1 e V2
  template:
    metadata:
      labels:
        app: app-service-mesh # MESMO entre V1 e V2
        version: v1           # DIFERENTE — usado pelo Destination Rule
```

```yaml
# deployment-v2.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v2  # Nome diferente
spec:
  selector:
    matchLabels:
      app: app-service-mesh   # MESMO label
  template:
    metadata:
      labels:
        app: app-service-mesh
        version: v2           # Label de versao diferente
```

### Step 2: Criar Destination Rule com subsets

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
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

### Step 3: Criar Virtual Service com split de trafego

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
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

### Step 4: Aplicar e validar

```bash
kubectl apply -f .
```

### Step 5: Teste de carga com FortIO

```bash
kubectl run fortio --rm -it \
  --namespace=app \
  --image=fortio/fortio \
  -- load -qps 8000 -t 60s -c 35 \
  http://app-service-mesh/ready
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Service nao encontra pods da V2 | Verificar se labels `app` do selector sao identicas entre V1 e V2 |
| Precisa mudar labels do selector | Deletar deployment e recriar — Kubernetes nao permite mutar selector labels |
| Split nao bate exato (ex: 78/22 em vez de 80/20) | Normal — pequena variacao e esperada, valide com volume maior |
| Quer teste A/B | Use `version: a` e `version: b` nas labels, mesma mecanica |
| Quer mudar proporcao de trafego | Altere apenas os `weight` no Virtual Service e `kubectl apply` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Labels diferentes no selector entre V1 e V2 | Mesma label `app`, diferente label `version` |
| Controlar split de trafego na aplicacao | Usar Virtual Service + Destination Rule na infra |
| Tentar mutar selector labels de deployment existente | Deletar e recriar o deployment |
| Confundir Virtual Service com Destination Rule | VS define pesos/roteamento, DR define subsets por label |

## Verification

- Kiali: verificar que trafego aparece split entre versoes no graph
- FortIO output: 100% de status 200, proporcao de requests proxima ao peso configurado
- `kubectl get endpoints <service>`: deve listar IPs de pods de ambas versoes

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
