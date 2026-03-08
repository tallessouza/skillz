---
name: rs-devops-primeiros-testes-service-mesh
description: "Applies Istio Virtual Service and Destination Rule patterns when configuring traffic splitting between deployment versions. Use when user asks to 'split traffic', 'canary deployment with Istio', 'configure Virtual Service weights', 'create Destination Rule subsets', or 'test A/B deployment'. Enforces consistent labels between versions, subset-based routing, and infrastructure-level traffic control. Make sure to use this skill whenever configuring Istio traffic management or validating deployment splits with load testing. Not for application-level feature flags, Kubernetes Services without Istio, or Ingress configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-traffic-management
  tags: [istio, virtual-service, destination-rule, canary, traffic-split, service-mesh, fortio]
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

---

# Deep Explanation: Service Mesh — Primeiros Testes

## Por que labels consistentes sao criticas

O problema central da aula: ao criar o deployment V2 com labels diferentes no selector (por exemplo, `app: app-service-mesh-v2`), o Service do Kubernetes — que faz match por `app: app-service-mesh` — simplesmente nao encontra os pods da V2. O Istio herda esse comportamento porque o Destination Rule tambem depende do host (Service) para localizar os pods.

A solucao: **o nome do Deployment muda** (para segregar os recursos), mas **as labels do selector e template permanecem as mesmas** entre versoes. A unica label que muda e a `version`, usada exclusivamente pelo Destination Rule para criar subsets.

## Troubleshooting: nao da para mutar labels

O Kubernetes nao permite alterar o campo `spec.selector.matchLabels` de um Deployment ja criado. Se voce tentar mudar apenas uma das labels (selector ou template) sem a outra, o deploy vai falhar porque nao havera match. A solucao e deletar o deployment e recria-lo com as labels corretas.

## Relacao Virtual Service ↔ Destination Rule

Esses dois recursos sao complementares:

- **Destination Rule**: define os **subsets** — agrupamentos de pods por label. Exemplo: subset `v1` = pods com `version: v1`.
- **Virtual Service**: define as **regras de roteamento** — quanto trafego vai para cada subset. Exemplo: 80% para subset `v1`, 20% para subset `v2`.

O campo `subset` no Virtual Service referencia o `name` do subset no Destination Rule. O campo `host` em ambos aponta para o Service do Kubernetes.

## Aplicacao agnostica — o grande beneficio

O instrutor enfatiza que a aplicacao **nao sabe nada** sobre o split de trafego. Isso e o ponto mais poderoso do service mesh: o controle de trafego fica 100% na camada de infraestrutura. Voce pode mudar de 80/20 para 50/50 sem tocar em uma linha de codigo da aplicacao, sem redeploy, apenas alterando o Virtual Service e aplicando com `kubectl apply`.

Isso habilita:
- **Canary deployments**: comece com 5% na V2, aumente gradualmente
- **Testes A/B**: split 50/50 entre variantes
- **Rollback instantaneo**: mude weight para 100/0 se V2 tiver problemas

## Validacao com FortIO

O FortIO e usado como pod temporario (`--rm`) dentro do cluster para gerar carga interna. O teste com 8000 QPS, 35 conexoes, durante 60 segundos gera volume suficiente para validar estatisticamente o split de trafego.

No teste 80/20:
- V1 recebeu ~1742 requests, V2 ~500 de um total de ~2200
- Proporcao real: ~79/21 — muito proximo do configurado

No teste 50/50:
- Normalizou para ~733/733 ao final do teste
- Pequenas variacoes sao normais e esperadas

## Kiali como ferramenta de observabilidade

O Kiali mostra em tempo real:
- O grafo de trafego entre servicos
- Quantidade de requests por segundo por versao
- Status codes (100% de 200 = sem erros)
- Recomendacoes (como protocolo de porta nao configurado)

## Endpoints e debugging

`kubectl get endpoints <service>` lista todos os IPs dos pods que o Service reconhece. Com 2 deployments de 4 replicas cada, devem aparecer 8 IPs. Se faltam IPs de uma versao, o problema esta nas labels do selector.

---

# Code Examples: Service Mesh — Primeiros Testes

## Exemplo completo: Deployments V1 e V2 com labels corretas

### V1

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v1
  namespace: app
spec:
  replicas: 4
  selector:
    matchLabels:
      app: app-service-mesh
  template:
    metadata:
      labels:
        app: app-service-mesh
        version: v1
    spec:
      containers:
        - name: app
          image: <registry>/app-service-mesh:v1
          ports:
            - containerPort: 8080
```

### V2

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v2
  namespace: app
spec:
  replicas: 4
  selector:
    matchLabels:
      app: app-service-mesh
  template:
    metadata:
      labels:
        app: app-service-mesh
        version: v2
    spec:
      containers:
        - name: app
          image: <registry>/app-service-mesh:v2
          ports:
            - containerPort: 8080
```

## Destination Rule completo

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
  namespace: app
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

## Virtual Service — variacao 80/20

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
  namespace: app
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

## Virtual Service — variacao 50/50

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
  namespace: app
spec:
  hosts:
    - app-service-mesh
  http:
    - route:
        - destination:
            host: app-service-mesh
            subset: v1
          weight: 50
        - destination:
            host: app-service-mesh
            subset: v2
          weight: 50
```

## Teste de carga com FortIO

### Comando completo

```bash
kubectl run fortio --rm -it \
  --namespace=app \
  --image=fortio/fortio \
  -- load -qps 8000 -t 60s -c 35 \
  http://app-service-mesh/ready
```

### Parametros explicados

| Parametro | Valor | Significado |
|-----------|-------|-------------|
| `--rm` | — | Remove o pod apos execucao |
| `-it` | — | Modo interativo (ver output em tempo real) |
| `--namespace=app` | app | Namespace onde o servico roda |
| `-qps 8000` | 8000 | Queries per second |
| `-t 60s` | 60s | Duracao do teste |
| `-c 35` | 35 | Conexoes simultaneas (threads) |

### Rotas alternativas para teste

```bash
# Rota /ready (health check — leve)
http://app-service-mesh/ready

# Rota raiz
http://app-service-mesh/

# Qualquer rota da aplicacao funciona
http://app-service-mesh/api/v1/resource
```

## Troubleshooting: deletar deployment com labels erradas

```bash
# Via kubectl
kubectl delete deployment app-service-mesh-v2 -n app

# Recriar com labels corretas
kubectl apply -f deployment-v2.yaml
```

## Aplicar todos os manifests de uma vez

```bash
kubectl apply -f .
```

## Verificar endpoints do Service

```bash
# Deve listar IPs de pods V1 e V2
kubectl get endpoints app-service-mesh -n app
```

## Verificar config no Kiali/Istio

Apos alterar weights no Virtual Service:
1. `kubectl apply -f virtual-service.yaml`
2. Verificar no Kiali > Istio Config que as regras atualizaram
3. Rodar novo teste de carga para validar
