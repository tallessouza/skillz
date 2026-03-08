---
name: rs-devops-mtls-cluster-config
description: "Applies mTLS configuration patterns for Istio service mesh at namespace and cluster level. Use when user asks to 'configure mtls', 'secure service mesh', 'enable mutual tls', 'protect inter-service communication', or 'setup istio security'. Covers namespace labeling, destination rules with TLS policy, and cluster-wide mTLS via istio-system namespace. Make sure to use this skill whenever configuring Istio mTLS or securing intra-cluster traffic. Not for external TLS/SSL certificates, ingress TLS termination, or cert-manager setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-mtls-security
  tags: [kubernetes, istio, mtls, service-mesh, security]
---

# Configuracao mTLS por Cluster no Istio

> Aplique mTLS no namespace istio-system para proteger o cluster inteiro, nao namespace por namespace.

## Rules

1. **Namespace deve estar na malha antes de receber mTLS** — rotule com `istio.io/dataplane-mode=ambient` antes de aplicar PeerAuthentication, porque namespaces fora da malha retornam `unknown` e barram conexoes
2. **mTLS no istio-system cobre o cluster inteiro** — aplique PeerAuthentication no namespace `istio-system` ao inves de replicar em cada namespace, porque um unico recurso atende 20, 30, 40 namespaces
3. **Destination Rule precisa de TLS mode ISTIO_MUTUAL** — configure `trafficPolicy.tls.mode: ISTIO_MUTUAL` no DestinationRule, porque sem isso o trafego entre servicos nao usa mTLS mesmo com PeerAuthentication ativo
4. **Namespace default nao esta na malha por padrao** — inclua-o explicitamente se necessario, porque o Istio nao reconhece namespaces nao rotulados
5. **Chamadas de fora da malha serao barradas** — todo namespace que se comunica deve estar na malha, porque mTLS exige certificado mutuo que so existe dentro do mesh
6. **Chamadas externas ao cluster passam normalmente** — mTLS protege apenas trafego intra-cluster, requisicoes de fora (ex: ingress) nao sao afetadas por PeerAuthentication

## How to write

### Rotular namespace para ambient mode
```bash
kubectl label namespace default istio.io/dataplane-mode=ambient
```

### PeerAuthentication por namespace
```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-app
  namespace: app
spec:
  mtls:
    mode: STRICT
```

### PeerAuthentication para o cluster inteiro
```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-cluster
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
```

### DestinationRule com TLS mutual
```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-destination
  namespace: app
spec:
  host: "*.app.svc.cluster.local"
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
```

## Example

**Before (mTLS apenas no namespace app — chamadas cross-namespace falham):**
```bash
# Namespace default nao rotulado — retorna unknown
# PeerAuthentication so no namespace app
# Chamadas de default -> app sao barradas
kubectl exec -n default curl-pod -- curl app-service.app.svc.cluster.local
# ERRO: connection refused
```

**After (mTLS no cluster inteiro — tudo funciona):**
```bash
# 1. Rotular todos os namespaces
kubectl label namespace default istio.io/dataplane-mode=ambient
kubectl label namespace app istio.io/dataplane-mode=ambient

# 2. Aplicar mTLS no istio-system (cobre tudo)
kubectl apply -f mtls-cluster.yaml  # namespace: istio-system

# 3. Configurar DestinationRule com ISTIO_MUTUAL
kubectl apply -f destination-rule.yaml

# Agora chamadas cross-namespace funcionam com criptografia
kubectl exec -n default curl-pod -- curl app-service.app.svc.cluster.local
# 200 OK — trafego criptografado com mTLS
```

## Heuristics

| Situacao | Acao |
|----------|------|
| mTLS precisa cobrir poucos namespaces isolados | PeerAuthentication por namespace |
| mTLS precisa cobrir o cluster inteiro | PeerAuthentication no namespace istio-system |
| Namespace retorna unknown no Kiali | Rotular com dataplane-mode antes de aplicar mTLS |
| Chamada cross-namespace falha com mTLS | Verificar se ambos namespaces estao na malha |
| Servico externo precisa chamar o cluster | mTLS nao afeta — trafego externo passa pelo ingress normalmente |
| Usando Sidecar ou Ambient Mode | mTLS funciona igual em ambos os modos |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar PeerAuthentication em cada namespace individualmente | Criar um unico no namespace istio-system |
| Aplicar mTLS sem rotular namespace na malha | Rotular com `istio.io/dataplane-mode` primeiro |
| Usar namespace default em producao | Criar namespaces com nomenclatura propria do desenho de cluster |
| Configurar apenas PeerAuthentication sem DestinationRule | Configurar ambos: PeerAuthentication + DestinationRule com ISTIO_MUTUAL |
| Assumir que mTLS protege chamadas externas | Entender que mTLS e apenas intra-cluster |

## Troubleshooting

### Chamadas cross-namespace falham com connection refused apos ativar mTLS
**Symptom:** Servicos em namespaces diferentes retornam connection refused ou timeout
**Cause:** O namespace de origem nao esta rotulado na malha do Istio, entao nao possui certificado mTLS valido
**Fix:** Rotule todos os namespaces envolvidos com `kubectl label namespace <ns> istio.io/dataplane-mode=ambient`

### Kiali mostra namespace como "unknown" mesmo com mTLS ativo
**Symptom:** Dashboard do Kiali exibe status "unknown" para o namespace
**Cause:** O namespace nao foi incluido na malha do Istio antes de aplicar PeerAuthentication
**Fix:** Aplique o label `istio.io/dataplane-mode=ambient` no namespace antes de configurar mTLS

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-adicionando-configuracao-por-cluster-e-consideracoes-finais/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-adicionando-configuracao-por-cluster-e-consideracoes-finais/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
