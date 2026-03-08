---
name: rs-devops-deploy-multi-versao-istio
description: "Applies Istio multi-version deployment patterns when deploying multiple application versions with traffic splitting. Use when user asks to 'deploy new version with istio', 'split traffic between versions', 'canary deploy istio', 'multi version kubernetes', or 'istio traffic management'. Enforces separate deployments per version, version labels, FQDN for service hosts, and DestinationRule/VirtualService pairing. Make sure to use this skill whenever deploying multiple versions of an application with Istio service mesh. Not for single-version deployments, Helm releases, or non-Istio traffic management."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-service-mesh
  tags: [istio, multi-version, deployment, traffic-splitting, virtual-service, destination-rule, canary]
---

# Deploy Multi-Versao com Istio Service Mesh

> Ao deployar multiplas versoes de uma aplicacao no Kubernetes com Istio, cada versao tem seu proprio Deployment com label `version`, e o trafego e controlado via DestinationRule e VirtualService.

## Rules

1. **Use o endereco DNS interno completo** — `nome-servico.namespace.svc.cluster.local`
2. **Cada versao tem seu proprio arquivo de Deployment** — nao junte multiplos deployments no mesmo YAML
3. **Adicione label `version` no template.metadata.labels** — Istio/Kiali usa essa label
4. **Teste a versao isoladamente antes de configurar trafego** — port-forward e valide health checks
5. **Use `imagePullPolicy: IfNotPresent`** — evita re-download e acelera rollbacks

## How to write

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

### VirtualService para split de trafego

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
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

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Multiplos deployments no mesmo YAML | Um arquivo por versao |
| `host: app-service-mesh` (abreviado) | FQDN completo |
| Label `version` so no Deployment metadata | Label no `template.metadata.labels` |
| `image: app:latest` em multi-versao | Tags explicitas: `app:v1`, `app:v2` |

## Troubleshooting

### Kiali nao mostra o grafo de trafego entre versoes
**Symptom:** O Kiali exibe os servicos mas nao diferencia trafego entre v1 e v2.
**Cause:** A label `version` esta no `metadata.labels` do Deployment mas nao no `template.metadata.labels` dos pods.
**Fix:** Adicione a label `version: v1` (ou `v2`) no `spec.template.metadata.labels` de cada Deployment, nao apenas no metadata raiz.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
