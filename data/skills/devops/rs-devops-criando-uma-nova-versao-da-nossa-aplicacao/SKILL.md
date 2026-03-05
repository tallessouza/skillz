---
name: rs-devops-criando-nova-versao-app
description: "Applies Kubernetes multi-version deployment patterns with Istio service mesh when setting up canary deploys, versioned workloads, or traffic splitting. Use when user asks to 'create a new version', 'canary deploy', 'split traffic between versions', 'deploy v2', or 'destination rule'. Enforces version labels, separate deployment manifests, and internal cluster DNS conventions. Make sure to use this skill whenever deploying multiple versions of the same app in Kubernetes with Istio. Not for single-version deploys, CI/CD pipelines, or Helm chart authoring."
---

# Deploy Multi-Versao com Istio Service Mesh

> Ao deployar multiplas versoes de uma aplicacao no Kubernetes com Istio, cada versao tem seu proprio Deployment com label `version`, e o trafego e controlado via DestinationRule e VirtualService.

## Rules

1. **Use o endereco DNS interno completo** — `nome-servico.namespace.svc.cluster.local`, porque o formato abreviado so funciona no mesmo namespace e quebra em comunicacao cross-namespace
2. **Cada versao tem seu proprio arquivo de Deployment** — nao junte multiplos deployments no mesmo YAML com `---`, porque dificulta manutencao e rollback independente
3. **Adicione label `version` no template.metadata.labels** — `version: v1`, `version: v2`, porque o Istio/Kiali usa essa label para identificar workloads e o DestinationRule faz match por ela
4. **Teste a versao isoladamente antes de configurar trafego** — faca port-forward no pod e valide health checks, porque problemas na imagem so aparecem depois do DestinationRule configurado
5. **Use `imagePullPolicy: IfNotPresent`** — porque evita re-download da imagem e acelera rollbacks entre versoes
6. **Atualize health check responses por versao** — inclua identificador da versao no retorno de `/healthz` e `/readyz`, porque facilita debug visual de qual versao esta respondendo

## How to write

### Deployment V2 (arquivo separado)

```yaml
# deployment-v2.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh-v2
  namespace: app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-service-mesh-v2
  template:
    metadata:
      labels:
        app: app-service-mesh-v2
        version: v2  # Istio usa essa label para routing
    spec:
      containers:
        - name: app-service-mesh-v2
          image: usuario/app-service-mesh:v2
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
```

### DestinationRule com subsets por versao

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service-mesh-dr
  namespace: app
spec:
  host: app-service-mesh.app.svc.cluster.local
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

### VirtualService para split de trafego (canario)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-mesh-vs
  namespace: app
spec:
  hosts:
    - app-service-mesh.app.svc.cluster.local
  http:
    - route:
        - destination:
            host: app-service-mesh.app.svc.cluster.local
            subset: v1
          weight: 80
        - destination:
            host: app-service-mesh.app.svc.cluster.local
            subset: v2
          weight: 20
```

## Example

**Before (deploy unico, sem controle de versao):**
```yaml
# Tudo num arquivo so, sem label version
metadata:
  labels:
    app: app-service-mesh
spec:
  template:
    metadata:
      labels:
        app: app-service-mesh
    spec:
      containers:
        - image: usuario/app-service-mesh:latest
```

**After (deploy canario com Istio):**
```yaml
# deployment-v1.yaml — label version explícita
metadata:
  labels:
    app: app-service-mesh
spec:
  template:
    metadata:
      labels:
        app: app-service-mesh
        version: v1
    spec:
      containers:
        - image: usuario/app-service-mesh:v1
          imagePullPolicy: IfNotPresent

# deployment-v2.yaml — arquivo separado
# + DestinationRule com subsets v1/v2
# + VirtualService com weight 80/20
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro deploy canario | Comece com 80/20 (v1/v2) e observe no Kiali |
| Validar versao nova antes de splitar | Port-forward no pod v2, teste `/healthz` e `/readyz` |
| Labels do selector nao batem | Verifique `matchLabels` no spec E no template.metadata.labels |
| Kiali mostra "Missing Version" | Adicione `version: vN` no template.metadata.labels |
| Comunicacao entre services no mesmo cluster | Use `servico.namespace.svc.cluster.local` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Multiplos deployments no mesmo YAML com `---` | Um arquivo por versao: `deployment-v1.yaml`, `deployment-v2.yaml` |
| `host: app-service-mesh` (abreviado) no DestinationRule | `host: app-service-mesh.app.svc.cluster.local` (completo) |
| Deploy v2 sem testar a imagem primeiro | Build → push → port-forward → teste → so entao configure trafego |
| Label `version` so no Deployment metadata | Label `version` no `template.metadata.labels` (onde Istio le) |
| `image: app:latest` em multi-versao | Tags explicitas: `app:v1`, `app:v2` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
