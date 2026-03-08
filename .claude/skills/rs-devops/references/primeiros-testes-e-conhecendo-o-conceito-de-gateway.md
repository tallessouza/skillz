---
name: rs-devops-primeiros-testes-e-conhecendo-o-conceito-de-gateway
description: "Applies Istio Gateway configuration patterns when setting up edge traffic management in Kubernetes. Use when user asks to 'configure istio gateway', 'setup service mesh entry point', 'install gateway api crds', 'configure ambient mode', or 'centralize ingress with istio'. Enforces Gateway API CRD installation and proper namespace labeling. Make sure to use this skill whenever configuring Istio service mesh ingress. Not for application-level routing, Kubernetes Ingress controller, or Docker networking."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-gateway
  tags: [istio, gateway, service-mesh, ambient-mode, kubernetes, crds, traffic]
---

# Gateway no Istio — Conceito e Configuracao Inicial

> O Gateway e uma configuracao de borda que centraliza todas as requisicoes em um unico ponto antes de entrar na sua rede.

## Conceito Central

O Gateway funciona como um portao na borda da rede. Tudo que chegar passa por ele, permitindo aplicar regras (rate limit, autenticacao) antes do trafego atingir os servicos internos. Sem gateway, voce bate diretamente em cada servico — com muitas aplicacoes, isso se torna incontrolavel.

## Rules

1. **Instale os Gateway API CRDs antes de criar Gateways** — o Istio nao inclui os CRDs do Kubernetes Gateway API por padrao, porque sao recursos separados mantidos pelo SIG-Network
2. **Use `gateway.networking.k8s.io` como apiVersion** — nao confunda com `networking.istio.io/v1beta1` (API legada), porque a API padrao do Kubernetes e o caminho recomendado
3. **Ambient Mode nao requer redeploy** — basta aplicar a label no namespace e todos os pods existentes ja respeitam, porque o ztunnel intercepta no nivel do node
4. **Sidecar Mode requer redeploy** — a injecao so ocorre na criacao do pod, porque o sidecar precisa ser adicionado como container no pod
5. **Gateway sem rotas retorna 404** — o gateway sozinho apenas ouve, porque sem HTTPRoute nao ha destino para redirecionar
6. **Restrinja allowedRoutes por namespace** — use `namespaces.from: Same` para limitar escopo, porque rotas de outros namespaces podem criar conflitos

## Configuracao do Gateway

### Passo 1: Instalar Gateway API CRDs

```bash
kubectl get crd gateways.gateway.networking.k8s.io &> /dev/null || \
  kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/latest/download/standard-install.yaml
```

### Passo 2: Criar o arquivo gateway.yaml

```yaml
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

### Passo 3: Aplicar no cluster

```bash
kubectl apply -f gateway.yaml -n app
```

### Passo 4: Verificar criacao

O gateway cria um Service do tipo LoadBalancer. Em ambiente local (Kind/k3d), o external IP fica `<pending>` — isso e esperado.

## Ambient Mode vs Sidecar — Diferenca na Label

| Aspecto | Sidecar | Ambient Mode |
|---------|---------|--------------|
| Label no namespace | `istio-injection=enabled` | `istio.io/dataplane-mode=ambient` |
| Precisa redeploy? | Sim | Nao |
| Quando aplica? | Proximo deploy do pod | Imediatamente |
| Mecanismo | Container injetado no pod | ztunnel no node intercepta |

## Heuristics

| Situacao | Acao |
|----------|------|
| Gateway retorna 404 | Faltam HTTPRoutes — configure rotas com destino |
| CRD nao encontrado ao aplicar | Instale os Gateway API CRDs primeiro |
| External IP pendente em local | Esperado — use port-forward ou NodePort |
| Muitos servicos expostos individualmente | Centralize em um Gateway com rotas |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Expor cada servico com seu proprio ingress | Centralizar em um Gateway com HTTPRoutes |
| Criar Gateway sem instalar CRDs | Verificar/instalar CRDs antes |
| Assumir que label do sidecar aplica sem redeploy | Redeploy pods apos aplicar label de sidecar |
| Deixar `allowedRoutes` aberto para todos namespaces | Restringir com `from: Same` ou lista explicita |

## Troubleshooting

### Gateway retorna 404 para todas as requisicoes
**Symptom:** Apos criar o Gateway, todas as requisicoes retornam HTTP 404
**Cause:** Gateway esta ouvindo mas nao tem HTTPRoutes configuradas — sem rotas, nao ha destino para o trafego
**Fix:** Criar HTTPRoute referenciando o Gateway como parentRef e apontando para o Service destino

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Gateway no Istio

## Por que o Gateway existe

O instrutor explica com uma analogia clara: o Gateway e um **portao** na borda da rede. Sem ele, voce bate diretamente no servico (`app-service-mesh-svc`). Com poucas aplicacoes, isso funciona. Com muitas, vira caos — voce precisa rastrear hosts, portas, e regras individualmente.

O Gateway centraliza tudo: um unico ponto de entrada. A partir dele, voce cria regras de redirecionamento (HTTPRoutes) para distribuir trafego internamente.

## Beneficios do Gateway como camada de borda

- **Rate limiting** — aplicado antes do trafego entrar na rede
- **Autenticacao** — validada na borda, rejeita antes de consumir recursos internos
- **Kill switch** — se algo da errado, voce bloqueia na borda sem afetar servicos internos
- **Centralizacao** — um ponto unico para todas as regras de entrada

O instrutor enfatiza: "caso tenha algum problema voce pode parar a requisicao na camada da borda, isso nem cai dentro da sua rede".

## Ambient Mode vs Sidecar — Por que importa

### Sidecar: label antes do deploy

No modelo sidecar, a injecao do proxy Envoy acontece como um container adicional no pod. Isso so ocorre no momento da criacao do pod. Portanto:

1. Voce faz deploy da v1 e v2
2. Esquece de rodar o comando de label
3. Os pods sobem SEM sidecar
4. Voce roda o comando de label no namespace
5. Os pods existentes continuam SEM sidecar
6. Precisa redeploy para a injecao acontecer

### Ambient Mode: label a qualquer momento

No Ambient Mode, o ztunnel opera no nivel do node (DaemonSet). Quando voce aplica a label:

1. O ztunnel ja esta rodando em cada node
2. A label ativa a interceptacao de trafego para aquele namespace
3. Pods existentes sao automaticamente incluidos
4. Nenhum redeploy necessario

O instrutor destaca que isso "traz uma certa facilidade — nao precisa ficar rastreando ou tendo que redeployar".

## Gateway API do Kubernetes vs APIs legadas

O arquivo usa `gateway.networking.k8s.io` — esta e a API padrao do Kubernetes Gateway, nao a API legada do Istio (`networking.istio.io`). O Istio suporta ambas, mas a API do Kubernetes e o caminho recomendado porque:

- E um padrao do ecossistema (SIG-Network)
- Funciona com multiplos provedores (Istio, Cilium, etc.)
- Os CRDs sao mantidos separadamente — por isso precisam ser instalados

## O erro de CRD nao encontrado

O instrutor encontrou um erro ao aplicar o gateway pela primeira vez. O motivo: os CRDs do Gateway API nao vem pre-instalados com o Istio. E preciso instalar separadamente com:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/latest/download/standard-install.yaml
```

A documentacao do Istio (tanto para Sidecar quanto Ambient) recomenda essa instalacao como prerequisito.

## Por que o Gateway retorna 404

Apos criar o Gateway, o instrutor acessou pela porta 80 e recebeu 404. Isso e esperado: o Gateway esta ouvindo (listeners configurados), mas nao tem nenhuma rota (HTTPRoute) definida. Ele nao sabe para onde mandar o trafego. Na proxima etapa, as rotas serao configuradas para fazer o redirect para os servicos internos.

## Alternativas ao Istio Gateway

O instrutor menciona outras ferramentas que cumprem papel similar:
- **Kubernetes Gateway API nativa** — padrao do K8s
- **Kong** — API Gateway muito popular, centraliza requisicoes na borda
- Todos compartilham o conceito de centralizar em um ponto unico na borda

## Contexto do teste de carga

O teste usa Fortio com 500 QPS por 10 segundos (5000 requisicoes). O trafego passa pelo VirtualService que faz split:
- Header `teste-ab: true` → v2
- Sem header → v1

O DestinationRule tem circuit breaker configurado. Com Ambient Mode ativo, o Kiali mostra o trafego passando corretamente — confirmando que a malha funciona sem sidecar.

---

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
